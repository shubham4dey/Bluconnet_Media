import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls to top on every route change (pathname only).
 * Replaces the scroll-reset behavior previously provided by HashRouter
 * remounts. Has no UI and changes no routes.
 */
const RouteScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default RouteScrollToTop;
