// Rock-solid Android Speech Engine & SFX Synthesizer
declare global {
  interface Window {
    _activeUtterance?: SpeechSynthesisUtterance | null;
  }
}

class SoundEffects {
  enabled: boolean = true;
  voiceEnabled: boolean = true;
  volume: number = 1.0;
  private audioCtx: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const unlockAudio = () => {
        this.getAudioContext();
        if ('speechSynthesis' in window) {
          try {
            window.speechSynthesis.resume();
            window.speechSynthesis.getVoices();
          } catch {}
        }
      };
      ['touchstart', 'touchend', 'click', 'mousedown', 'keydown'].forEach(evt => {
        window.addEventListener(evt, unlockAudio, { passive: true });
      });

      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
          try { window.speechSynthesis.getVoices(); } catch {}
        };
      }
    }
  }

  private getAudioContext(): AudioContext | null {
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      return this.audioCtx;
    } catch {
      return null;
    }
  }

  playTone(freq: number, type: OscillatorType, duration: number, vol = 0.25) {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }

  playPop() {
    this.playTone(700, 'sine', 0.08, 0.35);
  }

  playCardFlip() {
    this.playTone(450, 'triangle', 0.07, 0.25);
  }

  playCorrect() {
    this.playTone(587.33, 'triangle', 0.12, 0.35);
    setTimeout(() => this.playTone(880, 'triangle', 0.22, 0.4), 100);
  }

  playFanfare() {
    if (!this.enabled) return;
    [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.25, 0.35), i * 75);
    });
  }

  speak(text: string) {
    if (!this.enabled || !this.voiceEnabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();

      const cleanText = text.replace(/[\/#!$%\^&\*;:{}=\-_`~()]/g, ' ').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.88;
      utterance.pitch = 1.15;
      utterance.volume = this.volume;
      utterance.lang = 'en-US';

      // Keep reference on window to prevent Android Chromium GC bug
      window._activeUtterance = utterance;

      utterance.onend = () => {
        window._activeUtterance = null;
      };
      utterance.onerror = () => {
        window._activeUtterance = null;
      };

      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const preferredVoice = voices.find(v => (v.lang.startsWith('en') || v.lang.includes('US')) && !v.name.includes('Google')) || voices[0];
        if (preferredVoice) utterance.voice = preferredVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {}
  }
}

export const sound = new SoundEffects();
