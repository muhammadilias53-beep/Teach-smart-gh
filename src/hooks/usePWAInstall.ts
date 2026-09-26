import { useState, useEffect, useCallback } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface Window {
    __teachsmart_deferred_prompt?: BeforeInstallPromptEvent | null;
  }
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(() => {
    if (typeof window !== 'undefined' && window.__teachsmart_deferred_prompt) {
      return window.__teachsmart_deferred_prompt;
    }
    return null;
  });

  const [isInstalled, setIsInstalled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://') ||
      window.matchMedia('(display-mode: window-controls-overlay)').matches
    );
  });

  const [isIOS, setIsIOS] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const ua = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(ua) && !(window as any).MSStream;
  });

  const [isAndroid, setIsAndroid] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return /android/.test(window.navigator.userAgent.toLowerCase());
  });

  useEffect(() => {
    // 1. Initial check for existing standalone mode
    const checkStandalone = () => {
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');
      setIsInstalled(standalone);
    };

    checkStandalone();

    // 2. Check if prompt was captured early
    if (window.__teachsmart_deferred_prompt && !deferredPrompt) {
      setDeferredPrompt(window.__teachsmart_deferred_prompt);
    }

    // 3. Listen for native beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      window.__teachsmart_deferred_prompt = promptEvent;
      setDeferredPrompt(promptEvent);
      console.log('[usePWAInstall] Captured beforeinstallprompt event');
    };

    // 4. Custom event from early head script
    const handlePromptReady = (e: Event) => {
      const customEvent = e as CustomEvent<BeforeInstallPromptEvent>;
      if (customEvent.detail) {
        setDeferredPrompt(customEvent.detail);
      } else if (window.__teachsmart_deferred_prompt) {
        setDeferredPrompt(window.__teachsmart_deferred_prompt);
      }
    };

    // 5. Successful installation listener
    const handleAppInstalled = () => {
      console.log('[usePWAInstall] App installed event fired');
      setIsInstalled(true);
      setDeferredPrompt(null);
      window.__teachsmart_deferred_prompt = null;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('teachsmart:pwa-prompt-ready', handlePromptReady);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('teachsmart:pwa-installed', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('teachsmart:pwa-prompt-ready', handlePromptReady);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('teachsmart:pwa-installed', handleAppInstalled);
    };
  }, [deferredPrompt]);

  /**
   * Single-click install trigger: directly opens the browser's native installation dialog
   */
  const install = useCallback(async (): Promise<{
    outcome: 'accepted' | 'dismissed' | 'unsupported' | 'error';
    platform?: string;
  }> => {
    const promptEvent = deferredPrompt || window.__teachsmart_deferred_prompt;

    if (!promptEvent) {
      return { outcome: 'unsupported' };
    }

    try {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;

      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        window.__teachsmart_deferred_prompt = null;
        return { outcome: 'accepted', platform: choice.platform };
      }

      return { outcome: 'dismissed', platform: choice.platform };
    } catch (err) {
      console.error('[usePWAInstall] Error executing install prompt:', err);
      return { outcome: 'error' };
    }
  }, [deferredPrompt]);

  return {
    isInstallable: !!(deferredPrompt || (typeof window !== 'undefined' && window.__teachsmart_deferred_prompt)),
    isInstalled,
    isIOS,
    isAndroid,
    deferredPrompt,
    install,
  };
}
