'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { profileSectionLinks } from '../data/profile-data';
import type { ProfileTab } from '../types';

const ProfileTabs = (): JSX.Element => {
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get('tab') as ProfileTab | null;
  const activeTab = profileSectionLinks.some(({ tab }) => tab === requestedTab) ? requestedTab : 'general';

  return (
    <nav aria-label="Secciones del perfil" role="tablist" className="flex gap-1 overflow-x-auto border-t border-border bg-muted/40 px-3 sm:px-5 lg:px-7">
      {profileSectionLinks.map(({ label, tab, icon: Icon }) => {
        const active = activeTab === tab;

        return (
          <Link
            key={tab}
            id={`profile-tab-${tab}`}
            href={`/profile?tab=${tab}`}
            role="tab"
            aria-selected={active}
            aria-controls="profile-tab-panel"
            className={`relative inline-flex min-h-11 shrink-0 items-center gap-2 px-2 text-[10px] font-semibold transition-colors after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 sm:px-3 sm:text-[11px] sm:after:inset-x-3 ${active ? 'text-secondary after:bg-secondary' : 'text-muted-foreground after:bg-transparent hover:text-foreground'}`}
          >
            <Icon aria-hidden="true" className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
};

export { ProfileTabs };
