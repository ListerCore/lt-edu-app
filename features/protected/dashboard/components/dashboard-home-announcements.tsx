import Link from 'next/link';
import type { JSX } from 'react';
import { Megaphone, Pin } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Skeleton } from '@/components/ui/skeleton';
import { ANNOUNCEMENTS_PATH, formatPublishedAt, kindMeta, panelAnnouncementPath } from '@/features/protected/announcements/data/announcements-data';
import { cn } from '@/lib/utils';
import type { DashboardHomeAnnouncementsProps } from '../types';

// Latest announcements (pinned first) with a link to the full module
export const DashboardHomeAnnouncements = ({ announcements, isLoading }: DashboardHomeAnnouncementsProps): JSX.Element => (
  <section aria-labelledby="home-announcements-title">
    <div className="flex items-baseline justify-between gap-3">
      <h2 id="home-announcements-title" className="text-sm font-semibold text-foreground">
        Comunicados recientes
      </h2>
      <Link href={ANNOUNCEMENTS_PATH} className="link-underline text-xs font-medium text-muted-foreground hover:text-foreground">
        Ver todos
      </Link>
    </div>

    <div className="mt-3">
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }, (_, index): JSX.Element => (
            <Skeleton key={index} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : announcements.length === 0 ? (
        <p className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
          <MorphIcon icon={Megaphone} size={22} />
          Aún no hay comunicados publicados.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {announcements.map((announcement): JSX.Element => {
            const meta = kindMeta[announcement.kind];
            return (
              <li key={announcement.id} className="row-in">
                <Link href={panelAnnouncementPath(announcement.slug)} className="soft-card flex gap-4 p-4 hover:border-brand/40">
                  <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-md', meta.className)}>
                    <MorphIcon icon={meta.icon} size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium">{meta.label}</span>
                      <span aria-hidden="true">·</span>
                      <time dateTime={announcement.publishedAt}>{formatPublishedAt(announcement.publishedAt)}</time>
                      {announcement.pinned && (
                        <span className="ml-auto flex items-center gap-1 text-brand">
                          <MorphIcon icon={Pin} size={12} />
                          Fijado
                        </span>
                      )}
                    </span>
                    <span className="mt-1 block truncate text-sm font-medium text-foreground">{announcement.title}</span>
                    <span className="mt-0.5 line-clamp-2 block text-sm leading-6 text-muted-foreground">{announcement.body}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  </section>
);
