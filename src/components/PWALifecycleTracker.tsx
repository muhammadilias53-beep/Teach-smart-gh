import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const PWALifecycleTracker: React.FC = () => {
  const { user, profile } = useAuth();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // 1. Detect and Log Launch Mode (Standalone vs. Standard Tab)
    const logLaunch = async () => {
      // Use sessionStorage to ensure we only log once per tab/session launch
      const hasLoggedThisSession = sessionStorage.getItem('pwa_launch_logged');
      if (hasLoggedThisSession) return;

      const isStandalone = 
        window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');

      const displayMode = isStandalone ? 'standalone-pwa' : 'standard-browser-tab';
      
      const payload = {
        displayMode,
        referral: document.referrer || 'direct',
        uid: user?.uid || 'anonymous',
        email: user?.email || profile?.email || 'anonymous',
        language: window.navigator.language || 'en',
        userAgent: window.navigator.userAgent || 'unknown',
        timestamp: serverTimestamp()
      };

      try {
        // Direct Client-Side Firestore Write (authorized via user/security rules)
        await addDoc(collection(db, 'pwa_launches'), payload);
        console.log(`[PWA Tracker] Client-side launch event recorded: Mode: ${displayMode}`);
        sessionStorage.setItem('pwa_launch_logged', 'true');
      } catch (clientErr) {
        console.warn('[PWA Tracker] client-side write failed:', clientErr);
      }

      try {
        // Pings the backend to output a pretty terminal log safely (without DB write)
        await fetch('/api/analytics/pwa-launch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            displayMode,
            referral: document.referrer || 'direct',
            uid: user?.uid || 'anonymous',
            email: user?.email || profile?.email || 'anonymous',
            language: window.navigator.language || 'en'
          }),
        });
      } catch (err) {
        // Safe console message
        console.warn('[PWA Tracker] server-side analytics ping failed:', err);
      }
    };

    logLaunch();
  }, [user, profile]);

  useEffect(() => {
    // 2. Listen to installable prompt event (beforeinstallprompt)
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later if wanted
      console.log('[PWA Tracker] beforeinstallprompt event fired. App is installable!');
      setDeferredPrompt(e);

      // Log installability event if not already logged this session
      const hasLoggedInstallable = sessionStorage.getItem('pwa_installable_logged');
      if (!hasLoggedInstallable) {
        const payload = {
          displayMode: 'installable-prompt-shown',
          referral: document.referrer || 'direct',
          uid: user?.uid || 'anonymous',
          email: user?.email || 'anonymous',
          language: window.navigator.language || 'en',
          userAgent: window.navigator.userAgent || 'unknown',
          timestamp: serverTimestamp()
        };

        // Direct Client-Side Write
        addDoc(collection(db, 'pwa_launches'), payload)
          .then(() => {
            sessionStorage.setItem('pwa_installable_logged', 'true');
          })
          .catch(err => console.warn('[PWA Tracker] Error logging installable event to client-db:', err));

        // Server-side Ping
        fetch('/api/analytics/pwa-launch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            displayMode: 'installable-prompt-shown',
            referral: document.referrer || 'direct',
            uid: user?.uid || 'anonymous',
            email: user?.email || 'anonymous',
            language: window.navigator.language || 'en'
          }),
        }).catch(() => {});
      }
    };

    // 3. Listen to appinstalled event (fired after user installs)
    const handleAppInstalled = (e: Event) => {
      console.log('[PWA Tracker] App installed successfully by the user!');
      
      const payload = {
        displayMode: 'installed-success',
        referral: 'browser-install-button',
        uid: user?.uid || 'anonymous',
        email: user?.email || 'anonymous',
        language: window.navigator.language || 'en',
        userAgent: window.navigator.userAgent || 'unknown',
        timestamp: serverTimestamp()
      };

      // Direct Client-Side Write
      addDoc(collection(db, 'pwa_launches'), payload)
        .catch(err => console.warn('[PWA Tracker] Error logging installation success to client-db:', err));

      // Server-side Ping
      fetch('/api/analytics/pwa-launch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayMode: 'installed-success',
          referral: 'browser-install-button',
          uid: user?.uid || 'anonymous',
          email: user?.email || 'anonymous',
          language: window.navigator.language || 'en'
        }),
      }).catch(() => {});
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [user]);

  // Completely silent tracking background component
  return null;
};
