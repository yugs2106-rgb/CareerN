import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, LogOut, LayoutDashboard } from 'lucide-react';

interface AccessDeniedProps {
  requiredRole?: string;
}

export default function AccessDenied({ requiredRole }: AccessDeniedProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'student': return 'Student';
      case 'company': return 'Employer / Company';
      case 'admin': return 'Placement Officer (TPO) / Admin';
      default: return role || 'Authorized';
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xl text-center">
        <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8 text-amber-500" />
        </div>

        <span className="inline-block px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-full uppercase tracking-wider mb-3">
          Access Restricted
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
          Permission Required
        </h1>

        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
          This section is restricted to <span className="font-semibold text-slate-900 dark:text-white">{getRoleLabel(requiredRole)}</span> accounts.
          {user && (
            <> You are currently signed in as a <span className="font-semibold capitalize text-amber-600 dark:text-amber-400">{getRoleLabel(user.role)}</span>.</>
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-sm rounded-xl transition-all shadow-sm"
          >
            <LayoutDashboard className="w-4 h-4" />
            Go to My Dashboard
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
            Switch Account
          </button>
        </div>
      </div>
    </div>
  );
}
