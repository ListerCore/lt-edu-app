'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, type JSX } from 'react';
import { ArrowLeft, CalendarClock, ExternalLink, Eye, EyeOff, LoaderCircle, Pencil, Pin, Trash2, Users } from 'lucide';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ANNOUNCEMENTS_PATH, audienceLabels, coverOf, ctaHref, formatDateTime, formatPublishedAt, isFeaturedAt, kindMeta, newsPath } from '../data/announcements-data';
import { useAnnouncementDetail } from '../hooks/use-announcement-detail';
import type { AnnouncementDetailPageProps } from '../types';
import { AnnouncementAttachments } from './announcement-attachments';
import { AnnouncementForm } from './announcement-form';

// /dashboard/announcements/<slug>: the announcement in full; whoever may change it edits it here or deletes it
export const AnnouncementDetailPage = ({ slug }: AnnouncementDetailPageProps): JSX.Element => {
  const { detail, error, isLoading, isDeleting, replace, remove } = useAnnouncementDetail(slug);
  const [editing, setEditing] = useState(false);
  // Reference time for "Vigente / Programada / Terminó", fixed when the page mounts
  const [now] = useState(() => Date.now());

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 md:px-8 md:py-10">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="aspect-video rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </section>
    );
  }

  if (!detail) {
    return (
      <section className="mx-auto flex w-full max-w-md flex-col items-center gap-4 px-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">{error ?? 'No encontramos esta publicación.'}</p>
        <Link href={ANNOUNCEMENTS_PATH} className="btn-alt">
          <MorphIcon icon={ArrowLeft} size={16} />
          Volver a comunicados
        </Link>
      </section>
    );
  }

  const { announcement, canEdit } = detail;
  const meta = kindMeta[announcement.kind];
  const cover = coverOf(announcement);
  const featuredNow = isFeaturedAt(announcement, now);

  return (
    <section aria-labelledby="announcement-title" className="mx-auto w-full max-w-4xl px-4 py-8 md:px-8 md:py-10">
      <Link href={ANNOUNCEMENTS_PATH} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-brand">
        <MorphIcon icon={ArrowLeft} size={14} />
        Comunicados
      </Link>

      {editing ? (
        <>
          <h1 id="announcement-title" className="mt-4 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Editar publicación
          </h1>
          <div className="mt-8">
            <AnnouncementForm
              announcement={announcement}
              onSaved={(saved): void => {
                replace(saved);
                setEditing(false);
              }}
              onCancel={(): void => setEditing(false)}
            />
          </div>
        </>
      ) : (
        <article className="mt-4">
          <header className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className={cn('pill gap-1.5 font-semibold', meta.className)}>
                  <MorphIcon icon={meta.icon} size={12} />
                  {meta.label}
                </span>
                <time dateTime={announcement.publishedAt}>{formatPublishedAt(announcement.publishedAt)}</time>
                {announcement.pinned && (
                  <span className="inline-flex items-center gap-1 font-medium text-brand">
                    <MorphIcon icon={Pin} size={12} />
                    Destacado
                  </span>
                )}
              </div>
              <h1 id="announcement-title" className="mt-3 text-2xl font-semibold tracking-tight text-balance text-foreground md:text-3xl">
                {announcement.title}
              </h1>
            </div>
            <div className="flex flex-wrap gap-2">
              {announcement.isPublic && (
                <Link href={newsPath(announcement.slug)} className="btn-alt">
                  <MorphIcon icon={ExternalLink} size={16} />
                  Ver publicación
                </Link>
              )}
              {canEdit && (
                <>
                  <button type="button" onClick={(): void => setEditing(true)} className="btn-alt">
                    <MorphIcon icon={Pencil} size={16} />
                    Editar
                  </button>
                  <AlertDialog>
                    <AlertDialogTrigger render={<button type="button" disabled={isDeleting} className="btn-alt text-destructive" />}>
                      <MorphIcon icon={isDeleting ? LoaderCircle : Trash2} size={16} className={isDeleting ? 'animate-spin' : ''} />
                      Eliminar
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar esta publicación?</AlertDialogTitle>
                        <AlertDialogDescription>Se quita del panel y de la página pública, con sus {announcement.attachments.length > 0 ? `${announcement.attachments.length} archivos` : 'datos'}. No se puede deshacer.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" onClick={remove}>
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
          </header>

          <dl className="mt-6 grid gap-4 rounded-2xl border border-border bg-background p-5 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-xs text-muted-foreground">Dirigido a</dt>
              <dd className="mt-0.5 inline-flex items-center gap-1.5 text-foreground">
                <MorphIcon icon={Users} size={14} />
                {audienceLabels[announcement.audience]}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Visibilidad</dt>
              <dd className="mt-0.5 inline-flex items-center gap-1.5 text-foreground">
                <MorphIcon icon={announcement.isPublic ? Eye : EyeOff} size={14} />
                {announcement.isPublic ? 'Pública y en el panel' : 'Solo en el panel'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Publicado por</dt>
              <dd className="mt-0.5 text-foreground">{announcement.authorName || '—'}</dd>
            </div>
            {announcement.featuredFrom && announcement.featuredUntil && (
              <div className="sm:col-span-3">
                <dt className="text-xs text-muted-foreground">Vigencia en el inicio</dt>
                <dd className="mt-0.5 flex flex-wrap items-center gap-2 text-foreground">
                  <MorphIcon icon={CalendarClock} size={14} />
                  Del {formatDateTime(announcement.featuredFrom)} al {formatDateTime(announcement.featuredUntil)}
                  <span className={featuredNow ? 'pill bg-success/12 text-success' : 'pill bg-surface text-muted-foreground'}>{featuredNow ? 'Vigente' : Date.parse(announcement.featuredUntil) <= now ? 'Terminó' : 'Programada'}</span>
                  <span className="text-muted-foreground">
                    · Botón «{announcement.ctaLabel || 'Continuar'}» a {ctaHref(announcement)}
                  </span>
                </dd>
              </div>
            )}
          </dl>

          {cover && (
            <div className="relative mt-6 aspect-video overflow-hidden rounded-2xl border border-border bg-surface">
              <Image src={cover.url} alt="" fill unoptimized sizes="(min-width: 1024px) 896px, 100vw" className="object-cover" />
            </div>
          )}

          <div className="mt-6 text-base leading-8 whitespace-pre-line text-foreground/90">{announcement.body}</div>

          {announcement.attachments.length > (cover ? 1 : 0) && (
            <div className="mt-8">
              <h2 className="text-sm font-semibold text-foreground">Archivos adjuntos</h2>
              <div className="mt-3">
                <AnnouncementAttachments attachments={announcement.attachments} skipCover layout="grid" />
              </div>
            </div>
          )}
        </article>
      )}
    </section>
  );
};
