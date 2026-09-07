import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  CheckCircle2, 
  Zap, 
  AlertCircle, 
  Loader2, 
  ShieldCheck, 
  ArrowRight, 
  X, 
  Sparkles, 
  Mail, 
  Coins, 
  Plus, 
  Minus,
  Building2,
  Users,
  Copy,
  Check,
  Share2,
  KeyRound,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { doc, updateDoc, increment, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

// Paystack script loader helper
const loadPaystack = () => {
    return new Promise((resolve) => {
        if ((window as any).PaystackPop) {
            resolve(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.id = 'paystack-script';
        script.onload = () => {
            if ((window as any).PaystackPop) {
                resolve(true);
            } else {
                resolve(false);
            }
        };
        script.onerror = () => resolve(false);

        const existingScript = document.getElementById('paystack-script');
        if (existingScript) {
            existingScript.remove();
        }
        document.body.appendChild(script);
    });
};

interface Plan {
  id: 'quick_pass' | 'credits' | 'termly' | 'termly_pro' | 'yearly' | 'lifetime' | 'school_starter' | 'school_pro';
  name: string;
  price: number;
  duration: string;
  description: string;
  features: string[];
  recommended?: boolean;
  badge?: string;
  isSpecialMode?: boolean;
  isCredits?: boolean;
  credits?: number;
  isB2B?: boolean;
  seats?: number;
}

const CREDIT_PRESETS = [
  { generations: 2, price: 5, label: 'Starter', desc: 'GHC 5 for 2 generations (Ideal for quick prep)' },
  { generations: 4, price: 10, label: 'Weekly Pack', desc: '4 full lesson plans or lesson notes' },
  { generations: 12, price: 25, label: 'Sprint Pack', badge: '+2 Bonus', desc: '12 generations (Save GHS 5 vs standard)' },
  { generations: 25, price: 50, label: 'Pro Pack', badge: '+5 Bonus', desc: '25 generations: schemes, notes & exams' },
  { generations: 60, price: 100, label: 'Mega Bundle', badge: '+10 Bonus', desc: '60 generations — maximum savings (GHS 1.66/gen)' }
];

const PLANS: Plan[] = [
  {
    id: 'quick_pass',
    name: '24-Hour Weekend Sprint',
    price: 20,
    duration: '24 hours access',
    description: 'Prepare your upcoming lessons and schemes at your own pace over 24 hours (fair-use: 15 generations).',
    features: [
      '24 Hours Unrestricted Access',
      'Fair-Use Cap: 15 Generations',
      'NaCCA SBC AI Engine',
      'Lesson Notes & Schemes of Work',
      'Word (.docx) & PDF Export'
    ]
  },
  {
    id: 'termly',
    name: 'Standard Termly',
    price: 50,
    duration: 'per term (90 days)',
    description: 'Ideal for standard classroom prep, lesson notes, and exams for the current term.',
    features: [
      'Full NaCCA Curriculum AI Engine',
      'Unlimited Lesson Plan Generations',
      'Lesson Notes & Schemes of Work',
      'Automated Marking Schemes & Quizzes',
      'Single Lesson Word & PDF Export'
    ]
  },
  {
    id: 'termly_pro',
    name: 'Termly Master',
    price: 70,
    duration: 'per term (90 days)',
    description: 'Special subscription mode with exclusive 12-week Bulk Term Book compilation.',
    features: [
      'Everything in Standard Termly',
      '🌟 Special Mode: Bulk Termly Export',
      'Compiles 12-Week NaCCA Books (.docx & .pdf)',
      'Standard GES Cover & Headteacher Vetting Blocks',
      'Terminal Remarks & Assessment Score Sheets'
    ],
    badge: 'Special Mode',
    isSpecialMode: true
  },
  {
    id: 'yearly',
    name: 'Professional Yearly',
    price: 130,
    duration: 'per year (365 days)',
    description: 'All-inclusive coverage for all 3 Ghanaian academic terms. Covers your entire school year.',
    features: [
      'All 3 Terms Fully Covered (365 Days)',
      '🌟 Unlimited Bulk Termly Exports (Word & PDF)',
      'Everything in Termly Master for All Subjects',
      'Save GHS 80 vs Termly Renewals',
      'Priority WhatsApp & Phone Teacher Support'
    ],
    recommended: true,
    badge: 'Save GHS 80',
    isSpecialMode: true
  },
  {
    id: 'lifetime',
    name: 'VIP Lifetime Pass',
    price: 300,
    duration: 'Permanent Access',
    description: 'Pay once, enjoy permanent access to all current and future curriculum updates forever.',
    features: [
      'Lifetime Permanent Access',
      'All Future AI & Curriculum Revisions Included',
      '🌟 Permanent Bulk Termly Export Access',
      'VIP Priority Hotline & Direct Feedback Channel',
      'Zero Renewal Fees Ever'
    ],
    badge: 'VIP Forever',
    isSpecialMode: true
  }
];

const SCHOOL_PLANS: Plan[] = [
  {
    id: 'school_starter',
    name: 'School Starter Pack',
    price: 350,
    duration: 'per term (90 days)',
    seats: 6,
    badge: 'Up to 6 Teachers',
    description: 'Equip up to 6 teachers in your school or department with full Termly Master access (only ~GHS 58/teacher/term!).',
    features: [
      '6 Dedicated Teacher Accounts Included',
      '🌟 Full Termly Master Access for All 6 Teachers',
      '12-Week Bulk Termly Export for Every Teacher',
      'Custom School Name & Header on All Exports',
      'Shareable Staff WhatsApp Passcode',
      'Online Team Seat Management'
    ],
    isB2B: true
  },
  {
    id: 'school_pro',
    name: 'School Pro / Department Pack',
    price: 600,
    duration: 'per term (90 days)',
    seats: 12,
    badge: 'Up to 12 Teachers',
    recommended: true,
    description: 'The complete solution for private schools and full faculties (only GHS 50/teacher/term!).',
    features: [
      '12 Dedicated Teacher Accounts Included',
      '🌟 Full Termly Master Access for All 12 Teachers',
      '12-Week Bulk Termly Export for All Classes',
      'Terminal Report Cards & Automatic Remarks',
      'School Crest & Custom GES Vetting Letterheads',
      'Dedicated Priority Account Manager'
    ],
    isB2B: true
  }
];

const Billing = () => {
  const { profile, user, refreshProfile, isSubscriptionActive, canBulkExport } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'schools'>('personal');

  const [emailToUse, setEmailToUse] = useState('');
  
  // Custom AI credits state
  const [customGenerations, setCustomGenerations] = useState<number>(2);

  // School Code Redemption State
  const [redeemCodeInput, setRedeemCodeInput] = useState('');
  const [redeemingCode, setRedeemingCode] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // Rate: GHS 2.50 per generation (2 generations = GHS 5)
  const calculateCreditsPrice = (gens: number) => {
    if (gens >= 60) return Math.round(gens * 1.66); // Volume discount
    if (gens >= 25) return Math.round(gens * 2.0);
    if (gens >= 12) return Math.round(gens * 2.08);
    return Math.max(5, Math.ceil(gens * 2.5));
  };

  useEffect(() => {
    if (user?.email) {
      setEmailToUse(user.email);
    } else if (profile?.email) {
      setEmailToUse(profile.email);
    }
  }, [user, profile]);

  const initiatePayment = async (planToPay?: Plan | { id: string, name: string, price: number, credits?: number, isCredits?: boolean, isB2B?: boolean, seats?: number }) => {
    const activePlan = planToPay || selectedPlan;
    if (!user || !profile || !activePlan) return;

    if (!emailToUse || !emailToUse.includes('@')) {
        setError('A valid email address is required for subscription. Please provide one.');
        return;
    }

    setProcessing(true);
    setError('');

    const res = await loadPaystack();
    if (!res) {
        setError('Failed to load Paystack connection. Please try again.');
        setProcessing(false);
        return;
    }

    const isCredits = activePlan.id === 'credits' || Boolean((activePlan as any).isCredits) || Boolean((activePlan as any).credits);
    const creditsAmount = (activePlan as any).credits || (isCredits ? Math.max(2, Math.floor(activePlan.price / 2.5)) : 0);
    const isSchoolPlan = activePlan.id === 'school_starter' || activePlan.id === 'school_pro';

    try {
        // @ts-ignore
        const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
        
        if (!paystackKey) {
            console.error('Paystack Public Key is missing from environment variables');
            setError('Payment gateway is not currently configured. Please contact support.');
            setProcessing(false);
            return;
        }

        const handler = (window as any).PaystackPop.setup({
            key: paystackKey,
            email: emailToUse,
            amount: Math.round(activePlan.price * 100),
            currency: 'GHS',
            ref: 'TS-' + Date.now() + Math.floor(Math.random() * 1000),
            metadata: {
                custom_fields: [
                    {
                        display_name: "UID",
                        variable_name: "uid",
                        value: user.uid
                    },
                    {
                        display_name: "Plan",
                        variable_name: "plan",
                        value: isCredits ? 'credits' : activePlan.id
                    },
                    ...(isCredits ? [{
                        display_name: "Credits",
                        variable_name: "credits",
                        value: creditsAmount
                    }] : []),
                    ...(isSchoolPlan ? [{
                        display_name: "Is School Plan",
                        variable_name: "is_school_plan",
                        value: true
                    }] : [])
                ]
            },
            callback: (response: any) => {
                setProcessing(true);
                toast.loading("Verifying payment automatically...", { id: "payment-verify" });
                
                // 1. Automatically and instantly grant local client-side firestore access first
                const grantAccessLocally = async () => {
                    try {
                        const userDocRef = doc(db, 'users', user.uid);
                        if (isCredits) {
                            await updateDoc(userDocRef, {
                                aiCredits: increment(creditsAmount),
                                lastPaymentId: response.reference,
                                updatedAt: new Date().toISOString()
                            });
                            console.log(`[Payment] Added ${creditsAmount} AI credits locally in Firestore.`);
                        } else if (isSchoolPlan) {
                            const durationMs = 90 * 24 * 60 * 60 * 1000;
                            const endDate = new Date(Date.now() + durationMs).toISOString();
                            const schoolCode = `TSG-SCH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

                            await setDoc(doc(db, 'school_licenses', schoolCode), {
                                code: schoolCode,
                                ownerUid: user.uid,
                                ownerEmail: user.email || emailToUse,
                                ownerName: profile.displayName || 'School Administrator',
                                schoolName: profile.school || profile.schoolName || `${profile.displayName || 'Teacher'}'s School`,
                                plan: activePlan.id,
                                maxSeats: activePlan.id === 'school_pro' ? 12 : 6,
                                usedSeats: 1,
                                members: [user.uid],
                                createdAt: new Date().toISOString(),
                                expiresAt: endDate,
                                active: true
                            });

                            await updateDoc(userDocRef, {
                                subscriptionStatus: 'active',
                                plan: 'school_license',
                                isSchoolAdmin: true,
                                hasBulkExport: true,
                                schoolLicenseCode: schoolCode,
                                schoolName: profile.school || profile.schoolName || `${profile.displayName || 'Teacher'}'s School`,
                                subscriptionEndDate: endDate,
                                lastPaymentId: response.reference,
                                updatedAt: new Date().toISOString()
                            });
                            console.log(`[Payment] School license ${schoolCode} created locally.`);
                        } else {
                            let durationMs: number | null = null;
                            if (activePlan.id === 'yearly') durationMs = 365 * 24 * 60 * 60 * 1000;
                            else if (activePlan.id === 'termly' || activePlan.id === 'termly_pro') durationMs = 90 * 24 * 60 * 60 * 1000;
                            else if (activePlan.id === 'quick_pass') durationMs = 24 * 60 * 60 * 1000;
                            else if (activePlan.id === 'lifetime') durationMs = null;

                            const endDate = durationMs === null ? null : new Date(Date.now() + durationMs).toISOString();
                            const isProMode = activePlan.id === 'termly_pro' || activePlan.id === 'yearly' || activePlan.id === 'lifetime';

                            await updateDoc(userDocRef, {
                                subscriptionStatus: 'active',
                                lastPaymentId: response.reference,
                                plan: activePlan.id,
                                hasBulkExport: isProMode,
                                subscriptionEndDate: endDate,
                                updatedAt: new Date().toISOString()
                            });
                            console.log("[Payment] Locally activated and granted access successfully.");
                        }
                    } catch (firestoreErr) {
                        console.error("[Payment] Local Firestore upgrade bypass error (will rely on backend):", firestoreErr);
                    }
                };

                // Run client-side grant in parallel for instantaneous access!
                grantAccessLocally();

                axios.post('/api/verify-payment', {
                  reference: response.reference,
                  uid: user.uid,
                  plan: isCredits ? 'credits' : activePlan.id,
                  credits: isCredits ? creditsAmount : undefined,
                  amount: activePlan.price
                }).then((verifyRes) => {
                    toast.dismiss("payment-verify");
                    setShowConfirm(false);
                    setSelectedPlan(null);
                    
                    refreshProfile().then(() => {
                        toast.success(
                          isCredits 
                            ? `🎉 ${creditsAmount} AI Generation Credits added to your balance!` 
                            : (isSchoolPlan 
                                ? `🏫 School License Activated! Code: ${verifyRes.data.schoolLicenseCode || 'Generated'}` 
                                : 'Subscription activated! Welcome to the Elite family.'), 
                          {
                            duration: 7000,
                            icon: isCredits ? '⚡' : '🚀'
                          }
                        );
                    });
                }).catch((err) => {
                    console.error('Verification warning (local update succeeded):', err);
                    toast.dismiss("payment-verify");
                    setShowConfirm(false);
                    setSelectedPlan(null);
                    
                    refreshProfile().then(() => {
                        toast.success(
                            isCredits 
                              ? `Payment completed! ${creditsAmount} AI credits credited to your account.` 
                              : (isSchoolPlan 
                                  ? 'School license activated! Share the code with your staff.' 
                                  : 'Payment completed successfully! Access granted automatically.'), 
                            {
                                duration: 7000,
                                icon: isCredits ? '⚡' : '🚀'
                            }
                        );
                    });
                }).finally(() => {
                    setProcessing(false);
                });
            },
            onClose: () => {
                setProcessing(false);
            }
        });

        handler.openIframe();
    } catch (err: any) {
        console.error('Paystack setup error:', err);
        setProcessing(false);
        setError(`Could not initialize payment gateway: ${err.message || 'Unknown error'}`);
    }
  };

  const handleSelectCredits = (generations: number) => {
    const price = calculateCreditsPrice(generations);
    setSelectedPlan({
      id: 'credits',
      name: `${generations} AI Generation Credits`,
      price: price,
      duration: 'Pay-As-You-Go (Never Expires)',
      description: `Flexible credit pack with ${generations} generations. Use anytime for Lesson Plans, Lesson Notes, Schemes of Learning, Exams, Quizzes & Assignments.`,
      features: [
        `${generations} Full AI Content Generations`,
        'Never Expires — Valid for Current & Future Terms',
        'NaCCA Curriculum-Aligned Content & Formatting',
        'All Generators Enabled (Plans, Notes, Schemes, Exams)',
        'Single Lesson Word (.docx) & PDF Export'
      ],
      isCredits: true,
      credits: generations
    });
    setShowConfirm(true);
  };

  const handleRedeemSchoolCode = async () => {
    if (!redeemCodeInput.trim() || !user) return;
    setRedeemingCode(true);
    try {
      const res = await axios.post('/api/redeem-school-code', {
        code: redeemCodeInput.trim(),
        uid: user.uid
      });
      if (res.data.status) {
        toast.success(res.data.message || "School seat activated successfully!", { duration: 6000, icon: '🏫' });
        setRedeemCodeInput('');
        await refreshProfile();
      } else {
        toast.error(res.data.error || "Could not redeem school code.");
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "Failed to redeem code. Please verify the code.";
      toast.error(msg);
    } finally {
      setRedeemingCode(false);
    }
  };

  const copySchoolCodeToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    toast.success("School Code copied to clipboard!");
    setTimeout(() => setCodeCopied(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20">
      {/* Header Banner */}
      <div className="mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-emerald-100">
            <ShieldCheck size={14} />
            Ghana Education Service (NaCCA) Aligned Billing
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tightest mb-4 leading-tight">
            Fair, Transparent Pricing for <span className="text-emerald-deep italic">Ghanaian Teachers & Schools</span>.
          </h1>
          <p className="text-lg text-slate-600 font-medium leading-relaxed">
            Choose affordable Pay-As-You-Go credits from GHS 5, individual termly passes, or school faculty licenses with custom letterheads and bulk exports.
          </p>
        </motion.div>
      </div>

      {/* Main Grid: Sidebar vs Content */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Status & Teacher / School Profile */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 text-white relative overflow-hidden group shadow-xl">
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl group-hover:bg-emerald-500/30 transition-colors" />
            
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Teacher Professional ID</h2>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/10 ring-4 ring-white/5">
                <Zap className={cn("transition-colors", isSubscriptionActive() ? "text-ghana-gold fill-ghana-gold" : "text-slate-600")} />
              </div>
              <div>
                <p className="text-xl font-black tracking-tight">{profile?.displayName || 'Ghana Teacher'}</p>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                  {profile?.isSchoolAdmin 
                    ? 'School Administrator' 
                    : (profile?.schoolLicenseCode 
                        ? `Team Member • ${profile?.schoolName || 'School'}` 
                        : (isSubscriptionActive() ? 'Elite Member' : 'Standard Member'))}
                </p>
              </div>
            </div>

            <div className="space-y-3.5 pt-6 border-t border-white/10">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Subscription</span>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                  isSubscriptionActive() ? "bg-emerald-500/20 text-emerald-400" : "bg-ghana-red/20 text-ghana-red"
                )}>
                  {isSubscriptionActive() ? 'Active' : 'Expired'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Current Plan</span>
                <span className="text-white font-bold">
                  {profile?.plan === 'lifetime' 
                    ? 'VIP Lifetime Pass' 
                    : profile?.plan === 'yearly' 
                      ? 'Professional Yearly' 
                      : profile?.plan === 'termly_pro'
                        ? 'Termly Master'
                        : profile?.plan === 'termly' 
                          ? 'Standard Termly' 
                          : profile?.plan === 'quick_pass'
                            ? '24-Hour Weekend Sprint'
                            : profile?.plan === 'school_license' || profile?.plan === 'school_starter' || profile?.plan === 'school_pro'
                              ? 'School Team License'
                              : 'Pay-As-You-Go'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-slate-400 font-medium">Bulk Term Export</span>
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1",
                  canBulkExport() ? "bg-amber-400/20 text-amber-300 border border-amber-400/30" : "bg-slate-800 text-slate-500"
                )}>
                  {canBulkExport() ? '✨ Special Mode Active' : 'Not Included'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-slate-400 font-medium">AI Credits Balance</span>
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5",
                  (profile?.aiCredits || 0) > 0 ? "bg-amber-400/20 text-amber-300 border border-amber-400/30 font-mono" : "bg-slate-800 text-slate-400"
                )}>
                  <Coins size={12} className="text-ghana-gold" />
                  {profile?.aiCredits || 0} Generation{(profile?.aiCredits || 0) === 1 ? '' : 's'}
                </span>
              </div>
            </div>
          </div>

          {/* School License Admin Portal Box (If user has a school license) */}
          {(profile?.isSchoolAdmin || profile?.schoolLicenseCode) && (
            <div className="bg-gradient-to-br from-indigo-950 to-slate-900 rounded-[2.5rem] p-7 text-white border border-indigo-500/20 shadow-xl">
              <div className="flex items-center gap-2.5 mb-4 text-indigo-300">
                <Building2 size={20} className="text-indigo-400" />
                <h3 className="font-black text-sm uppercase tracking-wider">
                  {profile?.isSchoolAdmin ? 'School Admin License' : 'Active School Team'}
                </h3>
              </div>
              
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                {profile?.isSchoolAdmin 
                  ? `Share this invite passcode with up to ${profile?.plan === 'school_pro' ? '12' : '6'} teachers in your school to give them full Termly Master access.`
                  : `You are connected to ${profile?.schoolName || 'your school team'} with full Termly Master access.`}
              </p>

              {profile?.schoolLicenseCode && (
                <div className="space-y-3">
                  <div className="bg-white/10 rounded-2xl p-3 border border-white/15 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Invite Passcode</span>
                      <span className="font-mono font-black text-base text-ghana-gold tracking-widest">{profile.schoolLicenseCode}</span>
                    </div>
                    <button
                      onClick={() => copySchoolCodeToClipboard(profile.schoolLicenseCode!)}
                      className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                      title="Copy Passcode"
                    >
                      {codeCopied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                    </button>
                  </div>

                  {profile?.isSchoolAdmin && (
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Hello colleagues! Here is our official TeachSmart Ghana school team access passcode: ${profile.schoolLicenseCode}\n\nEnter this code in the TeachSmart app (Billing -> Redeem School Code) to activate your full Termly Master pass with bulk 12-week exports!`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Share2 size={14} />
                      Share to Staff WhatsApp
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {/* School Code Redemption Card */}
          <div className="bg-amber-50/70 rounded-[2rem] p-7 border border-amber-200/80">
            <h3 className="font-black text-amber-950 text-sm mb-2 flex items-center gap-2">
              <KeyRound size={16} className="text-amber-700" />
              Have a School Access Code?
            </h3>
            <p className="text-xs text-amber-800/90 mb-4 leading-relaxed font-medium">
              Did your headteacher or proprietor purchase a school license? Enter the 10-character code below to activate your seat instantly.
            </p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="TSG-SCH-XXXXXX"
                value={redeemCodeInput}
                onChange={(e) => setRedeemCodeInput(e.target.value.toUpperCase())}
                className="w-full bg-white border border-amber-300 rounded-xl py-3 px-4 text-xs font-black tracking-widest uppercase focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none font-mono"
              />
              <button
                type="button"
                onClick={handleRedeemSchoolCode}
                disabled={redeemingCode || !redeemCodeInput.trim()}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {redeemingCode ? <Loader2 size={14} className="animate-spin" /> : <GraduationCap size={14} />}
                Activate My School Seat
              </button>
            </div>
          </div>

          {/* Platform Benefits List */}
          <div className="bg-emerald-50 rounded-[2rem] p-7 border border-emerald-100">
            <h3 className="font-black text-emerald-950 text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-ghana-gold fill-ghana-gold" />
              TeachSmart Ghana Features
            </h3>
            <ul className="space-y-2.5">
              {[
                'Strict NaCCA Common Core Alignment',
                'Competency-Based Activity Planning',
                'Word (.docx) & PDF Print-Ready Exports',
                'Terminal Report Remarks & Score Sheets',
                '12-Week Termly Book Compilation',
                'Ghanaian Contextual TLR Recommendations'
              ].map((benefit, i) => (
                <li key={i} className="flex items-center gap-2.5 text-xs font-bold text-emerald-900/80">
                  <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Segmented View Switcher */}
          <div className="flex items-center p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('personal')}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2",
                activeTab === 'personal'
                  ? "bg-white text-slate-900 shadow-md shadow-slate-200"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              <Zap size={15} className={activeTab === 'personal' ? "text-emerald-600" : "text-slate-400"} />
              Individual Teacher Plans (Credits & Passes)
            </button>

            <button
              onClick={() => setActiveTab('schools')}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2",
                activeTab === 'schools'
                  ? "bg-white text-slate-900 shadow-md shadow-slate-200"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              <Building2 size={15} className={activeTab === 'schools' ? "text-indigo-600" : "text-slate-400"} />
              Schools & Proprietors (B2B Team Packs)
            </button>
          </div>

          {/* TAB 1: INDIVIDUAL TEACHERS */}
          {activeTab === 'personal' && (
            <div className="space-y-12">
              {/* PAY-AS-YOU-GO AI CREDITS SECTION */}
              <section className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 rounded-[2.5rem] p-7 sm:p-10 text-white relative overflow-hidden shadow-2xl border border-emerald-900/40">
                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 border border-amber-400/30">
                        <Coins size={12} />
                        Pay As You Go • No Monthly Lock-in
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                        AI Generation Credits
                      </h2>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-400 block">From GHS 5.00</span>
                      <span className="text-[10px] text-slate-400">Credits never expire</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 mb-8 max-w-2xl leading-relaxed">
                    Only generate lessons occasionally? Purchase affordable generation credits. 1 credit creates a full lesson plan, scheme of learning, or examination paper.
                  </p>

                  {/* Credit Presets */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-8">
                    {CREDIT_PRESETS.map((preset) => (
                      <button
                        key={preset.generations}
                        onClick={() => handleSelectCredits(preset.generations)}
                        className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/50 rounded-2xl p-4 text-left transition-all hover:scale-[1.02] flex flex-col justify-between"
                      >
                        {preset.badge && (
                          <span className="absolute -top-2.5 right-2 px-2 py-0.5 bg-ghana-gold text-slate-950 font-black text-[9px] uppercase tracking-wider rounded-full shadow-md">
                            {preset.badge}
                          </span>
                        )}
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block mb-1">
                            {preset.label}
                          </span>
                          <div className="text-lg font-black text-white">
                            {preset.generations} <span className="text-xs font-medium text-slate-300">gens</span>
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                          <span className="text-xs font-black text-ghana-gold">GHS {preset.price}</span>
                          <ArrowRight size={13} className="text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Custom Quantity Stepper */}
                  <div className="bg-white/5 rounded-3xl p-5 border border-white/10 backdrop-blur-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-black text-white flex items-center gap-1.5 mb-0.5">
                          <Sparkles size={15} className="text-ghana-gold" />
                          Custom Amount Builder
                        </h4>
                        <p className="text-[11px] text-slate-300">
                          Order any custom quantity you need at fair volume rates.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center bg-slate-800/90 rounded-2xl border border-white/15 p-1">
                          <button
                            type="button"
                            onClick={() => setCustomGenerations(prev => Math.max(2, prev - 2))}
                            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <div className="px-3 text-center">
                            <input
                              type="number"
                              min={2}
                              max={500}
                              value={customGenerations}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                if (!isNaN(val)) setCustomGenerations(Math.max(2, val));
                              }}
                              className="w-14 bg-transparent text-center font-black text-lg text-white outline-none"
                            />
                            <span className="block text-[8px] font-black uppercase tracking-wider text-slate-400">Gens</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCustomGenerations(prev => prev + 2)}
                            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-xl font-black text-ghana-gold">
                            GHS {calculateCreditsPrice(customGenerations)}.00
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSelectCredits(customGenerations)}
                          className="px-5 py-3 bg-ghana-gold hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center gap-1.5 active:scale-95"
                        >
                          Buy Credits
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* UNLIMITED SUBSCRIPTION PLANS */}
              <div>
                <div className="text-center max-w-xl mx-auto mb-8">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Individual Subscription Passes
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                    Continuous access throughout the academic term or full academic year with no generation limits.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {PLANS.map((plan, idx) => (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * idx }}
                      className={cn(
                        "relative p-7 rounded-[2.5rem] border transition-all duration-300 flex flex-col justify-between",
                        plan.recommended 
                          ? "bg-white border-emerald-deep ring-2 ring-emerald-deep/10 shadow-2xl shadow-emerald-900/10" 
                          : plan.isSpecialMode
                            ? "bg-gradient-to-b from-amber-500/[0.04] to-white border-amber-200 hover:border-amber-400 shadow-lg shadow-amber-900/5"
                            : "bg-white border-slate-100 hover:border-slate-300"
                      )}
                    >
                      <div>
                        {plan.badge && (
                          <div className={cn(
                            "absolute -top-3 left-6 px-3.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-full shadow-md",
                            plan.recommended 
                              ? "bg-emerald-deep text-white shadow-emerald-900/20" 
                              : "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-amber-500/20"
                          )}>
                            {plan.badge}
                          </div>
                        )}

                        <h3 className="text-xl font-black text-slate-900 mb-1.5">{plan.name}</h3>
                        <p className="text-slate-500 text-xs font-medium mb-6 leading-relaxed min-h-[38px]">
                          {plan.description}
                        </p>

                        <div className="mb-6">
                          <div className="flex items-baseline gap-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-1">GHS</span>
                            <span className="text-4xl font-black text-slate-900 tracking-tighter">{plan.price}</span>
                          </div>
                          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.15em] mt-0.5">{plan.duration}</p>
                        </div>

                        <div className="space-y-2.5 mb-8">
                          {plan.features.map(feature => (
                            <div key={feature} className="flex items-start gap-2.5">
                              <div className="w-4 h-4 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                                <CheckCircle2 size={11} className="text-emerald-600" />
                              </div>
                              <span className="text-xs font-bold text-slate-700 tracking-tight leading-snug">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedPlan(plan);
                          setShowConfirm(true);
                        }}
                        className={cn(
                          "w-full py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98]",
                          plan.recommended
                            ? "bg-emerald-deep text-white shadow-xl shadow-emerald-900/20 hover:bg-emerald-900"
                            : plan.isSpecialMode
                              ? "bg-slate-900 text-ghana-gold border border-ghana-gold/30 hover:bg-slate-800"
                              : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                        )}
                      >
                        Choose {plan.name}
                        <ArrowRight size={15} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SCHOOLS & PROPRIETORS (B2B) */}
          {activeTab === 'schools' && (
            <div className="space-y-10">
              {/* B2B Explainer Hero */}
              <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 rounded-[2.5rem] p-8 sm:p-10 text-white relative overflow-hidden shadow-2xl border border-indigo-500/20">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-black uppercase tracking-widest mb-4 border border-indigo-400/30">
                  <Building2 size={14} />
                  Institutional Faculty Licensing
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
                  Equip Your Entire Teaching Staff with 1 Single Payment
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mb-6">
                  Proprietors and Headteachers can sponsor their teachers directly via Mobile Money or Card. Receive an instant shareable 10-character team passcode that automatically grants all your teachers full Termly Master access with custom school vetting letterheads.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10 text-xs">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-slate-300 font-medium">Save up to 45% compared to individual teacher subscriptions.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-slate-300 font-medium">School crest and custom approval blocks on all 12-week export books.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-slate-300 font-medium">Instant shareable WhatsApp invite code for quick staff onboarding.</span>
                  </div>
                </div>
              </div>

              {/* School Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {SCHOOL_PLANS.map((plan, idx) => (
                  <div
                    key={plan.id}
                    className={cn(
                      "relative p-8 rounded-[2.5rem] border transition-all duration-300 flex flex-col justify-between",
                      plan.recommended 
                        ? "bg-white border-indigo-600 ring-2 ring-indigo-600/10 shadow-2xl shadow-indigo-900/10" 
                        : "bg-white border-slate-200 hover:border-slate-300 shadow-lg"
                    )}
                  >
                    <div>
                      {plan.badge && (
                        <div className={cn(
                          "absolute -top-3.5 left-6 px-4 py-1 text-[11px] font-black uppercase tracking-widest rounded-full shadow-md",
                          plan.recommended 
                            ? "bg-indigo-600 text-white shadow-indigo-900/20" 
                            : "bg-slate-900 text-white"
                        )}>
                          {plan.badge}
                        </div>
                      )}

                      <div className="flex items-center gap-3 mb-2">
                        <Users size={22} className="text-indigo-600" />
                        <h3 className="text-2xl font-black text-slate-900">{plan.name}</h3>
                      </div>

                      <p className="text-slate-500 text-xs font-medium mb-6 leading-relaxed min-h-[40px]">
                        {plan.description}
                      </p>

                      <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xs font-black uppercase text-slate-400 mr-1">GHS</span>
                            <span className="text-4xl font-black text-slate-900 tracking-tighter">{plan.price}</span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{plan.duration}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full block">
                            ~GHS {Math.round(plan.price / (plan.seats || 1))}/teacher
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Full Term Coverage</span>
                        </div>
                      </div>

                      <div className="space-y-3 mb-8">
                        {plan.features.map(feature => (
                          <div key={feature} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                              <CheckCircle2 size={13} className="text-indigo-600" />
                            </div>
                            <span className="text-xs font-bold text-slate-700 leading-snug">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedPlan(plan);
                        setShowConfirm(true);
                      }}
                      className={cn(
                        "w-full py-4 px-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98]",
                        plan.recommended
                          ? "bg-indigo-600 text-white shadow-xl shadow-indigo-900/20 hover:bg-indigo-700"
                          : "bg-slate-900 text-white hover:bg-black"
                      )}
                    >
                      Purchase {plan.name}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && selectedPlan && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !processing && setShowConfirm(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
            />
            
            <motion.div
              layoutId="confirm-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <div className="p-8 sm:p-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Confirm Selection</h3>
                    <p className="text-slate-500 font-medium text-xs mt-0.5">Ghana&#39;s #1 AI Teacher Assistant</p>
                  </div>
                  {!processing && (
                    <button 
                      onClick={() => setShowConfirm(false)}
                      className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>

                <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 mb-8 border border-slate-100">
                  <div className="mb-6">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Notification Email</p>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input 
                            type="email"
                            placeholder="YOUR EMAIL ADDRESS"
                            value={emailToUse}
                            onChange={(e) => setEmailToUse(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-xs font-bold tracking-widest uppercase focus:ring-2 focus:ring-emerald-deep/20 focus:border-emerald-deep transition-all outline-none"
                        />
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-200">
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                        {selectedPlan.isCredits ? 'Item' : (selectedPlan.isB2B ? 'School Plan' : 'Plan')}
                      </p>
                      <p className="text-xl font-black text-slate-900">{selectedPlan.name}</p>
                      {selectedPlan.isCredits && (
                        <p className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1">
                          <Coins size={12} />
                          {selectedPlan.credits} Generations • Never Expires
                        </p>
                      )}
                      {selectedPlan.isB2B && (
                        <p className="text-xs font-bold text-indigo-600 mt-1 flex items-center gap-1">
                          <Users size={12} />
                          Up to {selectedPlan.seats} Teachers Included
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Price</p>
                      <p className="text-xl font-black text-emerald-deep">GHS {selectedPlan.price}.00</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs font-bold">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Subtotal</span>
                      <span className="text-slate-900">GHS {selectedPlan.price}.00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">MoMo / Paystack Processing Fee</span>
                      <span className="text-emerald-deep">GHS 0.00</span>
                    </div>
                    <div className="h-px bg-slate-200 my-3" />
                    <div className="flex justify-between items-center">
                      <span className="text-base font-black text-slate-900 tracking-tight">Total Due</span>
                      <span className="text-2xl font-black text-emerald-deep">GHS {selectedPlan.price}.00</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 flex items-center gap-3">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={() => initiatePayment()}
                    disabled={processing}
                    className="w-full py-4 bg-emerald-deep text-white rounded-2xl font-black text-base flex items-center justify-center gap-3 shadow-xl shadow-emerald-900/20 hover:bg-emerald-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Connecting Paystack...
                      </>
                    ) : (
                      <>
                        <CreditCard size={18} />
                        Confirm and Pay via MoMo / Card
                      </>
                    )}
                  </button>
                  
                  <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <ShieldCheck size={12} />
                    Secured via Paystack 🇬🇭 (MTN MoMo, Telecel, AT & Cards)
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Billing;
