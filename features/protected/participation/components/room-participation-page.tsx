'use client';

import Link from 'next/link';
import type { JSX } from 'react';
import { ArrowLeft } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AcademicPage, LoadError, PageSkeleton } from '@/features/protected/academic/components/academic-ui';
import { roomPath } from '@/features/protected/classroom/data/classroom-data';
import { cn } from '@/lib/utils';
import { stamp } from '../data/participation-data';
import { useRoomParticipation } from '../hooks/use-room-participation';
import type { RoomParticipationPageProps } from '../types';

// Registro de participación of a classroom room: what each student of the grade did in it, from the platform's own
// record (nobody fills it in)
export const RoomParticipationPage = ({ roomId }: RoomParticipationPageProps): JSX.Element => {
  const { data, error, reload } = useRoomParticipation(roomId);
  const rows = data ?? [];
  const silent = rows.filter((r) => r.activeDays === 0).length;
  return (
    <AcademicPage
      titleId="participation-title"
      title="Registro de participación"
      description={data ? `${rows.length} estudiantes del grado${silent > 0 ? ` · ${silent} sin actividad en esta aula` : ''}. Se registra solo al abrir materiales, entrar a sesiones en vivo, rendir, entregar y escribir en los foros.` : ''}
      context={null}
      back={
        <Link href={roomPath(roomId)} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand">
          <MorphIcon icon={ArrowLeft} size={14} />
          Volver al aula
        </Link>
      }
    >
      {error ? (
        <LoadError message={error} onRetry={reload} />
      ) : !data ? (
        <PageSkeleton />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-background">
          <table className="w-full min-w-[48rem] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th scope="col" className="px-4 py-3 font-medium">Estudiante</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Días activos</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Materiales vistos</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Sesiones en vivo</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Intentos</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Entregas</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Foros</th>
                <th scope="col" className="px-4 py-3 font-medium">Última acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border tabular-nums">
              {rows.map((r) => (
                <tr key={r.studentId} className={cn(r.activeDays === 0 && 'text-muted-foreground')}>
                  <td className="px-4 py-2.5">
                    <span className="font-medium">{r.studentName}</span>
                    <span className="block text-xs text-muted-foreground">{r.studentCode}</span>
                  </td>
                  <td className="px-4 py-2.5 text-right">{r.activeDays}</td>
                  <td className="px-4 py-2.5 text-right">{r.itemsSeen}</td>
                  <td className="px-4 py-2.5 text-right">{r.live}</td>
                  <td className="px-4 py-2.5 text-right">{r.attempts}</td>
                  <td className="px-4 py-2.5 text-right">{r.submissions}</td>
                  <td className="px-4 py-2.5 text-right">{r.posts}</td>
                  <td className="px-4 py-2.5">{stamp(r.lastAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AcademicPage>
  );
};
