class SoundEffects {
  enabled: boolean = true;
  voiceEnabled: boolean = true;
  volume: number = 1.0;
  private audioCtx: AudioContext | null = null;

  constructor() {
    // Lazy AudioContext init on first user interaction
    const initCtx = () => {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
    };
    ['touchstart', 'touchend', 'mousedown', 'keydown'].forEach(evt => {
      window.addEventListener(evt, initCtx, { once: true, passive: true });
    });
  }

  private playTone(freq: number, type: OscillatorType, duration: number, startVol = 0.3) {
    if (!this.enabled) return;
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) this.audioCtx = new AudioContextClass();
      }
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(startVol * this.volume, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch {}
  }

  playPop() {
    this.playTone(600, 'sine', 0.1, 0.4);
  }

  playSparkle() {
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.18, 0.25), i * 60);
    });
  }

  playFanfare() {
    [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.3, 0.35), i * 90);
    });
  }

  playColorChime(index: number) {
    const scale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99];
    this.playTone(scale[index % scale.length], 'sine', 0.2, 0.3);
  }

  playCardFlip() {
    this.playTone(400, 'sine', 0.08, 0.2);
  }

  playCorrect() {
    this.playTone(587.33, 'triangle', 0.15, 0.3);
    setTimeout(() => this.playTone(880.00, 'triangle', 0.25, 0.3), 120);
  }

  playSwoosh() {
    this.playTone(300, 'sine', 0.12, 0.15);
  }

  speak(text: string) {
    if (!this.enabled || !this.voiceEnabled) return;
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.2;
        utterance.volume = this.volume;
        window.speechSynthesis.speak(utterance);
      }
    } catch {}
  }
}

export const sound = new SoundEffects();
