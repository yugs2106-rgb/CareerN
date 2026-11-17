import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, FileText, User, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function StudentBottomNav() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const navItems = [
    { label: 'Overview', path: '/', icon: LayoutDashboard },
    { label: 'Internships', path: '/student/internships', icon: Briefcase },
    { label: 'Status', path: '/student/applications', icon: FileText },
    { label: 'AI Advisor', path: '/student/assistant', icon: Sparkles },
    { label: 'Profile', path: '/student/profile', icon: User },
  ];

  return (
    // STRICTLY md:hidden so it never exists or overlaps buttons on desktop / laptop screens
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A1128]/95 backdrop-blur-lg border-t border-slate-800 shadow-[0_-4px_25px_rgba(0,0,0,0.5)] px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 shrink-0",
                active
                  ? "text-yellow-400 font-bold scale-105"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              <div className={cn(
                "p-1 rounded-lg transition-colors",
                active ? "bg-yellow-400/10" : "bg-transparent"
              )}>
                <Icon className={cn("w-5 h-5", active ? "stroke-[2.5]" : "stroke-2")} />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
