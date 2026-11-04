import Link from 'next/link';
import type { JSX } from 'react';
import { UsersRound } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { UserAvatar } from '@/features/protected/dashboard/components/user-avatar';
import type { AccountProfileProps } from '../types';

// Guardians: the students they are responsible for
export const AccountLinkedCard = ({ profile }: AccountProfileProps): JSX.Element => (
  <section aria-labelledby="account-linked" className="rounded-2xl border border-border bg-background p-6">
    <h2 id="account-linked" className="flex items-center gap-2.5 text-base font-semibold text-foreground">
      <span className="flex size-8 items-center justify-center rounded-lg bg-brand-soft text-brand">
        <MorphIcon icon={UsersRound} size={16} />
      </span>
      Estudiantes a cargo
    </h2>
    <ul className="mt-5 divide-y divide-border">
      {profile.linked.map(({ name, detail, code }): JSX.Element => (
        <li key={code} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
          <UserAvatar name={name} avatarUrl={null} className="size-10" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-foreground">{name}</span>
            <span className="block truncate text-xs text-muted-foreground">{detail}</span>
          </span>
          <Link href="/dashboard/cards" className="font-mono text-xs text-brand hover:underline">
            {code}
          </Link>
        </li>
      ))}
    </ul>
  </section>
);
