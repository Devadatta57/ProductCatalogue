import { useEffect, useRef, useState } from 'react';

/*
 * For a `position: sticky` bar:
 * - publishes its live height as `--bar-h` on the container, so things below
 *   it (e.g. a sticky sidebar) can offset themselves by exactly that much;
 * - reports `stuck` once the bar is pinned to the top of the viewport
 *   (watched through a zero-height sentinel placed right before the bar).
 */
export function useStickyBar() {
  const containerRef = useRef(null);
  const barRef = useRef(null);
  const sentinelRef = useRef(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const bar = barRef.current;
    const sentinel = sentinelRef.current;
    if (!container || !bar || !sentinel) return undefined;

    const resizeObserver = new ResizeObserver(() => {
      container.style.setProperty('--bar-h', `${Math.ceil(bar.getBoundingClientRect().height)}px`);
    });
    resizeObserver.observe(bar);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      setStuck(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    intersectionObserver.observe(sentinel);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return { containerRef, barRef, sentinelRef, stuck };
}
