import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { JSX } from 'react';
import { ArrowLeft, ChevronRight, CloudOff, Pin, Users } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { audienceLabels, coverOf, formatPublishedAt, kindMeta, NEWS_PATH } from '@/features/protected/announcements/data/announcements-data';
import { cn } from '@/lib/utils';
import { getPublicNewsItem } from '../lib/news';
import { NewsAttachments } from './news-attachments';
import { NewsLiveRefresh } from './news-live-refresh';

interface NewsDetailProps {
  params: Promise<{ slug: string }>;
}

// URL-specific part of /news/<slug>, resolved inside the page's Suspense boundary
export const NewsDetail = async ({ params }: NewsDetailProps): Promise<JSX.Element> => {
  const { slug } = await params;
  const result = await getPublicNewsItem(slug);
  if (!result.ok) {
    return (
      <p className="mt-10 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
        <MorphIcon icon={CloudOff} size={24} />
        No pudimos cargar esta publicación. Vuelve a intentarlo en unos minutos.
      </p>
    );
  }
  const item = result.item;
  if (!item) notFound();

  const meta = kindMeta[item.kind];
  const cover = coverOf(item);
  const rest = item.attachments.filter(({ id }) => id !== cover?.id);

  return (
    <>
      <NewsLiveRefresh />
      <nav aria-label="Ruta">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="transition-colors hover:text-brand">
              Inicio
            </Link>
          </li>
          <li className="flex items-center gap-1.5">
            <MorphIcon icon={ChevronRight} size={14} />
            <Link href={NEWS_PATH} className="transition-colors hover:text-brand">
              Comunicados
            </Link>
          </li>
          <li aria-current="page" className="flex min-w-0 items-center gap-1.5 font-medium text-foreground">
            <MorphIcon icon={ChevronRight} size={14} />
            <span className="truncate">{item.title}</span>
          </li>
        </ol>
      </nav>

      <article className="mt-8">
        <header>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className={cn('pill gap-1.5 font-semibold', meta.className)}>
              <MorphIcon icon={meta.icon} size={12} />
              {meta.label}
            </span>
            <time dateTime={item.publishedAt}>{formatPublishedAt(item.publishedAt)}</time>
            {item.pinned && (
              <span className="inline-flex items-center gap-1 font-medium text-brand">
                <MorphIcon icon={Pin} size={12} />
                Destacado
              </span>
            )}
          </div>
          <h1 className="mt-4 text-[clamp(2rem,4vw,2.75rem)] leading-[1.1] font-semibold tracking-tight text-balance text-foreground">{item.title}</h1>
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <MorphIcon icon={Users} size={14} />
            {audienceLabels[item.audience]}
            {item.authorName && <span>· Publicado por {item.authorName}</span>}
          </p>
        </header>

        {cover && (
          <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl border border-border bg-surface">
            <Image src={cover.url} alt="" fill unoptimized priority sizes="(min-width: 1024px) 896px, 100vw" className="object-cover" />
          </div>
        )}

        <div className="mt-8 max-w-3xl text-base leading-8 whitespace-pre-line text-foreground/90">{item.body}</div>

        {rest.length > 0 && (
          <div className="mt-12">
            <NewsAttachments attachments={rest} />
          </div>
        )}
      </article>

      <Link href={NEWS_PATH} className="btn-alt mt-14 inline-flex">
        <MorphIcon icon={ArrowLeft} size={16} />
        Ver todos los comunicados
      </Link>
    </>
  );
};

export const NewsDetailSkeleton = (): JSX.Element => (
  <div aria-hidden="true" className="animate-pulse space-y-6">
    <div className="h-4 w-56 rounded bg-muted" />
    <div className="mt-8 h-6 w-40 rounded-full bg-muted" />
    <div className="h-12 w-4/5 rounded bg-muted" />
    <div className="aspect-video w-full rounded-2xl bg-muted" />
    <div className="space-y-3">
      <div className="h-4 w-full rounded bg-muted" />
      <div className="h-4 w-11/12 rounded bg-muted" />
      <div className="h-4 w-3/5 rounded bg-muted" />
    </div>
  </div>
);
