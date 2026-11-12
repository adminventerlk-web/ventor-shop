'use client';

import { useEffect, useRef } from 'react';

/** One entrance per mounted section; all content is visible without this effect. */
export function useSectionEntrance() {
  const sectionRef = useRef<HTMLElement>(null);
  const enteredRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!section || enteredRef.current || reducedMotion.matches || section.contains(document.activeElement) ||
        typeof window.IntersectionObserver !== 'function' || typeof Element.prototype.animate !== 'function') return;

    const animations: Animation[] = [];
    let observer: IntersectionObserver | undefined;
    const revealImmediately = () => {
      enteredRef.current = true;
      observer?.disconnect();
      animations.forEach(animation => animation.cancel());
    };
    const handleMotionChange = () => {
      if (reducedMotion.matches) revealImmediately();
    };

    try {
      const mobile = window.matchMedia('(max-width: 767px)').matches;
      const distance = mobile ? 12 : 18;
      section.querySelectorAll<HTMLElement>('[data-entrance]').forEach(element => {
        const direction = element.dataset.entrance;
        const x = direction === 'left' ? -distance : direction === 'right' ? distance : 0;
        const y = direction === 'up' ? distance : 0;
        const delay = Number(element.dataset.entranceDelay || 0) * (mobile ? 0.75 : 1);
        // Individual CSS translate/scale hover effects remain independent of transform.
        const animation = element.animate([
          { opacity: 0, transform: `translate3d(${x}px, ${y}px, 0)` },
          { opacity: 1, transform: 'translate3d(0, 0, 0)' },
        ], {
          duration: mobile ? 550 : 600,
          delay,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          fill: 'both',
        });
        animations.push(animation);
        animation.pause();
        animation.currentTime = 0;
        // Remove the effect after entry so later interactions use the original styles.
        void animation.finished.then(() => animation.cancel(), () => undefined);
      });
      const threshold = Math.min(0.18, window.innerHeight / Math.max(section.offsetHeight, 1) * 0.8);
      observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting || entry.intersectionRatio < threshold || enteredRef.current) return;
        enteredRef.current = true;
        observer?.disconnect();
        try {
          animations.forEach(animation => animation.play());
        } catch {
          revealImmediately();
        }
      }, { threshold });
      observer.observe(section);
    } catch {
      // A missing/failed animation API must never leave content hidden.
      revealImmediately();
    }

    section.addEventListener('focusin', revealImmediately);
    reducedMotion.addEventListener('change', handleMotionChange);
    return () => {
      observer?.disconnect();
      animations.forEach(animation => animation.cancel());
      section.removeEventListener('focusin', revealImmediately);
      reducedMotion.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return sectionRef;
}
