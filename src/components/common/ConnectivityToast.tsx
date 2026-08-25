import React, { useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';

export default function ConnectivityToast() {
  const isFirstMount = useRef(true);

  useEffect(() => {
    // If the browser starts offline, show a quiet notice
    if (!navigator.onLine) {
      toast('🇬🇭 Offline Mode: Your cached lesson plans, schemes, and notes are available in your Offline Vault.', {
        id: 'connectivity-status',
        duration: 6000,
        icon: '📦'
      });
    }

    const handleOnline = () => {
      toast.success('Connection restored! All features & cloud synchronization active. 🇬🇭', {
        id: 'connectivity-status',
        duration: 4000,
        icon: '🟢'
      });
    };

    const handleOffline = () => {
      toast('Poor or lost connection: TeachSmartGH is in Offline Mode. All your cached documents remain accessible in your Vault.', {
        id: 'connectivity-status',
        duration: 7000,
        icon: '📦'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    isFirstMount.current = false;

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return null; // purely functional background listener
}
