'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useSyncExternalStore, type JSX } from 'react';
import { ArrowRight, CalendarClock, ChevronLeft, ChevronRight } from 'lucide';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { MorphIcon } from '@/components/ui/morph-icon';
import { coverOf, ctaHref, formatDateTime, isExternal, isFeaturedAt, kindMeta, NEWS_PATH } from '@/features/protected/announcements/data/announcements-data';
import type { FeaturedAnnouncementsModalProps } from '@/features/protected/announcements/types';
import { cn } from '@/lib/utils';

const SEEN_KEY = 'joseph-featured-seen';

// What was already shown in this tab: the same set of announcements does not pop up again until something changes
const readSeen = (): string | null => {
  try {
    return sessionStorage.getItem(SEEN_KEY);
  } catch {
    return null;
  }
};
const writeSeen = (value: string): void => {
  try {
    sessionStorage.setItem(SEEN_KEY, value);
  } catch {
    // Blocked storage: it may show again on the next visit, which is harmless
  }
};

const noSubscription = (): (() => void) => () => undefined;

// Home modal: announcements within their validity window, newest first; a carousel when there is more than one.
// Each one has its button ("Ir" / "Continuar") to where it leads
export const FeaturedAnnouncementsModal = ({ announcements }: FeaturedAnnouncementsModalProps): JSX.Element | null => {
  // A cached list may still hold one whose window just ended: checked against the time the modal mounted
  const [mountedAt] = useState(() => Date.now());
  const items = announcements.filter((item) => isFeaturedAt(item, mountedAt));
  const signature = items.map(({ id, updatedAt }) => `${id}:${updatedAt}`).join('|');
  // On the server it reads as already seen, so the modal only opens in the browser (no hydration mismatch)
  const seen = useSyncExternalStore(noSubscription, readSeen, () => signature);
  const [dismissed, setDismissed] = useState(false);
  const [index, setIndex] = useState(0);
  const open = items.length > 0 && !dismissed && seen !== signature;

  const close = (): void => {
    setDismissed(true);
    writeSeen(signature);
  };

  if (items.length === 0) return null;
  const item = items[Math.min(index, items.length - 1)];
  const meta = kindMeta[item.kind];
  const cover = coverOf(item);
  const href = ctaHref(item);
  const many = items.length > 1;
  const go = (step: number): void => setIndex((current) => (current + step + items.length) % items.length);

  return (
    <Dialog open={open} onOpenChange={(next): void => (next ? undefined : close())}>
      <DialogContent className="max-h-[92svh] gap-0 overflow-y-auto p-0 sm:max-w-2xl lg:max-w-3xl" onKeyDown={(event): void => {
        if (!many) return;
        if (event.key === 'ArrowRight') go(1);
        if (event.key === 'ArrowLeft') go(-1);
      }}>
        <div key={item.id} className="row-in" aria-roledescription={many ? 'diapositiva' : undefined} aria-label={many ? `${index + 1} de ${items.length}` : undefined}>
          {cover ? (
            <div className="relative aspect-video bg-surface">
              <Image src={cover.url} alt="" fill unoptimized sizes="(min-width: 1024px) 768px, (min-width: 640px) 672px, 100vw" className="object-cover" />
            </div>
          ) : (
            <div className={cn('flex h-32 items-center justify-center', meta.className)}>
              <MorphIcon icon={meta.icon} size={40} />
            </div>
          )}
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className={cn('pill gap-1.5 font-semibold', meta.className)}>
                <MorphIcon icon={meta.icon} size={12} />
                {meta.label}
              </span>
              {item.featuredUntil && (
                <span className="inline-flex items-center gap-1">
                  <MorphIcon icon={CalendarClock} size={12} />
                  Hasta el {formatDateTime(item.featuredUntil)}
                </span>
              )}
            </div>
            <DialogTitle className="mt-3 text-xl leading-snug sm:text-2xl font-semibold text-foreground">{item.title}</DialogTitle>
            <DialogDescription className="mt-3 line-clamp-6 text-sm leading-6 sm:text-base sm:leading-7 whitespace-pre-line text-muted-foreground">{item.body}</DialogDescription>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              {many ? (
                <div className="flex items-center gap-1">
                  <button type="button" onClick={(): void => go(-1)} aria-label="Anterior" className="flex size-8 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-brand hover:text-brand">
                    <MorphIcon icon={ChevronLeft} size={16} />
                  </button>
                  <div className="flex items-center gap-1.5 px-2" role="tablist" aria-label="Publicaciones vigentes">
                    {items.map((entry, position): JSX.Element => (
                      <button key={entry.id} type="button" role="tab" aria-selected={position === index} aria-label={`Ir a ${position + 1} de ${items.length}`} onClick={(): void => setIndex(position)} className={cn('h-1.5 rounded-full transition-all', position === index ? 'w-5 bg-brand' : 'w-1.5 bg-border hover:bg-muted-foreground')} />
                    ))}
                  </div>
                  <button type="button" onClick={(): void => go(1)} aria-label="Siguiente" className="flex size-8 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-brand hover:text-brand">
                    <MorphIcon icon={ChevronRight} size={16} />
                  </button>
                </div>
              ) : (
                <Link href={NEWS_PATH} onClick={close} className="text-sm font-medium text-muted-foreground transition-colors hover:text-brand">
                  Ver comunicados
                </Link>
              )}
              <div className="flex gap-2">
                <button type="button" onClick={close} className="btn-alt">
                  Cerrar
                </button>
                {isExternal(href) ? (
                  <a href={href} target="_blank" rel="noopener" onClick={close} className="btn-brand">
                    {item.ctaLabel || 'Continuar'}
                    <MorphIcon icon={ArrowRight} size={16} />
                  </a>
                ) : (
                  <Link href={href} onClick={close} className="btn-brand">
                    {item.ctaLabel || 'Continuar'}
                    <MorphIcon icon={ArrowRight} size={16} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
