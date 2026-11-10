'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { JSX } from 'react';
import { ArrowLeft } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { ANNOUNCEMENTS_PATH, panelAnnouncementPath } from '../data/announcements-data';
import { AnnouncementForm } from './announcement-form';

// /dashboard/announcements/new: publishing on its own page; once published it opens the announcement
export const NewAnnouncementPage = (): JSX.Element => {
  const router = useRouter();
  return (
    <section aria-labelledby="new-announcement-title" className="mx-auto w-full max-w-3xl px-4 py-8 md:px-8 md:py-10">
      <Link href={ANNOUNCEMENTS_PATH} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-brand">
        <MorphIcon icon={ArrowLeft} size={14} />
        Comunicados
      </Link>
      <h1 id="new-announcement-title" className="mt-4 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        Nueva publicación
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">Elige el tipo y a quién va dirigida. Puedes adjuntar imágenes y PDF; las públicas también aparecen en la página de comunicados del sitio.</p>
      <div className="mt-8">
        <AnnouncementForm onSaved={(saved): void => router.replace(panelAnnouncementPath(saved.slug))} onCancel={(): void => router.push(ANNOUNCEMENTS_PATH)} />
      </div>
    </section>
  );
};
