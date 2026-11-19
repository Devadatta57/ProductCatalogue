import { useEffect, useState } from 'react';

/*
 * Tiny hash router: "#/families-table" → "/families-table", empty → "/".
 * Hash URLs work on any static host and the browser Back button works too.
 */

const read = () => window.location.hash.replace(/^#/, '') || '/';
const RETURN_KEY = 'feedReturnScroll';

export function navigate(path) {
  window.location.hash = path === '/' ? '' : path;
}

/** Open another page from home, remembering where home was scrolled to */
export function openFromHome(path) {
  try {
    sessionStorage.setItem(RETURN_KEY, String(window.scrollY));
  } catch {
    // Storage blocked: Back still works, home just opens at the top
  }
  navigate(path);
}

/** Back to home: browser history when we came from there, else a fresh visit */
export function backToHome() {
  let fromHome = false;
  try {
    fromHome = sessionStorage.getItem(RETURN_KEY) !== null;
  } catch {
    // ignore
  }
  if (fromHome && window.history.length > 1) window.history.back();
  else navigate('/');
}

/** Home page: scroll back to where the user left it (once) */
export function takeReturnScroll() {
  try {
    const y = sessionStorage.getItem(RETURN_KEY);
    sessionStorage.removeItem(RETURN_KEY);
    return y === null ? null : Number(y);
  } catch {
    return null;
  }
}

export function useHashRoute() {
  const [route, setRoute] = useState(read);

  useEffect(() => {
    const onChange = () => {
      setRoute(read());
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}
