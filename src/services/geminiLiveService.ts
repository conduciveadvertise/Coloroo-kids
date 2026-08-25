/**
 * Gemini Live Bidi WebSocket Client for Coloroo AI Buddy
 * Connects directly to GenerativeService.BidiGenerateContent using ephemeral tokens.
 * Streams real-time 16kHz PCM audio input and plays back native 24kHz PCM audio output.
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
  private isConnected = false;

  public onStateChange: ((state: LiveConnectionState, statusMsg?: string) => void) | null = null;
  public onTranscript: ((msg: LiveMessageTranscript) => void) | null = null;
  public onError: ((err: string) => void) | null = null;

  private systemInstruction = `
You are Coloroo Buddy, a friendly, warm, and cheerful educational AI companion for young children.
Speak in simple Hinglish (a natural, friendly mix of Hindi and English).
Keep answers short, joyful, and easy to understand (1 to 3 sentences maximum).
Explain concepts like colors, animals, numbers, space, drawing, and good habits.
Never ask for personal information.
Always respond using real-time audio voice.
`;

  public async connect(): Promise<void> {
    console.log('[GeminiLive] Connecting to Gemini Live...');
    this.setState('connecting', 'Buddy is waking up... ✨');

    try {
      const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || 'https://coloroo-kids-production.up.railway.app';
      console.log(`[GeminiLive] Requesting token from: ${backendUrl}/api/ai-buddy/token`);

      const res = await fetch(`${backendUrl}/api/ai-buddy/token`, { method: 'POST' });
      if (!res.ok) {
        throw new Error(`Token endpoint returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const ephemeralToken = data.token;
      const model = data.model || 'gemini-2.0-flash-exp';

      if (!ephemeralToken) {
        throw new Error('No ephemeral token received from server.');
      }

      console.log('[GeminiLive] Ephemeral token received. Opening WebSocket...');
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${ephemeralToken}`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('[GeminiLive] WebSocket connected. Sending initial setup...');
        this.isConnected = true;
        this.sendSetupMessage(model);
      };

      this.ws.onmessage = async (event) => {
        await this.handleServerMessage(event.data);
      };

      this.ws.onerror = (err) => {
        console.error('[GeminiLive ERROR] WebSocket error:', err);
        this.setState('error', 'Gemini connection error. Tap to retry! ⚠️');
      };

      this.ws.onclose = (event) => {
        console.log(`[GeminiLive] WebSocket closed: Code ${event.code}, Reason: ${event.reason}`);
        this.isConnected = false;
        this.stopAudioCapture();
        if (event.code !== 1000) {
          this.setState('error', 'Connection lost. Tap reconnect 🔄');
        } else {
          this.setState('disconnected', 'Buddy is resting.');
        }
      };
    } catch (err: any) {
      console.error('[GeminiLive ERROR] Failed to connect:', err);
      this.setState('error', 'Cannot reach Gemini Live. Check internet & retry.');
      if (this.onError) this.onError(err.message || 'Connection failed');
    }
  }

  private sendSetupMessage(model: string) {
    const formattedModel = model.startsWith('models/') ? model : `models/${model}`;
    const setupMessage = {
      setup: {
        model: formattedModel,
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

    console.log('[GeminiLive] Sending setup config:', JSON.stringify(setupMessage));
    this.ws?.send(JSON.stringify(setupMessage));
    this.setState('ready', 'Tap to Talk with Buddy! 🎤');
  }

  public async startTalking(): Promise<void> {
    console.log('[GeminiLive] Starting microphone capture for Gemini...');
    try {
      this.stopAllAudioPlayback();

      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.inputAudioContext = new AudioCtx();

      if (this.inputAudioContext.state === 'suspended') {
        await this.inputAudioContext.resume();
      }

      this.source = this.inputAudioContext.createMediaStreamSource(this.micStream);
      this.processor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);

      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const pcm16 = this.downsampleTo16kPCM(inputData, this.inputAudioContext!.sampleRate);
        const base64Audio = this.arrayBufferToBase64(pcm16);

        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          const audioChunk = {
            realtimeInput: {
              mediaChunks: [
                {
                  mimeType: 'audio/pcm;rate=16000',
                  data: base64Audio
                }
              ]
            }
          };
          this.ws.send(JSON.stringify(audioChunk));
        }
      };

      this.source.connect(this.processor);
      this.processor.connect(this.inputAudioContext.destination);

      this.setState('listening', 'Listening to you... 👂');
    } catch (err: any) {
      console.error('[GeminiLive ERROR] getUserMedia error:', err);
      this.setState('error', 'Microphone permission needed so Buddy can hear you 🎤');
      if (this.onError) this.onError('Microphone access denied');
    }
  }

  public stopTalking(): void {
    console.log('[GeminiLive] User stopped talking. Sending turn complete signal...');
    this.stopAudioCapture();
    this.setState('thinking', 'Buddy is thinking... 🤖');

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const clientTurnComplete = {
        clientContent: {
          turnComplete: true
        }
      };
      this.ws.send(JSON.stringify(clientTurnComplete));
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

    // Handle Interruption
    if (msg.serverContent?.interrupted) {
      console.log('[GeminiLive] Interruption received.');
      this.stopAllAudioPlayback();
      this.setState('ready', 'Listening...');
      return;
    }

    // Handle Model Content (Native Text + Audio)
    const parts = msg.serverContent?.modelTurn?.parts || [];
    for (const part of parts) {
      if (part.text && this.onTranscript) {
        this.onTranscript({ sender: 'buddy', text: part.text });
      }
      if (part.inlineData && part.inlineData.data) {
        this.setState('speaking', 'Buddy is speaking... 🔊');
        const pcmData = this.base64ToArrayBuffer(part.inlineData.data);
        this.playPCMChunk(pcmData, 24000);
      }
    }

    if (msg.serverContent?.turnComplete) {
      setTimeout(() => {
        if (this.scheduledAudioSources.length === 0) {
          this.setState('ready', 'Tap to Talk with Buddy! 🎤');
        }
      }, 400);
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
        this.setState('ready', 'Tap to Talk with Buddy! 🎤');
      }
    };
  }

  public stopAllAudioPlayback(): void {
    this.scheduledAudioSources.forEach((source) => {
      try { source.stop(); } catch {}
    });
    this.scheduledAudioSources = [];
    if (this.outputAudioContext) {
      this.nextPlayTime = this.outputAudioContext.currentTime;
    }
  }

  public disconnect(): void {
    console.log('[GeminiLive] Disconnecting session...');
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
