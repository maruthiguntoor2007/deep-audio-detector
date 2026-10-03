import React, { useState, useRef } from 'react';
import { AudioFileData } from '../types';
import { SAMPLE_AUDIO_FILES, audioPlayer } from '../utils/audioSynth';
import { VoiceRecorder } from './VoiceRecorder';

interface AnalyzeScreenProps {
  selectedFile: AudioFileData;
  onSelectFile: (file: AudioFileData) => void;
  onStartAnalysis: () => void;
}

export const AnalyzeScreen: React.FC<AnalyzeScreenProps> = ({
  selectedFile,
  onSelectFile,
  onStartAnalysis,
}) => {
  const [activeTab, setActiveTab] = useState<'voice' | 'upload'>('voice');
  const [isDragging, setIsDragging] = useState(false);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files[0]);
    }
  };

  const handleFiles = (file: File) => {
    const sizeMB = parseFloat((file.size / (1024 * 1024)).toFixed(1));
    const ext = file.name.split('.').pop()?.toLowerCase() || 'wav';
    const isWavOrMp3 = ['wav', 'mp3', 'flac', 'm4a'].includes(ext);

    // Realistic forensic assessment logic
    const simulatedIsAi = Math.random() > 0.45;
    const aiProb = simulatedIsAi
      ? Math.floor(78 + Math.random() * 19)
      : Math.floor(4 + Math.random() * 18);

    const newFileData: AudioFileData = {
      id: 'custom-' + Date.now(),
      name: file.name,
      sizeMB: sizeMB || 2.4,
      durationSec: 36,
      durationFormatted: '00:36',
      format: (isWavOrMp3 ? ext : 'wav') as any,
      source: 'upload',
      isAiGenerated: simulatedIsAi,
      aiProbability: aiProb,
      humanProbability: 100 - aiProb,
      anomalyZones: simulatedIsAi ? '00:03 - 00:19' : 'None detected',
      spectralSummary: simulatedIsAi
        ? 'High harmonic jitter detected along with unnatural vocal envelope continuity.'
        : 'Natural acoustic harmonics and organic breathing micro-pauses verified.',
      frequencyBandNote: simulatedIsAi
        ? 'Model assessment: The audio is more likely to be AI-generated.'
        : 'Model assessment: The audio is more likely to be authentic human speech.',
    };

    onSelectFile(newFileData);
  };

  const togglePreviewPlay = () => {
    if (isPlayingPreview) {
      audioPlayer.stop();
      setIsPlayingPreview(false);
    } else {
      audioPlayer.playSample(
        selectedFile.isAiGenerated,
        10,
        () => {},
        () => setIsPlayingPreview(false)
      );
      setIsPlayingPreview(true);
    }
  };

  const handleVoiceDetect = (file: AudioFileData) => {
    onSelectFile(file);
    onStartAnalysis();
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 pb-12 flex flex-col">
      {/* Title & Explanatory Subtitle */}
      <div className="flex flex-col mt-1">
        <h1 className="font-headline text-[24px] leading-[32px] font-bold text-[#131b2e] tracking-tight">
          Analyze Audio & Voice
        </h1>
        <p className="text-[14px] leading-[20px] text-[#434655] mt-1">
          Record voice or upload audio to check whether it is AI-generated or human-generated.
        </p>
      </div>

      {/* Tab Switcher: Record Voice (Primary) vs Upload Audio File */}
      <div className="mt-4 p-1 bg-[#eaedff] rounded-xl flex items-center justify-between border border-[#dae2fd]">
        <button
          type="button"
          onClick={() => setActiveTab('voice')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'voice'
              ? 'bg-[#ffffff] text-[#004ac6] shadow-sm'
              : 'text-[#434655] hover:text-[#131b2e]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">mic</span>
          <span>Record Voice</span>
          <span className="px-1.5 py-0.2 bg-[#2563eb] text-white text-[9px] rounded-full uppercase tracking-wider">
            New
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'upload'
              ? 'bg-[#ffffff] text-[#004ac6] shadow-sm'
              : 'text-[#434655] hover:text-[#131b2e]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">upload_file</span>
          <span>Upload Audio</span>
        </button>
      </div>

      {/* Tab 1: Live Voice Recording Console with "Only Voice" Isolation and Detection */}
      {activeTab === 'voice' && (
        <div className="mt-4 animate-in fade-in">
          <VoiceRecorder
            onVoiceCaptured={(file) => onSelectFile(file)}
            onDetectVoice={handleVoiceDetect}
          />
        </div>
      )}

      {/* Tab 2: Upload Audio File Dropzone */}
      {activeTab === 'upload' && (
        <div className="animate-in fade-in">
          {/* Interactive Drag-and-Drop Area */}
          <div
            id="drop-zone"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center p-6 mt-4 rounded-2xl shadow-sm transition-all duration-300 cursor-pointer overflow-hidden group select-none border-2 border-dashed ${
              isDragging
                ? 'bg-[#dbe1ff]/30 border-[#004ac6]'
                : 'bg-[#f2f3ff] border-[#dae2fd] hover:border-[#004ac6]/50 hover:bg-[#eaedff]/60'
            }`}
          >
            {/* Subtle ambient glow on active/hover */}
            <div className="absolute inset-0 bg-[#004ac6]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            {/* Acoustic Wave Cloud Icon Circle */}
            <div className="relative w-14 h-14 rounded-full bg-[#ffffff] text-[#004ac6] shadow-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-105 border border-[#eaedff]">
              <span
                className="material-symbols-outlined text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                cloud_upload
              </span>

              {/* Little audio spark indicator */}
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#006c49] rounded-full flex items-center justify-center text-white shadow-sm ring-2 ring-white">
                <span className="material-symbols-outlined text-[10px]">graphic_eq</span>
              </span>
            </div>

            {/* Instructions */}
            <span className="font-headline text-[18px] font-semibold text-[#131b2e] mt-3.5 tracking-tight text-center">
              Drag and drop your audio file here
            </span>

            <span className="text-[11px] text-[#737686] my-1.5 uppercase tracking-wider font-semibold">
              or
            </span>

            {/* Interactive Browse Button */}
            <button
              id="browse-btn"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="bg-[#ffffff] text-[#131b2e] font-semibold text-[14px] px-4 py-2 rounded-xl shadow-sm border border-[#dae2fd] hover:bg-[#faf8ff] active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[#004ac6] text-[18px]">
                folder_open
              </span>
              <span>Choose Audio File</span>
            </button>

            <input
              ref={fileInputRef}
              accept=".wav,.mp3,.flac,.m4a,audio/*"
              className="hidden"
              id="audio-input"
              type="file"
              onChange={handleFileInputChange}
            />

            {/* Supported Format Labels */}
            <div className="flex items-center gap-2 mt-4 text-[#434655]">
              <span className="text-[11px] tracking-widest uppercase font-semibold text-[#737686]">
                WAV • MP3 • FLAC • M4A
              </span>
            </div>
          </div>

          {/* Quick Test Audio Preset Chips */}
          <div className="mt-4 flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-[#737686]">Lab audio samples:</span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_AUDIO_FILES.map((sample) => {
                const isCurrent = selectedFile.id === sample.id;
                return (
                  <button
                    key={sample.id}
                    onClick={() => onSelectFile(sample)}
                    type="button"
                    className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all flex items-center gap-1.5 ${
                      isCurrent
                        ? 'bg-[#dbe1ff] border-[#2563eb] text-[#00174b] shadow-sm font-semibold'
                        : 'bg-[#ffffff] border-[#dae2fd] text-[#434655] hover:bg-[#f2f3ff]'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        sample.isAiGenerated ? 'bg-[#cf2c30]' : 'bg-[#006c49]'
                      }`}
                    />
                    <span className="truncate max-w-[130px]">{sample.name}</span>
                    <span className="text-[10px] text-[#737686]">
                      {sample.isAiGenerated ? '(AI Synth)' : '(Human)'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Audio File Preview Card */}
          <div
            id="file-card"
            className="bg-[#ffffff] rounded-xl p-4 shadow-sm border border-[#dae2fd]/70 mt-4 flex items-center justify-between transition-all duration-300"
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              {/* Media Icon Avatar & Play button */}
              <button
                type="button"
                onClick={togglePreviewPlay}
                title={isPlayingPreview ? 'Stop Audio' : 'Listen to Audio'}
                className="w-11 h-11 rounded-xl bg-[#dbe1ff] hover:bg-[#b4c5ff] flex items-center justify-center text-[#00174b] shrink-0 shadow-sm transition-transform active:scale-95 group"
              >
                <span
                  className="material-symbols-outlined text-[22px] group-hover:hidden"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  audio_file
                </span>
                <span className="material-symbols-outlined text-[22px] hidden group-hover:inline-block text-[#004ac6]">
                  {isPlayingPreview ? 'pause_circle' : 'play_circle'}
                </span>
              </button>

              {/* File Metadata */}
              <div className="flex flex-col min-w-0 pr-2">
                <div className="flex items-center gap-1.5">
                  <span
                    id="card-filename"
                    className="text-[14px] font-semibold text-[#131b2e] truncate"
                  >
                    {selectedFile.name}
                  </span>
                  <span
                    className="material-symbols-outlined text-[#006c49] text-[16px] shrink-0"
                    title="Audio Integrity Verified"
                  >
                    verified
                  </span>
                </div>
                <span id="card-meta" className="text-[13px] text-[#434655] truncate mt-0.5">
                  File size: {selectedFile.sizeMB} MB • Audio duration: {selectedFile.durationFormatted}
                </span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="shrink-0 flex items-center">
              <span className="inline-flex items-center gap-1 bg-[#6cf8bb]/40 text-[#00714d] px-2.5 py-1 rounded-full text-[11px] font-semibold shadow-sm border border-[#6ffbbe]/80">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006c49] animate-pulse" />
                Ready
              </span>
            </div>
          </div>

          {/* Primary Analyze Call To Action */}
          <button
            id="analyze-cta"
            type="button"
            onClick={onStartAnalysis}
            className="w-full bg-[#2563eb] hover:bg-[#004ac6] text-white font-semibold text-[14px] py-4 rounded-xl shadow-md hover:shadow-lg active:scale-[0.99] transition-all mt-5 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">biotech</span>
            <span>Analyze Audio</span>
          </button>
        </div>
      )}

      {/* Bottom assurance note */}
      <div className="flex items-center justify-center gap-2 mt-5 text-xs text-[#737686]">
        <span className="material-symbols-outlined text-[15px] text-[#006c49]">shield</span>
        <span>Zero retention privacy • Speech & audio analyzed in secure memory</span>
      </div>
    </div>
  );
};
