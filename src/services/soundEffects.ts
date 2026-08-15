// Audio Synthesizer & Speech Engine for Coloroo Kids

class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  public volume: number = 0.8;
  public voiceEnabled: boolean = true;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public playPop(): void {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      const now = ctx.currentTime;
      
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(850, now + 0.08);
      
      gain.gain.setValueAtTime(0.3 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Audio fallback silent
    }
  }

  public playColorChime(colorIndex: number = 0): void {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      // Pentatonic bright scale
      const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];
      const freq = notes[colorIndex % notes.length];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const now = ctx.currentTime;

      osc.frequency.setValueAtTime(freq, now);
      
      gain.gain.setValueAtTime(0.25 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {}
  }

  public playSparkle(): void {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.18 * this.volume, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.22);
      });
    } catch {}
  }

  public playFanfare(): void {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const notes = [
        { f: 392.00, t: 0.0, d: 0.12 },
        { f: 523.25, t: 0.14, d: 0.12 },
        { f: 659.25, t: 0.28, d: 0.12 },
        { f: 783.99, t: 0.42, d: 0.45 }
      ];

      const now = ctx.currentTime;
      notes.forEach(({ f, t, d }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + t);

        gain.gain.setValueAtTime(0.3 * this.volume, now + t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + t);
        osc.stop(now + t + d + 0.05);
      });
    } catch {}
  }

  public playArtworkSuccess(): void {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // 1. High-energy celebratory rising fanfare arpeggio (C4 -> E4 -> G4 -> C5 -> E5 -> G5 -> C6)
      const celebrationNotes = [
        { f: 261.63, t: 0.0, d: 0.12, type: 'triangle' as OscillatorType, vol: 0.32 },
        { f: 329.63, t: 0.07, d: 0.12, type: 'triangle' as OscillatorType, vol: 0.34 },
        { f: 392.00, t: 0.14, d: 0.12, type: 'triangle' as OscillatorType, vol: 0.36 },
        { f: 523.25, t: 0.21, d: 0.14, type: 'sine' as OscillatorType, vol: 0.38 },
        { f: 659.25, t: 0.28, d: 0.14, type: 'sine' as OscillatorType, vol: 0.4 },
        { f: 783.99, t: 0.35, d: 0.16, type: 'triangle' as OscillatorType, vol: 0.42 },
        { f: 1046.50, t: 0.42, d: 0.7, type: 'triangle' as OscillatorType, vol: 0.48 },
        // Harmonic major chord triumphant chime sustain
        { f: 1318.51, t: 0.46, d: 0.65, type: 'sine' as OscillatorType, vol: 0.3 },
        { f: 1567.98, t: 0.50, d: 0.6, type: 'sine' as OscillatorType, vol: 0.28 }
      ];

      celebrationNotes.forEach(({ f, t, d, type, vol }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(f, now + t);

        gain.gain.setValueAtTime(vol * this.volume, now + t);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + t + d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + t);
        osc.stop(now + t + d + 0.05);
      });

      // 2. High-energy glittering stardust sparkle flurry
      const sparklePitches = [1396.91, 1567.98, 1760.00, 2093.00, 2349.32, 2793.83, 3135.96];
      sparklePitches.forEach((pitch, i) => {
        const delay = 0.48 + i * 0.04;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(pitch, now + delay);

        gain.gain.setValueAtTime(0.2 * this.volume, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 0.25);
      });

      // 3. Cheerful celebratory bouncy bass impact
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(180, now);
      bassOsc.frequency.exponentialRampToValueAtTime(70, now + 0.18);
      bassGain.gain.setValueAtTime(0.35 * this.volume, now);
      bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
      bassOsc.connect(bassGain);
      bassGain.connect(ctx.destination);
      bassOsc.start(now);
      bassOsc.stop(now + 0.22);

    } catch {}
  }

  public playCardFlip(): void {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.09);

      gain.gain.setValueAtTime(0.2 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }

  public playCorrect(): void {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [523.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
        gain.gain.setValueAtTime(0.25 * this.volume, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.25);
      });
    } catch {}
  }

  public playSwoosh(): void {
    if (!this.enabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.12);

      gain.gain.setValueAtTime(0.15 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {}
  }

  public speak(text: string): void {
    if (!this.voiceEnabled) return;
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.25;
      utterance.volume = this.volume;
      
      // Select an English voice if available
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const enVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Natural')));
        if (enVoice) utterance.voice = enVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Audio speech fallback silent
    }
  }
}

export const sound = new SoundEngine();
