import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';

/**
 * ResetToDashboardOnRefresh
 * Automatically redirects the application to the Dashboard ('/') on every page refresh or initial load,
 * while preserving public routes like /login, /about, /features, and /blog.
 */
export default function ResetToDashboardOnRefresh() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    if (!hasCheckedRef.current) {
      hasCheckedRef.current = true;
      const currentPath = location.pathname;
      const publicPaths = ['/login', '/about', '/features', '/blog'];
      const isPublic = publicPaths.some(p => currentPath === p || currentPath.startsWith(`${p}/`));

      if (!isPublic && currentPath !== '/') {
        navigate('/', { replace: true });
      }
    }
  }, [location.pathname, navigate]);

  return null;
}
