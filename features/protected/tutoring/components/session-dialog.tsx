'use client';

import { useCallback, useMemo, useState, useTransition, type JSX } from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SelectField } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { isoToLimaLocal } from '@/features/protected/classroom/data/classroom-data';
import { ProviderPicker } from '@/features/protected/meetings/components/provider-picker';
import { usePlatformAvailable, useProviderFallback } from '@/features/protected/meetings/hooks/use-live-config';
import { saveSessionAction } from '../actions/save-session';
import { alertCodeLabels, sessionModeLabels } from '../data/tutoring-data';
import type { SessionDraft, SessionInput, TutorBoardRow, TutoringSession } from '../types';

interface Props {
  slug: string;
  staffId: string;
  students: TutorBoardRow[];
  // A new session from a student or an alert, or one to change
  draft?: SessionDraft;
  session?: TutoringSession;
  onClose: () => void;
  onSaved: () => void;
}

// Tomorrow at 19:00 in Lima, a usual hour for working students
const tomorrowEvening = (): string => {
  const d = new Date(Date.now() - 5 * 3600_000 + 24 * 3600_000);
  return `${d.toISOString().slice(0, 10)}T19:00`;
};

// Schedules an individual or group tutoring session: who is called, when, how (virtual with its link, in person or
// by phone) and why
export const SessionDialog = ({ slug, staffId, students, draft, session, onClose, onSaved }: Props): JSX.Element => {
  const [v, setV] = useState<SessionInput>(() =>
    session
      ? { id: session.id, staffId, kind: session.kind as SessionInput['kind'], mode: session.mode as SessionInput['mode'], scheduledAt: isoToLimaLocal(session.scheduledAt),
          durationMin: session.durationMin, link: session.link, provider: session.provider === 'platform' ? 'platform' : 'meet', reason: session.reason, alertKind: session.alertKind, studentIds: session.attendees.map((a) => a.studentId) }
      : { id: '', staffId, kind: draft?.kind ?? 'individual', mode: 'virtual', scheduledAt: tomorrowEvening(), durationMin: draft?.kind === 'group' ? 45 : 30, link: '', provider: 'platform',
          reason: draft?.reason ?? '', alertKind: draft?.alertKind ?? '', studentIds: draft?.studentIds ?? [] },
  );
  const platformAvailable = usePlatformAvailable(slug);
  useProviderFallback(platformAvailable, v.provider, !session, useCallback((p: SessionInput['provider']): void => setV((x) => ({ ...x, provider: p })), []));
  const [query, setQuery] = useState('');
  const [isPending, start] = useTransition();
  const set = (patch: Partial<SessionInput>): void => setV((x) => ({ ...x, ...patch }));
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students.filter((s) => !q || `${s.student?.name} ${s.student?.placement}`.toLowerCase().includes(q));
  }, [students, query]);
  const toggle = (id: string): void =>
    set({ studentIds: v.kind === 'individual' ? [id] : v.studentIds.includes(id) ? v.studentIds.filter((x) => x !== id) : [...v.studentIds, id] });
  const errors = {
    students: v.studentIds.length === 0 ? 'Elige a quién convocar.' : v.kind === 'individual' && v.studentIds.length > 1 ? 'La tutoría individual es con un estudiante.' : '',
    reason: v.reason.trim().length < 3 ? 'Escribe el motivo.' : '',
    link: v.mode === 'virtual' && v.provider === 'meet' && v.link && !/^https?:\/\/\S+\.\S+/.test(v.link) ? 'El enlace empieza con https://' : '',
    when: !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v.scheduledAt) ? 'Indica la fecha y la hora.' : '',
  };
  const invalid = Object.values(errors).some(Boolean) || v.durationMin < 5 || v.durationMin > 240;
  // Shown once there is something to correct, not on an empty form
  const shownReason = v.reason.trim() !== '' && errors.reason ? errors.reason : undefined;
  const submit = (): void =>
    start(async () => {
      const r = await runAcademicAction(saveSessionAction(slug, { ...v, reason: v.reason.trim(), link: v.mode === 'virtual' && v.provider === 'meet' ? v.link.trim() : '' }));
      if (r.ok) onSaved();
    });
  return (
    <FormDialog title={session ? 'Cambiar la tutoría' : 'Agendar tutoría'} description={v.alertKind ? `Para atender la alerta «${alertCodeLabels[v.alertKind] ?? v.alertKind}».` : 'El estudiante la ve en su tutoría, con el enlace para unirse.'} submitLabel={session ? 'Guardar cambios' : 'Agendar'} isPending={isPending} disabled={invalid} onSubmit={submit} onClose={onClose} wide>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="session-kind" label="Tipo">
          <SelectField id="session-kind" value={v.kind} options={[{ value: 'individual', label: 'Individual' }, { value: 'group', label: 'Grupal' }]} onChange={(k): void => set({ kind: k as SessionInput['kind'], studentIds: k === 'individual' ? v.studentIds.slice(0, 1) : v.studentIds })} />
        </FormField>
        <FormField id="session-mode" label="Modalidad">
          <SelectField id="session-mode" value={v.mode} options={Object.entries(sessionModeLabels).map(([value, label]) => ({ value, label }))} onChange={(m): void => set({ mode: m as SessionInput['mode'] })} />
        </FormField>
        <FormField id="session-when" label="Fecha y hora" required error={errors.when || undefined}>
          <Input id="session-when" type="datetime-local" value={v.scheduledAt} onChange={(e): void => set({ scheduledAt: e.target.value })} />
        </FormField>
        <FormField id="session-duration" label="Duración (minutos)">
          <Input id="session-duration" type="number" min={5} max={240} step={5} value={v.durationMin} onChange={(e): void => set({ durationMin: Number(e.target.value) })} />
        </FormField>
      </div>
      {v.mode === 'virtual' && (
        <ProviderPicker
          id="session"
          provider={v.provider}
          link={v.link}
          platformAvailable={platformAvailable !== false || session?.provider === 'platform'}
          onProvider={(p): void => set({ provider: p })}
          onLink={(link): void => set({ link })}
          linkError={errors.link || undefined}
          linkOptional
        />
      )}
      <FormField id="session-reason" label="Motivo" required error={shownReason}>
        <Textarea id="session-reason" rows={2} maxLength={300} value={v.reason} onChange={(e): void => set({ reason: e.target.value })} />
      </FormField>
      <fieldset className="grid gap-2">
        <legend className="text-sm font-medium text-foreground">
          {v.kind === 'individual' ? 'Estudiante' : `Estudiantes (${v.studentIds.length})`}
          {errors.students && <span className="ml-2 text-xs font-normal text-destructive">{errors.students}</span>}
        </legend>
        {students.length > 8 && <Input aria-label="Buscar estudiante" placeholder="Buscar" value={query} onChange={(e): void => setQuery(e.target.value)} />}
        <ul className="max-h-56 divide-y divide-border overflow-y-auto rounded-xl border border-border">
          {shown.map((s) => {
            const id = s.student?.studentId ?? '';
            return (
              <li key={id}>
                <label className="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm hover:bg-surface">
                  <input type={v.kind === 'individual' ? 'radio' : 'checkbox'} name="session-students" checked={v.studentIds.includes(id)} onChange={(): void => toggle(id)} className="size-4 accent-brand" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-foreground">{s.student?.name}</span>
                    <span className="block text-xs text-muted-foreground">{s.student?.placement}</span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
        {v.kind === 'group' && (
          <button type="button" className="justify-self-start text-xs font-medium text-brand hover:underline" onClick={(): void => set({ studentIds: shown.map((s) => s.student?.studentId ?? '') })}>
            Convocar a todos los mostrados
          </button>
        )}
      </fieldset>
    </FormDialog>
  );
};
