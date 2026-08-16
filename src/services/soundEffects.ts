import { TextToSpeech, QueueStrategy } from '@capacitor-community/text-to-speech';

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

  // Reliable Android WebView Speech Engine
  // Uses the device/browser TTS engine directly; no external TTS URL required.
  private speechVoices: SpeechSynthesisVoice[] = [];
  private speechReady = false;

  private initSpeech() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      const synth = window.speechSynthesis;

      const loadVoices = () => {
        try {
          this.speechVoices = synth.getVoices() || [];
          this.speechReady = true;
        } catch {}
      };

      loadVoices();

      // Android WebView may initially return an empty voice list.
      if ('onvoiceschanged' in synth) {
        synth.addEventListener('voiceschanged', loadVoices);
      }

      // Some Android WebViews populate voices shortly after startup.
      setTimeout(loadVoices, 100);
      setTimeout(loadVoices, 500);
      setTimeout(loadVoices, 1500);
    } catch {}
  }

  private getEnglishVoice(): SpeechSynthesisVoice | null {
    const voices =
      this.speechVoices.length > 0
        ? this.speechVoices
        : (typeof window !== 'undefined' && 'speechSynthesis' in window
            ? window.speechSynthesis.getVoices()
            : []);

    return (
      voices.find(v => /^en-US$/i.test(v.lang)) ||
      voices.find(v => /^en-GB$/i.test(v.lang)) ||
      voices.find(v => /^en[-_]/i.test(v.lang)) ||
      voices.find(v => v.lang.toLowerCase().startsWith('en')) ||
      null
    );
  }

  // Speak directly through Android/WebView TTS.
  async speak(text: string) {
    if (!this.enabled || !this.voiceEnabled) return;

    const cleanText = text
      .replace(/[\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;
    // Native Android TTS — primary engine for the Capacitor APK.
    try {
      await TextToSpeech.stop();
      await TextToSpeech.speak({
        text: cleanText,
        lang: 'en-US',
        rate: 0.9,
        pitch: 1.05,
        volume: this.volume,
        queueStrategy: QueueStrategy.Flush,
      });
      return;
    } catch (error) {
      console.warn('Native TTS failed, using Web Speech fallback:', error);
    }


    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      const synth = window.speechSynthesis;

      // Android WebView can pause the speech engine after inactivity.
      try {
        synth.resume();
      } catch {}

      // Stop previous narration so multiple taps do not overlap.
      try {
        synth.cancel();
      } catch {}

      const speakNow = () => {
        try {
          const utterance = new SpeechSynthesisUtterance(cleanText);

          utterance.lang = 'en-US';
          utterance.rate = 0.9;
          utterance.pitch = 1.05;
          utterance.volume = this.volume;

          const voice = this.getEnglishVoice();
          if (voice) {
            utterance.voice = voice;
          }

          utterance.onerror = () => {
            // Give Android WebView one clean retry if the first utterance fails.
            try {
              synth.cancel();
              synth.resume();
              const retry = new SpeechSynthesisUtterance(cleanText);
              retry.lang = voice?.lang || 'en-US';
              retry.rate = 0.9;
              retry.pitch = 1.05;
              retry.volume = this.volume;
              if (voice) retry.voice = voice;
              synth.speak(retry);
            } catch {}
          };

          synth.speak(utterance);
        } catch {}
      };

      // If Android has not populated voices yet, retry after initialization.
      if (!this.speechReady || this.speechVoices.length === 0) {
        this.initSpeech();
        setTimeout(speakNow, 150);
      } else {
        speakNow();
      }
    } catch {}
  }

}

export const sound = new SoundEngine();
