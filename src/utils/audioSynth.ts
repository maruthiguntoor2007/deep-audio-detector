import { AudioFileData } from '../types';

export const SAMPLE_AUDIO_FILES: AudioFileData[] = [
  {
    id: 'sample-ai-1',
    name: 'sample_audio.wav',
    sizeMB: 3.4,
    durationSec: 42,
    durationFormatted: '00:42',
    format: 'wav',
    source: 'sample',
    isAiGenerated: true,
    aiProbability: 87,
    humanProbability: 13,
    anomalyZones: '00:00 - 00:14',
    spectralSummary:
      'Synthetic phase irregularities and harmonic continuity gaps were detected in upper frequency bands (14kHz - 18kHz).',
    frequencyBandNote:
      'Model assessment: The audio is more likely to be AI-generated. Synthetic phase irregularities and harmonic continuity gaps were detected in upper frequency bands.',
  },
  {
    id: 'sample-human-1',
    name: 'authentic_interview.wav',
    sizeMB: 4.8,
    durationSec: 58,
    durationFormatted: '00:58',
    format: 'wav',
    source: 'sample',
    isAiGenerated: false,
    aiProbability: 6,
    humanProbability: 94,
    anomalyZones: 'None detected',
    spectralSummary:
      'Natural glottal pulse variations, authentic micro-tremors, and continuous acoustic sub-harmonics verified.',
    frequencyBandNote:
      'Model assessment: The audio is overwhelmingly authentic human speech. Organic vocal tract resonance with organic breath decay.',
  },
  {
    id: 'sample-ai-2',
    name: 'cloned_voice_speech.mp3',
    sizeMB: 2.1,
    durationSec: 32,
    durationFormatted: '00:32',
    format: 'mp3',
    source: 'sample',
    isAiGenerated: true,
    aiProbability: 96,
    humanProbability: 4,
    anomalyZones: '00:04 - 00:28',
    spectralSummary:
      'High-frequency cutoff brickwall filter signature at 16kHz typical of diffusion neural vocoders.',
    frequencyBandNote:
      'Model assessment: High-confidence neural synthesis detected. Unnatural phoneme-to-phoneme pitch transitions.',
  },
];

// Simple Web Audio player that can generate realistic speech-like acoustic tones
class ForensicAudioPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private activeOscillators: OscillatorNode[] = [];
  private onEndedCallback: (() => void) | null = null;
  private timer: any = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playSample(isAi: boolean, durationSeconds = 14, onProgress?: (sec: number) => void, onEnd?: () => void) {
    this.stop();
    this.initCtx();
    if (!this.ctx) return;

    this.isPlaying = true;
    this.onEndedCallback = onEnd || null;

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    masterGain.connect(this.ctx.destination);

    // Formant filter frequencies resembling speech vowels
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(isAi ? 1800 : 900, this.ctx.currentTime);
    filter.Q.setValueAtTime(isAi ? 8 : 3, this.ctx.currentTime);
    filter.connect(masterGain);

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();

    // AI voice has slightly robotic static harmonic intervals
    osc1.type = isAi ? 'sawtooth' : 'triangle';
    osc2.type = 'sine';

    const baseFreq = isAi ? 190 : 130;
    osc1.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    osc2.frequency.setValueAtTime(baseFreq * 2, this.ctx.currentTime);

    // Add speech cadence pitch modulation
    for (let t = 0; t < durationSeconds; t += 0.4) {
      const targetPitch = baseFreq + Math.sin(t * 3) * (isAi ? 15 : 45);
      osc1.frequency.linearRampToValueAtTime(targetPitch, this.ctx.currentTime + t);
    }

    osc1.connect(filter);
    osc2.connect(filter);

    osc1.start();
    osc2.start();

    this.activeOscillators = [osc1, osc2];

    let elapsed = 0;
    this.timer = setInterval(() => {
      elapsed += 0.25;
      if (onProgress) onProgress(elapsed);
      if (elapsed >= durationSeconds) {
        this.stop();
        if (this.onEndedCallback) this.onEndedCallback();
      }
    }, 250);
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // ignore
      }
    });
    this.activeOscillators = [];
  }

  public getIsPlaying() {
    return this.isPlaying;
  }
}

export const audioPlayer = new ForensicAudioPlayer();
