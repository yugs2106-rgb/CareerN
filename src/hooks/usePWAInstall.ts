import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    // Detect standalone mode (already installed / running as native app)
    const checkStandalone = () => {
      const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
      const isWindowControlsOverlay = window.matchMedia('(display-mode: window-controls-overlay)').matches;
      const isNavStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      return isStandaloneMedia || isWindowControlsOverlay || isNavStandalone;
    };

    setIsInstalled(checkStandalone());

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // Detect Mac OS desktop
    const isMacDevice = /macintosh|mac os x/i.test(userAgent) && !isIOSDevice;
    setIsMac(isMacDevice);

    // Safari check (Safari desktop or mobile without Chrome/Chromium/Edge)
    const isSafariBrowser = /safari/i.test(userAgent) && !/chrome|chromium|edg|crios|opr/i.test(userAgent);
    setIsSafari(isSafariBrowser);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
      return true;
    }
    return false;
  };

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS,
    isMac,
    isSafari,
    install,
  };
}

