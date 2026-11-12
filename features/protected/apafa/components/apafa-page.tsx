'use client';

import { useRouter } from 'next/navigation';
import { useState, type JSX } from 'react';
import { CalendarPlus, Eye, TriangleAlert } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AcademicPage, LoadError, PageSkeleton } from '@/features/protected/academic/components/academic-ui';
import { meetingPath } from '../data/apafa-data';
import { useApafaPage } from '../hooks/use-apafa-page';
import { ApafaBoard } from './apafa-board';
import { ApafaFeesCard } from './apafa-fees-card';
import { ApafaMeetingDialog } from './apafa-meeting-dialog';
import { ApafaMeetingList } from './apafa-meeting-list';

// APAFA of a public institution: upcoming and past meetings, the board and the fee collection. Dirección and
// secretaría convene; coordinación and the families read
export const ApafaPage = (): JSX.Element => {
  const page = useApafaPage();
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const ready = !page.isLoading && !page.error;

  return (
    <AcademicPage
      titleId="apafa-title"
      title="APAFA"
      description={page.isFamily ? 'Las reuniones de la Asociación de Padres de Familia: cuándo y dónde son, la agenda, los acuerdos y los documentos.' : 'Reuniones de la Asociación de Padres de Familia (Ley N.° 28628): convoca, avisa a las familias, registra el acta y adjunta los documentos.'}
      context={ready && page.canManage ? { canManage: true } : null}
      actions={
        <button type="button" className="btn-brand" onClick={(): void => setCreating(true)}>
          <MorphIcon icon={CalendarPlus} size={16} />
          Nueva reunión
        </button>
      }
    >
      {page.error ? (
        <LoadError message={page.error} onRetry={page.reload} />
      ) : page.isLoading ? (
        <PageSkeleton />
      ) : (
        <div className="space-y-6">
          {!page.canManage && !page.isFamily && (
            <p className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-3 text-sm text-muted-foreground">
              <MorphIcon icon={Eye} size={16} />
              Solo lectura: dirección y secretaría convocan las reuniones y registran las actas.
            </p>
          )}
          {page.canManage && page.pendingMinutes > 0 && (
            <p role="status" className="flex items-center gap-2 rounded-lg bg-warning/10 px-4 py-3 text-sm text-foreground">
              <MorphIcon icon={TriangleAlert} size={16} className="text-warning" />
              {page.pendingMinutes === 1 ? 'Una reunión ya pasó y espera su acta.' : `${page.pendingMinutes} reuniones ya pasaron y esperan su acta.`}
            </p>
          )}
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="space-y-8">
              <ApafaMeetingList title="Próximas reuniones" meetings={page.upcoming} canManage={page.canManage} empty={page.canManage ? 'No hay reuniones programadas. Convoca la siguiente con «Nueva reunión».' : 'No hay reuniones convocadas por ahora.'} />
              <ApafaMeetingList title="Reuniones anteriores" meetings={page.past} canManage={page.canManage} empty="Aún no hay reuniones realizadas." />
            </div>
            <aside className="space-y-4">
              {page.fees && <ApafaFeesCard fees={page.fees} />}
              <ApafaBoard members={page.board} canManage={page.canManage} onChanged={page.reload} />
            </aside>
          </div>
        </div>
      )}
      {creating && <ApafaMeetingDialog meeting={null} onClose={(): void => setCreating(false)} onSaved={(m): void => router.push(meetingPath(m.id))} />}
    </AcademicPage>
  );
};
