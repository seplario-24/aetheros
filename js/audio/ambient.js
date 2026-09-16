/**
 * AETHER OS — PROCEDURAL WEB AUDIO SYNTHESIZER & AMBIENT GENERATOR
 * 100% offline, procedural sound generation using Web Audio API.
 * Rain & Thunder, 10Hz Binaural Alpha Waves, Deep Space Drone, Forest Night, Harmonic Chimes.
 */

import { store } from '../store/db.js';

class AmbientAudioEngine {
  constructor() {
    this.ctx = null;
    this.activeNodes = [];
    this.currentTrack = 'none';
    this.masterGain = null;
    this.volume = 0.5;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  stop() {
    for (const node of this.activeNodes) {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    }
    this.activeNodes = [];
    this.currentTrack = 'none';
  }

  setTrack(trackId) {
    this.stop();
    if (!trackId || trackId === 'none') {
      return;
    }

    this.ensureContext();
    this.currentTrack = trackId;

    switch (trackId) {
      case 'rain':
        this.generateRain();
        break;
      case 'binaural':
        this.generateBinauralAlpha();
        break;
      case 'cosmos':
        this.generateCosmosDrone();
        break;
      case 'forest':
        this.generateForestNight();
        break;
      default:
        break;
    }
  }

  // --------------------------------------------------------------------------
  // Procedural Noise Buffer (Pink Noise)
  // --------------------------------------------------------------------------
  createPinkNoiseBuffer(duration = 5) {
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  // --------------------------------------------------------------------------
  // Rain & Gentle Thunder
  // --------------------------------------------------------------------------
  generateRain() {
    const noiseBuffer = this.createPinkNoiseBuffer(4);
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Filter to simulate soft rainfall
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(850, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.65, this.ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.masterGain);

    noiseSource.start();
    this.activeNodes.push(noiseSource, filter, rainGain);
  }

  // --------------------------------------------------------------------------
  // 10Hz Binaural Alpha Waves (Focus Frequency)
  // --------------------------------------------------------------------------
  generateBinauralAlpha() {
    // Carrier: 440 Hz (left), 450 Hz (right) -> 10Hz Alpha beat
    const baseFreq = 216;
    const beatOffset = 10;

    const oscL = this.ctx.createOscillator();
    oscL.type = 'sine';
    oscL.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);

    const oscR = this.ctx.createOscillator();
    oscR.type = 'sine';
    oscR.frequency.setValueAtTime(baseFreq + beatOffset, this.ctx.currentTime);

    const panL = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    const panR = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

    const gainL = this.ctx.createGain();
    const gainR = this.ctx.createGain();
    gainL.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gainR.gain.setValueAtTime(0.3, this.ctx.currentTime);

    if (panL && panR) {
      panL.pan.setValueAtTime(-0.85, this.ctx.currentTime);
      panR.pan.setValueAtTime(0.85, this.ctx.currentTime);

      oscL.connect(gainL);
      gainL.connect(panL);
      panL.connect(this.masterGain);

      oscR.connect(gainR);
      gainR.connect(panR);
      panR.connect(this.masterGain);
      this.activeNodes.push(oscL, oscR, panL, panR, gainL, gainR);
    } else {
      oscL.connect(gainL);
      gainL.connect(this.masterGain);
      oscR.connect(gainR);
      gainR.connect(this.masterGain);
      this.activeNodes.push(oscL, oscR, gainL, gainR);
    }

    oscL.start();
    oscR.start();
  }

  // --------------------------------------------------------------------------
  // Deep Cosmos Warm Drone
  // --------------------------------------------------------------------------
  generateCosmosDrone() {
    const rootFreq = 65.41; // C2

    // Oscillator 1 (Warm Triangle root)
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(rootFreq, this.ctx.currentTime);

    // Oscillator 2 (Slightly detuned octave)
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(rootFreq * 2 + 0.4, this.ctx.currentTime);

    // Lowpass filter for warm sub warmth
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc1.start();
    osc2.start();
    this.activeNodes.push(osc1, osc2, filter, gain);
  }

  // --------------------------------------------------------------------------
  // Forest Night
  // --------------------------------------------------------------------------
  generateForestNight() {
    const noiseBuffer = this.createPinkNoiseBuffer(5);
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Highpass filter for gentle night wind
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
    filter.Q.setValueAtTime(0.8, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noiseSource.start();
    this.activeNodes.push(noiseSource, filter, gain);
  }

  // --------------------------------------------------------------------------
  // Pleasant Harmonic Chime (Task Completed / Timer Finished)
  // --------------------------------------------------------------------------
  playChime() {
    if (!store.getPreferences().soundEnabled) return;

    try {
      this.ensureContext();
      const now = this.ctx.currentTime;

      // Harmonic frequencies (E maj pentatonic chord: E5, G#5, B5, E6)
      const freqs = [659.25, 830.61, 987.77, 1318.51];

      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.2 - idx * 0.03, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 1.6);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.8);
      });
    } catch (e) {
      console.warn('Could not play chime:', e);
    }
  }
}

export const ambientAudio = new AmbientAudioEngine();
