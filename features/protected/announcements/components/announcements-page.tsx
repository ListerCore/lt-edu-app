'use client';

import Link from 'next/link';
import type { JSX } from 'react';
import { Plus } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { NEW_ANNOUNCEMENT_PATH } from '../data/announcements-data';
import { useGetAnnouncements } from '../hooks/use-get-announcements';
import { AnnouncementTabs } from './announcement-tabs';

// Panel module: what the role may read in the institution, refreshed live; roles that publish get "Publicar"
export const AnnouncementsPage = (): JSX.Element => {
  const { announcements, canPublish, isLoading } = useGetAnnouncements();

  return (
    <section aria-labelledby="announcements-title" className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8 md:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 id="announcements-title" className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Comunicados
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Anuncios, comunicados y avisos de la institución.</p>
        </div>
        {canPublish && (
          <Link href={NEW_ANNOUNCEMENT_PATH} className="btn-brand">
            <MorphIcon icon={Plus} size={16} />
            Publicar
          </Link>
        )}
      </header>
      <div className="mt-8">
        <AnnouncementTabs announcements={announcements} isLoading={isLoading} context="panel" emptyText="No hay publicaciones de este tipo." />
      </div>
    </section>
  );
};
