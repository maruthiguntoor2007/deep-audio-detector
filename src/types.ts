export type ScreenType =
  | 'login'
  | 'forgot_password'
  | 'otp'
  | 'analyze'
  | 'analyzing'
  | 'result';

export interface VocalFeatures {
  pitchHz: number;
  jitterPct: number;
  shimmerPct: number;
  speechNaturalnessPct: number;
  glottalPulseRate: number;
  isIsolatedVoice: boolean;
}

export interface AudioFileData {
  id: string;
  name: string;
  sizeMB: number;
  durationSec: number;
  durationFormatted: string;
  format: 'wav' | 'mp3' | 'flac' | 'm4a';
  source: 'sample' | 'upload' | 'recording';
  url?: string;
  isAiGenerated: boolean;
  aiProbability: number;
  humanProbability: number;
  spectralSummary: string;
  anomalyZones?: string;
  frequencyBandNote?: string;
  vocalFeatures?: VocalFeatures;
  voiceOnlyWaveform?: number[];
  audioBlob?: Blob;
}

export interface AnalysisState {
  currentStage: number; // 1, 2, or 3
  progressPercent: number; // 0 to 100
  stage1Status: 'done' | 'active' | 'pending';
  stage2Status: 'done' | 'active' | 'pending';
  stage3Status: 'done' | 'active' | 'pending';
}
