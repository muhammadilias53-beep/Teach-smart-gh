import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { saveOffline, getOffline } from './indexedDB';

const AUTOMATED_MESSAGES_KEY = 'teachsmart_automated_sent_v1';

export interface AutomatedMessageDefinition {
  id: string;
  title: string;
  message: string;
  category: string;
  type: 'update' | 'resource' | 'event' | 'system';
  priority: 'high' | 'medium' | 'low';
  link?: string;
  triggerDays?: number[]; // Days of week (0 = Sunday, 1 = Monday...) to trigger
}

const TEMPLATES: AutomatedMessageDefinition[] = [
  {
    id: 'msg_welcome_akwaaba',
    title: 'Akwaaba to TeachSmartGH! 🇬🇭',
    message: 'Welcome to your premium AI Teaching Assistant. Prepare NaCCA-aligned lesson notes, schemes of learning, and diagnostic exam papers in seconds.',
    category: 'Announcements',
    type: 'system',
    priority: 'high',
    link: '/profile'
  },
  {
    id: 'msg_offline_tutorial',
    title: 'Did you know? Work 100% Offline! 📶',
    message: 'TeachSmartGH caches your libraries, worksheets, and schemes in local storage. Tap "Install App" on the sign-in page to run completely offline without internet data!',
    category: 'Training & Tutorials',
    type: 'resource',
    priority: 'medium',
    link: '/'
  },
  {
    id: 'msg_nacca_compliance',
    title: 'NaCCA Curriculum Verification Directive 🇬🇭',
    message: 'Always ensure your teaching lesson notes correspond strictly to physical standard indicators before entering the classroom. Standard-Based Curriculum codes are automatically aligned here.',
    category: 'Curriculum Updates',
    type: 'update',
    priority: 'high',
    link: '/curriculum'
  },
  {
    id: 'msg_mon_morning_prep',
    title: 'Monday Instructional Prep Reminder 📝',
    message: 'Start your academic week with confidence! Generate your weekly Lesson Notes and schemes in advance to maximize active phase-centered instructional time.',
    category: 'Teaching Resources',
    type: 'resource',
    priority: 'medium',
    triggerDays: [1], // Monday
    link: '/'
  },
  {
    id: 'msg_wed_competency',
    title: 'Mid-Week Core Competency Check 🎯',
    message: 'Review your lesson outcomes: are learners actively collaborating using Ghanaian-centered contexts? Click to check curriculum core indicators.',
    category: 'Training & Tutorials',
    type: 'update',
    priority: 'low',
    triggerDays: [3], // Wednesday
    link: '/curriculum'
  },
  {
    id: 'msg_fri_plenary',
    title: 'Friday Curriculum Evaluation 📊',
    message: 'End your week strong! Use our Diagnostic Exam Generator to quickly design and export a quick review quiz over topics processed this week.',
    category: 'Teaching Resources',
    type: 'resource',
    priority: 'medium',
    triggerDays: [5], // Friday
    link: '/'
  },
  {
    id: 'msg_weekend_insights',
    title: 'Weekend Strategic Lesson Planning 🌟',
    message: 'Beat Sunday night stress! Relax and use TeachSmartGH over the weekend to auto-schedule standard-based lesson indicators for the incoming school week.',
    category: 'Announcements',
    type: 'system',
    priority: 'low',
    triggerDays: [0, 6], // Saturday & Sunday
    link: '/'
  }
];

/**
 * Automate triggering messages for a user based on context, current week day, and subscription state.
 * Prevents duplicates by tracking locally and via Firestore query filters.
 */
export async function automateUserMessages(
  userId: string, 
  email?: string,
  isSubscriptionActive?: boolean,
  trialDaysLeft?: number,
  subscriptionStatus?: string
): Promise<void> {
  if (!userId) return;

  const today = new Date();
  const currentDay = today.getDay();

  // Load sent list from localStorage to prevent duplicate execution during the exact same session
  let sentList: string[] = [];
  try {
    const stored = localStorage.getItem(`${AUTOMATED_MESSAGES_KEY}_${userId}`);
    sentList = stored ? JSON.parse(stored) : [];
  } catch {}

  const isOnline = typeof navigator !== 'undefined' && navigator.onLine;

  // Dynamic subscription and motivation templates
  const subscriptionTemplates: AutomatedMessageDefinition[] = [];

  if (!isSubscriptionActive) {
    // User is not actively subscribed (expired, free, or in trial)

    // 1. Premium Upgrade: Unlock unlimited lesson planning
    subscriptionTemplates.push({
      id: 'sub_msg_unlock_unlimited',
      title: 'Go Premium: Unlock Unlimited Lesson Indicators 🇬🇭',
      message: 'Unleash absolute teaching productivity without caps! Subscribing to TeachSmartGH Premium unlocks endless high-speed daily/weekly lesson planning and NaCCA standard tracking blocks with zero data delays.',
      category: 'Premium Upgrade',
      type: 'system',
      priority: 'high',
      link: '/billing'
    });

    // 2. Premium Upgrade: Evaluation and marking guide rubrics
    subscriptionTemplates.push({
      id: 'sub_msg_marking_guide',
      title: 'Structured Marking Schemes & Rubrics 📝',
      message: 'Upgrade to Premium today to automatically attach comprehensive scoring guides, correct diagnostic answers, and evaluation grids for every single exam and quiz paper generated.',
      category: 'Premium Upgrade',
      type: 'resource',
      priority: 'medium',
      link: '/billing'
    });

    // 3. Premium Upgrade: High-Density layout printing
    subscriptionTemplates.push({
      id: 'sub_msg_pdf_branding',
      title: 'Professional Branded PDFs & Print Layouts 📥',
      message: 'Export your lesson notes and term schemes with sleek, clutter-free table headers and Catalyst Creative styles, fully optimized for printer ink and ready for curriculum inspection reviews.',
      category: 'Premium Upgrade',
      type: 'resource',
      priority: 'medium',
      link: '/billing'
    });

    // Time-sensitive reminders
    if (subscriptionStatus === 'trial') {
      if (trialDaysLeft !== undefined && trialDaysLeft <= 1) {
        subscriptionTemplates.push({
          id: 'sub_msg_trial_expiry_warning',
          title: '⚠️ Your 3-Day Trial Period Has Concluded or is Expiring!',
          message: 'Secure your offline curriculum library! Your trial period is about to end. Upgrade to Premium now to guarantee uninterrupted access to all standard-based lesson generators.',
          category: 'Account Status',
          type: 'system',
          priority: 'high',
          link: '/billing'
        });
      } else if (trialDaysLeft !== undefined) {
        subscriptionTemplates.push({
          id: 'sub_msg_trial_days_remaining',
          title: `Enjoying TeachSmartGH? ${trialDaysLeft} Days Left in Trial 🌟`,
          message: `You currently have ${trialDaysLeft} days remaining of full trial access. Save your upcoming term schemes now, and subscribe to Premium to unlock unlimited creations!`,
          category: 'Account Status',
          type: 'system',
          priority: 'medium',
          link: '/billing'
        });
      }
    } else {
      subscriptionTemplates.push({
        id: 'sub_msg_expired_locked',
        title: '🔒 Unlock your TeachSmartGH Full Power Cabinet',
        message: 'Your standard-access restrictions are now active. Activate your premium subscription today under Catalyst Creative to regain continuous high-speed generation of lessons, notes, and exams.',
        category: 'Account Status',
        type: 'system',
        priority: 'high',
        link: '/billing'
      });
    }
  } else {
    // Premium Active: Show active premium announcements & appreciations
    subscriptionTemplates.push({
      id: 'sub_msg_premium_active_thanks',
      title: 'Thank You for Supporting Ghana Education! 🇬🇭',
      message: 'Your active Premium membership powers us to maintain high-integrity curriculum cross-references, custom BSTEM labs, and offline-first storage tools for schools nationwide. Smarter tomorrow!',
      category: 'Announcements',
      type: 'system',
      priority: 'medium',
      link: '/profile'
    });

    subscriptionTemplates.push({
      id: 'sub_msg_premium_active_feature',
      title: 'Premium Enabled: Autonomic Offline Persistence 📶',
      message: 'Every lesson plan, note collection, term scheme, and exam you build is automatically compiled and cached in our secure IndexedDB environment. Access your complete cabinet anytime, anywhere, with zero internet data!',
      category: 'Training & Tutorials',
      type: 'resource',
      priority: 'high',
      link: '/'
    });
  }

  // Meger standard templates with dynamic subscription alerts
  const allTemplates = [...TEMPLATES, ...subscriptionTemplates];

  for (const template of allTemplates) {
    // 1. Skip if already sent in this session tracking
    const uniqueTriggerId = `${template.id}_${today.toDateString().replace(/\s/g, '_')}`;
    if (sentList.includes(template.id) || sentList.includes(uniqueTriggerId)) {
      continue;
    }

    // 2. Day of week filter check
    if (template.triggerDays && !template.triggerDays.includes(currentDay)) {
      continue;
    }

    // Attempt to verify if already in Firestore (to prevent duplicates on other devices)
    let alreadyExists = false;
    if (isOnline) {
      try {
        const qCheck = query(
          collection(db, 'notifications'),
          where('userId', '==', userId),
          where('category', '==', template.category),
          where('title', '==', template.title)
        );
        const snap = await getDocs(qCheck);
        if (!snap.empty) {
          alreadyExists = true;
        }
      } catch (err) {
        console.warn("Could not query firestore for duplicate alerts:", err);
      }
    } else {
      // Offline fallback: check IndexedDB
      try {
        const cachedAlerts = await getOffline('notes', userId); // or check generic offline storage
        alreadyExists = cachedAlerts.some((item: any) => item.title === template.title);
      } catch {}
    }

    if (alreadyExists) {
      // Mark as processed so we don't query again
      sentList.push(template.id);
      continue;
    }

    // 3. Construct automated notification
    const payload = {
      userId,
      title: template.title,
      message: template.message,
      category: template.category,
      type: template.type,
      priority: template.priority,
      link: template.link,
      read: false,
      pinned: template.priority === 'high',
      createdAt: isOnline ? serverTimestamp() : new Date().toISOString()
    };

    // Save
    if (isOnline) {
      try {
        await addDoc(collection(db, 'notifications'), {
          ...payload,
          createdAt: serverTimestamp()
        });
        
        // Also fire off a local notification to attract attention if supported
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(template.title, {
            body: template.message,
            icon: '/icon-192.png'
          });
        }
      } catch (err) {
        console.warn("Failed to write automated alert to Cloud firestore:", err);
      }
    } else {
      // Cache locally to notify user
      try {
        await saveOffline('notes', {
          ...payload,
          id: `automated_${template.id}_${Date.now()}`
        }, false);
      } catch {}
    }

    // Save tracking ID
    sentList.push(template.id);
    sentList.push(uniqueTriggerId);
  }

  // Persist tracking IDs
  try {
    localStorage.setItem(`${AUTOMATED_MESSAGES_KEY}_${userId}`, JSON.stringify(sentList));
  } catch {}
}
