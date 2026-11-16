import Image from 'next/image';
import type { JSX } from 'react';
import { cn } from '@/lib/utils';
import type { BrandWatermarkProps } from './types';

// Faint ListerCore Edu mascot behind a screen's content (public/watermark.png). The parent must be `relative isolate`;
// the mark stays centered in view while the content scrolls, and never takes clicks or reaches screen readers
export const BrandWatermark = ({ className }: BrandWatermarkProps): JSX.Element => (
  <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0 -z-1 overflow-hidden', className)}>
    <div className="sticky top-0 flex h-svh items-center justify-center">
      <Image src="/watermark.png" alt="" width={640} height={620} unoptimized className="w-[min(70%,26rem)] opacity-[0.06] select-none dark:opacity-[0.08] dark:invert" />
    </div>
  </div>
);
