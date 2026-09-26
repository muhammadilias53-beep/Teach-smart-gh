import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, Smartphone, Check, X, Share, PlusSquare, 
  Sparkles, WifiOff, Zap, ShieldCheck, ArrowRight, Laptop
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { toast } from 'react-hot-toast';

const SNOOZE_KEY = 'teachsmart_install_prompt_snoozed_until';

export const BrowserInstallPrompt: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [isOpen, setIsOpen] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Automatically trigger the install pop up for non-installed users
  useEffect(() => {
    if (isInstalled) {
      setIsOpen(false);
      return;
    }

    // Check if user recently snoozed the prompt
    const snoozedUntil = localStorage.getItem(SNOOZE_KEY);
    const isSnoozed = snoozedUntil && Number(snoozedUntil) > Date.now();

    // If installable or mobile user, and not snoozed, show prompt after a smooth delay
    if (!isSnoozed && !hasInteracted) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled, hasInteracted]);

  // Listen for manual trigger events dispatched by buttons anywhere in the app
  useEffect(() => {
    const handleManualOpen = () => {
      setIsOpen(true);
      setShowIOSGuide(false);
    };

    window.addEventListener('teachsmart:open-install-prompt', handleManualOpen);
    return () => window.removeEventListener('teachsmart:open-install-prompt', handleManualOpen);
  }, []);

  // If the app is already installed in standalone mode, suppress completely
  if (isInstalled) {
    return null;
  }

  const handleSingleClickInstall = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (isInstallable) {
      setIsInstalling(true);
      try {
        const result = await install();
        if (result.outcome === 'accepted') {
          toast.success(
            'TeachSmartGH Installed! 🇬🇭 You can now launch it directly from your home screen or desktop apps.',
            { duration: 6000 }
          );
          setIsOpen(false);
        } else if (result.outcome === 'dismissed') {
          console.log('[PWA] User dismissed browser install dialog');
        }
      } catch (err) {
        console.error('[PWA] Installation failed:', err);
      } finally {
        setIsInstalling(false);
      }
    } else {
      // If native deferred prompt isn't yet ready or browser doesn't support beforeinstallprompt
      if (isIOS) {
        setShowIOSGuide(true);
      } else {
        toast(
          'To install: Tap your browser menu (⋮ or ⋯) and select "Install app" or "Add to Home Screen".',
          { icon: '📲', duration: 7000 }
        );
      }
    }
  };

  const handleDismiss = () => {
    setIsOpen(false);
    setHasInteracted(true);
    // Snooze automatic pop up for 12 hours so we don't nag, while keeping the quick floating button available
    localStorage.setItem(SNOOZE_KEY, (Date.now() + 12 * 60 * 60 * 1000).toString());
  };

  return (
    <>
      {/* 1. Main Automatic / Triggered Install Pop-up Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-3 sm:p-4 pointer-events-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleDismiss}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs pointer-events-auto"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 25, scale: 0.96 }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              className="relative w-full max-w-lg bg-gradient-to-b from-[#0A192F] via-[#0E2442] to-[#0A192F] text-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-700/60 pointer-events-auto overflow-hidden"
            >
              {/* Subtle Ghana Color Accent Top Border */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#CE1126] via-[#FCD116] to-[#006B3F]" />

              {/* Close Button */}
              <button
                onClick={handleDismiss}
                aria-label="Close install prompt"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>

              {/* Header with App Logo & Title */}
              <div className="flex items-start gap-4 mb-4">
                <div className="relative shrink-0">
                  <img 
                    src="/icon-192.png" 
                    alt="TeachSmartGH Logo" 
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-lg border-2 border-[#FCD116]/40 object-cover bg-slate-900"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-[#006B3F] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border border-slate-900 shadow-xs">
                    GH 🇬🇭
                  </div>
                </div>

                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-[#FCD116]/20 text-[#FCD116] border border-[#FCD116]/30">
                      Official App
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Catalyst Creative</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                    Install TeachSmartGH
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
                    {isIOS 
                      ? 'Add to your iPhone / iPad home screen for 1-tap lesson planning.' 
                      : 'Install on your device with a single click for instant offline curriculum access.'}
                  </p>
                </div>
              </div>

              {/* Key Value Highlights */}
              <div className="grid grid-cols-3 gap-2 my-4 p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="flex flex-col items-center text-center p-1.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-1">
                    <Zap size={16} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-200">1-Click Launch</span>
                  <span className="text-[9px] text-slate-400">Zero loading delay</span>
                </div>

                <div className="flex flex-col items-center text-center p-1.5 border-x border-slate-800">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-1">
                    <WifiOff size={16} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-200">Offline Vault</span>
                  <span className="text-[9px] text-slate-400">Works without net</span>
                </div>

                <div className="flex flex-col items-center text-center p-1.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center mb-1">
                    <ShieldCheck size={16} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-200">NaCCA Aligned</span>
                  <span className="text-[9px] text-slate-400">Full GES standards</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 mt-5">
                <button
                  onClick={handleSingleClickInstall}
                  disabled={isInstalling}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl font-black text-sm text-slate-950 bg-gradient-to-r from-[#FCD116] via-[#f7d93d] to-[#FCD116] hover:brightness-105 active:scale-[0.98] transition-all shadow-lg shadow-[#FCD116]/20 cursor-pointer disabled:opacity-70"
                >
                  {isInstalling ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      Opening Browser Installer...
                    </span>
                  ) : (
                    <>
                      <Download size={18} className="stroke-[2.5]" />
                      <span>{isIOS ? 'View 2-Step iOS Install Guide' : 'Install App Now (Single Click)'}</span>
                      <ArrowRight size={16} className="stroke-[2.5]" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Sparkles size={11} className="text-[#FCD116]" /> Free &bull; No app store download needed
                  </span>
                  <button
                    onClick={handleDismiss}
                    className="text-[11px] font-semibold text-slate-400 hover:text-slate-200 hover:underline transition-colors"
                  >
                    Remind me later
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. iOS Safari Step-by-Step Installation Modal */}
      <AnimatePresence>
        {showIOSGuide && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowIOSGuide(false)}
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl z-10 text-slate-900 border border-slate-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900 leading-tight">Install on iPhone / iPad</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Safari 2-Step Setup</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3.5 my-4">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-black shrink-0">
                    1
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed">
                    Tap the <strong className="inline-flex items-center gap-1 font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded mx-1"><Share size={12} /> Share</strong> button in Safari's bottom toolbar.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-black shrink-0">
                    2
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed">
                    Scroll down and tap <strong className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mx-1"><PlusSquare size={12} /> Add to Home Screen</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-7 h-7 rounded-xl bg-[#006B3F] text-white flex items-center justify-center text-xs font-black shrink-0">
                    3
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed">
                    Tap <strong className="font-bold text-slate-900">Add</strong> in the top right. TeachSmartGH will now appear like a native app on your home screen!
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider transition-colors"
              >
                Got It, Thank You!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Floating Quick-Install Trigger Pill (visible when modal is closed and app is not installed) */}
      {!isOpen && !isInstalled && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[990]"
        >
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#0A192F] to-[#122D52] text-white shadow-xl shadow-slate-950/30 border-2 border-[#FCD116]/50 hover:border-[#FCD116] hover:scale-105 active:scale-95 transition-all duration-300"
            title="Install TeachSmartGH app on your device"
          >
            <div className="w-7 h-7 rounded-full bg-[#FCD116] text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
              <Download size={14} className="stroke-[3] group-hover:animate-bounce" />
            </div>
            <div className="text-left hidden xs:block sm:block pr-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-[#FCD116] leading-none mb-0.5">
                Install App
              </p>
              <p className="text-[9px] font-medium text-slate-300 leading-none">
                Single Click Setup
              </p>
            </div>
          </button>
        </motion.div>
      )}
    </>
  );
};
