import React, { useState } from 'react';
import { EMBLEM_LOGO_URL } from './Header';

interface LoginScreenProps {
  onLoginSuccess: (email: string) => void;
  onForgotPassword: () => void;
  defaultEmail?: string;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onForgotPassword,
  defaultEmail = 'analyst@forensicaudio.io',
}) => {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState('neuralPass@2026');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(email);
    }, 600);
  };

  return (
    <main className="flex-1 flex flex-col justify-center items-center w-full px-4 bg-[#faf8ff] min-h-[85vh]">
      <div className="flex flex-col w-full items-center justify-center py-6">
        <div className="w-full max-w-sm bg-[#ffffff] rounded-2xl shadow-xl border border-[#dae2fd]/60 p-6 sm:p-7 flex flex-col items-center relative overflow-hidden">
          {/* Subtle top ambient glow */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#dbe1ff]/40 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-[#6ffbbe]/15 rounded-full blur-xl pointer-events-none" />

          {/* App Emblem Logo */}
          <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm flex items-center justify-center bg-[#f2f3ff] border border-[#eaedff]">
            <img
              alt="Deep Audio Detector Emblem"
              className="w-16 h-16 object-cover"
              src={EMBLEM_LOGO_URL}
            />
          </div>

          {/* Title & Subtitle */}
          <h1 className="font-headline text-[24px] leading-[32px] font-bold text-[#131b2e] text-center mt-3 tracking-tight">
            Deep Audio Detector
          </h1>
          <p className="text-[14px] leading-[20px] text-[#434655] text-center mt-1 px-1">
            Detect whether an audio file is AI-generated or human-generated.
          </p>

          {/* Authentication Form */}
          <form className="w-full flex flex-col space-y-4 mt-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="flex flex-col space-y-1.5 text-left">
              <label className="text-[14px] font-semibold text-[#131b2e]" htmlFor="email">
                Email Address
              </label>
              <div className="relative flex items-center">
                <input
                  className="w-full bg-[#faf8ff] hover:bg-[#f2f3ff] text-[#131b2e] placeholder:text-[#737686] text-[15px] rounded-xl p-3.5 border border-[#dae2fd] shadow-sm focus:outline-none focus:border-[#2563eb] focus:bg-[#ffffff] focus:ring-2 focus:ring-[#dbe1ff] transition-all"
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <label className="text-[14px] font-semibold text-[#131b2e]" htmlFor="password">
                  Password
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs text-[#004ac6] hover:underline"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-xs text-[#004ac6] font-medium hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
              <div className="relative flex items-center">
                <input
                  className="w-full bg-[#faf8ff] hover:bg-[#f2f3ff] text-[#131b2e] placeholder:text-[#737686] text-[15px] rounded-xl p-3.5 border border-[#dae2fd] shadow-sm focus:outline-none focus:border-[#2563eb] focus:bg-[#ffffff] focus:ring-2 focus:ring-[#dbe1ff] transition-all"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex justify-end pt-0.5">
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-xs text-[#2563eb] hover:text-[#004ac6] font-semibold hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[13px]">lock_reset</span>
                  Forgot Password? (Send 4-Digit Code)
                </button>
              </div>
            </div>

            {/* Submit Action Button */}
            <div className="pt-1">
              <button
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-[#ffffff] font-semibold text-[14px] py-3.5 rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-75"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">
                      progress_activity
                    </span>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Login</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Pre-Fill Helper */}
          <div className="mt-4 pt-3 border-t border-[#eaedff] w-full flex items-center justify-between text-xs text-[#737686]">
            <span>Demo analyst account</span>
            <button
              type="button"
              onClick={() => {
                setEmail('analyst@forensicaudio.io');
                setPassword('neuralPass@2026');
              }}
              className="text-[#004ac6] font-medium hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">auto_fix_high</span>
              Quick Autofill
            </button>
          </div>

          {/* Micro Trust Indicator */}
          <div className="flex items-center space-x-1.5 mt-5 text-[#434655]">
            <span
              className="material-symbols-outlined text-[18px] text-[#006c49]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified_user
            </span>
            <span className="text-[11px] font-medium tracking-wide">
              Lab-grade neural speech analysis
            </span>
          </div>
        </div>
      </div>
    </main>
  );
};
