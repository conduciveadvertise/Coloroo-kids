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
          window.speechSynthesis.resume();
          window.speechSynthesis.getVoices();
        }
      };
      ['touchstart', 'touchend', 'click', 'mousedown'].forEach(evt => {
        window.addEventListener(evt, unlockAudio, { passive: true });
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

  private playTone(freq: number, type: OscillatorType, duration: number, vol = 0.25) {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }

  playPop() {
    this.playTone(650, 'sine', 0.09, 0.3);
  }

  playCorrect() {
    this.playTone(587.33, 'triangle', 0.12, 0.3);
    setTimeout(() => this.playTone(880, 'triangle', 0.2, 0.35), 100);
  }

  playFanfare() {
    if (!this.enabled) return;
    [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.25, 0.3), i * 75);
    });
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
