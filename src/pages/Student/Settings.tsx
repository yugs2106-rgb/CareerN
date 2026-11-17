import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun, Settings as SettingsIcon, Shield, Bell, User as UserIcon, Lock, CheckCircle2, LogOut, Check } from 'lucide-react';

export default function Settings() {
  const { theme, setTheme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('appearance');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Sun },
    { id: 'account', label: 'Account Details', icon: UserIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
            <SettingsIcon className="w-7 h-7 text-blue-600 dark:text-blue-400" /> System Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your interface theme, personal details, security, and alerts.
          </p>
        </div>
        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-4 py-2 rounded-xl font-semibold text-xs shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Changes saved successfully
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-all text-sm ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/25 dark:text-blue-400 font-semibold border-l-4 border-blue-600 dark:border-blue-500 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-colors text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-sm"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          {activeTab === 'appearance' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-6 transition-colors">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Theme & Display</h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Customize the appearance of the portal to suit your environment and eye comfort.
                </p>
              </div>

              {/* Interactive Quick Toggle Banner */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                    {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Current Mode: <span className="capitalize text-blue-600 dark:text-blue-400 font-bold">{theme}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {theme === 'dark' ? 'Dark theme reduces glare in low-light environments' : 'Light theme provides high contrast for daylight usage'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white shrink-0"
                >
                  Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                </button>
              </div>

              {/* Theme Option Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                  onClick={() => setTheme('light')}
                  role="button"
                  tabIndex={0}
                  className={`p-5 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                    theme === 'light' 
                      ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/20 shadow-xs ring-2 ring-blue-500/20' 
                      : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      theme === 'light' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}>
                      <Sun className="w-5 h-5" />
                    </div>
                    {theme === 'light' && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>
                  <h3 className={`font-bold text-base ${theme === 'light' ? 'text-blue-700 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                    Light Mode
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Crisp off-white canvas with clean typography and balanced negative space.
                  </p>
                </div>

                <div 
                  onClick={() => setTheme('dark')}
                  role="button"
                  tabIndex={0}
                  className={`p-5 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                    theme === 'dark' 
                      ? 'border-blue-500 bg-slate-950/80 shadow-xs ring-2 ring-blue-500/20' 
                      : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      theme === 'dark' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}>
                      <Moon className="w-5 h-5" />
                    </div>
                    {theme === 'dark' && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-blue-400 bg-blue-900/40 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>
                  <h3 className={`font-bold text-base ${theme === 'dark' ? 'text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                    Dark Mode
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Deep navy and slate palette crafted for extended night sessions with zero eye strain.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 animate-in fade-in slide-in-from-bottom-4 duration-300 transition-colors">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Account Details</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">Update your login information and personal contact record.</p>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Full Name</label>
                    <input type="text" defaultValue={user?.name} className="w-full bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Email Address</label>
                    <input type="email" defaultValue={user?.email || "student@careernexus.com"} className="w-full bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Phone Number</label>
                    <input type="tel" placeholder="+91..." className="w-full bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Campus / City</label>
                    <input type="text" placeholder="Campus, City" className="w-full bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white" />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2.5 px-6 rounded-xl transition-colors shadow-xs">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 animate-in fade-in slide-in-from-bottom-4 duration-300 transition-colors">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Alert Preferences</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">Choose notifications and placement drive updates sent to you.</p>
              
              <div className="space-y-5">
                {[
                  { title: "Application Status Updates", desc: "Immediate notification when a company shortlists or updates your status." },
                  { title: "Placement Drive Alerts", desc: "Instant announcements when new eligibility drives are posted by TPO." },
                  { title: "Interview Scheduling", desc: "Alerts when recruiter interview rounds or test links are dispatched." },
                  { title: "AI Resume & Skill Insights", desc: "Personalized suggestions on missing skills based on posted job descriptions." }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{item.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input type="checkbox" className="sr-only peer" defaultChecked={i < 3} />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 animate-in fade-in slide-in-from-bottom-4 duration-300 transition-colors">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Privacy & Security</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">Manage authentication credentials and student directory discoverability.</p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                    <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Change Password
                  </h3>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Current Password</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">New Password</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white" />
                    </div>
                    <button onClick={handleSave} className="bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold py-2 px-5 rounded-xl transition-colors text-xs">
                      Update Password
                    </button>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                    <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Placement Directory Privacy
                  </h3>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Profile Discoverability</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Allow verified recruiting partners to discover your CV in talent searches.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-sm text-rose-600 dark:text-rose-400 flex items-center gap-2 mb-2">
                    <LogOut className="w-4 h-4" /> Active Session
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    Terminates your authentication session and returns to login screen.
                  </p>
                  <button onClick={handleLogout} className="bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-900/40 font-semibold py-2 px-5 rounded-xl transition-colors text-xs flex items-center gap-2 border border-rose-200 dark:border-rose-900/50">
                    <LogOut className="w-3.5 h-3.5" /> Sign Out from CareerNexus
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
