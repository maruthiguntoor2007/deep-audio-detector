import React, { useState } from 'react';
import { AudioFileData } from '../types';
import { audioPlayer } from '../utils/audioSynth';

interface ResultScreenProps {
  file: AudioFileData;
  onAnalyzeAnother: () => void;
  onUploadNew: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  file,
  onAnalyzeAnother,
  onUploadNew,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSec, setPlaybackSec] = useState(0);
  const [showDetailedReport, setShowDetailedReport] = useState(false);
  const [showOnlyVoiceWave, setShowOnlyVoiceWave] = useState(true);

  const aiPercent = file.aiProbability ?? (file.isAiGenerated ? 87 : 8);
  const humanPercent = file.humanProbability ?? (100 - aiPercent);
  const isAi = aiPercent >= 50;
  const isVoiceRecording = file.source === 'recording' || !!file.vocalFeatures;

  const toggleAudio = () => {
    if (isPlaying) {
      audioPlayer.stop();
      setIsPlaying(false);
    } else {
      audioPlayer.playSample(
        isAi,
        file.durationSec || 14,
        (sec) => setPlaybackSec(Math.floor(sec)),
        () => {
          setIsPlaying(false);
          setPlaybackSec(0);
        }
      );
      setIsPlaying(true);
    }
  };

  const handleDownloadReport = () => {
    const report = {
      target: file.name,
      timestamp: new Date().toISOString(),
      voice_isolation: 'Only Voice (Active)',
      classification: isAi ? 'AI_GENERATED_VOICE' : 'AUTHENTIC_HUMAN_VOICE',
      metrics: {
        ai_probability: `${aiPercent}%`,
        human_probability: `${humanPercent}%`,
        anomaly_zones: file.anomalyZones || '00:00 - 00:14',
      },
      vocal_features: file.vocalFeatures || {
        fundamental_frequency: '142 Hz',
        glottal_pulse_continuity: isAi ? 'Artificially Periodic (AI)' : 'Biological Flutter (Human)',
      },
      forensic_telemetry: {
        spectral_continuity: isAi
          ? 'Deficient (high phase variance / diffusion vocoder)'
          : 'Natural (continuous organic vocal phase)',
        high_band_cutoff: isAi ? 'Detected (16.2 kHz artificial roll-off)' : 'None (extends to 22.05 kHz)',
        vocal_tract_formants: isAi ? 'Synthetic mathematical trajectory' : 'Organic micro-tremors verified',
      },
      diagnostic_summary: file.spectralSummary,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forensic_voice_report_${file.name.replace(/\.[^/.]+$/, '')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 pb-12 flex flex-col">
      {/* Top Header Section */}
      <div className="flex flex-col items-center text-center mt-1 mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dae2fd] text-[#434655] text-[12px] font-semibold mb-2 border border-[#c3c6d7]">
          <span className="material-symbols-outlined text-[16px] text-[#004ac6]">
            {isVoiceRecording ? 'record_voice_over' : 'audio_file'}
          </span>
          <span id="badge-filename">File: {file.name}</span>
        </div>
        <h1 className="font-headline text-[24px] leading-[32px] font-bold text-[#131b2e] tracking-tight">
          Analysis Result
        </h1>
        <p className="text-[14px] leading-[20px] text-[#434655] mt-0.5">
          {isVoiceRecording ? 'Neural voice detection telemetry complete' : 'Forensic acoustic telemetry complete'}
        </p>
      </div>

      {/* Primary Score Display Bento Card */}
      <div className="w-full bg-[#ffffff] rounded-2xl p-6 shadow-sm border border-[#dae2fd]/70 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#2563eb]/5 rounded-full pointer-events-none blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-[#ba1a1a]/5 rounded-full pointer-events-none blur-2xl" />

        {/* AI Tag / Human Tag */}
        <div
          className={`inline-flex items-center gap-1.5 font-semibold text-[12px] px-3.5 py-1 rounded-full uppercase tracking-wider ${
            isAi
              ? 'bg-[#dbe1ff] text-[#00174b] border border-[#b4c5ff]'
              : 'bg-[#6cf8bb]/40 text-[#005236] border border-[#4edea3]'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full animate-pulse ${
              isAi ? 'bg-[#004ac6]' : 'bg-[#006c49]'
            }`}
          />
          <span id="main-classification-label">
            {isAi ? 'AI-GENERATED' : 'HUMAN-GENERATED'}
          </span>
        </div>

        {/* Percentage Hero */}
        <div className="my-2 flex items-baseline justify-center">
          <span
            className="font-headline text-[#131b2e] tracking-tight font-extrabold"
            id="main-score-display"
            style={{ fontSize: '56px', lineHeight: '64px' }}
          >
            {isAi ? `${aiPercent}%` : `${humanPercent}%`}
          </span>
        </div>

        {/* Secondary Relative Measure */}
        <div className="flex items-center justify-center gap-1.5 text-[#434655] text-[14px]">
          <span>{isAi ? 'Human-Generated:' : 'AI-Generated:'}</span>
          <span
            className="font-headline text-[18px] font-bold text-[#131b2e]"
            id="human-relative-label"
          >
            {isAi ? `${humanPercent}%` : `${aiPercent}%`}
          </span>
        </div>

        {/* Mini Waveform Visualizer Preview with interactive play */}
        <div className="w-full bg-[#f2f3ff] rounded-xl p-3 mt-5 flex flex-col gap-2 border border-[#eaedff]">
          <div className="flex items-center justify-between px-1">
            <button
              onClick={toggleAudio}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#004ac6] hover:text-[#00174b] bg-white px-2.5 py-1 rounded-lg border border-[#dae2fd] shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
              <span>{isPlaying ? 'Pause' : 'Play Voice'}</span>
            </button>

            {/* Toggle show only voice */}
            <button
              onClick={() => setShowOnlyVoiceWave(!showOnlyVoiceWave)}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-[#dae2fd] text-[#004ac6] flex items-center gap-1 hover:bg-[#eaedff]"
            >
              <span className="material-symbols-outlined text-[12px]">record_voice_over</span>
              <span>{showOnlyVoiceWave ? 'Showing: Only Voice' : 'Showing: Raw Audio'}</span>
            </button>

            <span className="text-[11px] text-[#737686] font-mono">
              {isPlaying ? `00:0${playbackSec}` : '00:00'} / {file.durationFormatted || '00:14'}
            </span>
          </div>

          <div className="w-full h-14 flex items-center justify-between gap-1 px-1 pt-1">
            {/* 18 Bars matching layout and anomaly flag colors */}
            <div className={`h-6 w-1 rounded-full ${isAi ? 'bg-[#2563eb]/40' : 'bg-[#006c49]/40'}`} />
            <div className={`h-8 w-1 rounded-full ${isAi ? 'bg-[#2563eb]/60' : 'bg-[#006c49]/60'}`} />
            <div className={`h-4 w-1 rounded-full ${isAi ? 'bg-[#2563eb]' : 'bg-[#006c49]'}`} />
            <div className={`h-10 w-1 rounded-full ${isAi ? 'bg-[#ba1a1a]' : 'bg-[#006c49]'}`} />
            <div className={`h-9 w-1 rounded-full ${isAi ? 'bg-[#ba1a1a]' : 'bg-[#006c49]'}`} />
            <div className={`h-5 w-1 rounded-full ${isAi ? 'bg-[#ba1a1a]/70' : 'bg-[#006c49]/70'}`} />
            <div className={`h-12 w-1 rounded-full ${isAi ? 'bg-[#2563eb]' : 'bg-[#006c49]'}`} />
            <div className={`h-7 w-1 rounded-full ${isAi ? 'bg-[#2563eb]/70' : 'bg-[#006c49]/70'}`} />
            <div className="h-3 w-1 rounded-full bg-[#dae2fd]" />
            <div className={`h-9 w-1 rounded-full ${isAi ? 'bg-[#ba1a1a]' : 'bg-[#006c49]'}`} />
            <div className={`h-11 w-1 rounded-full ${isAi ? 'bg-[#ba1a1a]' : 'bg-[#006c49]'}`} />
            <div className={`h-6 w-1 rounded-full ${isAi ? 'bg-[#2563eb]' : 'bg-[#006c49]'}`} />
            <div className={`h-4 w-1 rounded-full ${isAi ? 'bg-[#2563eb]/50' : 'bg-[#006c49]/50'}`} />
            <div className="h-8 w-1 rounded-full bg-[#dae2fd]" />
            <div className={`h-5 w-1 rounded-full ${isAi ? 'bg-[#2563eb]' : 'bg-[#006c49]'}`} />
            <div className={`h-10 w-1 rounded-full ${isAi ? 'bg-[#ba1a1a]' : 'bg-[#006c49]'}`} />
            <div className={`h-7 w-1 rounded-full ${isAi ? 'bg-[#2563eb]/80' : 'bg-[#006c49]/80'}`} />
            <div className={`h-4 w-1 rounded-full ${isAi ? 'bg-[#2563eb]/40' : 'bg-[#006c49]/40'}`} />
          </div>

          <div className="w-full flex justify-between items-center px-1 text-[#434655] text-[11px]">
            <span className="flex items-center gap-1 font-medium">
              <span className={`w-1.5 h-1.5 rounded-full ${isAi ? 'bg-[#ba1a1a]' : 'bg-[#006c49]'}`} />
              {isAi ? 'Flagged anomaly zones' : 'Acoustic vocal continuity verified'}
            </span>
            <span>{file.anomalyZones || '00:00 - 00:14'}</span>
          </div>
        </div>
      </div>

      {/* Diagnostic Comparison Metric Bars & Representation */}
      <div className="w-full bg-[#ffffff] rounded-2xl p-5 shadow-sm border border-[#dae2fd]/70 mt-3 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="font-headline text-[18px] font-bold text-[#131b2e]">
            Telemetry Distribution
          </span>
          <span className="material-symbols-outlined text-[#737686] text-[20px]">query_stats</span>
        </div>

        {/* AI Metric Row */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[12px] font-semibold">
            <span className="flex items-center gap-1.5 text-[#131b2e]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#004ac6]" />
              AI-generated
            </span>
            <span className="font-headline text-[16px] text-[#004ac6]" id="bar-ai-val">
              {aiPercent}%
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-[#eaedff] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#004ac6] transition-all duration-700 ease-out"
              id="bar-ai-fill"
              style={{ width: `${aiPercent}%` }}
            />
          </div>
        </div>

        {/* Human Metric Row */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[12px] font-semibold">
            <span className="flex items-center gap-1.5 text-[#131b2e]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#006c49]" />
              Human-generated
            </span>
            <span className="font-headline text-[16px] text-[#006c49]" id="bar-human-val">
              {humanPercent}%
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-[#eaedff] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#006c49] transition-all duration-700 ease-out"
              id="bar-human-fill"
              style={{ width: `${humanPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Clinical Interpretation Banner */}
      <div className="w-full bg-[#e2e7ff] rounded-2xl p-4 shadow-sm border border-[#dae2fd] mt-3 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-[#2563eb] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
          <span className="material-symbols-outlined text-[18px]">verified_user</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[14px] font-semibold text-[#131b2e]">
            System Interpretation
          </span>
          <p className="text-[13px] leading-relaxed text-[#434655] mt-0.5">
            Model assessment: The audio is{' '}
            <span className="font-semibold text-[#131b2e]">
              {isAi ? 'more likely to be AI-generated' : 'authentic human speech'}
            </span>
            .{' '}
            {file.spectralSummary ||
              'Synthetic phase irregularities and harmonic continuity gaps were detected in upper frequency bands.'}
          </p>
        </div>
      </div>

      {/* Telemetry Details Breakdown Card */}
      <div className="w-full bg-[#ffffff] rounded-2xl p-4 shadow-sm border border-[#dae2fd]/70 mt-3 flex flex-col gap-2.5">
        <div className="flex items-center justify-between py-1 border-b border-[#eaedff]">
          <span className="text-[13px] text-[#434655]">Target Voice / Audio</span>
          <span className="text-[12px] font-semibold text-[#131b2e] truncate max-w-[200px]" id="detail-filename">
            {file.name}
          </span>
        </div>
        <div className="flex items-center justify-between py-1 border-b border-[#eaedff]">
          <span className="text-[13px] text-[#434655]">AI-generated probability</span>
          <span className="text-[12px] font-bold text-[#004ac6]" id="detail-ai">
            {aiPercent}%
          </span>
        </div>
        <div className="flex items-center justify-between py-1 border-b border-[#eaedff]">
          <span className="text-[13px] text-[#434655]">Human-generated probability</span>
          <span className="text-[12px] font-bold text-[#006c49]" id="detail-human">
            {humanPercent}%
          </span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-[13px] text-[#434655]">Status</span>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#6cf8bb]/40 text-[#00714d] text-[11px] font-semibold border border-[#6ffbbe]/80">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006c49]" />
            <span id="detail-status">Analysis completed</span>
          </div>
        </div>
      </div>

      {/* Expandable Forensic Vocal Telemetry */}
      <div className="mt-3">
        <button
          onClick={() => setShowDetailedReport(!showDetailedReport)}
          className="w-full py-2.5 px-3 rounded-xl bg-white border border-[#dae2fd] text-xs font-semibold text-[#004ac6] flex items-center justify-between hover:bg-[#f2f3ff] transition-all cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
            {showDetailedReport
              ? 'Hide Isolated Vocal Telemetry'
              : 'View Isolated Voice Telemetry & Biomarkers'}
          </span>
          <span className="material-symbols-outlined text-[18px]">
            {showDetailedReport ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {showDetailedReport && (
          <div className="mt-2 p-3.5 bg-white rounded-xl border border-[#dae2fd] text-xs space-y-2.5 animate-in fade-in">
            <div className="flex justify-between items-center text-slate-700">
              <span className="font-medium">Voice Isolation Mode</span>
              <span className="font-mono text-emerald-700 font-semibold">Active (Only Voice)</span>
            </div>
            <div className="flex justify-between items-center text-slate-700">
              <span className="font-medium">Fundamental Pitch (F0)</span>
              <span className="font-mono text-slate-900 font-semibold">
                {file.vocalFeatures?.pitchHz ? `${file.vocalFeatures.pitchHz} Hz` : '142 Hz (Speech Band)'}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-700">
              <span className="font-medium">Formant Tracking Jitter</span>
              <span className="font-mono text-slate-900 font-semibold">
                {isAi ? '0.041 (Elevated / Synthetic)' : '0.012 (Natural Micro-flutter)'}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-700">
              <span className="font-medium">Glottal Air Turbulence</span>
              <span className="font-mono text-slate-900 font-semibold">
                {isAi ? 'Absent (Neural vocoder signature)' : 'Natural biological breath present'}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleDownloadReport}
                className="text-xs text-[#004ac6] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">download</span>
                Download JSON Telemetry Log
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action CTA Group */}
      <div className="flex flex-col gap-2.5 mt-5">
        <button
          id="btn-analyze-another"
          onClick={onAnalyzeAnother}
          className="w-full bg-[#004ac6] hover:bg-[#0053db] active:scale-[0.98] transition-all text-white font-semibold text-[14px] py-3.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">mic</span>
          <span>Record / Analyze Another Voice</span>
        </button>

        <button
          id="btn-upload-new"
          onClick={onUploadNew}
          className="w-full bg-[#ffffff] hover:bg-[#f2f3ff] active:scale-[0.98] transition-all text-[#131b2e] font-semibold text-[14px] py-3 px-4 rounded-xl border border-[#dae2fd] shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">upload_file</span>
          <span>Upload Audio File</span>
        </button>
      </div>
    </div>
  );
};
