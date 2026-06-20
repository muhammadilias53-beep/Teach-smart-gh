import React, { useState, useEffect } from 'react';
import { Download, Sparkles, Smartphone, Check, HelpCircle, Share, PlusSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // Detect standalone mode (already installed)
    const isInStandaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone || 
      document.referrer.includes('android-app://');

    if (isInStandaloneMode) {
      setIsInstalled(true);
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // Watch beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsReady(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Watch appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsReady(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIosGuide(true);
      return;
    }

    const isIframe = typeof window !== 'undefined' && window.self !== window.top;

    if (!deferredPrompt) {
      if (isIframe) {
        toast.success(
          "To install TeachSmartGH natively, click 'Open in New Tab' at the top-right of your workspace view, then click the browser's Install icon or app menu! 🇬🇭",
          { duration: 9000, id: 'pwa-install-iframe-btn' }
        );
      } else {
        toast(
          "To complete layout setup: Tap your browser's options menu (3-dots or Safari Share) and select 'Install TeachSmartGH' or 'Add to Home Screen'! 📶",
          { duration: 8000, id: 'pwa-install-manual-btn' }
        );
      }
      return;
    }

    try {
      // Show native prompt
      await deferredPrompt.prompt();

      // Check choice
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] User accepted the install prompt');
        setIsInstalled(true);
        setIsReady(false);
        toast.success("Successfully installed TeachSmartGH PWA! 🇬🇭");
      } else {
        console.log('[PWA] User dismissed the install prompt');
        toast("Installation dismissed. You can install it anytime from this sidebar panel.");
      }
    } catch (err) {
      console.error("Installation prompt rejected or failed:", err);
      toast.error("Interactive install is restricted in this window. Tap 'Open in New Tab' to load outside the frame, then retry! 🇬🇭");
    }

    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return (
      <div className="px-4 py-3 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100 flex items-center gap-3 shadow-xs">
        <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
          <Check size={16} className="stroke-[3]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black uppercase tracking-wider text-emerald-900 leading-none mb-0.5">TeachSmart Install</p>
          <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-tight leading-none">Native App Enabled</p>
        </div>
      </div>
    );
  }

  // Show installation trigger inside iframes so developers and users can easily trigger information drawers
  const isCurrentlyInIframe = typeof window !== 'undefined' && window.self !== window.top;
  if (!isReady && !isIOS && !isCurrentlyInIframe) {
    return null;
  }

  return (
    <div className="relative">
      <motion.div
        className="p-4 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-[2rem] text-white flex flex-col gap-3 shadow-xl shadow-slate-950/20"
        id="pwa-install-container"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-2xl bg-ghana-gold/10 text-ghana-gold flex items-center justify-center shrink-0 border border-ghana-gold/20 shadow-inner">
            <Smartphone size={18} className="animate-pulse" />
          </div>
          <div className="flex-grow min-w-0">
            <h4 className="text-[11px] font-black uppercase tracking-wider text-white flex items-center gap-1.5 leading-none mb-1">
              <span>TeachSmartGH App</span>
              <span className="text-[8px] bg-ghana-gold text-slate-950 font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                PWA
              </span>
            </h4>
            <p className="text-[10px] font-medium text-slate-400 leading-normal">
              Install to your home screen for quick, offline-ready curriculum access.
            </p>
          </div>
        </div>

        <button
          onClick={handleInstallClick}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-md shadow-emerald-950/10 active:scale-[0.98]"
        >
          <Download size={12} className="stroke-[3]" />
          <span>Install TeachSmartGH</span>
        </button>
      </motion.div>

      {/* iOS Step-by-Step Dialog */}
      <AnimatePresence>
        {showIosGuide && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowIosGuide(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-80 bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-2xl z-[101]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-ghana-gold/20 flex items-center justify-center">
                    <Smartphone size={16} className="text-emerald-deep" />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Install iOS App</h4>
                </div>
                <button
                  onClick={() => setShowIosGuide(false)}
                  className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 font-bold hover:bg-slate-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-[11px] font-bold text-slate-500 leading-normal">
                  To install **TeachSmartGH** on your iPhone or iPad, please follow these simple steps using Safari:
                </p>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 text-[10px] font-black shrink-0">
                    1
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-700 leading-normal">
                      Tap the <strong className="inline-flex items-center gap-1 font-black bg-slate-100 px-1.5 py-0.5 rounded text-emerald-deep"><Share size={10} /> Share</strong> button at the bottom of Safari.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 text-[10px] font-black shrink-0">
                    2
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-700 leading-normal">
                      Scroll down and tap <strong className="inline-flex items-center gap-1 font-black bg-slate-100 px-1.5 py-0.5 rounded text-emerald-deep"><PlusSquare size={10} /> Add to Home Screen</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 text-[10px] font-black shrink-0">
                    3
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-700 leading-normal">
                      Provide standard details and click **Add** to complete installation.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIosGuide(false)}
                className="w-full mt-5 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
              >
                Got It, Thank You!
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
