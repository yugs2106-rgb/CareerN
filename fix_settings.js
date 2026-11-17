const fs = require('fs');

const content = `import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun, Settings as SettingsIcon, Shield, Bell, User as UserIcon, Lock, CheckCircle2 } from 'lucide-react';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('appearance');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-slate-400" /> Settings
        </h1>
        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full font-medium text-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              Settings saved
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
              className={\`w-full text-left px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-colors \${
                activeTab === tab.id
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }\`}
            >
              <tab.icon className="w-5 h-5" /> {tab.label}
            </button>
          ))}
        </div>

        <div className="md:col-span-2 space-y-6">
          {activeTab === 'appearance' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Theme Preferences</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Choose how the CareerNexus looks to you.</p>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => theme !== 'light' && toggleTheme()}
                  className={\`flex-1 p-6 rounded-2xl border-2 text-left transition-all \${
                    theme === 'light' 
                      ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' 
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-800'
                  }\`}
                >
                  <div className={\`w-12 h-12 rounded-full flex items-center justify-center mb-4 \${
                    theme === 'light' ? 'bg-yellow-400 text-black' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }\`}>
                    <Sun className="w-6 h-6" />
                  </div>
                  <h3 className={\`font-bold text-lg \${theme === 'light' ? 'text-yellow-700 dark:text-yellow-500' : 'text-slate-900 dark:text-white'}\`}>Light Mode</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clean and bright.</p>
                </motion.button>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => theme !== 'dark' && toggleTheme()}
                  className={\`flex-1 p-6 rounded-2xl border-2 text-left transition-all \${
                    theme === 'dark' 
                      ? 'border-yellow-400 bg-slate-900 dark:bg-slate-950' 
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-800'
                  }\`}
                >
                  <div className={\`w-12 h-12 rounded-full flex items-center justify-center mb-4 \${
                    theme === 'dark' ? 'bg-yellow-400 text-black' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }\`}>
                    <Moon className="w-6 h-6" />
                  </div>
                  <h3 className={\`font-bold text-lg \${theme === 'dark' ? 'text-yellow-400' : 'text-slate-900 dark:text-white'}\`}>Dark Mode</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Easy on the eyes.</p>
                </motion.button>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Account Details</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Update your login information and personal details.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input type="text" defaultValue={user?.name} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input type="email" defaultValue={user?.email || "student@careernexus.com"} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all dark:text-white" />
                </div>
                <div className="pt-4">
                  <button onClick={handleSave} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded-lg transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Notifications</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Control when and how you want to be notified.</p>
              
              <div className="space-y-6">
                {[
                  { title: "Application Updates", desc: "Get notified when your internship application status changes." },
                  { title: "New Opportunities", desc: "Receive alerts for internships matching your profile." },
                  { title: "Messages", desc: "Be notified when a recruiter sends you a message." },
                  { title: "Marketing & News", desc: "Occasional updates about CareerNexus features." }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">{item.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input type="checkbox" className="sr-only peer" defaultChecked={i < 3} />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-yellow-400"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Privacy & Security</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Manage your security settings and privacy preferences.</p>
              
              <div className="space-y-8">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                    <Lock className="w-5 h-5 text-slate-400" /> Password
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all dark:text-white" />
                    </div>
                    <button onClick={handleSave} className="bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold py-2 px-6 rounded-lg transition-colors text-sm">
                      Update Password
                    </button>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-slate-400" /> Privacy
                  </h3>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">Profile Visibility</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Allow companies to find your profile in searches.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-yellow-400"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/pages/Student/Settings.tsx', content);
console.log('Settings updated!');
