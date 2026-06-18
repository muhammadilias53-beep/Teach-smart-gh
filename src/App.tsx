/**
 * TeachSmart Ghana - AI-Powered Teaching Assistant
 * Version: 1.0.1
 */
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AuthGuard from './components/auth/AuthGuard';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import LessonPlanGenerator from './components/generators/LessonPlanGenerator';
import ExamGenerator from './components/generators/ExamGenerator';
import NoteGenerator from './components/generators/NoteGenerator';
import Billing from './components/billing/Billing';
import GeminiAssistant from './components/ai/GeminiAssistant';
import AITutorPage from './components/ai/AITutorPage';
import ContentLibrary from './components/library/ContentLibrary';
import SchemeGenerator from './components/generators/SchemeGenerator';
import ProfileSettings from './components/profile/ProfileSettings';
import ResourcePacks from './components/packs/ResourcePacks';
import BstemLabGuide from './components/packs/BstemLabGuide';
import BstemMathGuide from './components/packs/BstemMathGuide';
import BstemTechGuide from './components/packs/BstemTechGuide';
import AdminCommandCenter from './components/admin/AdminCommandCenter';
import { PWALifecycleTracker } from './components/PWALifecycleTracker';
import ScrollToTop from './components/common/ScrollToTop';

// Public pages
import { About } from './components/public/About';
import { Features } from './components/public/Features';
import { BlogResources } from './components/public/BlogResources';

// Generic placeholder for other features
const Placeholder = ({ name }: { name: string }) => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center">
            <span className="text-4xl">🚀</span>
        </div>
        <h2 className="text-2xl font-bold">{name} coming soon!</h2>
        <p className="text-gray-500 max-w-sm text-center">We are currently fine-tuning the AI for this feature to ensure perfect NaCCA alignment.</p>
    </div>
);

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <PWALifecycleTracker />
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/blog" element={<BlogResources />} />
          
          <Route element={<AuthGuard />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ai" element={<AITutorPage />} />
            <Route path="/lessons" element={<LessonPlanGenerator />} />
            <Route path="/notes" element={<NoteGenerator />} />
            <Route path="/schemes" element={<SchemeGenerator />} />
            <Route path="/library" element={<ContentLibrary />} />
            <Route path="/packs" element={<ResourcePacks />} />
            <Route path="/bstem-guide" element={<BstemLabGuide />} />
            <Route path="/bstem-math" element={<BstemMathGuide />} />
            <Route path="/bstem-tech" element={<BstemTechGuide />} />
            <Route path="/exams" element={<ExamGenerator />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/profile" element={<ProfileSettings />} />
            <Route path="/admin" element={<AdminCommandCenter />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        <GeminiAssistant />
      </AuthProvider>
    </Router>
  );
}

export default App;
