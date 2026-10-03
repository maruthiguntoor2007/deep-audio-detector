import React, { useState, useEffect, useRef } from 'react';

interface OtpScreenProps {
  email: string;
  onVerifySuccess: () => void;
  onBackToLogin: () => void;
}

export const OtpScreen: React.FC<OtpScreenProps> = ({
  email,
  onVerifySuccess,
  onBackToLogin,
}) => {
  // Start with completely empty 4 digits so user can type the 4 digit OTP
  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(45);
  const [generatedCode, setGeneratedCode] = useState(() =>
    Math.floor(1000 + Math.random() * 9000).toString()
  );
  const [showToast, setShowToast] = useState(true);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto focus first input on mount
  useEffect(() => {
    const focusTimer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 150);
    return () => clearTimeout(focusTimer);
  }, []);

  // Countdown timer for Resend
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    setErrorMessage(null);
    const char = value.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    // Auto advance to next box
    if (char && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto verify if all 4 digits typed
    if (char && index === 3) {
      const fullCode = newDigits.join('');
      if (fullCode.length === 4) {
        setTimeout(() => {
          executeVerification(fullCode);
        }, 250);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
      } else {
        const newDigits = [...digits];
        newDigits[index] = '';
        setDigits(newDigits);
      }
      setErrorMessage(null);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{4}$/.test(pastedData)) {
      const chars = pastedData.split('');
      setDigits(chars);
      inputRefs.current[3]?.focus();
      setTimeout(() => {
        executeVerification(pastedData);
      }, 250);
    }
  };

  const executeVerification = (codeToVerify?: string) => {
    const code = codeToVerify || digits.join('');
    if (code.length < 4) {
      setErrorMessage('Please type all 4 digits of the OTP.');
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      setTimeout(() => {
        onVerifySuccess();
      }, 650);
    }, 600);
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeVerification();
  };

  const handleResend = () => {
    if (timeLeft <= 0) {
      const newCode = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedCode(newCode);
      setTimeLeft(45);
      setShowToast(true);
      setDigits(['', '', '', '']);
      setErrorMessage(null);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  };

  const handleAutoFill = () => {
    setDigits(generatedCode.split(''));
    setErrorMessage(null);
    setTimeout(() => {
      executeVerification(generatedCode);
    }, 300);
  };

  const formattedTimer = timeLeft < 10 ? `0:0${timeLeft}` : `0:${timeLeft}`;

  return (
    <main className="flex-1 flex flex-col justify-center items-center w-full px-4 bg-[#faf8ff] min-h-[85vh]">
      <div className="flex flex-col w-full items-center justify-center py-6">
        {/* Real-time Email OTP Notification Banner */}
        {showToast && (
          <div className="w-full max-w-sm mb-3 bg-[#e2e7ff] text-[#00174b] border border-[#b4c5ff] rounded-xl p-3 shadow-md text-xs flex items-center justify-between gap-2 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2563eb] text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">mark_email_read</span>
              </div>
              <div>
                <p className="font-semibold text-[#131b2e]">4-Digit OTP Sent via Email</p>
                <p className="text-[12px] text-[#004ac6] font-mono mt-0.5">
                  Your OTP is: <strong className="text-sm font-bold tracking-widest text-[#00174b]">{generatedCode}</strong>
                </p>
              </div>
            </div>
            <button
              onClick={handleAutoFill}
              type="button"
              className="bg-[#2563eb] hover:bg-[#004ac6] text-white px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all shrink-0 cursor-pointer shadow-xs active:scale-95"
            >
              Autofill
            </button>
          </div>
        )}

        <div className="w-full max-w-sm bg-[#ffffff] rounded-2xl shadow-xl border border-[#dae2fd]/60 p-6 sm:p-7 flex flex-col items-center relative overflow-hidden">
          {/* Top Ambient Accents */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#e2e7ff] rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-[#eaedff] rounded-full blur-xl pointer-events-none" />

          {/* Shield Verification Badge */}
          <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#f2f3ff] text-[#004ac6] border border-[#eaedff] shadow-sm mb-4">
            <span
              className="material-symbols-outlined text-[28px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified_user
            </span>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#006c49] ring-2 ring-white shadow-sm" />
          </div>

          {/* Headers */}
          <h1 className="font-headline text-[24px] leading-[32px] font-bold text-[#131b2e] text-center tracking-tight">
            Verify your account
          </h1>
          <p className="text-[14px] leading-[20px] text-[#434655] text-center mt-1">
            Type the 4-digit OTP sent to your registered email.
          </p>

          {/* Email Chip Indication */}
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaedff] text-[#434655] text-[12px] font-medium border border-[#dae2fd]">
            <span className="material-symbols-outlined text-[14px] text-[#004ac6]">mail</span>
            <span className="truncate max-w-[200px]">{email || 'analyst@forensicaudio.io'}</span>
          </div>

          {/* Error display if any */}
          {errorMessage && (
            <div className="w-full mt-3 p-2 bg-red-50 text-[#ba1a1a] text-xs rounded-lg border border-red-200 text-center font-medium animate-in fade-in">
              {errorMessage}
            </div>
          )}

          {/* OTP Input Form - Type 4 Digits */}
          <form className="w-full flex flex-col items-center mt-6" onSubmit={handleVerifySubmit}>
            <div className="flex flex-row justify-center items-center gap-3 w-full" onPaste={handlePaste}>
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  aria-label={`Digit ${idx + 1}`}
                  className={`w-13 h-14 text-center rounded-xl text-[24px] font-bold shadow-sm transition-all focus:outline-none border ${
                    digit
                      ? 'bg-white text-[#131b2e] border-[#2563eb] ring-2 ring-[#dbe1ff]'
                      : 'bg-[#f2f3ff] text-[#131b2e] border-[#dae2fd] hover:border-[#2563eb]/50'
                  } focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-[#dbe1ff]`}
                  inputMode="numeric"
                  maxLength={1}
                  pattern="[0-9]*"
                  placeholder="·"
                  type="text"
                  value={digit}
                  onChange={(e) => handleInputChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                />
              ))}
            </div>

            {/* Micro instruction hint */}
            <p className="text-[11px] text-[#737686] mt-2.5">
              Type the 4 numbers on your keyboard or keypad
            </p>

            {/* Action Button */}
            <button
              className={`w-full mt-5 py-3.5 px-4 rounded-xl font-semibold text-[14px] shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isVerified
                  ? 'bg-[#006c49] text-white shadow-[#006c49]/20'
                  : 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white'
              }`}
              type="submit"
              disabled={isVerifying}
            >
              {isVerifying ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">
                    progress_activity
                  </span>
                  <span>Verifying 4-digit OTP...</span>
                </>
              ) : isVerified ? (
                <>
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <span>Verified Successfully</span>
                </>
              ) : (
                <>
                  <span>Verify OTP</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Resend Option Footer */}
          <div className="mt-4 flex flex-col items-center justify-center gap-1 text-center">
            <p className="text-[14px] text-[#434655] flex items-center justify-center gap-1.5 flex-wrap">
              <span>Didn't receive code?</span>
              <button
                className={`font-semibold text-[14px] transition-opacity bg-transparent ${
                  timeLeft > 0
                    ? 'text-[#737686] cursor-not-allowed'
                    : 'text-[#004ac6] cursor-pointer hover:underline'
                }`}
                onClick={handleResend}
                disabled={timeLeft > 0}
                type="button"
              >
                Resend OTP
              </button>
            </p>

            <span className="text-[12px] text-[#737686] flex items-center gap-1">
              {timeLeft > 0 ? (
                <>
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  <span>Resend available in {formattedTimer}</span>
                </>
              ) : (
                <span className="text-[#006c49] font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                  Code ready to resend
                </span>
              )}
            </span>
          </div>

          {/* Back button */}
          <button
            type="button"
            onClick={onBackToLogin}
            className="mt-3 text-xs text-[#737686] hover:text-[#131b2e] flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            Back to login
          </button>
        </div>

        {/* Trust / Lab Security Badge Indicator */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[#434655] text-[12px]">
          <span className="material-symbols-outlined text-[15px] text-[#006c49]">lock</span>
          <span>256-bit Encrypted Voice Auth Session</span>
        </div>
      </div>
    </main>
  );
};
