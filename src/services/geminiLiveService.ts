/**
 * Gemini Live API WebSocket Client for Coloroo AI Buddy
 * Fully instrumented with 16kHz PCM downsampler, turn-completion handling,
 * and comprehensive diagnostic logging for Android WebView.
 */

export interface LiveMessageTranscript {
  sender: 'user' | 'buddy';
  text: string;
}

export type LiveConnectionState =
  | 'idle'
  | 'connecting'
  | 'ready'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'error'
  | 'disconnected';

export class GeminiLiveSession {
  private ws: WebSocket | null = null;
  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private micStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private scheduledAudioSources: AudioBufferSourceNode[] = [];
  private nextPlayTime = 0;
  private frameCount = 0;
  private isConnected = false;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private intentionalDisconnect = false;

  public onStateChange: ((state: LiveConnectionState, statusMsg?: string) => void) | null = null;
  public onTranscript: ((msg: LiveMessageTranscript) => void) | null = null;
  public onError: ((err: string) => void) | null = null;

  private systemInstruction = `
You are Coloroo Buddy, a friendly educational AI companion for young children.
Speak in simple Hinglish (a natural, friendly mix of Hindi and English).
Use short sentences (1 to 3 sentences maximum).
Be encouraging, cheerful, and patient.
Explain concepts like colors, animals, numbers, space, and dinosaurs in an easy way.
Never ask for private or personal info.
If an inappropriate question is asked, respond safely and redirect to a fun learning topic.
`;

  public async connect(): Promise<void> {
    console.log('[AIBuddy] TALK/CONNECT PRESSED');
    this.intentionalDisconnect = false;
    this.reconnectAttempts = 0;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.setState('connecting', 'Buddy is getting ready...');

    try {
      const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || 'https://coloroo-kids-production.up.railway.app';
      console.log(`[AIBuddy] requesting ephemeral token from: ${backendUrl}/api/ai-buddy/token`);
      
      const res = await fetch(`${backendUrl}/api/ai-buddy/token`, { method: 'POST' });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Server returned ${res.status}`);
      }

      const data = await res.json();
      const ephemeralToken = data.token;
      const model = data.model || 'gemini-3.1-flash-live-preview';
      console.log('[AIBuddy] token received');

      if (!ephemeralToken) {
        throw new Error('Ephemeral token missing from backend response');
      }

      console.log('[AIBuddy] creating Gemini Live session');
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained?access_token=${encodeURIComponent(ephemeralToken)}`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('[AIBuddy] Gemini Live connection opened');
        this.isConnected = true;
        this.sendInitialSetup(model);
      };

      this.ws.onmessage = async (event) => {
        console.log('[AIBuddy WS] MESSAGE RECEIVED');
        await this.handleServerMessage(event.data);
      };

      this.ws.onerror = (e) => {
        console.error('[AIBuddy ERROR] WebSocket error:', e);
        console.error('[AIBuddy ERROR] WebSocket readyState:', this.ws?.readyState);
        this.setState('error', 'Gemini connection error. Tap to retry!');
      };

      this.ws.onclose = (e) => {
        console.log(`[AIBuddy] Gemini session CLOSED code=${e.code}, reason=${e.reason}, wasClean=${e.wasClean}`);
        this.isConnected = false;
        this.stopAudioCapture();

        // User intentionally closed the session — do not reconnect.
        if (this.intentionalDisconnect) {
          this.setState('disconnected', 'Disconnected');
          return;
        }

        // 1011/1006/1012 can happen from a temporary Live session failure.
        // Automatically create a fresh ephemeral session.
        if ([1006, 1011, 1012].includes(e.code)) {
          if (this.reconnectAttempts < 3) {
            this.reconnectAttempts++;

            const delay = Math.min(1000 * this.reconnectAttempts, 3000);

            console.log(
              `[AIBuddy] temporary disconnect ${e.code}; reconnect attempt ${this.reconnectAttempts}/3 in ${delay}ms`
            );

            this.setState(
              'connecting',
              `Reconnecting to Buddy... (${this.reconnectAttempts}/3)`
            );

            this.reconnectTimer = setTimeout(async () => {
              this.reconnectTimer = null;

              try {
                await this.connectAfterDisconnect();
              } catch (err) {
                console.error('[AIBuddy] automatic reconnect failed:', err);
              }
            }, delay);

            return;
          }
        }

        this.setState('disconnected', `Gemini disconnected (${e.code})`);
      };
    } catch (err: any) {
      console.error('[AIBuddy ERROR] connect failed:', err);
      this.setState('error', 'Buddy needs internet to talk right now.');
      if (this.onError) this.onError(err.message || 'Connection failed');
    }
  }

  private async connectAfterDisconnect(): Promise<void> {
    console.log('[AIBuddy] reconnecting after temporary Gemini disconnect');

    try {
      // Clean up the old socket reference.
      this.ws = null;

      const backendUrl =
        (import.meta as any).env?.VITE_BACKEND_URL ||
        'https://coloroo-kids-production.up.railway.app';

      console.log(`[AIBuddy] requesting fresh ephemeral token from: ${backendUrl}/api/ai-buddy/token`);

      const res = await fetch(`${backendUrl}/api/ai-buddy/token`, {
        method: 'POST'
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Server returned ${res.status}`);
      }

      const data = await res.json();
      const ephemeralToken = data.token;
      const model = data.model || 'gemini-3.1-flash-live-preview';

      if (!ephemeralToken) {
        throw new Error('Ephemeral token missing from backend response');
      }

      const wsUrl =
        `wss://generativelanguage.googleapis.com/ws/` +
        `google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained` +
        `?access_token=${encodeURIComponent(ephemeralToken)}`;

      const ws = new WebSocket(wsUrl);
      this.ws = ws;

      ws.onopen = () => {
        console.log('[AIBuddy] Gemini Live RECONNECTED');
        this.isConnected = true;
        this.sendInitialSetup(model);

        // Try to unlock/resume output audio after reconnect.
        this.initOutputAudioContext();
        if (this.outputAudioContext?.state === 'suspended') {
          this.outputAudioContext.resume().catch((err) => {
            console.warn('[AIBuddy AUDIO] resume after reconnect failed:', err);
          });
        }
      };

      ws.onmessage = async (event) => {
        console.log('[AIBuddy WS] MESSAGE RECEIVED after reconnect');
        await this.handleServerMessage(event.data);
      };

      ws.onerror = (e) => {
        console.error('[AIBuddy RECONNECT ERROR]', e);
      };

      ws.onclose = (e) => {
        console.log(
          `[AIBuddy] RECONNECTED session CLOSED code=${e.code}, reason=${e.reason}`
        );

        this.isConnected = false;
        this.stopAudioCapture();

        if (!this.intentionalDisconnect && [1006, 1011, 1012].includes(e.code)) {
          // Re-enter normal reconnect flow.
          this.reconnectAttempts = Math.min(this.reconnectAttempts, 2);
          this.setState('disconnected', `Gemini disconnected (${e.code})`);

          if (this.reconnectAttempts < 3) {
            this.reconnectAttempts++;

            const delay = Math.min(1000 * this.reconnectAttempts, 3000);

            this.setState(
              'connecting',
              `Reconnecting to Buddy... (${this.reconnectAttempts}/3)`
            );

            this.reconnectTimer = setTimeout(() => {
              this.reconnectTimer = null;
              this.connectAfterDisconnect().catch((err) => {
                console.error('[AIBuddy] retry failed:', err);
              });
            }, delay);
          }
        }
      };
    } catch (err) {
      console.error('[AIBuddy] reconnect setup failed:', err);

      if (this.reconnectAttempts < 3 && !this.intentionalDisconnect) {
        const delay = Math.min(1000 * this.reconnectAttempts, 3000);

        this.reconnectTimer = setTimeout(() => {
          this.reconnectTimer = null;
          this.connectAfterDisconnect().catch(() => {});
        }, delay);
      } else {
        this.setState('error', 'Gemini connection failed. Tap to retry!');
      }
    }
  }

  private sendInitialSetup(model: string) {
    console.log('[AIBuddy] sending Gemini setup');
    const setupMsg = {
      setup: {
        model: `models/${model}`,
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: 'Puck'
              }
            }
          }
        },
        systemInstruction: {
          parts: [{ text: this.systemInstruction }]
        }
      }
    };
    this.ws?.send(JSON.stringify(setupMsg));
    console.log('[AIBuddy] Gemini setup completed');
  }

  public async startTalking(): Promise<void> {
    console.log('[AIBuddy] startTalking() called');
    this.frameCount = 0;

    try {
      console.log('[AIBuddy] requesting microphone stream');
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      const audioTracks = this.micStream.getAudioTracks();
      console.log('[AIBuddy] microphone stream obtained');
      console.log(`[AIBuddy] stream.getAudioTracks().length: ${audioTracks.length}`);
      if (audioTracks[0]) {
        console.log(`[AIBuddy] audioTrack.readyState: ${audioTracks[0].readyState}`);
        console.log(`[AIBuddy] audioTrack.enabled: ${audioTracks[0].enabled}`);
        console.log(`[AIBuddy] audioTrack.muted: ${audioTracks[0].muted}`);
      }

      console.log('[AIBuddy] starting microphone capture');
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.inputAudioContext = new AudioCtx();
      console.log(`[AIBuddy] inputAudioContext.sampleRate: ${this.inputAudioContext.sampleRate}`);

      if (this.inputAudioContext.state === 'suspended') {
        await this.inputAudioContext.resume();
      }

      this.source = this.inputAudioContext.createMediaStreamSource(this.micStream);
      this.processor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);

      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        this.frameCount++;

        if (this.frameCount <= 3 || this.frameCount % 50 === 0) {
          console.log(`[AIBuddy AUDIO] frame received #${this.frameCount}, raw samples: ${inputData.length}`);
        }

        // Downsample from hardware rate (e.g. 48kHz/44.1kHz) to 16kHz Linear PCM
        const pcm16 = this.downsampleTo16kPCM(inputData, this.inputAudioContext!.sampleRate);
        const base64Audio = this.arrayBufferToBase64(pcm16);

        if (this.frameCount <= 3 || this.frameCount % 50 === 0) {
          console.log(`[AIBuddy AUDIO] sending audio chunk #${this.frameCount}, size = ${base64Audio.length}, mimeType = audio/pcm;rate=16000`);
        }

        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          const audioChunk = {
            realtimeInput: {
              audio: {
                data: base64Audio,
                mimeType: 'audio/pcm;rate=16000'
              }
            }
          };
          this.ws.send(JSON.stringify(audioChunk));
        }
      };

      this.source.connect(this.processor);
      this.processor.connect(this.inputAudioContext.destination);

      console.log('[AIBuddy] audio capture started');
      this.setState('listening', 'Listening to you... 👂');
    } catch (err: any) {
      console.error('[AIBuddy ERROR] getUserMedia/Audio capture error:', err);
      this.setState('error', 'Microphone permission is needed so Buddy can hear you 🎤');
      if (this.onError) this.onError('Microphone permission denied.');
    }
  }

  public stopTalking(): void {
    console.log('[AIBuddy] stopTalking() called');
    if (this.frameCount === 0) {
      console.log('[AIBuddy ERROR] MICROPHONE AUDIO FRAMES = 0');
    } else {
      console.log(`[AIBuddy] Total audio frames generated: ${this.frameCount}`);
    }

    this.stopAudioCapture();
    this.setState('thinking', 'Buddy is thinking... 🤖');

    // Signal end of microphone audio stream.
    // Gemini Live automatic activity detection handles the turn.
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const audioEndMsg = {
        realtimeInput: {
          audioStreamEnd: true
        }
      };
      console.log('[AIBuddy] sending realtimeInput audioStreamEnd: true');
      this.ws.send(JSON.stringify(audioEndMsg));
    }
  }

  private stopAudioCapture(): void {
    if (this.micStream) {
      this.micStream.getTracks().forEach((t) => t.stop());
      this.micStream = null;
    }
    if (this.processor && this.source) {
      this.source.disconnect();
      this.processor.disconnect();
      this.processor = null;
      this.source = null;
    }
    if (this.inputAudioContext && this.inputAudioContext.state !== 'closed') {
      this.inputAudioContext.close();
      this.inputAudioContext = null;
    }
  }

  private async handleServerMessage(data: any): Promise<void> {
    let msg: any = null;
    if (typeof data === 'string') {
      try { msg = JSON.parse(data); } catch { return; }
    } else if (data instanceof Blob) {
      const text = await data.text();
      try { msg = JSON.parse(text); } catch { return; }
    }

    if (!msg) return;

    console.log('[AIBuddy GEMINI RAW]', JSON.stringify(msg));

    if (msg.setupComplete) {
      console.log('[AIBuddy GEMINI] SETUP COMPLETE');
      this.setState('ready', 'Tap to Talk with Buddy! 🎤');
      return;
    }

    if (msg.error) {
      console.error('[AIBuddy GEMINI ERROR]', JSON.stringify(msg.error));
      this.setState('error', 'Gemini connection error. Tap to retry!');
      return;
    }

    if (msg.serverContent) {
      console.log('[AIBuddy GEMINI EVENT] serverContent received');
    }
    if (msg.toolCall) {
      console.log('[AIBuddy GEMINI EVENT] toolCall received');
    }

    // Handle Interruption
    if (msg.serverContent?.interrupted) {
      console.log('[AIBuddy GEMINI EVENT] interruption detected');
      this.stopAllAudioPlayback();
      this.setState('ready', 'Listening...');
      return;
    }

    // Handle Model Content (Text + Audio)
    const parts = msg.serverContent?.modelTurn?.parts || [];
    for (const part of parts) {
      if (part.text) {
        console.log('[AIBuddy GEMINI EVENT] Text transcript:', part.text);
        if (this.onTranscript) {
          this.onTranscript({ sender: 'buddy', text: part.text });
        }
      }
      if (part.inlineData && part.inlineData.data) {
        console.log(`[AIBuddy GEMINI EVENT] Native PCM audio chunk received (size: ${part.inlineData.data.length})`);
        this.setState('speaking', 'Buddy is speaking... 🔊');
        const pcmData = this.base64ToArrayBuffer(part.inlineData.data);
        this.playPCMChunk(pcmData, 24000);
      }
    }

    if (msg.serverContent?.turnComplete) {
      console.log('[AIBuddy GEMINI EVENT] turn complete');
      setTimeout(() => {
        if (this.scheduledAudioSources.length === 0) {
          this.setState('ready', 'Tap to Talk! 🎤');
        }
      }, 500);
    }
  }

  private initOutputAudioContext(): void {
    if (!this.outputAudioContext || this.outputAudioContext.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.outputAudioContext = new AudioCtx({ sampleRate: 24000 });
      this.nextPlayTime = this.outputAudioContext.currentTime;
    }
    if (this.outputAudioContext.state === 'suspended') {
      this.outputAudioContext.resume();
    }
  }

  private playPCMChunk(arrayBuffer: ArrayBuffer, sampleRate = 24000): void {
    this.initOutputAudioContext();
    if (!this.outputAudioContext) return;

    const int16Array = new Int16Array(arrayBuffer);
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 32768.0;
    }

    const audioBuffer = this.outputAudioContext.createBuffer(1, float32Array.length, sampleRate);
    audioBuffer.getChannelData(0).set(float32Array);

    const source = this.outputAudioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.outputAudioContext.destination);

    const startTime = Math.max(this.outputAudioContext.currentTime, this.nextPlayTime);
    source.start(startTime);
    this.nextPlayTime = startTime + audioBuffer.duration;

    this.scheduledAudioSources.push(source);
    source.onended = () => {
      this.scheduledAudioSources = this.scheduledAudioSources.filter((s) => s !== source);
      if (this.scheduledAudioSources.length === 0) {
        this.setState('ready', 'Tap to Talk! 🎤');
      }
    };
  }

  private stopAllAudioPlayback(): void {
    this.scheduledAudioSources.forEach((source) => {
      try { source.stop(); } catch {}
    });
    this.scheduledAudioSources = [];
    if (this.outputAudioContext) {
      this.nextPlayTime = this.outputAudioContext.currentTime;
    }
  }

  public disconnect(): void {
    console.log('[AIBuddy] session disconnecting');
    this.intentionalDisconnect = true;
    this.reconnectAttempts = 0;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.stopAudioCapture();
    this.stopAllAudioPlayback();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.outputAudioContext && this.outputAudioContext.state !== 'closed') {
      this.outputAudioContext.close();
      this.outputAudioContext = null;
    }
    this.setState('idle', 'Ready to connect');
  }

  private setState(state: LiveConnectionState, msg?: string): void {
    if (this.onStateChange) {
      this.onStateChange(state, msg);
    }
  }

  private downsampleTo16kPCM(buffer: Float32Array, inputSampleRate: number): ArrayBuffer {
    if (inputSampleRate === 16000) {
      return this.floatTo16BitPCM(buffer);
    }
    const sampleRateRatio = inputSampleRate / 16000;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;

    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      let accum = 0;
      let count = 0;
      for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }
      result[offsetResult] = count > 0 ? accum / count : 0;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }

    return this.floatTo16BitPCM(result);
  }

  private floatTo16BitPCM(input: Float32Array): ArrayBuffer {
    const output = new DataView(new ArrayBuffer(input.length * 2));
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      output.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return output.buffer;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
