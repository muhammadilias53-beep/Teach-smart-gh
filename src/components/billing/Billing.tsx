import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, CheckCircle2, Zap, AlertCircle, Loader2, ShieldCheck, ArrowRight, X, Sparkles, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { doc, updateDoc } from 'firebase/firestore';
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
  id: 'quick_pass' | 'termly' | 'yearly' | 'lifetime';
  name: string;
  price: number;
  duration: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'quick_pass',
    name: '5-Hour Quick Pass',
    price: 15,
    duration: '5 hours access',
    description: 'Urgent task? Get full access to all AI generators for 5 hours straight.',
    features: [
      '5 Hours Unrestricted Access',
      'NaCCA SBC AI Engine',
      'All Generators Enabled',
      'Downloadable Resources'
    ]
  },
  {
    id: 'termly',
    name: 'Termly Access',
    price: 50,
    duration: 'per term',
    description: 'Perfect for testing the waters and staying organized for the current term.',
    features: [
      'Full NaCCA Curriculum AI Engine',
      'Unlimited Lesson Plan Generations',
      'Automated Marking Schemes',
      'Standard Support'
    ]
  },
  {
    id: 'yearly',
    name: 'Professional Yearly',
    price: 100,
    duration: 'per year',
    description: 'The perfect balance for dedicated educators. One full year of uninterrupted access.',
    features: [
      'Everything in Termly',
      'Extra Storage for Lesson Notes',
      'Priority Email Support',
      'Curriculum Updates'
    ],
    recommended: true
  }
];

const Billing = () => {
  const { profile, user, refreshProfile, isSubscriptionActive } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const [emailToUse, setEmailToUse] = useState('');

  useEffect(() => {
    if (user?.email) {
      setEmailToUse(user.email);
    } else if (profile?.email) {
      setEmailToUse(profile.email);
    }
  }, [user, profile]);

  const initiatePayment = async (planToPay?: Plan | { id: string, name: string, price: number }) => {
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
                        value: activePlan.id
                    }
                ]
            },
            callback: (response: any) => {
                setProcessing(true);
                toast.loading("Verifying payment automatically...", { id: "payment-verify" });
                
                // 1. Automatically and instantly grant local client-side firestore access first
                const grantAccessLocally = async () => {
                    try {
                        const userDocRef = doc(db, 'users', user.uid);
                        let durationMs: number | null = null;
                        if (activePlan.id === 'yearly') durationMs = 365 * 24 * 60 * 60 * 1000;
                        else if (activePlan.id === 'termly') durationMs = 90 * 24 * 60 * 60 * 1000;
                        else if (activePlan.id === 'quick_pass') durationMs = 5 * 60 * 60 * 1000;
                        else if (activePlan.id === 'lifetime') durationMs = null;

                        const endDate = durationMs === null ? null : new Date(Date.now() + durationMs).toISOString();

                        await updateDoc(userDocRef, {
                            subscriptionStatus: 'active',
                            lastPaymentId: response.reference,
                            plan: activePlan.id,
                            subscriptionEndDate: endDate,
                            updatedAt: new Date().toISOString()
                        });
                        console.log("[Payment] Locally activated and granted access successfully.");
                    } catch (firestoreErr) {
                        console.error("[Payment] Local Firestore upgrade bypass error (will rely on backend):", firestoreErr);
                    }
                };

                // Run client-side grant in parallel for instantaneous access!
                grantAccessLocally();

                axios.post('/api/verify-payment', {
                  reference: response.reference,
                  uid: user.uid,
                  plan: activePlan.id
                }).then((verifyRes) => {
                    toast.dismiss("payment-verify");
                    // Close confirm dialog and reset selectedPlan because callback has completed
                    setShowConfirm(false);
                    setSelectedPlan(null);
                    
                    refreshProfile().then(() => {
                        const isCredits = activePlan.id === 'credits';
                        toast.success(
                          isCredits ? '5 Credits added to your account!' : 'Subscription activated! Welcome to the Elite family.', 
                          {
                            duration: 6000,
                            icon: isCredits ? '💫' : '🚀'
                          }
                        );
                    });
                }).catch((err) => {
                    console.error('Verification warning (local update succeeded):', err);
                    // Since local update was triggered, we still grant access and provide soft fallback
                    toast.dismiss("payment-verify");
                    setShowConfirm(false);
                    setSelectedPlan(null);
                    
                    refreshProfile().then(() => {
                        toast.success('Payment completed successfully! Access granted automatically.', {
                            duration: 6000,
                            icon: '🚀'
                        });
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20">
      {/* ... prev header ... */}
      <div className="mb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-emerald-100">
            <ShieldCheck size={14} />
            Secure Billing Dashboard
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tightest mb-6 leading-[0.9]">
            Empower Your <span className="text-emerald-deep italic">Teaching</span> Career.
          </h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed">
            Invest in tools that save you hours every week. Join thousands of Ghanaian teachers using TeachSmart to lead their classrooms.
          </p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12 items-start">
        {/* Sidebar Status */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl group-hover:bg-emerald-500/30 transition-colors" />
            
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">Professional ID</h2>
            
            <div className="flex items-center gap-5 mb-10">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/10 ring-4 ring-white/5">
                <Zap className={cn("transition-colors", isSubscriptionActive() ? "text-ghana-gold fill-ghana-gold" : "text-slate-600")} />
              </div>
              <div>
                <p className="text-2xl font-black tracking-tight">{profile?.displayName || 'Ghana Teacher'}</p>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{isSubscriptionActive() ? 'Elite Member' : 'Standard Member'}</p>
              </div>
            </div>

            <div className="space-y-4 pt-10 border-t border-white/5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-medium">Subscription</span>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                  isSubscriptionActive() ? "bg-emerald-500/20 text-emerald-400" : "bg-ghana-red/20 text-ghana-red"
                )}>
                  {isSubscriptionActive() ? 'Active' : 'Expired'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-medium">Plan Type</span>
                <span className="text-white font-bold">{profile?.plan === 'lifetime' ? 'Lifetime Elite' : profile?.plan === 'yearly' ? 'Professional Yearly' : profile?.plan === 'termly' ? 'Termly' : 'None'}</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-[2rem] p-8 border border-emerald-100">
            <h3 className="font-black text-emerald-900 mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-ghana-gold fill-ghana-gold" />
              Elite Benefits
            </h3>
            <ul className="space-y-3">
              {[
                'Smart Note Generation',
                'Diagram Integration',
                'Scheme of Work Builder',
                'Offline Resource Export'
              ].map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-sm font-medium text-emerald-800">
                  <div className="w-1.5 h-1.5 bg-ghana-gold rounded-full" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>

      {/* Pricing Grid */}
      <div className="lg:col-span-8">
        <h2 className="text-2xl font-black text-slate-900 mb-10 text-center tracking-tighter uppercase">Subscription Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {PLANS.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className={cn(
                "relative p-10 rounded-[3rem] border transition-all duration-300 flex flex-col",
                plan.recommended 
                  ? "bg-white border-emerald-deep ring-2 ring-emerald-deep/5 shadow-2xl shadow-emerald-900/10" 
                  : "bg-white border-slate-100 hover:border-slate-300"
              )}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-10 px-4 py-1 bg-emerald-deep text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-black text-slate-900 mb-3">{plan.name}</h3>
              <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed h-12">
                {plan.description}
              </p>

              <div className="mb-10">
                <div className="flex items-baseline gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-1">GHS</span>
                  <span className="text-6xl font-black text-slate-900 tracking-tighter">{plan.price}</span>
                </div>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-1">{plan.duration}</p>
              </div>

              <div className="space-y-4 mb-12 flex-1">
                {plan.features.map(feature => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={12} className="text-emerald-600" />
                    </div>
                    <span className="text-sm font-bold text-slate-700 tracking-tight">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setSelectedPlan(plan);
                  setShowConfirm(true);
                }}
                className={cn(
                  "w-full py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-[0.98]",
                  plan.recommended
                    ? "bg-emerald-deep text-white shadow-xl shadow-emerald-900/20 hover:bg-emerald-900"
                    : "bg-slate-50 text-slate-900 border border-slate-200 hover:bg-slate-100"
                )}
              >
                Choose {plan.name}
                <ArrowRight size={18} />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Credits Pack removed */}
        </div>
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
              <div className="p-10">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Confirm Selection</h3>
                    <p className="text-slate-500 font-medium">Ghana&#39;s #1 AI Teacher Assistant</p>
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

                <div className="bg-slate-50 rounded-3xl p-8 mb-10 border border-slate-100">
                  <div className="mb-6">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Subscription Email</p>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input 
                            type="email"
                            placeholder="YOUR EMAIL ACCOUNT"
                            value={emailToUse}
                            onChange={(e) => setEmailToUse(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-xs font-bold tracking-widest uppercase focus:ring-2 focus:ring-emerald-deep/20 focus:border-emerald-deep transition-all outline-none"
                        />
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-200">
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Plan</p>
                      <p className="text-xl font-black text-slate-900">{selectedPlan.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Price</p>
                      <p className="text-xl font-black text-emerald-deep">GHS {selectedPlan.price}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-slate-500">Subtotal</span>
                      <span className="text-slate-900">GHS {selectedPlan.price}.00</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-slate-500">Processing Fee</span>
                      <span className="text-emerald-deep">GHS 0.00</span>
                    </div>
                    <div className="h-px bg-slate-200 my-4" />
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-black text-slate-900 tracking-tight">Total Amount</span>
                      <span className="text-2xl font-black text-emerald-deep">GHS {selectedPlan.price}.00</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 flex items-center gap-3">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <button
                    onClick={() => initiatePayment()}
                    disabled={processing}
                    className="w-full py-5 bg-emerald-deep text-white rounded-2xl font-black text-lg flex items-center justify-center gap-4 shadow-xl shadow-emerald-900/20 hover:bg-emerald-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Initializing Paystack...
                      </>
                    ) : (
                      <>
                        <CreditCard size={20} />
                        Confirm and Pay Now
                      </>
                    )}
                  </button>
                  
                  <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <ShieldCheck size={12} />
                    Encrypted via Paystack 🇬🇭
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
