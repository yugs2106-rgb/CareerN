import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Laptop, Check, X, Compass, Globe } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, isMac, isSafari, install } = usePWAInstall();
  const [showMacGuide, setShowMacGuide] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [activeMacTab, setActiveMacTab] = useState<'safari' | 'chrome'>('safari');

  // If already running as an installed native app, display a subtle native indicator or hide
  if (isInstalled) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
        <Check className="w-3.5 h-3.5" />
        <span>Desktop App</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (!installed && isMac) {
        setShowMacGuide(true);
      }
    } else if (isMac) {
      setActiveMacTab(isSafari ? 'safari' : 'chrome');
      setShowMacGuide(true);
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      setShowMacGuide(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-3.5 py-1.5 text-xs sm:text-sm font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
        title={isMac ? "Install as native Mac App" : "Install CareerNexus App"}
      >
        {isMac ? (
          <Laptop className="w-4 h-4" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        <span>{isMac ? 'Install Mac App' : isIOS ? 'Install on iOS' : 'Install App'}</span>
      </button>

      {/* Mac Installation Guide Modal */}
      {showMacGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl relative">
            <button
              onClick={() => setShowMacGuide(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center shadow-md">
                <Laptop className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Run as Native Mac App</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Add CareerNexus to your Mac Dock & Launchpad</p>
              </div>
            </div>

            {/* Browser Selector Tabs */}
            <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1 mb-5">
              <button
                onClick={() => setActiveMacTab('safari')}
                className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition ${
                  activeMacTab === 'safari'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Compass className="w-4 h-4 text-blue-500" />
                <span>Safari (macOS Sonoma+)</span>
              </button>
              <button
                onClick={() => setActiveMacTab('chrome')}
                className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition ${
                  activeMacTab === 'chrome'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Globe className="w-4 h-4 text-amber-500" />
                <span>Chrome / Edge</span>
              </button>
            </div>

            {activeMacTab === 'safari' ? (
              <div className="space-y-3.5 text-sm text-slate-700 dark:text-slate-300">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-yellow-400 text-slate-950 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">1</span>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">In Safari's top menu bar:</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Click <strong>File</strong> &gt; <strong>"Add to Dock..."</strong> (or click the Share icon in the Safari toolbar).</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-yellow-400 text-slate-950 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">2</span>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Confirm app name:</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Check that <strong>CareerNexus</strong> is selected with its native gold logo.</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-yellow-400 text-slate-950 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">3</span>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Click "Add":</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">CareerNexus will open in its own standalone Mac window with standard Mac keyboard shortcuts!</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5 text-sm text-slate-700 dark:text-slate-300">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-yellow-400 text-slate-950 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">1</span>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Address Bar shortcut:</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Click the <strong>Install App icon (⊕ or computer with arrow)</strong> on the right side of Chrome/Edge address bar.</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-yellow-400 text-slate-950 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">2</span>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Or via Chrome menu:</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Click <strong>⋮ (Settings)</strong> &gt; <strong>Save and share</strong> &gt; <strong>Install CareerNexus</strong>.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowMacGuide(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-yellow-400 dark:hover:bg-yellow-500 text-white dark:text-slate-950 text-sm font-semibold transition"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS Installation Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Install on iPhone / iPad</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              1. Tap the <strong>Share</strong> button in Safari toolbar.<br />
              2. Scroll down and tap <strong>Add to Home Screen</strong>.
            </p>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-xl bg-slate-100 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

