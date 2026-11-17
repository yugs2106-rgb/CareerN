import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, CheckCircle2, ShieldCheck, X, RefreshCw, Sparkles, ArrowRight } from 'lucide-react';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmailVerificationModal({ isOpen, onClose }: EmailVerificationModalProps) {
  const { user, updateUser } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setTimer(45);
    setCanResend(false);
    setError('');
    setIsSuccess(false);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen || !user) return null;

  const handleOtpChange = (val: string, index: number) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);

    // Auto focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim().slice(0, 6);
    if (/^\d+$/.test(pasted)) {
      const newOtp = pasted.split('').concat(Array(6 - pasted.length).fill(''));
      setOtp(newOtp.slice(0, 6));
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setCanResend(false);
    setTimer(45);
    setError('');
    // Mock resend
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otp.join('');
    if (enteredCode.length < 6) {
      setError('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsVerifying(true);
    setError('');

    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);
      if (user) {
        updateUser({
          ...user,
          isVerified: true
        });
      }
      setTimeout(() => {
        onClose();
      }, 1400);
    }, 800);
  };

  const autoFillDemoOtp = () => {
    setOtp(['4', '8', '2', '9', '1', '0']);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in-75 duration-300">
              <CheckCircle2 className="w-9 h-9 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Email Verified!</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Your college account is now fully verified.</p>
          </div>
        ) : (
          <div>
            <div className="w-14 h-14 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-7 h-7 text-yellow-600 dark:text-yellow-400" />
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Verify Your Email</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                We sent a 6-digit confirmation code to <span className="font-semibold text-slate-800 dark:text-slate-200">{user.email}</span>
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
              <div className="flex justify-between gap-2" onPaste={handlePaste}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 focus:outline-none transition-all"
                  />
                ))}
              </div>

              {error && (
                <p className="text-xs text-rose-500 font-medium text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl transition-all shadow-sm disabled:opacity-50"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Verifying Code...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Verify & Activate
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={autoFillDemoOtp}
                  className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 font-semibold hover:underline"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Auto-fill demo code (482910)
                </button>

                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="font-semibold text-slate-800 dark:text-slate-200 hover:underline"
                  >
                    Resend Code
                  </button>
                ) : (
                  <span>Resend in {timer}s</span>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
