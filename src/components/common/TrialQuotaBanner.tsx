import React from 'react';
import { Link } from 'react-router';
import { Sparkles, Clock, Zap, Crown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

interface TrialQuotaBannerProps {
  className?: string;
  compact?: boolean;
}

export const TrialQuotaBanner: React.FC<TrialQuotaBannerProps> = ({ className, compact = false }) => {
  const {
    profile,
    user,
    daysLeft,
    aiCredits,
    isTrialActive,
    isSubscriptionActive,
    trialGenerationsLeftToday,
    trialDailyLimit
  } = useAuth();

  const isAdmin = user?.email === 'muhammadilias53@gmail.com';
  const hasActiveSub = isSubscriptionActive();
  const trialActive = isTrialActive();

  if (isAdmin) {
    return null;
  }

  // 1. Unlimited Paid Subscription
  if (hasActiveSub) {
    if (compact) return null;
    return (
      <div className={cn("flex items-center justify-between px-4 py-2 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/50 rounded-xl text-xs", className)}>
        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
          <Crown size={14} className="text-ghana-gold shrink-0" />
          <span>Unlimited Generations Active ({profile?.plan === 'quick_pass' ? '5-Hour Sprint' : 'Termly Pro'})</span>
        </div>
      </div>
    );
  }

  // 2. Purchased Credit Balance
  if (aiCredits > 0) {
    return (
      <div className={cn("flex items-center justify-between px-4 py-2.5 bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs shadow-sm", className)}>
        <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold">
          <Zap size={14} className="text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            Pay-As-You-Go: <strong className="font-mono text-amber-700 dark:text-amber-300 text-sm">{aiCredits}</strong> generation{aiCredits === 1 ? '' : 's'} available
          </span>
        </div>
        <Link
          to="/billing"
          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all"
        >
          Top Up +
        </Link>
      </div>
    );
  }

  // 3. Active 3-Day Free Trial (Option B: 2/day)
  if (trialActive) {
    const isOutOfQuotaToday = trialGenerationsLeftToday === 0;

    return (
      <div className={cn(
        "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-4 py-2.5 rounded-xl text-xs border shadow-sm transition-all",
        isOutOfQuotaToday
          ? "bg-rose-50/90 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-200"
          : "bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200",
        className
      )}>
        <div className="flex items-center gap-2.5 font-medium">
          <div className={cn(
            "w-6 h-6 rounded-lg flex items-center justify-center shrink-0",
            isOutOfQuotaToday ? "bg-rose-500 text-white" : "bg-emerald-600 text-white"
          )}>
            {isOutOfQuotaToday ? <Clock size={13} /> : <Sparkles size={13} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black tracking-tight text-[11px] uppercase">
                3-Day Free Trial
              </span>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                ({daysLeft}d left)
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
              {isOutOfQuotaToday ? (
                <>
                  Today's quota used (2/2). Next 2 free generations unlock <strong className="text-rose-700 dark:text-rose-400">tomorrow at midnight</strong>.
                </>
              ) : (
                <>
                  Daily Quota: <strong className="font-mono text-emerald-700 dark:text-emerald-300 font-black">{trialGenerationsLeftToday} of {trialDailyLimit}</strong> free generations left today.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <Link
            to="/billing"
            className={cn(
              "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shadow-sm",
              isOutOfQuotaToday
                ? "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20"
                : "bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-700/20"
            )}
          >
            {isOutOfQuotaToday ? "Get GHS 5 Credits" : "Upgrade Pro"}
          </Link>
        </div>
      </div>
    );
  }

  // 4. Trial Expired & No Credits
  return (
    <div className={cn("flex items-center justify-between px-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs", className)}>
      <div className="text-slate-700 dark:text-slate-300 font-medium text-[11px]">
        <span>Free trial completed • Top up credits from <strong>GHS 5</strong> to generate new resources.</span>
      </div>
      <Link
        to="/billing"
        className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ml-3 shrink-0"
      >
        Top Up
      </Link>
    </div>
  );
};
