import toast from 'react-hot-toast';
import { GenerationBlockReason } from '../contexts/AuthContext';

/**
 * Dispatches an educational, user-friendly notification when a teacher is blocked from generating.
 * Accurately communicates Option B (3-Day Trial with 2 generations per day).
 */
export const showGenerationBlockedToast = (
  reason: GenerationBlockReason, 
  itemType: string = 'resources'
) => {
  if (reason === 'trial_daily_limit') {
    toast.error(
      `Daily Trial Quota Reached (2/2 today): You've used your 2 free trial generations for today. Your next 2 free generations unlock tomorrow! Need more now? Top up 2 credits for only GHS 5 or get an unlimited pass in Billing.`,
      { duration: 7000, icon: '⏳' }
    );
  } else if (reason === 'trial_expired') {
    toast.error(
      `Your 3-day free trial has expired. All your saved documents and curriculum remain accessible! Top up AI credits from GHS 5 or subscribe to an unlimited pass in Billing.`,
      { duration: 7000, icon: '🔒' }
    );
  } else {
    toast.error(
      `An active subscription or AI credits are required to generate new ${itemType}. Top up credits starting at GHS 5 (for 2 generations) or subscribe for unlimited access in Billing!`,
      { duration: 6000, icon: '🔒' }
    );
  }
};
