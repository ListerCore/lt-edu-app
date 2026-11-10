import Image from 'next/image';
import Link from 'next/link';
import type { JSX } from 'react';
import { ArrowRight, Paperclip, Pin, Users } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { cn } from '@/lib/utils';
import { audienceLabels, coverOf, formatPublishedAt, kindMeta, newsPath } from '../data/announcements-data';
import type { AnnouncementCardProps } from '../types';
import { AnnouncementAttachments } from './announcement-attachments';

// One announcement: cover image (first image), kind, date, title, detail, the other images and PDFs as thumbnails,
// and the audience; public ones link to their page (/news/<slug>)
export const AnnouncementCard = ({ announcement, linkToDetail = false }: AnnouncementCardProps): JSX.Element => {
  const meta = kindMeta[announcement.kind];
  const cover = coverOf(announcement);
  const detail = linkToDetail && announcement.isPublic ? newsPath(announcement.slug) : null;
  const extra = announcement.attachments.length - (cover ? 1 : 0);

  return (
    <article className={cn('row-in flex flex-col overflow-hidden rounded-xl border bg-background transition-colors hover:border-brand/50', announcement.pinned ? 'border-brand/40' : 'border-border')}>
      {cover && (
        <div className="relative aspect-video bg-surface">
          <Image src={cover.url} alt="" fill unoptimized sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
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
        <h3 className="mt-3 text-base font-semibold text-foreground">
          {detail ? (
            <Link href={detail} className="transition-colors hover:text-brand">
              {announcement.title}
            </Link>
          ) : (
            announcement.title
          )}
        </h3>
        <p className="mt-1.5 line-clamp-4 text-sm leading-6 whitespace-pre-line text-muted-foreground">{announcement.body}</p>
        {extra > 0 && (
          <div className="mt-4">
            <AnnouncementAttachments attachments={announcement.attachments} skipCover />
          </div>
        )}
        <footer className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MorphIcon icon={Users} size={12} />
            {audienceLabels[announcement.audience]}
          </span>
          {announcement.attachments.length > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <MorphIcon icon={Paperclip} size={12} />
              {announcement.attachments.length} {announcement.attachments.length === 1 ? 'archivo' : 'archivos'}
            </span>
          )}
          {detail && (
            <Link href={detail} className="ml-auto inline-flex items-center gap-1 font-medium text-brand transition-colors hover:text-brand-solid-hover">
              Ver publicación
              <MorphIcon icon={ArrowRight} size={12} />
            </Link>
          )}
        </footer>
      </div>
    </article>
  );
};
