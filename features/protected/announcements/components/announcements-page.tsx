'use client';

import type { JSX } from 'react';
import { useGetAnnouncements } from '../hooks/use-get-announcements';
import { AnnouncementFormDialog } from './announcement-form-dialog';
import { AnnouncementTabs } from './announcement-tabs';

// Panel module: what the role may read in the institution, refreshed live; roles that publish get "Publicar"
export const AnnouncementsPage = (): JSX.Element => {
  const { announcements, canPublish, isLoading, prepend } = useGetAnnouncements();

  return (
    <section aria-labelledby="announcements-title" className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8 md:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 id="announcements-title" className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Comunicados
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Anuncios, comunicados y avisos de la institución.</p>
        </div>
        {canPublish && <AnnouncementFormDialog onCreated={prepend} />}
      </header>
      <div className="mt-8">
        <AnnouncementTabs announcements={announcements} isLoading={isLoading} linkToDetail emptyText="No hay publicaciones de este tipo." />
      </div>
    </section>
  );
};
