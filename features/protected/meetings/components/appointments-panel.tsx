'use client';

import Link from 'next/link';
import { useCallback, useState, useTransition, type JSX } from 'react';
import { CalendarPlus, Pencil, Video, X } from 'lucide';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { LoadError, SelectField } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { useNow } from '@/features/protected/apafa/hooks/use-now';
import { isoToLimaLocal } from '@/features/protected/classroom/data/classroom-data';
import { cn } from '@/lib/utils';
import { saveAppointmentAction, setAppointmentStatusAction } from '../actions/appointments';
import { appointmentStatusLabels, liveDay, liveHref, livePhase, liveTime, providerLabels } from '../data/meetings-data';
import { useAppointments } from '../hooks/use-appointments';
import { ProviderPicker } from './provider-picker';
import { useProviderFallback } from '../hooks/use-live-config';
import type { Appointment, AppointmentInput, LiveProvider } from '../types';

const statusClass: Record<string, string> = {
  scheduled: 'bg-brand-soft text-brand',
  held: 'bg-success/15 text-success',
  missed: 'bg-secondary text-muted-foreground',
  cancelled: 'bg-secondary text-muted-foreground',
};

// Tomorrow at 16:00 in Lima
const tomorrowAfternoon = (): string => {
  const d = new Date(Date.now() - 5 * 3600_000 + 24 * 3600_000);
  return `${d.toISOString().slice(0, 10)}T16:00`;
};

// Appointments of a psychology case: by video call (on the platform or Google Meet) or in person. The student sees
// only the date and how to join; the case stays confidential
export const AppointmentsPanel = ({ slug, caseId }: { slug: string; caseId: string }): JSX.Element => {
  const { data, error, reload } = useAppointments(slug, caseId);
  const now = useNow();
  const [editing, setEditing] = useState<Appointment | 'new' | null>(null);
  const [isPending, start] = useTransition();
  const setStatus = (a: Appointment, status: string): void =>
    start(async () => {
      const r = await runAcademicAction(setAppointmentStatusAction(slug, a.id, status));
      if (r.ok) reload();
    });
  return (
    <section aria-labelledby="appointments" className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 id="appointments" className="text-sm font-semibold text-foreground">
          Citas
        </h3>
        <button type="button" className="btn-alt h-8 px-3 text-xs" onClick={(): void => setEditing('new')}>
          <MorphIcon icon={CalendarPlus} size={14} />
          Agendar cita
        </button>
      </div>
      {error ? (
        <LoadError message={error} onRetry={reload} />
      ) : !data ? (
        <p className="text-sm text-muted-foreground">Cargando…</p>
      ) : data.appointments.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">Sin citas. Agenda una por videollamada o presencial; el estudiante la ve en «Clases en vivo».</p>
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border bg-background">
          {data.appointments.map((a) => {
            const open = a.status === 'scheduled' && a.mode === 'virtual' && now > 0 && livePhase(a.scheduledAt, a.durationMin, now) !== 'ended';
            return (
              <li key={a.id} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
                <span className="min-w-0 flex-1 basis-56">
                  <span className="block font-medium text-foreground first-letter:uppercase">
                    {liveDay(a.scheduledAt)}, {liveTime(a.scheduledAt)}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {a.durationMin} min · {a.mode === 'virtual' ? providerLabels[a.provider as LiveProvider] : 'Presencial'}
                  </span>
                </span>
                <span className={cn('pill', statusClass[a.status])}>{appointmentStatusLabels[a.status] ?? a.status}</span>
                {a.status === 'scheduled' && (
                  <span className="flex flex-wrap gap-1">
                    {open && (
                      <Link href={liveHref('psychology', a.id)} className="btn-brand h-8 px-3 text-xs">
                        <MorphIcon icon={Video} size={14} />
                        Abrir la sala
                      </Link>
                    )}
                    <button type="button" className="btn-alt h-8 px-3 text-xs" disabled={isPending} onClick={(): void => setStatus(a, 'held')}>
                      Realizada
                    </button>
                    <button type="button" className="btn-alt h-8 px-3 text-xs" disabled={isPending} onClick={(): void => setStatus(a, 'missed')}>
                      No asistió
                    </button>
                    <button type="button" className="btn-alt h-8 px-3 text-xs" onClick={(): void => setEditing(a)} aria-label="Cambiar la cita">
                      <MorphIcon icon={Pencil} size={14} />
                    </button>
                    <button type="button" className="btn-alt h-8 px-3 text-xs" disabled={isPending} onClick={(): void => setStatus(a, 'cancelled')} aria-label="Cancelar la cita">
                      <MorphIcon icon={X} size={14} />
                    </button>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {editing && (
        <AppointmentDialog
          slug={slug}
          caseId={caseId}
          appointment={editing === 'new' ? null : editing}
          platformAvailable={data?.platformAvailable ?? null}
          onClose={(): void => setEditing(null)}
          onSaved={(): void => {
            setEditing(null);
            reload();
          }}
        />
      )}
    </section>
  );
};

interface DialogProps {
  slug: string;
  caseId: string;
  appointment: Appointment | null;
  platformAvailable: boolean | null;
  onClose: () => void;
  onSaved: () => void;
}

const AppointmentDialog = ({ slug, caseId, appointment, platformAvailable, onClose, onSaved }: DialogProps): JSX.Element => {
  const [v, setV] = useState<AppointmentInput>(() =>
    appointment ? { id: appointment.id, caseId, scheduledAt: isoToLimaLocal(appointment.scheduledAt), durationMin: appointment.durationMin, mode: appointment.mode === 'in_person' ? 'in_person' : 'virtual', provider: appointment.provider === 'meet' ? 'meet' : 'platform', link: appointment.link } : { id: '', caseId, scheduledAt: tomorrowAfternoon(), durationMin: 45, mode: 'virtual', provider: 'platform', link: '' },
  );
  const set = (patch: Partial<AppointmentInput>): void => setV((x) => ({ ...x, ...patch }));
  useProviderFallback(
    platformAvailable,
    v.provider,
    !appointment,
    useCallback((p: LiveProvider): void => setV((x) => ({ ...x, provider: p })), []),
  );
  const [isPending, start] = useTransition();
  const errors = {
    when: !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v.scheduledAt) ? 'Indica la fecha y la hora.' : '',
    link: v.mode === 'virtual' && v.provider === 'meet' && v.link.trim() && !/^https:\/\/\S+$/.test(v.link.trim()) ? 'El enlace empieza con https://' : '',
  };
  const invalid = Boolean(errors.when || errors.link) || v.durationMin < 5 || v.durationMin > 240;
  const submit = (): void =>
    start(async () => {
      const r = await runAcademicAction(saveAppointmentAction(slug, { ...v, link: v.mode === 'virtual' && v.provider === 'meet' ? v.link : '' }));
      if (r.ok) onSaved();
    });
  return (
    <FormDialog title={appointment ? 'Cambiar la cita' : 'Agendar cita'} description="El estudiante ve solo la fecha, la hora y cómo unirse." submitLabel={appointment ? 'Guardar' : 'Agendar'} isPending={isPending} disabled={invalid} onSubmit={submit} onClose={onClose} wide>
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField id="appt-when" label="Fecha y hora" required error={errors.when || undefined}>
          <Input id="appt-when" type="datetime-local" value={v.scheduledAt} onChange={(e): void => set({ scheduledAt: e.target.value })} />
        </FormField>
        <FormField id="appt-duration" label="Duración (minutos)">
          <Input id="appt-duration" type="number" min={5} max={240} step={5} value={v.durationMin} onChange={(e): void => set({ durationMin: Number(e.target.value) })} />
        </FormField>
        <FormField id="appt-mode" label="Modalidad">
          <SelectField
            id="appt-mode"
            value={v.mode}
            options={[
              { value: 'virtual', label: 'Virtual' },
              { value: 'in_person', label: 'Presencial' },
            ]}
            onChange={(m): void => set({ mode: m === 'in_person' ? 'in_person' : 'virtual' })}
          />
        </FormField>
      </div>
      {v.mode === 'virtual' && <ProviderPickerField v={v} platformAvailable={platformAvailable !== false || appointment?.provider === 'platform'} linkError={errors.link} set={set} />}
    </FormDialog>
  );
};

const ProviderPickerField = ({ v, platformAvailable, linkError, set }: { v: AppointmentInput; platformAvailable: boolean; linkError: string; set: (patch: Partial<AppointmentInput>) => void }): JSX.Element => <ProviderPicker id="appt" provider={v.provider} link={v.link} platformAvailable={platformAvailable} onProvider={(provider): void => set({ provider })} onLink={(link): void => set({ link })} linkError={linkError || undefined} linkOptional />;
