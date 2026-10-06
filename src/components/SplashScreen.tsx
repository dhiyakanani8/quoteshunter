import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Table2, Sparkles, Database, Layers, ArrowRight, CheckCircle2 } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  categoriesLoaded: boolean;
  totalCategories?: number;
}

export default function SplashScreen({
  onComplete,
  categoriesLoaded,
  totalCategories = 18,
}: SplashScreenProps) {
  const [progress, setProgress] = useState(12);
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    { title: 'Connecting to Google Sheets Cloud', desc: 'Handshaking with Apps Script execution API', icon: Database },
    { title: 'Discovering Dynamic Categories', desc: `Scanning sheets (${totalCategories} available)`, icon: Layers },
    { title: 'Synchronizing Curated Messages', desc: 'Preparing live tweets, quotes & media feeds', icon: Table2 },
    { title: 'Ready to Explore', desc: 'Optimizing views, pagination & cache engine', icon: Sparkles },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(40);
      setStepIndex(1);
    }, 600);

    const timer2 = setTimeout(() => {
      setProgress(75);
      setStepIndex(2);
    }, 1200);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStepIndex(3);
    }, 1800);

    const timer4 = setTimeout(() => {
      onComplete();
    }, 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03, filter: 'blur(8px)' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden select-none"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Decorative subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 text-center">
        {/* Animated Brand Emblem */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-6"
        >
          {/* Pulsing ring outer */}
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.05, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-emerald-500 to-indigo-600 blur-md"
          />

          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 border border-indigo-500/30 shadow-2xl flex items-center justify-center p-4 shadow-indigo-500/20">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Table2 className="w-10 h-10 text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]" />
            </motion.div>

            {/* Sparkle badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
              className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-lg border border-slate-900"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </motion.div>
          </div>
        </motion.div>

        {/* App Title & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Live Cloud Feed Connected
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
            Quotes<span className="text-emerald-400">hunter</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-sm">
            Interactive explorer for dynamic Google Sheets feeds, quotes, jokes & social tweets.
          </p>
        </motion.div>

        {/* Steps Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="w-full bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800/80 p-4 shadow-xl mb-6 text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              System Initialization
            </span>
            <span className="text-xs font-mono font-medium text-emerald-400">
              {progress}%
            </span>
          </div>

          {/* Progress track */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-4">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-400 rounded-full"
              initial={{ width: '10%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          {/* Current Step Info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center shrink-0 text-emerald-400">
              {progress >= 100 ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                (() => {
                  const CurrentIcon = steps[stepIndex]?.icon || Layers;
                  return <CurrentIcon className="w-4 h-4 text-indigo-400 animate-pulse" />;
                })()
              )}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-semibold text-white truncate">
                {steps[stepIndex]?.title}
              </div>
              <div className="text-xs text-slate-400 truncate">
                {steps[stepIndex]?.desc}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Skip button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={onComplete}
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white px-4 py-2 rounded-xl hover:bg-slate-900/60 transition-colors border border-transparent hover:border-slate-800 cursor-pointer"
        >
          <span>Skip to feed</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </motion.div>
  );
}
