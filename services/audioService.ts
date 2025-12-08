// A simple procedural audio engine for relaxation sounds without external assets

class AudioEngine {
  private ctx: AudioContext | null = null;
  private nodes: Record<string, GainNode> = {};
  private sources: Record<string, AudioNode[]> = {};
  private isInitialized = false;

  init() {
    if (this.isInitialized) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.isInitialized = true;
    this.setupWind();
    this.setupRain();
    this.setupBowls();
    this.setupWhiteNoise();
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private createWhiteNoiseBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = 2 * this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  private setupWind() {
    if (!this.ctx) return;
    // Pinkish noise through a lowpass filter
    const buffer = this.createWhiteNoiseBuffer();
    if (!buffer) return;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    filter.Q.value = 1;

    // Modulate filter frequency to simulate gusting
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.1;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 300; 

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    const gain = this.ctx.createGain();
    gain.gain.value = 0;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
    this.nodes['wind'] = gain;
    this.sources['wind'] = [noise, lfo];
  }

  private setupRain() {
    if (!this.ctx) return;
    const buffer = this.createWhiteNoiseBuffer();
    if (!buffer) return;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass'; // Rain is closer to pink/brown noise
    filter.frequency.value = 800;

    const gain = this.ctx.createGain();
    gain.gain.value = 0;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
    this.nodes['rain'] = gain;
    this.sources['rain'] = [noise];
  }

  private setupBowls() {
    if (!this.ctx) return;
    // Multiple sine waves to create a drone
    const gain = this.ctx.createGain();
    gain.gain.value = 0;
    gain.connect(this.ctx.destination);
    
    const freqs = [110, 112, 220, 221, 440]; // Detuned harmonics
    const oscs: OscillatorNode[] = [];

    freqs.forEach(f => {
      if(!this.ctx) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f;
      const oscGain = this.ctx.createGain();
      oscGain.gain.value = 0.1;
      osc.connect(oscGain);
      oscGain.connect(gain);
      osc.start();
      oscs.push(osc);
    });

    this.nodes['bowls'] = gain;
    this.sources['bowls'] = oscs;
  }

  private setupWhiteNoise() {
    if (!this.ctx) return;
    const buffer = this.createWhiteNoiseBuffer();
    if (!buffer) return;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const gain = this.ctx.createGain();
    gain.gain.value = 0;

    noise.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
    this.nodes['whiteNoise'] = gain;
    this.sources['whiteNoise'] = [noise];
  }

  setVolume(channel: string, value: number) {
    if (this.nodes[channel] && this.ctx) {
      // Smooth transition
      this.nodes[channel].gain.setTargetAtTime(value, this.ctx.currentTime, 0.1);
    }
  }
}

export const audioEngine = new AudioEngine();
