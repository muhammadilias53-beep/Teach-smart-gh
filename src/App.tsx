/**
 * TeachSmart Ghana - AI-Powered Teaching Assistant
 * Version: 1.0.2 (High-Performance Code-Split Architecture)
 */
import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { Toaster } from 'react-hot-toast';
import AuthGuard from './components/auth/AuthGuard';
import { PWALifecycleTracker } from './components/PWALifecycleTracker';
import ScrollToTop from './components/common/ScrollToTop';
import RouteStateManager from './components/common/RouteStateManager';
import ConnectivityToast from './components/common/ConnectivityToast';
import { BrowserInstallPrompt } from './components/common/BrowserInstallPrompt';

// Dynamic route code-splitting for ultra-fast FCP & LCP (< 1.5s)
const Login = lazy(() => import('./components/auth/Login'));
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const LessonPlanGenerator = lazy(() => import('./components/generators/LessonPlanGenerator'));
const ExamGenerator = lazy(() => import('./components/generators/ExamGenerator'));
const NoteGenerator = lazy(() => import('./components/generators/NoteGenerator'));
const AssignmentGenerator = lazy(() => import('./components/generators/AssignmentGenerator'));
const ReportGenerator = lazy(() => import('./components/generators/ReportGenerator'));
const SchemeGenerator = lazy(() => import('./components/generators/SchemeGenerator'));
const Billing = lazy(() => import('./components/billing/Billing'));
const GeminiAssistant = lazy(() => import('./components/ai/GeminiAssistant'));
const AITutorPage = lazy(() => import('./components/ai/AITutorPage'));
const ProfileSettings = lazy(() => import('./components/profile/ProfileSettings'));
const BstemLabGuide = lazy(() => import('./components/packs/BstemLabGuide'));
const BstemMathGuide = lazy(() => import('./components/packs/BstemMathGuide'));
const BstemTechGuide = lazy(() => import('./components/packs/BstemTechGuide'));
const AdminCommandCenter = lazy(() => import('./components/admin/AdminCommandCenter'));
const OfflineVaultPage = lazy(() => import('./components/pages/OfflineVaultPage'));
const HeadteacherVettingHub = lazy(() => import('./components/vetting/HeadteacherVettingHub'));
const CurriculumDatabase = lazy(() => 
  import('./components/standards/CurriculumDatabase').then(m => ({ default: m.CurriculumDatabase }))
);

// Public pages
const About = lazy(() => import('./components/public/About').then(m => ({ default: m.About })));
const Features = lazy(() => import('./components/public/Features').then(m => ({ default: m.Features })));
const BlogResources = lazy(() => import('./components/public/BlogResources').then(m => ({ default: m.BlogResources })));
const PrivacyPolicy = lazy(() => import('./components/public/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const VerifyDocumentPage = lazy(() => import('./pages/VerifyDocumentPage'));

// Lightweight, instant Ghanaian-branded skeleton fallback for route transitions
const RouteLoadingFallback = () => (
  <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6 text-center">
    <div className="w-14 h-14 rounded-2xl bg-[#001c3d] flex items-center justify-center text-[#FCD116] shadow-xl border border-slate-700/30 mb-4 animate-pulse">
      <span className="text-2xl">🇬🇭</span>
    </div>
    <div className="w-7 h-7 border-3 border-[#001c3d] border-t-[#FCD116] rounded-full animate-spin mb-3" />
    <p className="text-[11px] font-black uppercase tracking-widest text-slate-700">TeachSmartGH</p>
    <p className="text-[9px] font-semibold text-slate-400 mt-1">Catalyst Creative &bull; NaCCA Aligned</p>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <SidebarProvider>
          <ScrollToTop />
          <RouteStateManager />
          <PWALifecycleTracker />
          <BrowserInstallPrompt />
          <Toaster position="top-right" />
          <ConnectivityToast />

          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />
              <Route path="/blog" element={<BlogResources />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/verify" element={<VerifyDocumentPage />} />
              
              <Route element={<AuthGuard />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/standards" element={<CurriculumDatabase />} />
                <Route path="/curriculum" element={<CurriculumDatabase />} />
                <Route path="/ai" element={<AITutorPage />} />
                <Route path="/lessons" element={<LessonPlanGenerator />} />
                <Route path="/vetting" element={<HeadteacherVettingHub />} />
                <Route path="/headteacher" element={<HeadteacherVettingHub />} />
                <Route path="/notes" element={<NoteGenerator />} />
                <Route path="/schemes" element={<SchemeGenerator />} />
                <Route path="/bstem-guide" element={<BstemLabGuide />} />
                <Route path="/bstem-math" element={<BstemMathGuide />} />
                <Route path="/bstem-tech" element={<BstemTechGuide />} />
                <Route path="/exams" element={<ExamGenerator />} />
                <Route path="/assignments" element={<AssignmentGenerator />} />
                <Route path="/reports" element={<ReportGenerator />} />
                <Route path="/billing" element={<Billing />} />
                <Route path="/offline-vault" element={<OfflineVaultPage />} />
                <Route path="/profile" element={<ProfileSettings />} />
                <Route path="/admin" element={<AdminCommandCenter />} />
              </Route>
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          
          <Suspense fallback={null}>
            <GeminiAssistant />
          </Suspense>
        </SidebarProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
