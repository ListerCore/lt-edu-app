'use client';

import type { JSX } from 'react';
import { useWorkspace } from '@/features/protected/dashboard/hooks/use-workspace';
import { useGetAnnouncements } from '../hooks/use-get-announcements';
import { AnnouncementFormDialog } from './announcement-form-dialog';
import { AnnouncementTabs } from './announcement-tabs';

// Panel module: every announcement of the institution in tabs; roles allowed to create also get "Publicar"
export const AnnouncementsPage = (): JSX.Element => {
  const { can } = useWorkspace();
  const { announcements, isLoading, prepend } = useGetAnnouncements();

  return (
    <section aria-labelledby="announcements-title" className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8 md:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 id="announcements-title" className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Comunicados
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Anuncios, comunicados y avisos de la institución.</p>
        </div>
        {can('announcements', 'create') && <AnnouncementFormDialog onCreated={prepend} />}
      </header>
      <div className="mt-8">
        <AnnouncementTabs announcements={announcements} isLoading={isLoading} emptyText="No hay publicaciones de este tipo." />
      </div>
    </section>
  );
};
