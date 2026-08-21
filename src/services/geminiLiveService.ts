/**
 * Gemini Live API WebSocket Client for Coloroo AI Buddy
 * Fully instrumented for debugging connection, audio capture, and response playback.
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
  private audioContext: AudioContext | null = null;
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
You are Coloroo Buddy, a friendly educational AI companion for young children.
Speak in simple Hinglish (a natural, friendly mix of Hindi and English).
Use short sentences (1 to 3 sentences maximum).
Be encouraging, cheerful, and patient.
Explain concepts like colors, animals, numbers, space, and dinosaurs in an easy way.
Never ask for private or personal info.
If an inappropriate question is asked, respond safely and redirect to a fun learning topic.
`;

  public async connect(): Promise<void> {
    console.log('[AIBuddy] Connecting session requested...');
    this.setState('connecting', 'Buddy is getting ready...');

    try {
      const backendUrl = (import.meta as any).env?.VITE_BACKEND_URL || 'https://coloroo-kids-production.up.railway.app';
      console.log(`[AIBuddy] Requesting Railway token from: ${backendUrl}/api/ai-buddy/token`);
      
      const res = await fetch(`${backendUrl}/api/ai-buddy/token`, { method: 'POST' });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Server returned ${res.status}`);
      }

      const data = await res.json();
      const ephemeralToken = data.token;
      const model = data.model || 'gemini-3.1-flash-live-preview';
      console.log('[AIBuddy] Railway token received successfully.');

      if (!ephemeralToken) {
        throw new Error('Ephemeral token is missing from server response.');
      }

      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${ephemeralToken}`;
      console.log('[AIBuddy] Connecting to Gemini Live WebSocket...');

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('[AIBuddy] Gemini Live WebSocket connected.');
        this.isConnected = true;
        this.sendInitialSetup(model);
      };

      this.ws.onmessage = async (event) => {
        await this.handleServerMessage(event.data);
      };

      this.ws.onerror = (e) => {
        console.error('[AIBuddy ERROR] WebSocket error:', e);
        this.setState('error', 'Connection issue. Tap to retry!');
      };

      this.ws.onclose = (e) => {
        console.log(`[AIBuddy] WebSocket closed. Code: ${e.code}, Reason: ${e.reason}`);
        this.isConnected = false;
        this.setState('disconnected', 'Buddy is resting.');
        this.stopAudioCapture();
      };
    } catch (err: any) {
      console.error('[AIBuddy ERROR] connect() failed:', err);
      this.setState('error', 'Buddy needs internet to talk right now.');
      if (this.onError) this.onError(err.message || 'Connection failed');
    }
  }

  private sendInitialSetup(model: string) {
    console.log(`[AIBuddy] Sending initial setup for model: ${model}`);
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
    this.setState('ready', 'Tap to Talk with Buddy! 🎤');
  }

  public async startTalking(): Promise<void> {
    console.log('[AIBuddy] startTalking() called');
    try {
      this.initAudioContext();
      console.log('[AIBuddy] Requesting navigator.mediaDevices.getUserMedia...');
      
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      const audioTracks = this.micStream.getAudioTracks();
      console.log(`[AIBuddy] Mic stream active. Audio tracks: ${audioTracks.length}, State: ${audioTracks[0]?.readyState}`);

      if (!this.audioContext) return;
      this.source = this.audioContext.createMediaStreamSource(this.micStream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const pcm16 = this.floatTo16BitPCM(inputData);
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
      this.processor.connect(this.audioContext.destination);
      this.setState('listening', 'Listening to you... 👂');
      console.log('[AIBuddy] Audio pipeline active and streaming PCM...');
    } catch (err: any) {
      console.error('[AIBuddy ERROR] getUserMedia/AudioContext error:', err);
      this.setState('error', 'Microphone permission is needed so Buddy can hear you 🎤');
      if (this.onError) this.onError('Microphone permission denied.');
    }
  }

  public stopTalking(): void {
    console.log('[AIBuddy] stopTalking() called - finalizing client audio turn');
    this.stopAudioCapture();
    this.setState('thinking', 'Buddy is thinking... 🤖');

    // Send explicit clientContent turn signal so Gemini Live produces a response
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const endTurnMsg = {
        clientContent: {
          turns: [
            {
              role: 'user',
              parts: [{ text: 'Respond to the spoken audio.' }]
            }
          ],
          turnComplete: true
        }
      };
      this.ws.send(JSON.stringify(endTurnMsg));
      console.log('[AIBuddy] Sent turnComplete message to Gemini Live.');
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

    if (msg.serverContent?.interrupted) {
      console.log('[AIBuddy] Server audio interrupted by user.');
      this.stopAllAudioPlayback();
      this.setState('ready', 'Listening...');
      return;
    }

    const parts = msg.serverContent?.modelTurn?.parts || [];
    for (const part of parts) {
      if (part.text && this.onTranscript) {
        console.log('[AIBuddy] Received text transcript:', part.text);
        this.onTranscript({ sender: 'buddy', text: part.text });
      }
      if (part.inlineData && part.inlineData.data) {
        console.log('[AIBuddy] Received PCM audio chunk from Gemini.');
        this.setState('speaking', 'Buddy is speaking... 🔊');
        const pcmData = this.base64ToArrayBuffer(part.inlineData.data);
        this.playPCMChunk(pcmData, 24000);
      }
    }

    if (msg.serverContent?.turnComplete) {
      console.log('[AIBuddy] Server turn complete.');
      setTimeout(() => {
        if (this.scheduledAudioSources.length === 0) {
          this.setState('ready', 'Tap to Talk! 🎤');
        }
      }, 500);
    }
  }

  private initAudioContext(): void {
    if (!this.audioContext || this.audioContext.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx({ sampleRate: 24000 });
      this.nextPlayTime = this.audioContext.currentTime;
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  private playPCMChunk(arrayBuffer: ArrayBuffer, sampleRate = 24000): void {
    this.initAudioContext();
    if (!this.audioContext) return;

    const int16Array = new Int16Array(arrayBuffer);
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 32768.0;
    }

    const audioBuffer = this.audioContext.createBuffer(1, float32Array.length, sampleRate);
    audioBuffer.getChannelData(0).set(float32Array);

    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);

    const startTime = Math.max(this.audioContext.currentTime, this.nextPlayTime);
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
    if (this.audioContext) {
      this.nextPlayTime = this.audioContext.currentTime;
    }
  }

  public disconnect(): void {
    console.log('[AIBuddy] Session disconnecting and clearing resources.');
    this.stopAudioCapture();
    this.stopAllAudioPlayback();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.setState('idle', 'Ready to connect');
  }

  private setState(state: LiveConnectionState, msg?: string): void {
    if (this.onStateChange) {
      this.onStateChange(state, msg);
    }
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
