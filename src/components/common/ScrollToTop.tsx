import { useEffect } from 'react';
import { useLocation, useInRouterContext } from 'react-router';

export default function ScrollToTop() {
  const inRouter = useInRouterContext();
  if (!inRouter) return null;
  return <ScrollToTopInner />;
}

function ScrollToTopInner() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior
    });
  }, [pathname]);

  return null;
}
