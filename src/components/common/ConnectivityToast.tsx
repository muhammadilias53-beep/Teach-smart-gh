import React, { useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { Wifi, WifiOff } from 'lucide-react';

export default function ConnectivityToast() {
  const isFirstMount = useRef(true);

  useEffect(() => {
    // If the browser starts offline, show a quiet warning
    if (!navigator.onLine) {
      toast.error('You are currently offline. Relying on local cached data. AI generation is disabled.', {
        id: 'connectivity-status',
        duration: 5000,
        icon: '⚠️'
      });
    }

    const handleOnline = () => {
      toast.success('Your connection is restored! Premium AI generation has been re-enabled.', {
        id: 'connectivity-status',
        duration: 4000,
        icon: '🟢'
      });
    };

    const handleOffline = () => {
      toast.error('Connection lost. You are now relying on cached data. AI generation is disabled.', {
        id: 'connectivity-status',
        duration: Infinity, // keep active until reconnected
        icon: '🔴'
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
