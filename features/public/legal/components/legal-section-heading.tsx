import type { JSX } from 'react';
import type { LegalSectionHeadingProps } from '../types';

export const LegalSectionHeading = ({ icon: Icon, title, number }: LegalSectionHeadingProps): JSX.Element => (
  <div className="mb-3 flex items-center gap-3">
    <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-secondary/25 bg-secondary/10 text-secondary">
      <Icon aria-hidden="true" className="size-4" />
    </span>
    <div>
      {number && <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary">{number}</p>}
      <h2 className="font-heading text-lg font-semibold text-foreground">{title}</h2>
    </div>
  </div>
);
