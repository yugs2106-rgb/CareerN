import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import { 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';
import { cn } from '../lib/utils';

export default function Register() {
  const [searchParams] = useSearchParams();
  const initialRole = (searchParams.get('role') as Role) || null;

  const [step, setStep] = useState<1 | 2>(initialRole ? 2 : 1);
  const [role, setRole] = useState<Role | null>(initialRole);
  
  // Registration Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  // Password validation checks
  const hasMinLength = password.length >= 8;
  const hasNumberOrSpecial = /[0-9!@#$%^&*]/.test(password);
  const isPasswordValid = hasMinLength && hasNumberOrSpecial;

  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
    setStep(2);
    setError('');
  };

  const validateForm = () => {
    if (!fullName.trim()) {
      setError('Please provide your full legal name or organization representative name.');
      return false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please provide a valid official email address.');
      return false;
    }
    if (!isPasswordValid) {
      setError('Password does not meet the security criteria (at least 8 characters with a number or special character).');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Password confirmation does not match.');
      return false;
    }
    if (!agreeTerms) {
      setError('You must agree to the university placement guidelines and terms of service.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !role) return;

    setError('');
    setIsLoading(true);

    setTimeout(() => {
      register(email, role, fullName);
      setIsLoading(false);
      navigate('/onboarding');
    }, 450);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center py-8 px-4 sm:px-6 overflow-y-auto relative transition-colors duration-300">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        
        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div className="p-8 sm:p-12">
            <div className="text-center max-w-xl mx-auto mb-10">
              <Link to="/" className="inline-flex items-center gap-2 mb-4">
                <Logo className="h-9 w-9 text-blue-600" />
                <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">CareerNexus</span>
              </Link>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">Create Your Account</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Select your account category to register on the unified placement platform.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-5 max-w-3xl mx-auto">
              {/* Student Role */}
              <button
                type="button"
                onClick={() => handleRoleSelect('student')}
                className="group relative p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all text-left flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">Student</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Build a job-ready profile, discover campus drives, match skills with AI, and track applications.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <span>Register as Student</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Company Role */}
              <button
                type="button"
                onClick={() => handleRoleSelect('company')}
                className="group relative p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all text-left flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-100 dark:border-amber-900/40 flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">Employer / Company</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Post verified internships and full-time roles, filter candidates by GPA & skill stack, and recruit.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <span>Register as Company</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Admin / TPO Role */}
              <button
                type="button"
                onClick={() => handleRoleSelect('admin')}
                className="group relative p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all text-left flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">College TPO / Admin</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Manage college drives, verify visiting employers, publish official notices, and generate analytics.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <span>Register as TPO</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>

            <p className="mt-10 text-center text-xs text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        )}

        {/* Step 2: Details Form */}
        {step === 2 && (
          <div className="p-6 sm:p-10 max-w-xl mx-auto">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Change account type
            </button>

            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
                {role === 'student' ? 'Student Registration' : role === 'company' ? 'Employer Registration' : 'Placement Cell Registration'}
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Create Your Account</h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
                Enter your details to initiate your profile.
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  {role === 'student' ? 'Full Legal Name *' : role === 'company' ? 'Recruiter Full Name *' : 'Placement Officer Name *'}
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder={role === 'student' ? 'e.g. Rahul Shah' : role === 'company' ? 'e.g. Sarah Connor' : 'e.g. Prof. R. K. Sharma'}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  {role === 'student' ? 'University / College Email *' : role === 'company' ? 'Corporate Work Email *' : 'Official Placement Email *'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder={role === 'student' ? 'student@university.edu' : 'recruiter@company.com'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {role === 'student' ? 'Use your .edu or official college domain email for instant domain verification.' : 'Official corporate or institutional email address.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Password checklist */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${hasMinLength ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-600'}`} />
                  <span className={hasMinLength ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'}>Minimum 8 characters</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${hasNumberOrSpecial ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-600'}`} />
                  <span className={hasNumberOrSpecial ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'}>Includes number or symbol</span>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-blue-600 focus:ring-blue-500"
                  />
                  <span>
                    I confirm that the details provided are accurate and agree to the CareerNexus Placement Guidelines and Code of Conduct.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 mt-4 disabled:opacity-60"
              >
                {isLoading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Proceed to Onboarding</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
