import Image from 'next/image';
import type { JSX } from 'react';
import { Pin, Users } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { cn } from '@/lib/utils';
import { audienceLabels, formatPublishedAt, kindMeta } from '../data/announcements-data';
import type { AnnouncementCardProps } from '../types';

// One announcement: optional cover image, kind badge, date, title, detail and audience; pinned ones get a brand edge
export const AnnouncementCard = ({ announcement }: AnnouncementCardProps): JSX.Element => {
  const meta = kindMeta[announcement.kind];
  return (
    <article className={cn('row-in overflow-hidden rounded-xl border bg-background transition-colors hover:border-brand/50', announcement.pinned ? 'border-brand/40' : 'border-border')}>
      {announcement.imageUrl && (
        <div className="relative aspect-video bg-surface">
          <Image src={announcement.imageUrl} alt="" fill unoptimized sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
      )}
      <div className="p-5">
        <header className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className={cn('pill gap-1.5 font-semibold', meta.className)}>
            <MorphIcon icon={meta.icon} size={12} />
            {meta.label}
          </span>
          <time dateTime={announcement.publishedAt}>{formatPublishedAt(announcement.publishedAt)}</time>
          {announcement.pinned && (
            <span className="ml-auto inline-flex items-center gap-1 font-medium text-brand">
              <MorphIcon icon={Pin} size={12} />
              Destacado
            </span>
          )}
        </header>
        <h3 className="mt-3 text-base font-semibold text-foreground">{announcement.title}</h3>
        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{announcement.summary}</p>
        <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <MorphIcon icon={Users} size={12} />
          {audienceLabels[announcement.audience]}
        </p>
      </div>
    </article>
  );
};
