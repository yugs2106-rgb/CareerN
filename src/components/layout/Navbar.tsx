import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LogOut, 
  Sparkles, 
  User, 
  FileText, 
  LayoutDashboard, 
  Bell, 
  Briefcase, 
  Settings, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  ShieldCheck,
  GraduationCap,
  X,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Logo } from '../Logo';
import { cn } from '../../lib/utils';
import EmailVerificationModal from '../EmailVerificationModal';

interface NavbarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Navbar({ isMobileOpen = false, onMobileClose }: NavbarProps) {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSwitchRole = (newRole: 'student' | 'company' | 'admin') => {
    setShowRoleSwitcher(false);
    if (newRole === 'student') {
      login('rahul.s@college.edu', 'student', 'Rahul Shah');
    } else if (newRole === 'company') {
      login('recruiter@techcorp.com', 'company', 'TechCorp HR');
    } else {
      login('tpo@college.edu', 'admin', 'Prof. V. Sharma (TPO)');
    }
    if (onMobileClose) onMobileClose();
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const navItemClass = (path: string) => cn(
    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all text-sm font-medium group",
    isActive(path)
      ? "bg-blue-600 text-white shadow-xs font-semibold"
      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
  );

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'student': return { label: 'Student', color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60' };
      case 'company': return { label: 'Employer', color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60' };
      case 'admin': return { label: 'TPO Admin', color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60' };
      default: return { label: 'Member', color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700' };
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-[#0F172A] text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80">
        <Link to="/" onClick={onMobileClose} className="flex items-center gap-3 group">
          <Logo className="h-8 w-8 text-blue-600 dark:text-blue-400 drop-shadow-xs group-hover:scale-105 transition-transform shrink-0" />
          <div>
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none block">CareerNexus</span>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mt-0.5">Placement Cell</span>
          </div>
        </Link>
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="md:hidden text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {!user ? (
          <>
            <Link to="/login" onClick={onMobileClose} className={navItemClass('/login')}>
              <User className="w-4 h-4" />
              <span>Log In</span>
            </Link>
            <Link to="/register" onClick={onMobileClose} className={navItemClass('/register')}>
              <FileText className="w-4 h-4" />
              <span>Sign Up</span>
            </Link>
          </>
        ) : (
          <>
            <div className="px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Core Platform
            </div>

            <Link to="/" onClick={onMobileClose} className={navItemClass('/')}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </Link>
            
            <Link to="/notices" onClick={onMobileClose} className={navItemClass('/notices')}>
              <Bell className="w-4 h-4" />
              <span>Noticeboard & Drives</span>
            </Link>

            {/* Student Links */}
            {user.role === 'student' && (
              <>
                <div className="px-3 pb-2 pt-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Student Portal
                </div>
                <Link to="/student/internships" onClick={onMobileClose} className={navItemClass('/student/internships')}>
                  <Briefcase className="w-4 h-4" />
                  <span>Find Opportunities</span>
                </Link>
                <Link to="/student/applications" onClick={onMobileClose} className={navItemClass('/student/applications')}>
                  <FileText className="w-4 h-4" />
                  <span>My Applications</span>
                </Link>
                <Link to="/student/assistant" onClick={onMobileClose} className={navItemClass('/student/assistant')}>
                  <Sparkles className="w-4 h-4 text-violet-500 dark:text-violet-400" />
                  <span>AI Career Advisor</span>
                </Link>
                <Link to="/student/profile" onClick={onMobileClose} className={navItemClass('/student/profile')}>
                  <User className="w-4 h-4" />
                  <span>Student Profile</span>
                </Link>
                <Link to="/student/settings" onClick={onMobileClose} className={navItemClass('/student/settings')}>
                  <Settings className="w-4 h-4" />
                  <span>Preferences</span>
                </Link>
              </>
            )}

            {/* Company Links */}
            {user.role === 'company' && (
              <>
                <div className="px-3 pb-2 pt-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Employer Actions
                </div>
                <Link to="/" onClick={onMobileClose} className={navItemClass('/')}>
                  <Building2 className="w-4 h-4" />
                  <span>Postings & Applicants</span>
                </Link>
              </>
            )}

            {/* Admin / TPO Links */}
            {user.role === 'admin' && (
              <>
                <div className="px-3 pb-2 pt-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Placement Cell
                </div>
                <Link to="/" onClick={onMobileClose} className={navItemClass('/')}>
                  <ShieldCheck className="w-4 h-4" />
                  <span>TPO Control Center</span>
                </Link>
              </>
            )}
          </>
        )}
      </nav>

      {/* Verification Status & User Profile Footer */}
      {user && (
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 mt-auto bg-slate-50 dark:bg-slate-900/60 transition-colors">
          {/* Email Verification Status Pill */}
          <div className="mb-2.5">
            {user.isVerified ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>Verified Account</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsVerifyModalOpen(true)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-400 text-[11px] font-semibold transition-all group"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Verify Email</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-amber-500 text-white px-1.5 py-0.5 rounded">
                  Action
                </span>
              </button>
            )}
          </div>

          {/* User Card */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black uppercase shrink-0 shadow-xs">
                {user.name.substring(0, 2)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                <span className={cn("inline-block text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider", getRoleBadge(user.role).color)}>
                  {getRoleBadge(user.role).label}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Demo Switcher Popup Toggle */}
          <div className="mt-2 text-center">
            <button
              type="button"
              onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
              className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
            >
              {showRoleSwitcher ? 'Close Switcher' : '⚡ Switch Role (Demo)'}
            </button>

            {showRoleSwitcher && (
              <div className="mt-2 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 text-left shadow-lg animate-in fade-in duration-150">
                <button
                  type="button"
                  onClick={() => handleSwitchRole('student')}
                  className="w-full text-left px-2 py-1.5 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Student View
                  </span>
                  {user.role === 'student' && <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">Active</span>}
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchRole('company')}
                  className="w-full text-left px-2 py-1.5 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Employer View
                  </span>
                  {user.role === 'company' && <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">Active</span>}
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchRole('admin')}
                  className="w-full text-left px-2 py-1.5 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> TPO Admin View
                  </span>
                  {user.role === 'admin' && <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">Active</span>}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Email Verification Modal */}
      <EmailVerificationModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
      />
    </div>
  );

  return (
    <>
      {/* Desktop Left Sidebar (Always rendered on md+ screens) */}
      <aside className="hidden md:flex flex-col w-60 lg:w-64 border-r border-slate-200 dark:border-slate-800/80 shrink-0 select-none z-30 transition-colors">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-over Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200" 
            onClick={onMobileClose} 
          />
          <div className="relative w-4/5 max-w-xs h-full z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
