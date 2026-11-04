import type { JSX } from 'react';

// Page backdrop: a faint brand wash plus a blueprint grid behind the first screen that fades out downwards and towards the center
export const SiteBackground = (): JSX.Element => (
  <>
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 -z-1 h-[36rem] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,var(--brand-soft),transparent_70%)]" />
    <svg aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-1 h-[min(100svh,64rem)] w-full text-foreground/[0.07] [mask-image:radial-gradient(ellipse_90%_75%_at_50%_0%,#000_35%,transparent_100%)]">
      <defs>
        <pattern id="site-grid" width="56" height="56" patternUnits="userSpaceOnUse">
          <path d="M56 0H0V56" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M-4 0h8M0-4v8" stroke="currentColor" strokeWidth="1.5" className="text-brand/40" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#site-grid)" />
    </svg>
  </>
);
