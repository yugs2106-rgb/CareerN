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
  Eye, 
  EyeOff, 
  AlertCircle,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';
import { cn } from '../lib/utils';

export default function Login() {
  const [searchParams] = useSearchParams();
  const initialRole = (searchParams.get('role') as Role) || null;

  const [role, setRole] = useState<Role | null>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
    setError('');
  };

  const validateForm = () => {
    if (!role) {
      setError('Please choose your account type first.');
      return false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please provide a valid email address.');
      return false;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    return true;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !role) return;

    setError('');
    setIsLoading(true);

    setTimeout(() => {
      // Clean display name from email or defaults
      let defaultName = email.split('@')[0].replace('.', ' ');
      defaultName = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);

      if (role === 'admin' && !defaultName.toLowerCase().includes('tpo')) {
        defaultName = 'Prof. TPO Placement Cell';
      } else if (role === 'company' && defaultName.toLowerCase().includes('hr')) {
        defaultName = 'TechCorp Talent Acquisition';
      }

      login(email, role, defaultName);
      setIsLoading(false);
      navigate('/');
    }, 450);
  };

  const handleQuickDemo = (demoRole: Role, demoEmail: string, demoName: string) => {
    setIsLoading(true);
    setTimeout(() => {
      login(demoEmail, demoRole, demoName);
      setIsLoading(false);
      navigate('/');
    }, 250);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center items-center py-8 px-4 sm:px-6 overflow-y-auto relative transition-colors duration-300">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Branding / Identity Column */}
        <div className="w-full md:w-5/12 bg-slate-900 dark:bg-slate-950 p-8 sm:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800 text-white relative">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-500/10 via-transparent to-transparent pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Logo className="h-10 w-10 text-blue-500 drop-shadow-md" />
              <div>
                <span className="text-2xl font-black text-white tracking-tight">CareerNexus</span>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-blue-400">Placement Network</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-3">
              Where verified talent meets real opportunity.
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
              Official campus recruitment portal for university students, verified employers, and the Training & Placement Office.
            </p>
          </div>

          {/* Quick Demo Access Bar */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Demo Switcher</span>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('student', 'rahul.s@college.edu', 'Rahul Shah')}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-left transition-all text-xs group"
              >
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-400" />
                  <div>
                    <p className="font-semibold text-white">Student Demo</p>
                    <p className="text-[10px] text-slate-400">rahul.s@college.edu</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('company', 'recruiter@techcorp.com', 'TechCorp HR')}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-left transition-all text-xs group"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <div>
                    <p className="font-semibold text-white">Company Recruiter</p>
                    <p className="text-[10px] text-slate-400">recruiter@techcorp.com</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('admin', 'tpo@college.edu', 'Prof. V. Sharma (TPO)')}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-left transition-all text-xs group"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="font-semibold text-white">Placement Admin (TPO)</p>
                    <p className="text-[10px] text-slate-400">tpo@college.edu</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="w-full md:w-7/12 p-6 sm:p-10 flex flex-col justify-center">
          
          <div className="mb-6">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Account Sign In</span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">Welcome Back</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Select your account role and enter your credentials.</p>
          </div>

          {/* Role Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => handleRoleSelect('student')}
              className={cn(
                "flex flex-col items-center py-2.5 px-2 rounded-xl text-xs font-semibold transition-all gap-1",
                role === 'student'
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700/50"
              )}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('company')}
              className={cn(
                "flex flex-col items-center py-2.5 px-2 rounded-xl text-xs font-semibold transition-all gap-1",
                role === 'company'
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700/50"
              )}
            >
              <Building2 className="w-4 h-4" />
              <span>Company</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              className={cn(
                "flex flex-col items-center py-2.5 px-2 rounded-xl text-xs font-semibold transition-all gap-1",
                role === 'admin'
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700/50"
              )}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>TPO / Admin</span>
            </button>
          </div>

          {/* Role Hint Banner */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 mb-5">
            {role === 'student' && "🎓 Access campus drives, skill evaluations, and track internship applications."}
            {role === 'company' && "🏢 Post verified internship & job listings and review matched student profiles."}
            {role === 'admin' && "🛡️ College Training & Placement Office dashboard to manage drives and approvals."}
            {!role && "👆 Please select whether you are a Student, Company, or College TPO."}
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Official Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder={role === 'student' ? 'student@college.edu' : role === 'company' ? 'hr@company.com' : 'tpo@college.edu'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In as {role ? (role === 'admin' ? 'TPO' : role.charAt(0).toUpperCase() + role.slice(1)) : 'User'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Create an account
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
