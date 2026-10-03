import React, { useState, useEffect, useRef } from 'react';
import { EMBLEM_LOGO_URL } from './Header';

interface ForgotPasswordScreenProps {
  initialEmail: string;
  onCodeVerified: (email: string) => void;
  onBackToLogin: () => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  initialEmail,
  onCodeVerified,
  onBackToLogin,
}) => {
  const [email, setEmail] = useState(initialEmail || 'analyst@forensicaudio.io');
  const [step, setStep] = useState<'request' | 'verify' | 'reset_success'>('request');
  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [sentCode, setSentCode] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(45);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let timer: any;
    if (step === 'verify' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((c) => (c > 0 ? c - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid registered email address');
      return;
    }
    setErrorMsg(null);
    setIsSending(true);

    // Generate random 4-digit code
    const generated = Math.floor(1000 + Math.random() * 9000).toString();
    setSentCode(generated);

    setTimeout(() => {
      setIsSending(false);
      setStep('verify');
      setToastMessage(`4-digit verification code sent to ${email}`);
      // Pre-focus first digit
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }, 600);
  };

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const char = value.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    setErrorMsg(null);

    if (char && index < 3) {
      inputRefs.current[index + 1]?.focus();
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
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').trim();
    if (/^\d{4}$/.test(paste)) {
      const chars = paste.split('');
      setDigits(chars);
      inputRefs.current[3]?.focus();
    }
  };

  const handleAutoFillCode = () => {
    if (sentCode) {
      setDigits(sentCode.split(''));
    }
  };

  const handleVerifyAndReset = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = digits.join('');
    if (entered.length < 4) {
      setErrorMsg('Please enter all 4 digits');
      return;
    }

    if (sentCode && entered !== sentCode) {
      setErrorMsg(`Invalid code. Expected ${sentCode}`);
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep('reset_success');
      setTimeout(() => {
        onCodeVerified(email);
      }, 1200);
    }, 700);
  };

  return (
    <main className="flex-1 flex flex-col justify-center items-center w-full px-4 bg-[#faf8ff] min-h-[85vh]">
      <div className="flex flex-col w-full items-center justify-center py-6">
        {/* Email Notification Toast */}
        {toastMessage && (
          <div className="w-full max-w-sm mb-3 bg-[#e2e7ff] text-[#00174b] border border-[#b4c5ff] rounded-xl p-3 shadow-md text-xs flex items-center justify-between gap-2 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#004ac6]">mark_email_read</span>
              <div>
                <p className="font-semibold text-[#131b2e]">{toastMessage}</p>
                <p className="text-[11px] text-[#004ac6] font-mono mt-0.5">
                  Code: <strong className="text-sm font-bold tracking-widest">{sentCode}</strong>
                </p>
              </div>
            </div>
            <button
              onClick={handleAutoFillCode}
              type="button"
              className="bg-[#2563eb] text-white px-2.5 py-1 rounded-lg text-[11px] font-semibold hover:bg-[#004ac6] shrink-0"
            >
              Fill Code
            </button>
          </div>
        )}

        <div className="w-full max-w-sm bg-[#ffffff] rounded-2xl shadow-xl border border-[#dae2fd]/60 p-6 sm:p-7 flex flex-col items-center relative overflow-hidden">
          {/* Subtle ambient accent */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#dbe1ff]/40 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-[#eaedff] rounded-full blur-xl pointer-events-none" />

          {/* App Emblem Logo or Key Icon */}
          <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm flex items-center justify-center bg-[#f2f3ff] border border-[#eaedff] mb-2 text-[#004ac6]">
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              lock_reset
            </span>
          </div>

          {step === 'request' && (
            <>
              <h1 className="font-headline text-[22px] leading-[28px] font-bold text-[#131b2e] text-center mt-2 tracking-tight">
                Forgot Password
              </h1>
              <p className="text-[13px] leading-[18px] text-[#434655] text-center mt-1 px-1">
                Enter your registered email address and we'll send a 4-digit verification code.
              </p>

              {errorMsg && (
                <div className="w-full mt-3 p-2 rounded-lg bg-red-50 text-[#ba1a1a] text-xs font-medium border border-red-200 text-center">
                  {errorMsg}
                </div>
              )}

              <form className="w-full flex flex-col space-y-4 mt-5" onSubmit={handleSendCode}>
                <div className="flex flex-col space-y-1.5 text-left">
                  <label className="text-[13px] font-semibold text-[#131b2e]" htmlFor="reset-email">
                    Registered Email Address
                  </label>
                  <div className="relative flex items-center">
                    <input
                      className="w-full bg-[#faf8ff] hover:bg-[#f2f3ff] text-[#131b2e] placeholder:text-[#737686] text-[14px] rounded-xl p-3.5 border border-[#dae2fd] shadow-sm focus:outline-none focus:border-[#2563eb] focus:bg-[#ffffff] focus:ring-2 focus:ring-[#dbe1ff] transition-all"
                      id="reset-email"
                      name="email"
                      placeholder="name@example.com"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-[#ffffff] font-semibold text-[14px] py-3.5 rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-75"
                  type="submit"
                  disabled={isSending}
                >
                  {isSending ? (
                    <>
                      <span className="material-symbols-outlined text-[18px] animate-spin">
                        progress_activity
                      </span>
                      <span>Sending 4-digit code...</span>
                    </>
                  ) : (
                    <>
                      <span>Send 4-Digit Code</span>
                      <span className="material-symbols-outlined text-[18px]">forward_to_inbox</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {step === 'verify' && (
            <>
              <h1 className="font-headline text-[22px] leading-[28px] font-bold text-[#131b2e] text-center mt-2 tracking-tight">
                Enter 4-Digit Code
              </h1>
              <p className="text-[13px] leading-[18px] text-[#434655] text-center mt-1">
                A 4-digit code was sent to <strong className="text-[#131b2e]">{email}</strong>.
              </p>

              {/* Email chip */}
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaedff] text-[#434655] text-[12px] font-medium border border-[#dae2fd]">
                <span className="material-symbols-outlined text-[14px] text-[#004ac6]">mail</span>
                <span className="truncate max-w-[200px]">{email}</span>
              </div>

              {errorMsg && (
                <div className="w-full mt-3 p-2 rounded-lg bg-red-50 text-[#ba1a1a] text-xs font-medium border border-red-200 text-center">
                  {errorMsg}
                </div>
              )}

              <form className="w-full flex flex-col items-center mt-5" onSubmit={handleVerifyAndReset}>
                {/* 4 Digit Input Row */}
                <div className="flex flex-row justify-center items-center gap-2.5 w-full" onPaste={handlePaste}>
                  {digits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        inputRefs.current[idx] = el;
                      }}
                      aria-label={`Code Digit ${idx + 1}`}
                      className={`w-13 h-14 text-center rounded-xl text-[24px] font-bold shadow-sm transition-all focus:outline-none border ${
                        digit
                          ? 'bg-white text-[#131b2e] border-[#2563eb] ring-2 ring-[#dbe1ff]'
                          : 'bg-[#f2f3ff] text-[#131b2e] border-[#dae2fd]'
                      } focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-[#dbe1ff]`}
                      inputMode="numeric"
                      maxLength={1}
                      pattern="[0-9]*"
                      placeholder="·"
                      type="text"
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                    />
                  ))}
                </div>

                {/* New Password input */}
                <div className="w-full flex flex-col space-y-1.5 text-left mt-4">
                  <label className="text-[12px] font-semibold text-[#131b2e]" htmlFor="new-password">
                    Set New Password
                  </label>
                  <input
                    className="w-full bg-[#faf8ff] text-[#131b2e] placeholder:text-[#737686] text-[14px] rounded-xl p-3 border border-[#dae2fd] shadow-sm focus:outline-none focus:border-[#2563eb] focus:bg-[#ffffff] transition-all"
                    id="new-password"
                    placeholder="Enter new secure password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <button
                  className="w-full mt-5 py-3.5 px-4 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-[14px] shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  type="submit"
                  disabled={isVerifying}
                >
                  {isVerifying ? (
                    <>
                      <span className="material-symbols-outlined text-[18px] animate-spin">
                        progress_activity
                      </span>
                      <span>Verifying 4-digit code...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify & Reset Password</span>
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    </>
                  )}
                </button>

                <div className="mt-3 flex items-center justify-between w-full text-xs text-[#737686]">
                  <span>Code not received?</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      setDigits(['', '', '', '']);
                      handleSendCode(e);
                    }}
                    className="text-[#004ac6] font-semibold hover:underline"
                  >
                    Resend Code {countdown > 0 ? `(${countdown}s)` : ''}
                  </button>
                </div>
              </form>
            </>
          )}

          {step === 'reset_success' && (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="w-14 h-14 rounded-full bg-[#6cf8bb]/50 text-[#006c49] flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[32px]">task_alt</span>
              </div>
              <h2 className="font-headline text-[20px] font-bold text-[#131b2e]">
                Password Reset Successfully!
              </h2>
              <p className="text-[13px] text-[#434655] mt-1">
                Your identity was verified with the 4-digit code. Logging you into the voice analysis console...
              </p>
            </div>
          )}

          {/* Back to Login link */}
          <div className="mt-5 pt-3 border-t border-[#eaedff] w-full flex justify-center">
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-xs text-[#737686] hover:text-[#131b2e] flex items-center gap-1 transition-colors font-medium"
            >
              <span className="material-symbols-outlined text-[14px]">arrow_back</span>
              Back to Login
            </button>
          </div>
        </div>

        {/* Security assurance */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[#434655] text-[12px]">
          <span className="material-symbols-outlined text-[15px] text-[#006c49]">lock</span>
          <span>Encrypted 4-digit authorization protocol</span>
        </div>
      </div>
    </main>
  );
};
