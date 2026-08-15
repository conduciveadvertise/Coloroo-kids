// Web Audio Formant Synthesizer & Speech Audio System
class VoiceAndSoundEngine {
  enabled: boolean = true;
  voiceEnabled: boolean = true;
  volume: number = 1.0;
  private ctx: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const unlock = () => {
        this.getAudioCtx();
        if ('speechSynthesis' in window) {
          try {
            window.speechSynthesis.resume();
            window.speechSynthesis.getVoices();
          } catch {}
        }
      };
      ['touchstart', 'touchend', 'click', 'mousedown'].forEach(evt => {
        window.addEventListener(evt, unlock, { passive: true });
      });
    }
  }

  private getAudioCtx(): AudioContext | null {
    try {
      if (!this.ctx) {
        const AudioClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioClass) this.ctx = new AudioClass();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  // Pure Web Audio Custom Sound Effects
  playPop() {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.4 * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {}
  }

  playCardFlip() {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      gain.gain.setValueAtTime(0.2 * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {}
  }

  playCorrect() {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioCtx();
      if (!ctx) return;
      [587.33, 880].forEach((freq, i) => {
        setTimeout(() => {
          if (!ctx) return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0.25 * this.volume, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.15);
        }, i * 100);
      });
    } catch {}
  }

  playFanfare() {
    if (!this.enabled) return;
    [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, i) => {
      setTimeout(() => {
        const ctx = this.getAudioCtx();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.25 * this.volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }, i * 75);
    });
  }

  // Audio Speech Formant fallback + Native TTS
  speak(text: string) {
    if (!this.enabled || !this.voiceEnabled) return;

    // 1. Direct Web Speech API
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();

        const clean = text.replace(/[\/#!$%\^&\*;:{}=\-_`~()]/g, ' ').trim();
        const utt = new SpeechSynthesisUtterance(clean);
        utt.rate = 0.88;
        utt.pitch = 1.15;
        utt.volume = this.volume;
        utt.lang = 'en-US';

        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          const v = voices.find(voice => voice.lang.includes('en') || voice.lang.includes('US'));
          if (v) utt.voice = v;
        }

        (window as any)._keepAliveUtt = utt;
        utt.onend = () => { (window as any)._keepAliveUtt = null; };
        utt.onerror = () => { (window as any)._keepAliveUtt = null; };

        window.speechSynthesis.speak(utt);
      }
    } catch {}

    // 2. Play Melodic Voice Sound Tone through AudioContext
    try {
      const ctx = this.getAudioCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const charCode = text.charCodeAt(0) || 65;
      const baseF = 350 + (charCode % 20) * 20;
      osc.frequency.setValueAtTime(baseF, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseF * 1.3, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.3 * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {}
  }
}

export const sound = new VoiceAndSoundEngine();
