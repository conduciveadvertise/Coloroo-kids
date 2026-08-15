// Dual-Engine Audio & Human Voice System (Works 100% on Android WebView & Browsers)
class SoundEngine {
  enabled: boolean = true;
  voiceEnabled: boolean = true;
  volume: number = 1.0;
  private audioCtx: AudioContext | null = null;
  private currentAudio: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const unlock = () => {
        this.getAudioContext();
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

  private getAudioContext(): AudioContext | null {
    try {
      if (!this.audioCtx) {
        const AudioClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioClass) this.audioCtx = new AudioClass();
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
      osc.frequency.setValueAtTime(750, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.07);
      gain.gain.setValueAtTime(0.35 * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } catch {}
  }

  playCardFlip() {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(480, ctx.currentTime);
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
      const ctx = this.getAudioContext();
      if (!ctx) return;
      [587.33, 880].forEach((freq, i) => {
        setTimeout(() => {
          if (!ctx) return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0.3 * this.volume, ctx.currentTime);
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
        const ctx = this.getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.25 * this.volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
      }, i * 75);
    });
  }

  // Dual-Engine Speech: Streams real human voice via HTML5 Audio + SpeechSynthesis
  speak(text: string) {
    if (!this.enabled || !this.voiceEnabled) return;
    const cleanText = text.replace(/[\/#!$%\^&\*;:{}=\-_`~()]/g, ' ').replace(/\s+/g, ' ').trim();
    if (!cleanText) return;

    // 1. Android Guaranteed Real Voice Engine (Google TTS Audio Stream)
    try {
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }
      const encoded = encodeURIComponent(cleanText);
      const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encoded}`;
      const audio = new Audio(audioUrl);
      audio.volume = this.volume;
      this.currentAudio = audio;
      audio.play().catch(() => {
        // Fallback to SpeechSynthesis if offline
        this.speakNativeFallback(cleanText);
      });
    } catch {
      this.speakNativeFallback(cleanText);
    }
  }

  private speakNativeFallback(cleanText: string) {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();
        const utt = new SpeechSynthesisUtterance(cleanText);
        utt.rate = 0.9;
        utt.pitch = 1.1;
        utt.volume = this.volume;
        utt.lang = 'en-US';
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          const v = voices.find(voice => voice.lang.includes('en'));
          if (v) utt.voice = v;
        }
        window.speechSynthesis.speak(utt);
      }
    } catch {}
  }
}

export const sound = new SoundEngine();
