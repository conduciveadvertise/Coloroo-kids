class SoundEffects {
  enabled: boolean = true;
  voiceEnabled: boolean = true;
  volume: number = 1.0;
  private audioCtx: AudioContext | null = null;
  private voicesLoaded: boolean = false;

  constructor() {
    const unlock = () => {
      this.getAudioContext();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.getVoices();
      }
    };
    if (typeof window !== 'undefined') {
      ['touchstart', 'touchend', 'click', 'mousedown'].forEach(evt => {
        window.addEventListener(evt, unlock, { once: true, passive: true });
      });
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.voicesLoaded = true;
        };
      }
    }
  }

  private getAudioContext(): AudioContext | null {
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      return this.audioCtx;
    } catch {
      return null;
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number, startVol = 0.35) {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(startVol * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }

  playPop() {
    this.playTone(700, 'sine', 0.12, 0.45);
  }

  playSparkle() {
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.15, 0.3), i * 50);
    });
  }

  playFanfare() {
    [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.25, 0.35), i * 80);
    });
  }

  playLetterChime(char: string) {
    const code = char.toUpperCase().charCodeAt(0) - 65;
    const baseFreq = 260 + (code % 12) * 35;
    this.playTone(baseFreq, 'sine', 0.22, 0.4);
    setTimeout(() => this.playTone(baseFreq * 1.5, 'triangle', 0.18, 0.3), 70);
  }

  speak(text: string) {
    if (!this.enabled || !this.voiceEnabled) return;
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.88;
        utterance.pitch = 1.15;
        utterance.volume = this.volume;
        utterance.lang = 'en-US';

        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          const engVoice = voices.find(v => (v.lang.includes('en') || v.lang.includes('US')) && !v.name.includes('Google'));
          if (engVoice) utterance.voice = engVoice;
        }

        // Keep speech synthesis active in Android WebView
        window.speechSynthesis.speak(utterance);
      }
    } catch {}
  }
}

export const sound = new SoundEffects();
