/**
 * Cross-platform Audio Synthesizer & Soundscape Engine
 * Generates soft chimes, Tibetan singing bowl bells, and ambient lo-fi sounds
 * (Rainfall, Campfire, Lo-Fi Cafe, White Noise) without external asset dependencies.
 */

class SoundService {
  private ctx: AudioContext | null = null;
  private ambientSource: AudioNode | null = null;
  private ambientGain: GainNode | null = null;
  private currentTrack: string | null = null;
  private isMuted: boolean = false;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play peaceful meditation chime
  playChime(type: 'start' | 'complete' | 'tick' = 'start') {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'start') {
        // Pentatonic peaceful rising two-tone (E5 -> B5)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, now);
        osc.frequency.exponentialRampToValueAtTime(987.77, now + 0.15);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.2, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.2);
      } else if (type === 'complete') {
        // Celebration chime chord
        const freqs = [523.25, 659.25, 783.99, 1046.5]; // C Major
        freqs.forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'sine';
          o.frequency.setValueAtTime(freq, now + i * 0.08);

          g.gain.setValueAtTime(0.001, now + i * 0.08);
          g.gain.exponentialRampToValueAtTime(0.15, now + i * 0.08 + 0.05);
          g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 1.8);

          o.connect(g);
          g.connect(ctx.destination);
          o.start(now + i * 0.08);
          o.stop(now + i * 0.08 + 1.8);
        });
      } else {
        // Subtle woodblock click
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.03);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
      }
    } catch {
      // Audio might be blocked before first user gesture
    }
  }

  // Play ambient generator
  playAmbient(track: 'rain' | 'campfire' | 'cafe' | 'whitenoise' | 'none') {
    this.stopAmbient();
    if (track === 'none' || this.isMuted) {
      this.currentTrack = null;
      return;
    }

    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      this.currentTrack = track;
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Generate brown/pink noise base
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (track === 'rain') {
          // Rain: Pink noise with soft lowpass
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5;
        } else if (track === 'campfire') {
          // Crackle + warm low hum
          const crackle = Math.random() > 0.995 ? (Math.random() * 0.8) : 0;
          output[i] = ((lastOut + 0.04 * white) / 1.04) * 2.5 + crackle;
          lastOut = output[i];
        } else if (track === 'cafe') {
          // Soft murmur frequencies
          output[i] = (lastOut + 0.015 * white) / 1.015;
          lastOut = output[i];
          output[i] *= 2.8;
        } else {
          // White noise
          output[i] = white * 0.15;
        }
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter to sound realistic and cozy
      const filter = ctx.createBiquadFilter();
      if (track === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.value = 1100;
      } else if (track === 'campfire') {
        filter.type = 'bandpass';
        filter.frequency.value = 650;
      } else {
        filter.type = 'lowpass';
        filter.frequency.value = 850;
      }

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 1.5);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
      this.ambientSource = whiteNoise;
      this.ambientGain = gain;
    } catch {
      // AudioContext handling
    }
  }

  stopAmbient() {
    if (this.ambientGain && this.ctx) {
      try {
        this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, this.ctx.currentTime);
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
        setTimeout(() => {
          if (this.ambientSource) {
            try {
              (this.ambientSource as AudioBufferSourceNode).stop();
              this.ambientSource.disconnect();
            } catch {
              // ignore
            }
            this.ambientSource = null;
          }
        }, 550);
      } catch {
        this.ambientSource = null;
      }
    }
  }

  getCurrentTrack() {
    return this.currentTrack;
  }
}

export const soundService = new SoundService();
