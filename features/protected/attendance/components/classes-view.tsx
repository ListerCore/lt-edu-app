'use client';

import { useState, useTransition, type JSX } from 'react';
import { ArrowLeft, Check, LoaderCircle } from 'lucide';
import { sileo } from 'sileo';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { LoadError, PageSkeleton, SelectField } from '@/features/protected/academic/components/academic-ui';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { isAttendanceEvent } from '@/hooks/use-live';
import { cn } from '@/lib/utils';
import { getClassAction, getClassesAction, saveClassAction } from '../actions/attendance-actions';
import { markLabels } from '../data/attendance-data';
import type { ClassSlot, Overview } from '../types';
import { Empty, MarkPicker } from './attendance-ui';

// What the sheet starts with: the class mark if taken, otherwise the day (absent at the gate stays absent)
const suggested = (status: string, dayStatus: string): string => status || (dayStatus === 'absent' || dayStatus === 'justified' ? dayStatus : 'present');

interface ClassesViewProps {
  slug: string;
  overview: Overview;
}

// Mis clases: the teacher's classes of the day; coordinación can pick a section and see (and take) its classes
export const ClassesView = ({ slug, overview }: ClassesViewProps): JSX.Element => {
  const [sectionId, setSectionId] = useState('');
  const [open, setOpen] = useState<ClassSlot | null>(null);
  const { data, error, reload } = useAcademicData(`att-classes:${slug}:${overview.day}:${sectionId}`, () => getClassesAction(slug, overview.day, sectionId), isAttendanceEvent);
  const sectionWord = overview.vocabulary?.section ?? 'Sección';

  if (open) return <ClassSheetView key={`${open.assignmentId}:${open.blockId}`} slug={slug} slot={open} day={overview.day} onBack={(): void => setOpen(null)} />;

  return (
    <div className="space-y-4">
      <div className="w-full max-w-sm">
        <SelectField
          id="att-classes-section"
          value={sectionId}
          options={[{ value: '', label: 'Mis clases' }, ...overview.sections.map((s) => ({ value: s.sectionId, label: `${sectionWord} ${s.sectionLabel}` }))]}
          onChange={setSectionId}
        />
      </div>
      {error ? (
        <LoadError message={error} onRetry={reload} />
      ) : !data ? (
        <PageSkeleton />
      ) : !data.schoolDay ? (
        <Empty>Este día no hay clases.</Empty>
      ) : data.slots.length === 0 ? (
        <Empty>{sectionId ? 'Esta sección no tiene clases este día en su horario.' : 'No tienes clases este día en tu horario.'}</Empty>
      ) : (
        <ol className="space-y-2">
          {data.slots.map((s) => {
            const taken = Boolean(s.sessionId);
            return (
              <li key={`${s.assignmentId}:${s.blockId}`}>
                <button type="button" onClick={(): void => setOpen(s)} className="flex w-full items-center gap-4 rounded-2xl border border-border bg-background p-4 text-left transition-colors hover:border-foreground/25">
                  <span className="w-24 shrink-0 text-sm text-muted-foreground tabular-nums">
                    {s.startsAt}–{s.endsAt}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-foreground">{s.subjectName}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {s.sectionLabel}
                      {data.scope === 'section' && s.staffName && ` · ${s.staffName}`}
                      {s.room && ` · ${s.room}`}
                    </span>
                  </span>
                  {taken ? (
                    <span className="pill shrink-0 bg-success/12 text-success">
                      <MorphIcon icon={Check} size={12} />
                      Tomada · {s.absent} {s.absent === 1 ? 'falta' : 'faltas'}
                    </span>
                  ) : (
                    <span className="pill shrink-0 bg-secondary text-muted-foreground">Por tomar</span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};

interface SheetProps {
  slug: string;
  slot: ClassSlot;
  day: string;
  onBack: () => void;
}

const ClassSheetView = ({ slug, slot, day, onBack }: SheetProps): JSX.Element => {
  const { data, error, reload } = useAcademicData(`att-class:${slug}:${slot.assignmentId}:${slot.blockId}:${day}`, () => getClassAction(slug, slot.assignmentId, slot.blockId, day), () => false);
  const [marks, setMarks] = useState<Record<string, { status: string; note: string }>>({});
  const [topic, setTopic] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <button type="button" className="btn-alt" onClick={onBack}>
        <MorphIcon icon={ArrowLeft} size={16} />
        Clases del día
      </button>
      <div className="text-right">
        <h2 className="text-lg font-semibold text-foreground">{slot.subjectName}</h2>
        <p className="text-xs text-muted-foreground tabular-nums">
          {slot.sectionLabel} · {slot.startsAt}–{slot.endsAt}
        </p>
      </div>
    </div>
  );
  if (error) return <div className="space-y-4">{header}<LoadError message={error} onRetry={reload} /></div>;
  if (!data) return <div className="space-y-4">{header}<PageSkeleton /></div>;

  const valueOf = (id: string, status: string, dayStatus: string, note: string): { status: string; note: string } => marks[id] ?? { status: suggested(status, dayStatus), note };
  const counts = data.marks.reduce<Record<string, number>>((acc, m) => {
    const s = valueOf(m.studentId, m.status, m.dayStatus, m.note).status;
    acc[s] = (acc[s] ?? 0) + 1;
    return acc;
  }, {});
  const taken = Boolean(data.slot?.sessionId);

  const save = (): void =>
    startTransition(async () => {
      const all = data.marks.map((m) => ({ personId: m.studentId, ...valueOf(m.studentId, m.status, m.dayStatus, m.note) }));
      const result = await saveClassAction(slug, slot.assignmentId, slot.blockId, day, topic ?? data.slot?.topic ?? '', all);
      if (!result.ok) {
        sileo.error({ title: 'No se pudo guardar', description: result.message });
        return;
      }
      sileo.success({ title: result.message ?? 'Guardado' });
      setMarks({});
      setTopic(null);
      onBack();
    });

  return (
    <div className="space-y-4">
      {header}
      <div className="grid gap-3 rounded-2xl border border-border bg-background p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">Tema de la sesión</span>
          <Input value={topic ?? data.slot?.topic ?? ''} maxLength={200} disabled={!data.canEdit} onChange={(e): void => setTopic(e.target.value)} placeholder="Opcional, por ejemplo: Fracciones equivalentes" />
        </label>
        <p className="text-xs text-muted-foreground tabular-nums">
          {Object.entries(counts)
            .map(([s, n]) => `${n} ${markLabels[s]?.toLowerCase()}`)
            .join(' · ')}
        </p>
      </div>
      {!taken && <p className="rounded-xl bg-secondary px-4 py-3 text-sm text-muted-foreground">Viene marcado según la puerta: quien faltó al día figura con falta. Cambia solo lo que veas distinto en el aula.</p>}
      <ul className="divide-y divide-border rounded-2xl border border-border bg-background">
        {data.marks.map((m, i) => {
          const v = valueOf(m.studentId, m.status, m.dayStatus, m.note);
          return (
            <li key={m.studentId} className={cn('flex flex-wrap items-center gap-3 px-4 py-2.5', marks[m.studentId] && 'bg-brand/5')}>
              <span className="w-6 text-sm text-muted-foreground tabular-nums">{i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">{m.name}</span>
                {m.dayStatus && m.dayStatus !== 'present' && <span className="block text-xs text-muted-foreground">En la puerta: {markLabels[m.dayStatus]?.toLowerCase()}</span>}
              </span>
              <MarkPicker label={`Marca de ${m.name}`} value={v.status} disabled={!data.canEdit || isPending} withJustified={false} onChange={(s): void => setMarks((c) => ({ ...c, [m.studentId]: { ...v, status: s } }))} />
            </li>
          );
        })}
      </ul>
      {data.marks.length === 0 && <Empty>Nadie de la sección lleva este curso.</Empty>}
      {data.canEdit ? (
        <div className="sticky bottom-4 flex justify-end rounded-2xl border border-border bg-background/95 p-3 shadow-sm backdrop-blur">
          <button type="button" className="btn-brand" disabled={isPending || data.marks.length === 0} onClick={save}>
            {isPending && <MorphIcon icon={LoaderCircle} size={16} className="animate-spin" />}
            {taken ? 'Guardar cambios' : 'Guardar asistencia'}
          </button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Solo el docente del curso o coordinación pueden tomar esta asistencia.</p>
      )}
    </div>
  );
};
