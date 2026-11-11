'use client';

import { useMemo, useState, type JSX } from 'react';
import { Plus } from 'lucide';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AcademicPage, ConfirmDelete, LoadError, PageSkeleton, SelectField } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { formatDay } from '@/features/protected/academic/data/academic-data';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { useToday } from '@/features/protected/academic/hooks/use-today';
import { isWellbeingEvent } from '@/hooks/use-live';
import { cn } from '@/lib/utils';
import { deleteTherapyAction, listTherapiesAction, saveTherapyAction } from '../actions/wellbeing-actions';
import { therapyKindLabels } from '../data/wellbeing-data';
import type { TherapyLog, TherapySession } from '../types';
import { DateInput, Filter, OneOf, TextArea, useAct } from './wellbeing-ui';

// The first day of the month of an ISO date
const monthStart = (iso: string): string => (iso ? `${iso.slice(0, 7)}-01` : '');

// Terapias (EBE): the sessions of each student with its goal, attendance and the tasks for home. Families read
// their children's sessions without the professional notes
export const TherapiesPage = (): JSX.Element => {
  const slug = useInstitutionSlug();
  const today = useToday();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [studentId, setStudentId] = useState('');
  const f = { from: from || monthStart(today), to: to || today, studentId };
  const { data, error, reload } = useAcademicData(`wb-ther:${slug}:${f.from}:${f.to}:${studentId}`, () => listTherapiesAction(slug, f), isWellbeingEvent);
  const [editing, setEditing] = useState<TherapySession | 'new' | null>(null);
  const [isPending, act] = useAct();
  const minutes = useMemo(() => (data?.sessions ?? []).filter((s) => s.attended).reduce((n, s) => n + s.minutes, 0), [data]);
  return (
    <AcademicPage
      titleId="ther-title"
      title="Terapias"
      description={data?.family ? 'Las sesiones de terapia de tu hijo o hija y lo que pueden practicar en casa.' : 'Sesiones de lenguaje, física, ocupacional y otras: objetivo, asistencia y tareas para casa.'}
      // The buttons below already follow what the API allows this person
      context={{ canManage: true }}
      actions={
        data?.canWrite && (
          <button type="button" className="btn-brand" onClick={(): void => setEditing('new')}>
            <MorphIcon icon={Plus} size={16} />
            Registrar sesión
          </button>
        )
      }
    >
      {error ? (
        <LoadError message={error} onRetry={reload} />
      ) : !data ? (
        <PageSkeleton />
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-foreground">Desde</span>
              <Input type="date" value={f.from} max={today} onChange={(e): void => setFrom(e.target.value)} />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-foreground">Hasta</span>
              <Input type="date" value={f.to} min={f.from} max={today} onChange={(e): void => setTo(e.target.value)} />
            </label>
            {data.students.length > 0 && (
              <div className="w-72">
                <Filter id="ther-student" label="Estudiante" value={studentId} options={[{ value: '', label: 'Todos' }, ...data.students.map((s) => ({ value: s.id, label: s.name }))]} onChange={setStudentId} />
              </div>
            )}
            <p className="ml-auto text-sm text-muted-foreground tabular-nums">
              {data.sessions.length === 1 ? '1 sesión' : `${data.sessions.length} sesiones`} · {Math.round(minutes / 60)} h de terapia
            </p>
          </div>
          {data.sessions.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">No hay sesiones en esas fechas.</p>
          ) : (
            <ul className="divide-y divide-border rounded-2xl border border-border bg-background">
              {data.sessions.map((t) => (
                <li key={t.id} className="flex flex-wrap items-start gap-3 px-4 py-3 text-sm">
                  <span className="w-24 shrink-0 text-muted-foreground tabular-nums">{formatDay(t.heldOn, false)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-foreground">{t.studentName}</span>
                      <span className="pill bg-brand/12 text-brand">{therapyKindLabels[t.kind]}</span>
                      {!t.attended && <span className="pill bg-secondary text-muted-foreground">No asistió</span>}
                    </span>
                    <span className="block text-foreground">{t.goal}</span>
                    {t.notes && <span className="block text-muted-foreground">{t.notes}</span>}
                    {t.homeTasks && <span className="block text-xs text-foreground">Para casa: {t.homeTasks}</span>}
                    <span className="block text-xs text-muted-foreground">
                      {t.minutes} min · {t.therapistName}
                    </span>
                  </span>
                  {t.mine && (
                    <span className="flex gap-1">
                      <button type="button" className="btn-alt h-8 px-3 text-xs" onClick={(): void => setEditing(t)}>
                        Editar
                      </button>
                      <ConfirmDelete compact title="Eliminar la sesión" description="No se puede deshacer." isPending={isPending} onConfirm={(): void => act(() => deleteTherapyAction(slug, t.id), reload)} />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {editing && data && (
        <TherapyDialog
          slug={slug}
          log={data}
          session={editing === 'new' ? null : editing}
          onClose={(): void => setEditing(null)}
          onSaved={(): void => {
            setEditing(null);
            reload();
          }}
        />
      )}
    </AcademicPage>
  );
};

// Logs (or corrects) a session
const TherapyDialog = ({ slug, log, session, onClose, onSaved }: { slug: string; log: TherapyLog; session: TherapySession | null; onClose: () => void; onSaved: () => void }): JSX.Element => {
  const today = useToday();
  const [isPending, act] = useAct();
  const [v, setV] = useState<TherapySession>(
    session ?? { id: '', studentId: log.students[0]?.id ?? '', studentName: '', therapistName: '', kind: 'language', heldOn: '', minutes: 45, attended: true, goal: '', notes: '', homeTasks: '', mine: true },
  );
  return (
    <FormDialog
      title={session ? 'Editar la sesión' : 'Registrar sesión de terapia'}
      description="Las notas son para el equipo; la familia ve el objetivo y las tareas para casa."
      submitLabel="Guardar sesión"
      isPending={isPending}
      disabled={!v.studentId || !v.goal.trim()}
      wide
      onSubmit={(): void => act(() => saveTherapyAction(slug, { ...v, heldOn: v.heldOn || today }), onSaved)}
      onClose={onClose}
    >
      {!session && (
        <FormField id="th-student" label="Estudiante" required>
          <SelectField id="th-student" value={v.studentId} options={log.students.map((s) => ({ value: s.id, label: `${s.name} · ${s.placement}` }))} onChange={(x): void => setV({ ...v, studentId: x })} />
        </FormField>
      )}
      <OneOf label="Terapia" value={v.kind} options={Object.entries(therapyKindLabels)} onChange={(x): void => setV({ ...v, kind: x })} />
      <div className="grid gap-4 sm:grid-cols-3">
        <DateInput id="th-date" label="Fecha" value={v.heldOn || today} max={today} onChange={(x): void => setV({ ...v, heldOn: x })} required />
        <FormField id="th-min" label="Minutos" required>
          <Input id="th-min" type="number" min={10} max={240} step={5} value={v.minutes} onChange={(e): void => setV({ ...v, minutes: Number(e.target.value) })} />
        </FormField>
        <label className={cn('flex items-center gap-2 self-end rounded-lg border border-border px-3 py-2.5 text-sm')}>
          <input type="checkbox" checked={!v.attended} onChange={(e): void => setV({ ...v, attended: !e.target.checked })} className="size-4 accent-brand" />
          No asistió
        </label>
      </div>
      <TextArea id="th-goal" label="Objetivo de la sesión" value={v.goal} onChange={(x): void => setV({ ...v, goal: x })} max={500} required rows={2} />
      <TextArea id="th-notes" label="Notas del profesional" value={v.notes} onChange={(x): void => setV({ ...v, notes: x })} max={2000} />
      <TextArea id="th-home" label="Tareas para casa" value={v.homeTasks} onChange={(x): void => setV({ ...v, homeTasks: x })} max={1000} hint="La familia las ve en su panel." rows={2} />
    </FormDialog>
  );
};
