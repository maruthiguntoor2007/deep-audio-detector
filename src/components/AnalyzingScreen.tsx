import React, { useState, useEffect } from 'react';
import { AudioFileData } from '../types';

interface AnalyzingScreenProps {
  file: AudioFileData;
  onAnalysisComplete: () => void;
  autoProgress?: boolean;
}

export const AnalyzingScreen: React.FC<AnalyzingScreenProps> = ({
  file,
  onAnalysisComplete,
  autoProgress = true,
}) => {
  const [progress, setProgress] = useState(68);
  const [stage, setStage] = useState<2 | 1 | 3>(2);

  useEffect(() => {
    if (!autoProgress) return;

    // Simulate progress advancing from 68% up to 100% and then switching to result screen
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          clearInterval(interval);
          setTimeout(() => {
            onAnalysisComplete();
          }, 400);
          return 100;
        }
        if (prev >= 75) {
          setStage(3);
        }
        return prev + 3;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [autoProgress, onAnalysisComplete]);

  // Circumference of radius 80 circle = 2 * PI * 80 ~= 502.65
  const circumference = 502;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 pb-12 flex flex-col items-center">
      {/* Active Analysis Visual Container */}
      <div className="relative w-full aspect-square max-w-[260px] flex items-center justify-center mb-2">
        {/* Ambient Backing Glow Rings */}
        <div className="absolute inset-0 rounded-full bg-[#e2e7ff]/70 animate-ping opacity-25" />
        <div className="absolute inset-4 rounded-full bg-[#dbe1ff]/50 animate-pulse" />

        {/* Lab-Grade Diagnostics Disc */}
        <div className="relative w-44 h-44 rounded-full bg-[#ffffff] shadow-xl border border-[#dae2fd]/60 flex flex-col items-center justify-center p-4">
          {/* Circular Progress Ring (SVG) */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 176 176">
            <circle
              className="text-[#dae2fd]"
              cx="88"
              cy="88"
              fill="transparent"
              r="80"
              stroke="currentColor"
              strokeWidth="6"
            />
            <circle
              className="text-[#2563eb] transition-all duration-300"
              cx="88"
              cy="88"
              fill="transparent"
              r="80"
              stroke="currentColor"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              strokeWidth="6"
            />
          </svg>

          {/* Animated Audio Waveform Cluster */}
          <div className="flex items-center justify-center gap-1.5 h-12 z-10 px-3">
            <span
              className="w-1 bg-[#2563eb] rounded-full animate-pulse h-4"
              style={{ animationDuration: '600ms' }}
            />
            <span
              className="w-1 bg-[#2563eb] rounded-full animate-bounce h-8"
              style={{ animationDuration: '900ms' }}
            />
            <span
              className="w-1.5 bg-[#004ac6] rounded-full animate-bounce h-11"
              style={{ animationDuration: '750ms' }}
            />
            <span
              className="w-1.5 bg-[#2563eb] rounded-full animate-bounce h-9"
              style={{ animationDuration: '850ms' }}
            />
            <span
              className="w-1 bg-[#2563eb] rounded-full animate-bounce h-5"
              style={{ animationDuration: '650ms' }}
            />
            <span
              className="w-1 bg-[#b4c5ff] rounded-full animate-pulse h-3"
              style={{ animationDuration: '1000ms' }}
            />
          </div>

          <span className="font-headline text-[18px] leading-[26px] text-[#004ac6] font-bold mt-1 z-10">
            {progress}%
          </span>
        </div>
      </div>

      {/* Target File Pill */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e2e7ff] text-[#434655] shadow-sm mb-4 border border-[#dae2fd]">
        <span className="material-symbols-outlined text-[#004ac6] text-[14px]">graphic_eq</span>
        <span className="text-[11px] font-medium tracking-tight text-[#131b2e]">
          {file.name}
        </span>
        <span className="text-[11px] text-[#737686]">• {file.sizeMB} MB</span>
      </div>

      {/* Title & Subtitle */}
      <h1 className="font-headline text-[24px] leading-[32px] font-bold text-[#131b2e] text-center tracking-tight">
        Analyzing Audio...
      </h1>
      <p className="text-[14px] leading-[20px] text-[#434655] text-center mt-1.5 px-4">
        We are checking the audio characteristics.
      </p>

      {/* Main Diagnostic Status Card */}
      <div className="w-full mt-6 bg-[#ffffff] rounded-xl p-5 shadow-sm border border-[#dae2fd]/70 flex flex-col gap-4">
        {/* Linear Progress Metric */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-medium text-[#434655]">Neural Forensic Engine</span>
            <span className="text-[11px] font-semibold text-[#004ac6]">
              Running Stage {stage}/3
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#dae2fd] overflow-hidden">
            <div
              className="h-full bg-[#2563eb] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Separation Divider */}
        <div className="w-full h-px bg-[#eaedff]" />

        {/* 3-Step Forensic Pipeline */}
        <div className="flex flex-col gap-3">
          {/* Step 1: Preprocessing (Completed) */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#f2f3ff] border border-[#eaedff]">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#6cf8bb] flex items-center justify-center text-[#00714d]">
                <span
                  className="material-symbols-outlined text-[16px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-semibold text-[#131b2e]">
                  Audio preprocessing
                </span>
                <span className="text-[11px] text-[#434655]">Noise floor calibrated</span>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#6cf8bb]/60 text-[#00714d] text-[11px] font-semibold">
              Done
            </span>
          </div>

          {/* Connection Indicator */}
          <div className="flex items-center pl-6 -my-2">
            <div className="w-0.5 h-3 bg-[#4edea3]" />
          </div>

          {/* Step 2: Feature Extraction */}
          <div
            className={`flex items-center justify-between p-2.5 rounded-lg transition-all ${
              stage >= 2 && stage < 3
                ? 'bg-[#dbe1ff]/50 shadow-sm border border-[#2563eb]/40'
                : stage >= 3
                ? 'bg-[#f2f3ff] border border-[#eaedff]'
                : 'bg-white opacity-60'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  stage >= 3
                    ? 'bg-[#6cf8bb] text-[#00714d]'
                    : 'bg-[#2563eb] text-white'
                }`}
              >
                {stage >= 3 ? (
                  <span
                    className="material-symbols-outlined text-[16px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-[16px] animate-spin">
                    progress_activity
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-[14px] font-semibold ${
                    stage === 2 ? 'text-[#004ac6]' : 'text-[#131b2e]'
                  }`}
                >
                  Feature extraction
                </span>
                <span className="text-[11px] text-[#434655]">
                  Mapping spectral anomalies
                </span>
              </div>
            </div>
            {stage >= 3 ? (
              <span className="px-2.5 py-0.5 rounded-full bg-[#6cf8bb]/60 text-[#00714d] text-[11px] font-semibold">
                Done
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-[#2563eb] text-white text-[11px] font-semibold animate-pulse">
                Active
              </span>
            )}
          </div>

          {/* Connection Indicator */}
          <div className="flex items-center pl-6 -my-2">
            <div className="w-0.5 h-3 bg-[#dae2fd]" />
          </div>

          {/* Step 3: AI Detection */}
          <div
            className={`flex items-center justify-between p-2.5 rounded-lg transition-all ${
              stage >= 3
                ? 'bg-[#dbe1ff]/50 shadow-sm border border-[#2563eb]/40'
                : 'bg-[#ffffff] opacity-60 border border-[#eaedff]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  stage >= 3 ? 'bg-[#2563eb] text-white' : 'bg-[#dae2fd] text-[#737686]'
                }`}
              >
                {stage >= 3 ? (
                  <span className="material-symbols-outlined text-[16px] animate-spin">
                    progress_activity
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                )}
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-[14px] font-semibold ${
                    stage >= 3 ? 'text-[#004ac6]' : 'text-[#434655]'
                  }`}
                >
                  AI detection
                </span>
                <span className="text-[11px] text-[#737686]">Synthesis classification</span>
              </div>
            </div>
            {stage >= 3 ? (
              <span className="px-2.5 py-0.5 rounded-full bg-[#2563eb] text-white text-[11px] font-semibold animate-pulse">
                Active
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-[#e2e7ff] text-[#434655] text-[11px]">
                Pending
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Informational Note Card */}
      <div className="w-full mt-5 px-4 py-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex items-start gap-2.5">
        <span className="material-symbols-outlined text-[#004ac6] text-[18px] mt-0.5 shrink-0">
          info
        </span>
        <p className="text-[14px] leading-snug text-[#434655]">
          Processing takes a few seconds. The result will appear automatically.
        </p>
      </div>

      {/* Manual Skip / View Results Button */}
      <button
        onClick={onAnalysisComplete}
        className="mt-4 text-xs text-[#004ac6] hover:underline flex items-center gap-1 font-medium"
      >
        <span>Skip waiting & view result</span>
        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
      </button>
    </div>
  );
};
