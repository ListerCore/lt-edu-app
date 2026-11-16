'use client';

import Link from 'next/link';
import { useState, type JSX } from 'react';
import { Activity, ArrowLeft, CalendarClock, Copy, Plus, Settings2, UserRound } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AcademicPage, LoadError, PageSkeleton, StatusPill } from '@/features/protected/academic/components/academic-ui';
import { CLASSROOM_PATH, participationPath, roomStatusClass, roomStatusLabels } from '../data/classroom-data';
import { useReorderUnits } from '../hooks/use-reorder-units';
import { useRoomPage } from '../hooks/use-room-page';
import type { Unit } from '../types';
import { CopyRoomDialog } from './copy-room-dialog';
import { RoomSettingsDialog } from './room-settings-dialog';
import { UnitDialog } from './unit-dialog';
import { UnitSection } from './unit-section';

// One virtual classroom: the welcome, the next live session and the units with their material. Students see what is
// open and published and how much they already opened; editors build it
export const RoomPage = ({ id }: { id: string }): JSX.Element => {
  const page = useRoomPage(id);
  const [editingUnit, setEditingUnit] = useState<Unit | 'new' | null>(null);
  const [settings, setSettings] = useState(false);
  const [copying, setCopying] = useState(false);
  const data = page.data;
  const units = useReorderUnits(id, page.reload);
  const unitIds = data?.units.map((u) => u.id) ?? [];

  const back = (
    <Link href={CLASSROOM_PATH} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand">
      <MorphIcon icon={ArrowLeft} size={14} />
      Aulas virtuales
    </Link>
  );

  return (
    <AcademicPage
      titleId="room-title"
      title={data ? data.room.subjectName : 'Aula virtual'}
      description={data ? `${data.room.levelName}${data.room.gradeName ? ` · ${data.room.gradeName}` : ''} · ${data.room.periodName}` : ''}
      context={data?.canEdit ? { canManage: true } : null}
      back={back}
      actions={
        <>
          {data && data.units.length === 0 && (
            <button type="button" className="btn-alt" onClick={(): void => setCopying(true)}>
              <MorphIcon icon={Copy} size={16} />
              Copiar de otro periodo
            </button>
          )}
          <Link href={participationPath(id)} className="btn-alt">
            <MorphIcon icon={Activity} size={16} />
            Participación
          </Link>
          <button type="button" className="btn-alt" onClick={(): void => setSettings(true)}>
            <MorphIcon icon={Settings2} size={16} />
            Ajustes
          </button>
          <button type="button" className="btn-brand" onClick={(): void => setEditingUnit('new')}>
            <MorphIcon icon={Plus} size={16} />
            Nueva unidad
          </button>
        </>
      }
    >
      {page.error ? (
        <LoadError message={page.error} onRetry={page.reload} />
      ) : page.isLoading || !data ? (
        <PageSkeleton />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-4">
            {data.units.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
                {data.canEdit ? 'Esta aula aún no tiene unidades. Crea la primera o copia el material de otro periodo.' : 'Tu docente aún no publicó material en esta aula.'}
              </p>
            ) : (
              data.units.map((u, i) => (
                <UnitSection
                  key={u.id}
                  unit={u}
                  index={i}
                  count={data.units.length}
                  room={data.room}
                  canEdit={data.canEdit}
                  family={data.family}
                  liveOf={page.liveOf}
                  isMoving={units.isMoving}
                  onMove={(delta): void => units.move(unitIds, i, delta)}
                  onEdit={(): void => setEditingUnit(u)}
                  onChanged={page.reload}
                />
              ))
            )}
          </div>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-border bg-background p-4">
              {!data.family && <StatusPill className={roomStatusClass[data.room.status]}>{roomStatusLabels[data.room.status]}</StatusPill>}
              <p className="mt-3 flex items-center gap-2 text-sm text-foreground">
                <MorphIcon icon={UserRound} size={14} className="text-muted-foreground" />
                {data.room.staffName || 'Sin docente asignado'}
              </p>
              {data.room.description && <p className="mt-3 text-sm leading-6 whitespace-pre-line text-muted-foreground">{data.room.description}</p>}
              {!data.family && <p className="mt-3 text-xs text-muted-foreground">{data.room.students} estudiantes en el grado</p>}
            </section>

            {page.progress && page.progress.total > 0 && (
              <section className="rounded-2xl border border-border bg-background p-4">
                <p className="text-sm font-medium text-foreground">Tu avance</p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary" role="progressbar" aria-valuemin={0} aria-valuemax={page.progress.total} aria-valuenow={page.progress.viewed}>
                  <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${Math.round((page.progress.viewed / page.progress.total) * 100)}%` }} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Abriste {page.progress.viewed} de {page.progress.total} materiales.
                </p>
              </section>
            )}

            {page.nextLive && (
              <section className="rounded-2xl border border-border bg-background p-4">
                <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <MorphIcon icon={CalendarClock} size={14} className="text-brand" />
                  Próxima sesión en vivo
                </p>
                <p className="mt-2 text-sm text-foreground">{page.nextLive.item.title}</p>
                <p className="text-xs text-muted-foreground first-letter:uppercase">{page.nextLive.live.label}</p>
                {page.nextLive.live.phase === 'open' && (
                  <a href={page.nextLive.item.url} target="_blank" rel="noreferrer" className="btn-brand mt-3 h-9 w-full text-sm">
                    Entrar ahora
                  </a>
                )}
              </section>
            )}
          </aside>
        </div>
      )}
      {data && editingUnit && <UnitDialog roomId={data.room.id} unit={editingUnit === 'new' ? null : editingUnit} onClose={(): void => setEditingUnit(null)} onSaved={page.reload} />}
      {data && settings && <RoomSettingsDialog room={data.room} onClose={(): void => setSettings(false)} onSaved={page.reload} />}
      {data && copying && <CopyRoomDialog room={data.room} onClose={(): void => setCopying(false)} onCopied={page.reload} />}
    </AcademicPage>
  );
};
