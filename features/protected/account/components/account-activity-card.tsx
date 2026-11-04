import type { JSX } from 'react';
import { History } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { formatDateTime } from '../data/account-data';
import type { AccountProfileProps } from '../types';

// Recent account activity on a vertical timeline, newest first
export const AccountActivityCard = ({ profile }: AccountProfileProps): JSX.Element => (
  <section aria-labelledby="account-activity" className="rounded-2xl border border-border bg-background p-6">
    <h2 id="account-activity" className="flex items-center gap-2.5 text-base font-semibold text-foreground">
      <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-foreground">
        <MorphIcon icon={History} size={16} />
      </span>
      Actividad reciente
    </h2>
    <ol className="relative mt-5 ml-1.5 border-l border-border">
      {profile.activity.map(({ id, title, detail, at }, index): JSX.Element => (
        <li key={id} className="relative pb-5 pl-5 last:pb-0">
          <span aria-hidden="true" className={index === 0 ? 'absolute top-1 -left-[5px] size-2.5 rounded-full bg-brand-solid ring-4 ring-background' : 'absolute top-1 -left-[5px] size-2.5 rounded-full bg-border ring-4 ring-background'} />
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{detail}</p>
          <time dateTime={at} className="text-xs text-muted-foreground">
            {formatDateTime(at)}
          </time>
        </li>
      ))}
    </ol>
  </section>
);
