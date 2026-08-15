class SoundEffects {
  enabled: boolean = true;
  voiceEnabled: boolean = true;
  volume: number = 1.0;
  private audioCtx: AudioContext | null = null;

  constructor() {
    const unlock = () => {
      this.getAudioContext();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.resume();
      }
    };
    if (typeof window !== 'undefined') {
      ['touchstart', 'touchend', 'click', 'mousedown'].forEach(evt => {
        window.addEventListener(evt, unlock, { once: true, passive: true });
      });
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
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

  playPop() {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      gain.gain.setValueAtTime(0.2 * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {}
  }

  speak(text: string) {
    if (!this.enabled || !this.voiceEnabled) return;
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.88;
        utterance.pitch = 1.15;
        utterance.volume = this.volume;
        utterance.lang = 'en-US';

        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          const engVoice = voices.find(v => (v.lang.includes('en') || v.lang.includes('US')) && !v.name.includes('Google')) || voices[0];
          if (engVoice) utterance.voice = engVoice;
        }

        window.speechSynthesis.speak(utterance);
      }
    } catch {}
  }
}

export const sound = new SoundEffects();
