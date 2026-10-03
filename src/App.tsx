/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScreenType, AudioFileData } from './types';
import { SAMPLE_AUDIO_FILES, audioPlayer } from './utils/audioSynth';
import { Header } from './components/Header';
import { LoginScreen } from './components/LoginScreen';
import { ForgotPasswordScreen } from './components/ForgotPasswordScreen';
import { OtpScreen } from './components/OtpScreen';
import { AnalyzeScreen } from './components/AnalyzeScreen';
import { AnalyzingScreen } from './components/AnalyzingScreen';
import { ResultScreen } from './components/ResultScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('login');
  const [userEmail, setUserEmail] = useState('analyst@forensicaudio.io');
  const [selectedFile, setSelectedFile] = useState<AudioFileData>(SAMPLE_AUDIO_FILES[0]);

  // Screen transition handlers
  const handleLoginSuccess = (email: string) => {
    setUserEmail(email);
    setCurrentScreen('otp');
  };

  const handleOtpSuccess = () => {
    setCurrentScreen('analyze');
  };

  const handleForgotPasswordSuccess = (email: string) => {
    setUserEmail(email);
    setCurrentScreen('analyze');
  };

  const handleStartAnalysis = () => {
    audioPlayer.stop();
    setCurrentScreen('analyzing');
  };

  const handleAnalysisComplete = () => {
    setCurrentScreen('result');
  };

  const handleAnalyzeAnother = () => {
    audioPlayer.stop();
    setCurrentScreen('analyze');
  };

  const handleUploadNew = () => {
    audioPlayer.stop();
    setCurrentScreen('analyze');
  };

  const handleLogout = () => {
    audioPlayer.stop();
    setCurrentScreen('login');
  };

  const handleNavigateHome = () => {
    audioPlayer.stop();
    setCurrentScreen('analyze');
  };

  // Header is displayed on in-app screens (analyze, analyzing, result)
  const showHeader = ['analyze', 'analyzing', 'result'].includes(currentScreen);

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col font-sans">
      {/* Top Header on in-app screens */}
      {showHeader && (
        <Header
          currentScreen={currentScreen}
          userEmail={userEmail}
          onLogout={handleLogout}
          onNavigateHome={handleNavigateHome}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-start w-full">
        <div className="w-full flex-1 flex flex-col bg-[#faf8ff] max-w-2xl">
          <main className="flex-1 flex flex-col w-full pb-safe">
            {currentScreen === 'login' && (
              <LoginScreen
                defaultEmail={userEmail}
                onLoginSuccess={handleLoginSuccess}
                onForgotPassword={() => setCurrentScreen('forgot_password')}
              />
            )}

            {currentScreen === 'forgot_password' && (
              <ForgotPasswordScreen
                initialEmail={userEmail}
                onCodeVerified={handleForgotPasswordSuccess}
                onBackToLogin={() => setCurrentScreen('login')}
              />
            )}

            {currentScreen === 'otp' && (
              <OtpScreen
                email={userEmail}
                onVerifySuccess={handleOtpSuccess}
                onBackToLogin={() => setCurrentScreen('login')}
              />
            )}

            {currentScreen === 'analyze' && (
              <AnalyzeScreen
                selectedFile={selectedFile}
                onSelectFile={setSelectedFile}
                onStartAnalysis={handleStartAnalysis}
              />
            )}

            {currentScreen === 'analyzing' && (
              <AnalyzingScreen
                file={selectedFile}
                onAnalysisComplete={handleAnalysisComplete}
                autoProgress={true}
              />
            )}

            {currentScreen === 'result' && (
              <ResultScreen
                file={selectedFile}
                onAnalyzeAnother={handleAnalyzeAnother}
                onUploadNew={handleUploadNew}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
