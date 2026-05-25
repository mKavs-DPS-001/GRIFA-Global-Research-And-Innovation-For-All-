import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Scroll to top only when:
    // 1. The user navigates via PUSH or REPLACE (actively clicking a link or redirect)
    // 2. We do NOT scroll to top on POP (which happens on page refresh/reload or browser back/forward)
    if (navigationType !== 'POP') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // Instant scroll prevents visual delay when page mounts
      });
    }
  }, [pathname, navigationType]);

  return null;
}
