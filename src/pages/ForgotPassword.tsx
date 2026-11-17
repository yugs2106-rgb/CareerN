import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';
import { ArrowLeft, Mail, Lock, CheckCircle2, ShieldCheck, Eye, EyeOff, Sparkles, RefreshCw, KeyRound } from 'lucide-react';

export default function ForgotPassword() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (step !== 2) return;
    setTimer(60);
    setCanResend(false);

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
  }, [step]);

  // Password strength checker
  const hasMinLength = newPassword.length >= 8;
  const hasNumberOrSpecial = /[0-9!@#$%^&*]/.test(newPassword);
  const hasUppercase = /[A-Z]/.test(newPassword);
  const isPasswordValid = hasMinLength && hasNumberOrSpecial;

  const handleSendResetCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please provide a valid registered email address.');
      return;
    }
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 600);
  };

  const handleOtpChange = (val: string, index: number) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);

    if (val && index < 5) {
      document.getElementById(`reset-otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`reset-otp-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join('').length < 6) {
      setError('Please enter the full 6-digit recovery code.');
      return;
    }
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
    }, 500);
  };

  const handleSetNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setError('Password must be at least 8 characters and include a number or special character.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setStep(4);
    }, 700);
  };

  const fillDemoCode = () => {
    setOtp(['7', '3', '9', '1', '2', '0']);
    setError('');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative transition-colors duration-300">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2">
            <Logo className="w-8 h-8 text-blue-600" />
            <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">CareerNexus</span>
          </Link>
          <Link to="/login" className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Log In
          </Link>
        </div>

        {/* Step 1: Request Code */}
        {step === 1 && (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center mb-4">
              <KeyRound className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Reset Password</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Enter your registered college or corporate email and we'll send a 6-digit recovery code.
            </p>

            {error && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSendResetCode} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Account Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@college.edu or name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Send Recovery Code'}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Enter OTP */}
        {step === 2 && (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Enter Verification Code</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              We sent a 6-digit recovery code to <span className="text-slate-900 dark:text-white font-medium">{email}</span>.
            </p>

            {error && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="flex justify-between gap-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`reset-otp-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                    className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Verify Code & Proceed'}
              </button>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={fillDemoCode}
                  className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Auto-fill demo code (739120)
                </button>

                {canResend ? (
                  <button
                    type="button"
                    onClick={() => {
                      setCanResend(false);
                      setTimer(60);
                    }}
                    className="text-slate-900 dark:text-white font-medium hover:underline"
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

        {/* Step 3: Set New Password */}
        {step === 3 && (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Create New Password</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Choose a strong password to secure your CareerNexus account.
            </p>

            {error && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSetNewPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="At least 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm pr-11 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Password criteria checklist */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${hasMinLength ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-600'}`} />
                  <span className={hasMinLength ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'}>Minimum 8 characters</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${hasNumberOrSpecial ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-600'}`} />
                  <span className={hasNumberOrSpecial ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'}>Includes number or special character</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${hasUppercase ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-600'}`} />
                  <span className={hasUppercase ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'}>Includes uppercase letter (recommended)</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !isPasswordValid}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Update Password'}
              </button>
            </form>
          </div>
        )}

        {/* Step 4: Success confirmation */}
        {step === 4 && (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Password Updated!</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">
              Your password has been reset securely. You can now log into your account using your new credentials.
            </p>

            <button
              onClick={() => navigate('/login')}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-all shadow-xs"
            >
              Proceed to Log In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
