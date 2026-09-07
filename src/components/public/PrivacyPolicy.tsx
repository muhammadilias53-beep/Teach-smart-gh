import React, { useEffect } from 'react';
import { PublicLayout } from './PublicLayout';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  Sparkles, 
  AlertTriangle, 
  FileText, 
  Server, 
  Smartphone, 
  CreditCard, 
  HelpCircle, 
  CheckCircle2, 
  Scale, 
  Layers, 
  Cpu, 
  Clock, 
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Building
} from 'lucide-react';
import { Link } from 'react-router';

export const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    // Dynamic SEO document title and meta description
    const previousTitle = document.title;
    document.title = 'TeachSmartGH Privacy Policy | Catalyst Creative';

    const metaDescription = document.querySelector('meta[name="description"]');
    const previousDesc = metaDescription?.getAttribute('content') || '';
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Official Privacy Policy for TeachSmartGH, a Catalyst Creative educational platform designed for Ghanaian teachers. Learn how we collect, use, and protect your data in alignment with Ghana Data Protection Act (Act 843).'
      );
    }

    // Scroll to top upon navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      document.title = previousTitle;
      if (metaDescription && previousDesc) {
        metaDescription.setAttribute('content', previousDesc);
      }
    };
  }, []);

  const whatsappNumber = '0556231544';
  const whatsappUrl = `https://wa.me/233556231544?text=${encodeURIComponent('Hello TeachSmart Privacy Team, I have a question regarding data privacy and the TeachSmartGH platform:')}`;

  const sections = [
    { id: 'intro', title: 'A. Introduction & Brand Scope' },
    { id: 'info-provided', title: 'B. Information Users Provide' },
    { id: 'auth-providers', title: 'C. Google & Firebase Authentication' },
    { id: 'content-storage', title: 'D. Saved & Generated Educational Content' },
    { id: 'ai-processing', title: 'E. Artificial Intelligence (AI) Processing' },
    { id: 'use-of-info', title: 'F. How Information is Used' },
    { id: 'cookies-local', title: 'G. Cookies & Local Browser Technologies' },
    { id: 'advertising', title: 'H. Advertising & Google AdSense' },
    { id: 'tiers', title: 'I. Free and Premium User Experience' },
    { id: 'third-parties', title: 'J. Third-Party Service Providers' },
    { id: 'payment-info', title: 'K. Payment Information & Security' },
    { id: 'student-privacy', title: 'L. Student & Child Privacy (Educator Responsibility)' },
    { id: 'data-security', title: 'M. Technical & Organizational Data Security' },
    { id: 'retention-deletion', title: 'N. Data Retention & Account Deletion' },
    { id: 'ghana-context', title: 'O. Ghana Privacy Context & Legal Framework' },
    { id: 'policy-updates', title: 'P. Policy Revisions & Updates' },
    { id: 'contact', title: 'Q. Contact & Privacy Inquiries' },
  ];

  return (
    <PublicLayout>
      {/* Policy Hero Header */}
      <section className="bg-slate-900 text-white py-14 sm:py-20 relative overflow-hidden border-b border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-ghana-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 sm:px-8 relative z-10 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Official Legal Document
            </span>
            <span className="text-xs font-bold text-slate-400">
              TeachSmartGH • A Catalyst Creative Brand
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Privacy Policy
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-medium max-w-2xl leading-relaxed">
              Transparent disclosures regarding how TeachSmartGH collects, utilizes, stores, processes, and protects educator and instructional preparation information.
            </p>
          </div>

          {/* Metadata bar */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-ghana-gold" />
              <span><strong>Last Updated:</strong> September 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <Building size={15} className="text-emerald-400" />
              <span><strong>Publisher:</strong> Catalyst Creative, Accra, Ghana</span>
            </div>
            <div className="flex items-center gap-2">
              <Scale size={15} className="text-sky-400" />
              <span><strong>Reference:</strong> Data Protection Act, 2012 (Act 843)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 sm:py-16 max-w-5xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Sticky Table of Contents on Desktop */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-28 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <FileText size={16} className="text-emerald-deep" />
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-800">
                  Contents
                </h2>
              </div>
              <nav className="space-y-1.5 max-h-[70vh] overflow-y-auto pr-2 text-xs font-semibold">
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="block py-1.5 px-2 rounded-lg text-slate-600 hover:text-emerald-deep hover:bg-slate-50 transition-colors leading-snug truncate"
                  >
                    {sec.title}
                  </a>
                ))}
              </nav>
              <div className="pt-4 border-t border-slate-100">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-colors"
                >
                  <MessageCircle size={14} />
                  <span>Ask Privacy Question</span>
                </a>
              </div>
            </div>
          </aside>

          {/* Right Column: Policy Document Articles */}
          <article className="lg:col-span-8 space-y-12 text-slate-700 leading-relaxed text-sm sm:text-base">
            
            {/* Regulatory Non-Affiliation Notice */}
            <div className="p-5 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-black text-amber-950 uppercase tracking-wider">
                <AlertTriangle size={16} className="text-amber-700 shrink-0" />
                <span>Notice on Organizational Independence & Curriculum Alignment</span>
              </div>
              <p className="leading-relaxed">
                TeachSmartGH is an independent educational productivity platform developed and operated by <strong>Catalyst Creative</strong>. TeachSmartGH is <strong>not owned, operated, approved, endorsed, or officially issued</strong> by the Ghana Education Service (GES), the National Council for Curriculum and Assessment (NaCCA), the Ministry of Education, or the Government of Ghana. Where stated, TeachSmartGH’s instructional planning templates and indicator frameworks are independently designed to align with Ghana’s official National Pre-Tertiary Curriculum standards.
              </p>
            </div>

            {/* SECTION A */}
            <div id="intro" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 pb-2 border-b border-slate-200">
                <ShieldCheck size={22} className="text-emerald-deep" />
                A. Introduction & Brand Scope
              </h2>
              <p>
                Welcome to TeachSmartGH. This Privacy Policy outlines how <strong>TeachSmartGH</strong>, a product of <strong>Catalyst Creative</strong> (“we,” “us,” or “our”), collects, uses, stores, processes, and protects your information when you visit or interact with our web application, tools, and digital services.
              </p>
              <p>
                We are committed to respecting the privacy of teachers, headteachers, educational administrators, and visitors who utilize our platform to prepare and streamline curriculum-aligned instructional delivery across Ghana. By accessing or using TeachSmartGH, you acknowledge the data handling practices described in this policy.
              </p>
            </div>

            {/* SECTION B */}
            <div id="info-provided" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 pb-2 border-b border-slate-200">
                <FileText size={22} className="text-emerald-deep" />
                B. Information Users Provide
              </h2>
              <p>
                We only collect personal information that is reasonably necessary to provide you with high-quality, customized educational preparation tools. Depending on how you interact with TeachSmartGH, this may include:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>
                  <strong>Contact & Profile Identifiers:</strong> Your full name, email address, and profile details provided during account creation or profile setup.
                </li>
                <li>
                  <strong>Professional Teaching Context:</strong> School name, educational district, region, assigned class levels (e.g., Basic 7, KG 1), and primary subject specializations voluntarily configured by you in your teacher settings.
                </li>
                <li>
                  <strong>Direct Inquiries & Form Submissions:</strong> Information provided when filling out feedback forms, requesting assistance, or messaging our administrative support team.
                </li>
                <li>
                  <strong>Subscription & Billing Metadata:</strong> Transaction reference codes, plan tier identifiers (e.g., Termly Pass, Elite Pro), and active duration. As detailed below, we do not receive or store your payment card numbers or mobile money PINs.
                </li>
                <li>
                  <strong>User Preferences:</strong> Interface preferences, including dark/light display settings and sidebar navigation state.
                </li>
              </ul>
              <p className="text-xs text-slate-500 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
                <em>Product Boundary Note:</em> TeachSmartGH does not collect biometric data, government identification card numbers, or private financial credentials.
              </p>
            </div>

            {/* SECTION C */}
            <div id="auth-providers" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 pb-2 border-b border-slate-200">
                <Lock size={22} className="text-emerald-deep" />
                C. Google & Firebase Authentication
              </h2>
              <p>
                To provide swift and secure account access, TeachSmartGH supports authentication via <strong>Google Sign-In</strong> and <strong>Firebase Authentication</strong> (operated by Google LLC).
              </p>
              <p>
                When you sign in using Google or email credentials:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>
                  Google and Firebase securely process your login credentials and return an encrypted authentication token, along with your verified email address, display name, and avatar image.
                </li>
                <li>
                  <strong>TeachSmartGH never receives, sees, or stores your Google account password.</strong> All authentication handshakes occur securely within Google’s sandboxed identity infrastructure.
                </li>
                <li>
                  Firebase Authentication uses unique user identifiers (UIDs) to safeguard your account records and verify authorized access to saved teacher drafts.
                </li>
              </ul>
            </div>

            {/* SECTION D */}
            <div id="content-storage" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 pb-2 border-b border-slate-200">
                <Server size={22} className="text-emerald-deep" />
                D. Saved and Generated Educational Content
              </h2>
              <p>
                TeachSmartGH enables teachers to formulate, customize, and save a variety of instructional materials, including:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Termly Schemes of Learning (SoL)</li>
                <li>Weekly lesson plans and daily notebook pages</li>
                <li>Continuous assessment quizzes, examination papers, and marking schemes</li>
                <li>Differentiated student notes, revision worksheets, and remedial prompts</li>
                <li>Custom teacher reflections, remarks, and supervisor vetting logs</li>
              </ul>
              <div className="p-4 bg-emerald-50/70 border border-emerald-200/70 rounded-2xl text-xs space-y-2 text-emerald-950">
                <p className="font-bold uppercase tracking-wider text-emerald-800">
                  Clear Distinction: Local Storage vs. Cloud Storage
                </p>
                <p>
                  <strong>Depending on the TeachSmartGH feature being used, information may be stored locally in the user's browser/device, in TeachSmartGH's cloud infrastructure, or both:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1 text-emerald-900">
                  <li>
                    <strong>Device & Browser Storage (localStorage / IndexedDB):</strong> Temporary editor drafts, active session states, cached curriculum strands, and offline-accessible materials may be stored directly within your device’s local browser sandbox to allow high-speed, low-bandwidth access without recurring server requests.
                  </li>
                  <li>
                    <strong>Cloud Database (Firebase Firestore):</strong> When you actively save lesson plans, update your profile, or record terms agreements, this information is stored within our secure cloud database infrastructure to allow persistent synchronization across your phone, tablet, and desktop computer.
                  </li>
                </ul>
              </div>
            </div>

            {/* SECTION E */}
            <div id="ai-processing" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 pb-2 border-b border-slate-200">
                <Cpu size={22} className="text-emerald-deep" />
                E. Artificial Intelligence (AI) Processing & Responsible Input Rules
              </h2>
              <p>
                Certain core features of TeachSmartGH utilize artificial intelligence models (including Google Gemini API services via server-side application endpoints) to process pedagogical inputs, structure lesson phases, map curriculum exemplars, and draft educational items.
              </p>
              
              {/* Critical Warning Box */}
              <div className="p-5 bg-rose-50 border-2 border-rose-200 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-rose-900 font-black text-xs uppercase tracking-wider">
                  <AlertTriangle size={18} className="text-rose-600 shrink-0" />
                  <span>Mandatory Directive: Do Not Enter Sensitive Student Personal Data</span>
                </div>
                <p className="text-xs text-rose-950 leading-relaxed font-medium">
                  TeachSmartGH is designed exclusively for educational concepts, teaching methodologies, and instructional structuring. <strong>Users must never include unnecessary or sensitive personally identifiable information in AI prompts.</strong>
                </p>
                <p className="text-xs text-rose-900 font-semibold">
                  Specifically, you are strictly prohibited and discouraged from entering any student personal information into AI input fields, including:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-rose-950">
                  <div className="flex items-center gap-2 bg-white/80 p-2 rounded-lg border border-rose-200/80">
                    <span className="text-rose-600 font-black">✕</span>
                    <span>Student full legal names</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 p-2 rounded-lg border border-rose-200/80">
                    <span className="text-rose-600 font-black">✕</span>
                    <span>Home residential addresses</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 p-2 rounded-lg border border-rose-200/80">
                    <span className="text-rose-600 font-black">✕</span>
                    <span>Private phone numbers or parent emails</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 p-2 rounded-lg border border-rose-200/80">
                    <span className="text-rose-600 font-black">✕</span>
                    <span>Confidential medical or disability records</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                <strong>Educator Pedagogical Responsibility:</strong> AI models generate draft educational content based on prompt instructions. As an educator, you retain sole professional responsibility for reviewing, fact-checking, and validating all AI-generated educational materials to ensure pedagogical suitability, moral sensitivity, and alignment with approved curriculum requirements before introducing content to Ghanaian students.
              </p>
            </div>

            {/* SECTION F */}
            <div id="use-of-info" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 pb-2 border-b border-slate-200">
                <CheckCircle2 size={22} className="text-emerald-deep" />
                F. How Information is Used
              </h2>
              <p>
                We use the information we collect strictly for operational, pedagogical, and administrative purposes, including to:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  { title: 'Service Provision', desc: 'Operating generator suites, export engines, and curriculum viewers.' },
                  { title: 'User Authentication', desc: 'Securely verifying identity, session continuity, and account access.' },
                  { title: 'Content Persistence', desc: 'Saving and synchronizing teacher lesson plans and exam banks across sessions.' },
                  { title: 'Experience Personalization', desc: 'Pre-selecting teacher class level, subject domains, and localized settings.' },
                  { title: 'AI Generation Fulfillment', desc: 'Formulating NaCCA-aligned learning steps, core competencies, and rubrics.' },
                  { title: 'Account Administration', desc: 'Managing trial entitlements, active subscriptions, and support cases.' },
                  { title: 'Security & Abuse Prevention', desc: 'Guarding against automated scraping, bot attacks, and unlawful intrusion.' },
                  { title: 'Compliance & Legal Duty', desc: 'Satisfying applicable statutory, tax, or regulatory standards in Ghana.' }
                ].map((item, i) => (
                  <div key={i} className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-2xl space-y-1">
                    <h3 className="font-bold text-xs text-slate-900 uppercase tracking-tight">{item.title}</h3>
                    <p className="text-xs text-slate-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION G */}
            <div id="cookies-local" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 pb-2 border-b border-slate-200">
                <Smartphone size={22} className="text-emerald-deep" />
                G. Cookies and Local Browser Technologies
              </h2>
              <p>
                TeachSmartGH may use cookies, local storage (HTML5 localStorage), session storage, and IndexedDB technologies to deliver a dependable experience, particularly on mobile devices and low-bandwidth connections.
              </p>
              <p>
                These technologies serve specific operational functions:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>
                  <strong>Authentication State:</strong> Storing temporary tokens so you do not need to sign in every time you navigate between curriculum tools.
                </li>
                <li>
                  <strong>Draft Preservation:</strong> Automatically caching unsubmitted lesson plan forms in your browser so unexpected mobile network dropouts do not cause you to lose your work.
                </li>
                <li>
                  <strong>Functional Preferences:</strong> Remembering your collapsed sidebar state or active grade view.
                </li>
              </ul>
              <p className="text-xs text-slate-500">
                You can adjust your browser settings to restrict cookies or clear local storage at any time; however, clearing local storage may remove unsaved local drafts and require you to sign in again.
              </p>
            </div>

            {/* SECTION H */}
            <div id="advertising" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 pb-2 border-b border-slate-200">
                <Layers size={22} className="text-emerald-deep" />
                H. Advertising and Google AdSense
              </h2>
              <p>
                To maintain accessible, affordable instructional tools for Ghanaian educators, TeachSmartGH may introduce Google AdSense or other approved third-party advertising services on selected parts of the platform.
              </p>
              <p>
                Where advertising services are introduced or displayed:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>
                  Third-party advertising vendors, including Google, may use cookies, device identifiers, and similar technologies to serve advertisements based on a user’s prior visits to this website or other websites on the Internet.
                </li>
                <li>
                  These technologies enable third-party ad networks to serve advertisements, measure advertising effectiveness, combat click fraud, and present personalized or non-personalized advertisements where permitted by law and user browser settings.
                </li>
                <li>
                  Google's use of advertising cookies is governed by Google’s own Privacy Policy and advertising terms. Users may learn more about how Google manages data in its advertising products and opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-semibold inline-flex items-center gap-1">Google Ads Settings <ExternalLink size={12} /></a>.
                </li>
              </ul>
              <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                <em>Implementation Note:</em> TeachSmartGH may introduce Google AdSense or other approved advertising services on selected parts of the platform to support free access tiers.
              </p>
            </div>

            {/* SECTION I */}
            <div id="tiers" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 pb-2 border-b border-slate-200">
                <Sparkles size={22} className="text-emerald-deep" />
                I. Free and Premium User Experience
              </h2>
              <p>
                TeachSmartGH offers different service levels and access tiers for educators. Where third-party advertising is active:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>
                  Users accessing free or trial versions of TeachSmartGH may see non-intrusive banner or display advertisements that support infrastructure and AI generation expenses.
                </li>
                <li>
                  Users on eligible paid subscription tiers (such as active Termly, Annual, or School passes) enjoy a focused, ad-free instructional workspace with no third-party display advertisements.
                </li>
              </ul>
            </div>

            {/* SECTION J */}
            <div id="third-parties" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 pb-2 border-b border-slate-200">
                <Building size={22} className="text-emerald-deep" />
                J. Third-Party Service Providers
              </h2>
              <p>
                We do not sell, rent, or trade your personal data to third parties. We collaborate with trusted enterprise infrastructure providers to operate TeachSmartGH securely:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>
                  <strong>Google LLC / Google Cloud Platform:</strong> Cloud hosting, server-side infrastructure, and Google Gemini API services for educational content generation.
                </li>
                <li>
                  <strong>Firebase (Google LLC):</strong> Identity authentication, user management, and encrypted Firestore database persistence.
                </li>
                <li>
                  <strong>Paystack Payments Limited:</strong> Authorized payment gateway for processing Ghanaian Mobile Money (MTN MoMo, Telecel Cash, AT Money) and debit cards.
                </li>
              </ul>
              <p className="text-xs text-slate-500">
                These third-party service providers process data under their respective security and privacy agreements and do not own, control, or operate TeachSmartGH.
              </p>
            </div>

            {/* SECTION K */}
            <div id="payment-info" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 pb-2 border-b border-slate-200">
                <CreditCard size={22} className="text-emerald-deep" />
                K. Payment Information & Financial Security
              </h2>
              <p>
                When you subscribe to a paid tier or purchase educational token packs, all financial transactions are processed directly by our third-party payment partner, <strong>Paystack</strong>, which is fully certified under the Payment Card Industry Data Security Standard (PCI-DSS Level 1).
              </p>
              <p className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                <strong>Financial Data Safeguard:</strong> TeachSmartGH does not collect, receive, process, or store complete payment card credentials, CVV security codes, bank account logins, or Mobile Money PINs. All payment authentication steps occur within Paystack’s encrypted payment interface. TeachSmartGH only receives confirmation tokens and transaction verification references.
              </p>
            </div>

            {/* SECTION L */}
            <div id="student-privacy" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 pb-2 border-b border-slate-200">
                <ShieldCheck size={22} className="text-emerald-deep" />
                L. Student and Child Privacy (Educator Responsibility)
              </h2>
              <p>
                TeachSmartGH is an instructional planning tool designed strictly for adult educators, student teachers, curriculum coordinators, and headteachers. <strong>It is not intended for direct student account creation or unsupervised child use.</strong>
              </p>
              <p>
                In alignment with international child protection standards and Ghanaian classroom ethics:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>
                  Teachers must avoid uploading personally identifiable student records into the platform. When creating differentiated notes or assessment items, use generic descriptors (e.g., “Learner Group A,” “Fast Finishers”) rather than student personal names.
                </li>
                <li>
                  Educators remain solely responsible for upholding their respective school, district, and institutional privacy obligations when generating materials or printing class records.
                </li>
              </ul>
            </div>

            {/* SECTION M */}
            <div id="data-security" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 pb-2 border-b border-slate-200">
                <Lock size={22} className="text-emerald-deep" />
                M. Technical & Organizational Data Security
              </h2>
              <p>
                TeachSmartGH implements reasonable technical and organizational safeguards intended to protect your personal data and lesson documents against unauthorized access, loss, misuse, or alteration:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li>
                  <strong>Encryption in Transit:</strong> All data transmissions between your browser and our servers are encrypted using modern Transport Layer Security (TLS/HTTPS).
                </li>
                <li>
                  <strong>Secure Server-Side Proxies:</strong> All AI interactions and proprietary curriculum calls are managed via secure backend logic, preventing direct exposure of API credentials to browser clients.
                </li>
                <li>
                  <strong>Granular Access Rules:</strong> Firebase security rules restrict database access so that only authenticated account holders can access or modify their personal profile documents.
                </li>
              </ul>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                <strong>Security Reality Disclosure:</strong> While we apply industry-standard technical measures to safeguard your information, no system transmitted over the Internet or digital cloud repository can be guaranteed as 100% secure or immune from all potential threats. We encourage users to maintain secure device passwords and sign out when using shared computers.
              </div>
            </div>

            {/* SECTION N */}
            <div id="retention-deletion" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 pb-2 border-b border-slate-200">
                <Clock size={22} className="text-emerald-deep" />
                N. Data Retention and Account Deletion
              </h2>
              <p>
                We retain your personal information and saved instructional content for as long as your account remains active, or as necessary to provide you with continuous platform services, maintain valid subscription records, protect against fraudulent misuse, or satisfy legal obligations.
              </p>
              <p>
                <strong>User Deletion Rights:</strong> You have the right to request the deletion of your account and associated cloud-saved materials at any time. To request account deletion, you may contact our administrative team via our official support channels listed below. Upon verified request, we will delete or anonymize your cloud profile and associated saved resources, subject to any statutory recordkeeping duties.
              </p>
            </div>

            {/* SECTION O */}
            <div id="ghana-context" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 pb-2 border-b border-slate-200">
                <Scale size={22} className="text-emerald-deep" />
                O. Ghana Privacy Context & Legal Framework
              </h2>
              <p>
                TeachSmartGH operates in the Republic of Ghana. We endeavor to handle personal data in accordance with the core principles of Ghana's <strong>Data Protection Act, 2012 (Act 843)</strong>, including:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Processing personal data fairly, lawfully, and transparently.</li>
                <li>Collecting information for explicit, defined educational productivity purposes.</li>
                <li>Taking reasonable steps to ensure stored profile records are accurate and up to date.</li>
                <li>Applying appropriate technical safeguards to prevent unauthorized data access or loss.</li>
              </ul>
              <p className="text-xs text-slate-500">
                <em>Notice:</em> TeachSmartGH references Act 843 as our operating standard for data protection. We do not claim formal accreditation or statutory certification by the Data Protection Commission (DPC) unless formally registered.
              </p>
            </div>

            {/* SECTION P */}
            <div id="policy-updates" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 pb-2 border-b border-slate-200">
                <Layers size={22} className="text-emerald-deep" />
                P. Policy Revisions & Updates
              </h2>
              <p>
                We may periodically update this Privacy Policy as TeachSmartGH introduces new features, payment methods, advertising capabilities, or changes to relevant laws.
              </p>
              <p>
                When changes are made, the "Last Updated" date at the top of this policy will be refreshed. For significant changes that alter how your personal data is handled, we will provide appropriate notice through an in-app announcement, email, or a prominent dashboard banner. Continued use of TeachSmartGH after revisions are posted constitutes your acknowledgment of the updated policy.
              </p>
            </div>

            {/* SECTION Q */}
            <div id="contact" className="space-y-4 scroll-mt-28">
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 pb-2 border-b border-slate-200">
                <HelpCircle size={22} className="text-emerald-deep" />
                Q. Contact & Privacy Questions
              </h2>
              <p>
                If you have questions, inquiries, or requests regarding this Privacy Policy, your saved educational documents, or personal data deletion, please reach out through our official administrative channels:
              </p>
              
              <div className="bg-slate-50 border border-slate-200/90 rounded-3xl p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      Publisher & Brand
                    </span>
                    <p className="font-bold text-slate-900 text-sm">
                      Catalyst Creative (TeachSmartGH)
                    </p>
                    <p className="text-xs text-slate-500">Accra, Greater Accra Region, Ghana</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      WhatsApp Administrative Support
                    </span>
                    <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <span>+233 55 623 1544</span>
                      <span className="text-emerald-600 text-xs font-semibold">(Active)</span>
                    </p>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-bold underline mt-1"
                    >
                      <span>Message Admin on WhatsApp</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/80 text-xs text-slate-500 space-y-1">
                  <p>
                    <strong>Electronic Privacy Inquiries:</strong> Direct formal written correspondence to the TeachSmartGH Privacy Desk at <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[11px] text-slate-800">privacy@teachsmartgh.com</code> (or contact our designated platform administration at <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[11px] text-slate-800">muhammadilias53@gmail.com</code>).
                  </p>
                  <p className="text-[11px] text-slate-400 italic">
                    Note for Administrators: The formal privacy inbox address above is subject to administrator server setup and routing configuration.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Navigation Link Cluster */}
            <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                to="/features"
                className="text-xs font-bold text-slate-600 hover:text-emerald-deep flex items-center gap-1 transition-colors"
              >
                ← Explore Platform Features
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 bg-emerald-deep hover:bg-emerald-900 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-md shadow-emerald-950/15 flex items-center gap-2 transition-all"
              >
                <span>Launch Teacher Profile</span>
                <ArrowRight size={14} />
              </Link>
            </div>

          </article>
        </div>
      </section>
    </PublicLayout>
  );
};
export default PrivacyPolicy;
