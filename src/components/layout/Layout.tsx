import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './Navbar';
import StudentBottomNav from './StudentBottomNav';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../Logo';
import { PWAInstallButton } from '../PWAInstallButton';
import { MacCommandPalette } from '../MacCommandPalette';
import { OfflineIndicator } from '../OfflineIndicator';
import { CopyLinkButton } from '../CopyLinkButton';
import { ThemeToggle } from '../ThemeToggle';
import { Menu, ShieldCheck, GraduationCap, Building2 } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isStudent = user?.role === 'student';

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'student': return <GraduationCap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
      case 'company': return <Building2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case 'admin': return <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      default: return null;
    }
  };

  const getRoleTitle = () => {
    switch (user?.role) {
      case 'student': return 'Student Portal';
      case 'company': return 'Employer Hub';
      case 'admin': return 'Placement Cell Admin';
      default: return 'Portal';
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans overflow-hidden select-none transition-colors duration-200">
      {/* Universal Desktop Sidebar & Mobile Slideover Drawer */}
      <Navbar isMobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden select-text bg-slate-50 dark:bg-[#0B0F19]">
        {/* Responsive Top Bar */}
        <header className="h-14 md:h-16 bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between px-3 sm:px-6 lg:px-8 shrink-0 z-20 transition-colors duration-200">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Logo Brand */}
            <div className="flex items-center gap-2 md:hidden">
              <Logo className="h-6 w-6 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">CareerNexus</span>
            </div>

            {/* Desktop Breadcrumb / Role Context */}
            <div className="hidden md:flex items-center gap-2.5">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {getRoleIcon()}
                <span>{getRoleTitle()}</span>
              </div>
              {user && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Signed in as <strong className="text-slate-900 dark:text-white font-semibold">{user.name}</strong>
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <CopyLinkButton />
            <MacCommandPalette />
            <ThemeToggle />
            <PWAInstallButton />
          </div>
        </header>

        {/* Scrollable Main Content Area */}
        <section className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-28 md:pb-8 bg-slate-50 dark:bg-[#0B0F19] transition-colors duration-200">
          <div className="w-full max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="w-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Desktop Footer (Hidden on Mobile) */}
        <footer className="hidden md:flex h-11 bg-white dark:bg-[#0F172A] border-t border-slate-200 dark:border-slate-800/80 items-center justify-between px-6 lg:px-8 text-[11px] text-slate-500 dark:text-slate-400 shrink-0 transition-colors duration-200">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-slate-700 dark:text-slate-300">&copy; {new Date().getFullYear()} CareerNexus</span>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <span className="hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer transition-colors">University Placement Protocol</span>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <span className="hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer transition-colors">Privacy & Security</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-600 dark:text-slate-300">Placement Server: Operational</span>
          </div>
        </footer>
      </main>

      {/* Compact Mobile Bottom Nav for Students (Only rendered on mobile via md:hidden) */}
      {isStudent && <StudentBottomNav />}
      
      {/* Offline Status Toast */}
      <OfflineIndicator />
    </div>
  );
}
