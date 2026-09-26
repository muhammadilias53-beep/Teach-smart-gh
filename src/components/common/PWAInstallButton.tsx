import React, { useState } from 'react';
import { Download, Smartphone, Check, Share, PlusSquare, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { toast } from 'react-hot-toast';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIosGuide(true);
      return;
    }

    if (isInstallable) {
      setIsInstalling(true);
      try {
        const choice = await install();
        if (choice.outcome === 'accepted') {
          toast.success('TeachSmartGH Installed! 🇬🇭 Launch anytime from your device home screen.');
        }
      } catch (err) {
        console.error('[PWAInstallButton] install error:', err);
      } finally {
        setIsInstalling(false);
      }
    } else {
      // Fire global install prompt dialog
      window.dispatchEvent(new CustomEvent('teachsmart:open-install-prompt'));
    }
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
          <div className="w-9 h-9 rounded-2xl bg-[#FCD116]/10 text-[#FCD116] flex items-center justify-center shrink-0 border border-[#FCD116]/20 shadow-inner">
            <Smartphone size={18} className="animate-pulse" />
          </div>
          <div className="flex-grow min-w-0">
            <h4 className="text-[11px] font-black uppercase tracking-wider text-white flex items-center gap-1.5 leading-none mb-1">
              <span>TeachSmartGH App</span>
              <span className="text-[8px] bg-[#FCD116] text-slate-950 font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                PWA
              </span>
            </h4>
            <p className="text-[10px] font-medium text-slate-400 leading-normal">
              Install to your device for 1-click launch and offline NaCCA curriculum access.
            </p>
          </div>
        </div>

        <button
          onClick={handleInstallClick}
          disabled={isInstalling}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-md shadow-emerald-950/10 active:scale-[0.98] cursor-pointer disabled:opacity-70"
        >
          <Download size={12} className="stroke-[3]" />
          <span>{isInstalling ? 'Opening Browser Prompt...' : 'Install TeachSmartGH (1-Click)'}</span>
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
                  <div className="w-8 h-8 rounded-xl bg-[#FCD116]/20 flex items-center justify-center">
                    <Smartphone size={16} className="text-emerald-700" />
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
                  To install TeachSmartGH on your iPhone or iPad, follow these simple steps in Safari:
                </p>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 text-[10px] font-black shrink-0">
                    1
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-700 leading-normal">
                      Tap the <strong className="inline-flex items-center gap-1 font-black bg-slate-100 px-1.5 py-0.5 rounded text-emerald-800"><Share size={10} /> Share</strong> button at the bottom of Safari.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 text-[10px] font-black shrink-0">
                    2
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-700 leading-normal">
                      Scroll down and tap <strong className="inline-flex items-center gap-1 font-black bg-slate-100 px-1.5 py-0.5 rounded text-emerald-800"><PlusSquare size={10} /> Add to Home Screen</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 text-[10px] font-black shrink-0">
                    3
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-700 leading-normal">
                      Tap <strong>Add</strong> in the top right to complete installation.
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
