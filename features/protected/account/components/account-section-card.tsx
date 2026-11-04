import type { JSX } from 'react';
import { MorphIcon } from '@/components/ui/morph-icon';
import { cn } from '@/lib/utils';
import type { AccountSectionCardProps } from '../types';

// Read-only block of profile data as a two-column definition list
export const AccountSectionCard = ({ section }: AccountSectionCardProps): JSX.Element => (
  <section aria-labelledby={`account-${section.id}`} className="rounded-2xl border border-border bg-background p-6">
    <h2 id={`account-${section.id}`} className="flex items-center gap-2.5 text-base font-semibold text-foreground">
      <span className="flex size-8 items-center justify-center rounded-lg bg-brand-soft text-brand">
        <MorphIcon icon={section.icon} size={16} />
      </span>
      {section.title}
    </h2>
    <dl className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2">
      {section.fields.map(({ label, value, mono }): JSX.Element => (
        <div key={label} className={cn(value.length > 48 && 'sm:col-span-2')}>
          <dt className="text-xs text-muted-foreground">{label}</dt>
          <dd className={cn('mt-0.5 text-sm text-foreground', mono && 'font-mono')}>{value}</dd>
        </div>
      ))}
    </dl>
  </section>
);
