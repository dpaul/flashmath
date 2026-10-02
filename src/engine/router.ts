import { useState, useEffect, useCallback } from 'react';
import { ActiveAppView } from './types';

export interface AppRoute {
  view: ActiveAppView;
  levelId?: string;
}

/**
 * Generates canonical URL hash string for an AppRoute.
 */
export function getHashForRoute(route: AppRoute): string {
  switch (route.view) {
    case 'mode-select':
      return '#/';
    case 'math':
      return '#/math';
    case 'math-practice':
      return '#/math/practice';
    case 'history':
      return '#/math/history';
    case 'spelling-levels':
      return '#/spelling';
    case 'spelling-practice':
      return route.levelId
        ? `#/spelling/practice?level=${encodeURIComponent(route.levelId)}`
        : '#/spelling/practice';
    case 'spelling-history':
      return route.levelId
        ? `#/spelling/history?level=${encodeURIComponent(route.levelId)}`
        : '#/spelling/history';
    default:
      return '#/';
  }
}

/**
 * Parses current window location (hash or pathname) into an AppRoute.
 */
export function parseRouteFromLocation(location: {
  hash: string;
  pathname: string;
  search?: string;
}): AppRoute {
  let hashStr = location.hash || '';
  if (hashStr.startsWith('#')) {
    hashStr = hashStr.slice(1);
  }

  let rawPath = hashStr;
  let rawQuery = '';

  // If no hash is provided, fallback to pathname (e.g. direct visits /math or /flashmath/math)
  if (!rawPath || rawPath === '/' || rawPath === '') {
    const pathname = location.pathname || '';
    const trimmedPath = pathname.replace(/^\/flashmath\/?/, '/');
    if (trimmedPath && trimmedPath !== '/') {
      rawPath = trimmedPath;
      rawQuery = location.search ? location.search.replace(/^\?/, '') : '';
    }
  }

  // Separate query parameters if present (e.g. #/spelling/practice?level=xyz)
  if (rawPath.includes('?')) {
    const parts = rawPath.split('?');
    rawPath = parts[0];
    rawQuery = parts[1];
  }

  const queryParams = new URLSearchParams(rawQuery);
  const segments = rawPath
    .split('/')
    .map((s) => s.trim())
    .filter(Boolean);

  if (segments.length === 0) {
    return { view: 'mode-select' };
  }

  const first = segments[0].toLowerCase();
  const second = segments[1]?.toLowerCase();
  const third = segments[2];

  if (first === 'math') {
    if (second === 'practice') {
      return { view: 'math-practice' };
    }
    if (second === 'history') {
      return { view: 'history' };
    }
    return { view: 'math' };
  }

  if (first === 'math-practice') {
    return { view: 'math-practice' };
  }

  if (first === 'history') {
    return { view: 'history' };
  }

  if (first === 'spelling' || first === 'spelling-levels') {
    if (second === 'practice') {
      const levelId = queryParams.get('level') || third;
      return { view: 'spelling-practice', levelId: levelId || undefined };
    }
    if (second === 'history') {
      const levelId = queryParams.get('level') || third;
      return { view: 'spelling-history', levelId: levelId || undefined };
    }
    return { view: 'spelling-levels' };
  }

  if (first === 'spelling-practice') {
    const levelId = queryParams.get('level') || second;
    return { view: 'spelling-practice', levelId: levelId || undefined };
  }

  if (first === 'spelling-history') {
    const levelId = queryParams.get('level') || second;
    return { view: 'spelling-history', levelId: levelId || undefined };
  }

  return { view: 'mode-select' };
}

/**
 * Custom React hook that syncs current app route with the browser URL and history stack.
 */
export function useAppRouter() {
  const [route, setRouteState] = useState<AppRoute>(() => {
    if (typeof window === 'undefined') return { view: 'mode-select' };
    return parseRouteFromLocation(window.location);
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const nextRoute = parseRouteFromLocation(window.location);
      setRouteState(nextRoute);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = useCallback((nextRoute: AppRoute, replace = false) => {
    if (typeof window === 'undefined') {
      setRouteState(nextRoute);
      return;
    }

    const newHash = getHashForRoute(nextRoute);
    const currentHash = window.location.hash || '#/';

    if (currentHash === newHash) {
      setRouteState(nextRoute);
      return;
    }

    if (replace) {
      window.history.replaceState(null, '', newHash);
    } else {
      window.history.pushState(null, '', newHash);
    }
    setRouteState(nextRoute);
  }, []);

  return { route, navigate };
}
