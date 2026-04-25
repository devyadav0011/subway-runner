import { useRef, useEffect } from 'react';

interface TouchControlsOptions {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeUp: () => void;
  onSwipeDown: () => void;
  threshold?: number;
}

export function useTouchControls(
  elementRef: React.RefObject<HTMLElement | null>,
  options: TouchControlsOptions
) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const { threshold = 40 } = options;

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      touchStart.current = { x: t.clientX, y: t.clientY };
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStart.current.x;
      const dy = t.clientY - touchStart.current.y;
      touchStart.current = null;

      if (Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) < threshold) return;
        if (dx < 0) options.onSwipeLeft();
        else options.onSwipeRight();
      } else {
        if (Math.abs(dy) < threshold) return;
        if (dy < 0) options.onSwipeUp();
        else options.onSwipeDown();
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [options, threshold, elementRef]);
}
