import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';

const VALID_PROTECTED_ROUTES = [
  '/',
  '/lessons',
  '/exams',
  '/schemes',
  '/notes',
  '/assignments',
  '/reports',
  '/standards',
  '/curriculum',
  '/ai',
  '/bstem-guide',
  '/bstem-math',
  '/bstem-tech',
  '/billing',
  '/profile',
  '/admin',
];

const PUBLIC_ROUTES = ['/login', '/about', '/features', '/blog'];

/**
 * RouteStateManager
 * 1. Ensures any fresh login lands on the Dashboard ('/').
 * 2. Seamlessly restores returning users who leave and come back to where they left off.
 * 3. Preserves the exact active route when refreshing the page.
 */
export default function RouteStateManager() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const hasRestoredSessionRef = useRef(false);

  // 1. Session Restoration for Returning Users who leave and come back
  useEffect(() => {
    if (loading) return;

    if (user && !hasRestoredSessionRef.current) {
      hasRestoredSessionRef.current = true;

      const isFreshLogin = sessionStorage.getItem('teachsmart_fresh_login') === 'true';
      
      if (isFreshLogin) {
        // User just logged in via the login screen. Always start fresh on the Dashboard.
        try {
          sessionStorage.removeItem('teachsmart_fresh_login');
          localStorage.setItem('teachsmart_last_working_route', '/');
        } catch (_) {}
        if (location.pathname !== '/') {
          navigate('/', { replace: true });
        }
        return;
      }

      // If user opened the app at root ('/' or empty), check if they have a saved working route to resume
      if (location.pathname === '/' || location.pathname === '') {
        try {
          const savedRoute = localStorage.getItem('teachsmart_last_working_route');
          if (
            savedRoute && 
            savedRoute !== '/' && 
            VALID_PROTECTED_ROUTES.some(r => savedRoute === r || savedRoute.startsWith(`${r}?`) || savedRoute.startsWith(`${r}#`))
          ) {
            navigate(savedRoute, { replace: true });
          }
        } catch (e) {
          console.warn('Could not read saved route:', e);
        }
      }
    }
  }, [user, loading, location.pathname, navigate]);

  // 2. Continuous Tracking of Active Working Route
  useEffect(() => {
    if (loading || !user) return;

    const currentPath = location.pathname;
    const isPublic = PUBLIC_ROUTES.some(p => currentPath === p || currentPath.startsWith(`${p}/`));

    // Only track valid protected application routes
    if (!isPublic && (VALID_PROTECTED_ROUTES.includes(currentPath) || currentPath === '/')) {
      try {
        const fullRoute = currentPath + (location.search || '');
        localStorage.setItem('teachsmart_last_working_route', fullRoute);
      } catch (e) {
        console.warn('Could not save active route:', e);
      }
    }
  }, [location.pathname, location.search, user, loading]);

  return null;
}
