'use client';

import Link from 'next/link';
import type { JSX } from 'react';
import { Megaphone } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { ANNOUNCEMENTS_PATH, kindMeta } from '@/features/protected/announcements/data/announcements-data';
import { useGetAnnouncements } from '@/features/protected/announcements/hooks/use-get-announcements';
import { cn } from '@/lib/utils';
import { useAnnouncementTicker } from '../hooks/use-announcement-ticker';

// Header ticker: the latest announcements (live), one at a time, rotating every 2 s and pausing on hover or focus
export const DashboardAnnouncementTicker = (): JSX.Element => {
  const { announcements } = useGetAnnouncements();
  const { current, index, total, pause, resume } = useAnnouncementTicker(announcements.slice(0, 6));

  if (!current) {
    return (
      <Link href={ANNOUNCEMENTS_PATH} className="group flex h-8 min-w-0 flex-1 items-center gap-2.5 overflow-hidden rounded-sm px-2 text-sm text-muted-foreground transition-colors hover:bg-accent md:max-w-xl">
        <MorphIcon icon={Megaphone} size={16} className="shrink-0 text-brand" />
        Comunicados
      </Link>
    );
  }
  const meta = kindMeta[current.kind];

  return (
    <Link href={ANNOUNCEMENTS_PATH} onMouseEnter={pause} onMouseLeave={resume} onFocus={pause} onBlur={resume} aria-label={`Comunicados. ${meta.label}: ${current.title}`} className="group flex h-8 min-w-0 flex-1 items-center gap-2.5 overflow-hidden rounded-sm px-2 transition-colors hover:bg-accent md:max-w-xl">
      <MorphIcon icon={Megaphone} size={16} className="shrink-0 text-brand" />
      <span key={current.id} className="row-in flex min-w-0 items-center gap-2">
        <span className={cn('pill shrink-0 px-2 text-[11px] font-semibold', meta.className)}>{meta.label}</span>
        <span className="truncate text-sm text-foreground/85 group-hover:text-foreground">{current.title}</span>
      </span>
      <span aria-hidden="true" className="ml-auto hidden shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums lg:inline">
        {index + 1}/{total}
      </span>
    </Link>
  );
};
