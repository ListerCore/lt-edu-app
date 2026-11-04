'use client';

import { Suspense, useEffect, type JSX } from 'react';
import { usePathname } from 'next/navigation';

const pendingSelector = '[data-reveal]:not([data-inview="true"])';

// Marks [data-reveal] elements as in view; re-runs per route and also watches for content streamed in after navigation
const ScrollRevealObserver = (): null => {
  const pathname = usePathname();

  useEffect((): (() => void) | undefined => {
    const pending = (): HTMLElement[] => Array.from(document.querySelectorAll<HTMLElement>(pendingSelector));

    if (typeof IntersectionObserver === 'undefined') {
      for (const element of pending()) element.dataset.inview = 'true';
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries): void => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.inview = 'true';
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    // Observing an element twice is a no-op, so rescanning on DOM changes is safe
    const observePending = (): void => {
      for (const element of pending()) observer.observe(element);
    };
    observePending();

    const mutations = new MutationObserver(observePending);
    mutations.observe(document.body, { childList: true, subtree: true });

    return (): void => {
      mutations.disconnect();
      observer.disconnect();
    };
  }, [pathname]);

  return null;
};

// Suspense lets routes with runtime params prerender while the pathname streams in
export const ScrollReveal = (): JSX.Element => (
  <Suspense fallback={null}>
    <ScrollRevealObserver />
  </Suspense>
);
