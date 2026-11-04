import type { JSX } from 'react';
import type { LegalBlockProps } from '../types';

// Numbered clause of a legal document; anchors match the table of contents
export const LegalBlock = ({ id, index, title, children }: LegalBlockProps): JSX.Element => (
  <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-32 border-t border-border pt-8 pb-10 first:border-t-0 first:pt-0">
    <h2 id={`${id}-title`} className="group flex items-baseline gap-3 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
      <span className="text-base font-medium text-brand tabular-nums">{String(index).padStart(2, '0')}</span>
      {title}
    </h2>
    <div className="mt-4 space-y-4 text-base leading-7 text-muted-foreground [&_a]:font-medium [&_a]:text-brand [&_a]:decoration-dotted [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:marker:text-brand">{children}</div>
  </section>
);
