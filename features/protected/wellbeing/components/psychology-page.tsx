'use client';

import { useState, type JSX } from 'react';
import { ArrowLeft, Lock, Plus, Stethoscope } from 'lucide';
import { FormField } from '@/components/ui/form-field';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AcademicPage, ConfirmDelete, LoadError, PageSkeleton, SelectField } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { formatDay } from '@/features/protected/academic/data/academic-data';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { useToday } from '@/features/protected/academic/hooks/use-today';
import { isWellbeingEvent } from '@/hooks/use-live';
import { cn } from '@/lib/utils';
import { addSessionAction, deleteSessionAction, getCaseAction, getPsychologyAction, updateCaseAction } from '../actions/wellbeing-actions';
import { caseStatusClass, caseStatusLabels, originLabels, sessionKindLabels } from '../data/wellbeing-data';
import type { PsychCase, PsychBoard } from '../types';
import { StudentFileView } from './student-file';
import { ReferDialog } from './wellbeing-dialogs';
import { DateInput, OneOf, TextArea, useAct } from './wellbeing-ui';

// Psicología: psychologists work their cases (confidential); dirección sees only counts; whoever referred sees the
// status of their referrals and the recommendations shared with them
export const PsychologyPage = (): JSX.Element => {
  const slug = useInstitutionSlug();
  const [status, setStatus] = useState('active');
  const { data, error, reload } = useAcademicData(`wb-psy:${slug}:${status}`, () => getPsychologyAction(slug, status), isWellbeingEvent);
  const [open, setOpen] = useState<string | null>(null);
  const [refer, setRefer] = useState(false);
  return (
    <AcademicPage
      titleId="psy-title"
      title="Psicología"
      description={data?.canManage ? 'Casos derivados y en atención, con sus sesiones. Lo que registras aquí es confidencial: solo lo ve el equipo de psicología.' : 'Deriva estudiantes al equipo de psicología y sigue el estado de tus derivaciones. El contenido de los casos es confidencial.'}
      // The buttons below already follow what the API allows this person
      context={{ canManage: true }}
      actions={
        data && (
          <button type="button" className="btn-brand" onClick={(): void => setRefer(true)}>
            <MorphIcon icon={Stethoscope} size={16} />
            {data.canManage ? 'Abrir caso' : 'Derivar a psicología'}
          </button>
        )
      }
    >
      {error ? (
        <LoadError message={error} onRetry={reload} />
      ) : !data ? (
        <PageSkeleton />
      ) : open ? (
        <CaseScreen slug={slug} id={open} onBack={(): void => setOpen(null)} />
      ) : (
        <div className="space-y-5">
          <Counts b={data} />
          {data.canManage && (
            <div role="tablist" aria-label="Estado" className="flex gap-1 overflow-x-auto border-b border-border">
              {[
                ['active', 'Activos'],
                ['referred', 'Por atender'],
                ['open', 'En atención'],
                ['follow_up', 'Seguimiento'],
                ['closed', 'Cerrados'],
              ].map(([k, label]) => (
                <button key={k} type="button" role="tab" aria-selected={status === k} onClick={(): void => setStatus(k ?? '')} className={cn('-mb-px border-b-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap', status === k ? 'border-brand text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground')}>
                  {label}
                </button>
              ))}
            </div>
          )}
          {data.confidential && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <MorphIcon icon={Lock} size={14} />
              {data.cases.length > 0 ? 'Tus derivaciones:' : 'No tienes derivaciones. El detalle de los casos solo lo ve el equipo de psicología.'}
            </p>
          )}
          {data.cases.length > 0 && (
            <ul className="divide-y divide-border rounded-2xl border border-border bg-background">
              {data.cases.map((c) => (
                <li key={c.id}>
                  <CaseRow c={c} onOpen={data.canManage ? (): void => setOpen(c.id) : undefined} />
                </li>
              ))}
            </ul>
          )}
          {data.canManage && data.cases.length === 0 && <p className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">No hay casos en este estado.</p>}
        </div>
      )}
      {refer && (
        <ReferDialog
          slug={slug}
          student={null}
          onClose={(): void => setRefer(false)}
          onSaved={(): void => {
            setRefer(false);
            reload();
          }}
        />
      )}
    </AcademicPage>
  );
};

// Counts by status (the only thing dirección sees)
const Counts = ({ b }: { b: PsychBoard }): JSX.Element => (
  <div className="grid gap-3 sm:grid-cols-5">
    {['referred', 'open', 'follow_up', 'closed'].map((k) => (
      <div key={k} className="rounded-2xl border border-border bg-background p-4">
        <p className="text-sm text-muted-foreground">{caseStatusLabels[k]}</p>
        <p className="mt-1 text-2xl font-semibold text-foreground tabular-nums">{b.byStatus[k] ?? 0}</p>
      </div>
    ))}
    <div className={cn('rounded-2xl border p-4', b.urgent > 0 ? 'border-destructive/40 bg-destructive/5' : 'border-border bg-background')}>
      <p className="text-sm text-muted-foreground">Urgentes abiertos</p>
      <p className={cn('mt-1 text-2xl font-semibold tabular-nums', b.urgent > 0 ? 'text-destructive' : 'text-foreground')}>{b.urgent}</p>
    </div>
  </div>
);

// One case in the list
const CaseRow = ({ c, onOpen }: { c: PsychCase; onOpen?: () => void }): JSX.Element => {
  const body = (
    <>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-foreground">{c.studentName}</span>
        <span className="block text-xs text-muted-foreground">
          {c.placement} · {originLabels[c.origin]}: {c.referredName} · {formatDay(c.openedOn, false)}
        </span>
        <span className="line-clamp-1 block text-sm text-muted-foreground">{c.reason}</span>
        {c.sharedNote && !onOpen && <span className="mt-1 block text-sm text-foreground">Recomendación: {c.sharedNote}</span>}
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1">
        <span className={cn('pill', caseStatusClass[c.status])}>{caseStatusLabels[c.status]}</span>
        {c.priority === 'urgent' && <span className="pill bg-destructive/10 text-destructive">Urgente</span>}
        {onOpen && <span className="text-xs text-muted-foreground">{c.sessions === 1 ? '1 sesión' : `${c.sessions} sesiones`}</span>}
      </span>
    </>
  );
  return onOpen ? (
    <button type="button" onClick={onOpen} className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-surface">
      {body}
    </button>
  ) : (
    <div className="flex items-start gap-3 px-4 py-3">{body}</div>
  );
};

// A case: its data, the note shared with whoever referred, and the sessions
const CaseScreen = ({ slug, id, onBack }: { slug: string; id: string; onBack: () => void }): JSX.Element => {
  const { data, error, reload } = useAcademicData(`wb-case:${slug}:${id}`, () => getCaseAction(slug, id), isWellbeingEvent);
  const [isPending, act] = useAct();
  const [dialog, setDialog] = useState<'session' | 'edit' | 'file' | null>(null);
  if (error) return <LoadError message={error} onRetry={reload} />;
  if (!data?.case) return <PageSkeleton />;
  const c = data.case;
  if (dialog === 'file') return <StudentFileView slug={slug} studentId={c.studentId} initialTab="tutoring" onBack={(): void => setDialog(null)} />;
  return (
    <div className="space-y-5">
      <button type="button" className="btn-alt" onClick={onBack}>
        <MorphIcon icon={ArrowLeft} size={16} />
        Volver
      </button>
      <header className="rounded-2xl border border-border bg-background px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{c.studentName}</h2>
            <p className="text-sm text-muted-foreground">
              {c.placement} · derivado por {c.referredName} ({originLabels[c.origin]?.toLowerCase()}) el {formatDay(c.openedOn)}
            </p>
          </div>
          <span className="flex gap-2">
            <span className={cn('pill', caseStatusClass[c.status])}>{caseStatusLabels[c.status]}</span>
            {c.priority === 'urgent' && <span className="pill bg-destructive/10 text-destructive">Urgente</span>}
          </span>
        </div>
        <p className="mt-3 text-sm whitespace-pre-line text-foreground">{c.reason}</p>
        {c.sharedNote && (
          <p className="mt-3 rounded-lg bg-brand-soft px-3 py-2 text-sm text-foreground">
            <span className="font-medium">Compartido con quien derivó: </span>
            {c.sharedNote}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="btn-brand" onClick={(): void => setDialog('session')}>
            <MorphIcon icon={Plus} size={16} />
            Registrar sesión
          </button>
          <button type="button" className="btn-alt" onClick={(): void => setDialog('edit')}>
            Estado y nota compartida
          </button>
          <button type="button" className="btn-alt" onClick={(): void => setDialog('file')}>
            Ver expediente
          </button>
        </div>
      </header>
      <section aria-labelledby="sessions" className="space-y-2">
        <h3 id="sessions" className="text-sm font-semibold text-foreground">
          Sesiones
        </h3>
        {data.sessions.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">Aún no hay sesiones. La primera pasa el caso a «En atención».</p>
        ) : (
          <ol className="space-y-3">
            {data.sessions.map((s) => (
              <li key={s.id} className="rounded-xl border border-border bg-background px-4 py-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-foreground">
                    {formatDay(s.heldOn)} · {sessionKindLabels[s.kind]}
                  </span>
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    {s.authorName}
                    <ConfirmDelete compact title="Eliminar la sesión" description="Solo si se registró por error." isPending={isPending} onConfirm={(): void => act(() => deleteSessionAction(slug, c.id, s.id), reload)} />
                  </span>
                </div>
                <p className="mt-1.5 whitespace-pre-line text-foreground">{s.notes}</p>
                {s.nextSteps && <p className="mt-1 text-muted-foreground">Siguiente: {s.nextSteps}</p>}
              </li>
            ))}
          </ol>
        )}
      </section>
      {dialog === 'session' && (
        <SessionDialog
          slug={slug}
          caseId={c.id}
          onClose={(): void => setDialog(null)}
          onSaved={(): void => {
            setDialog(null);
            reload();
          }}
        />
      )}
      {dialog === 'edit' && (
        <CaseDialog
          slug={slug}
          c={c}
          onClose={(): void => setDialog(null)}
          onSaved={(): void => {
            setDialog(null);
            reload();
          }}
        />
      )}
    </div>
  );
};

// Logs a session
const SessionDialog = ({ slug, caseId, onClose, onSaved }: { slug: string; caseId: string; onClose: () => void; onSaved: () => void }): JSX.Element => {
  const today = useToday();
  const [isPending, act] = useAct();
  const [kind, setKind] = useState('individual');
  const [heldOn, setHeldOn] = useState('');
  const [notes, setNotes] = useState('');
  const [next, setNext] = useState('');
  return (
    <FormDialog
      title="Registrar sesión"
      submitLabel="Guardar sesión"
      isPending={isPending}
      disabled={!notes.trim()}
      wide
      onSubmit={(): void => act(() => addSessionAction(slug, { id: '', caseId, heldOn: heldOn || today, kind, notes, nextSteps: next, authorName: '' }), onSaved)}
      onClose={onClose}
    >
      <OneOf label="Tipo" value={kind} options={Object.entries(sessionKindLabels)} onChange={setKind} />
      <DateInput id="ss-date" label="Fecha" value={heldOn || today} max={today} onChange={setHeldOn} required />
      <TextArea id="ss-notes" label="Notas (confidenciales)" value={notes} onChange={setNotes} max={4000} required rows={6} />
      <TextArea id="ss-next" label="Siguientes pasos" value={next} onChange={setNext} max={1000} />
    </FormDialog>
  );
};

// Status, priority, reason and the note shared with whoever referred
const CaseDialog = ({ slug, c, onClose, onSaved }: { slug: string; c: PsychCase; onClose: () => void; onSaved: () => void }): JSX.Element => {
  const [isPending, act] = useAct();
  const [status, setStatus] = useState(c.status);
  const [priority, setPriority] = useState(c.priority);
  const [reason, setReason] = useState(c.reason);
  const [note, setNote] = useState(c.sharedNote);
  return (
    <FormDialog
      title="Estado del caso"
      description="La nota compartida la lee quien derivó (por ejemplo, el tutor). No escribas en ella nada confidencial."
      submitLabel="Guardar"
      isPending={isPending}
      disabled={!reason.trim()}
      onSubmit={(): void => act(() => updateCaseAction(slug, { id: c.id, status, priority, reason, sharedNote: note }), onSaved)}
      onClose={onClose}
    >
      <FormField id="cs-status" label="Estado" required>
        <SelectField id="cs-status" value={status} options={Object.entries(caseStatusLabels).map(([value, label]) => ({ value, label }))} onChange={setStatus} />
      </FormField>
      <OneOf
        label="Prioridad"
        value={priority}
        options={[
          ['normal', 'Normal'],
          ['urgent', 'Urgente'],
        ]}
        onChange={setPriority}
      />
      <TextArea id="cs-reason" label="Motivo" value={reason} onChange={setReason} max={2000} required />
      <TextArea id="cs-note" label="Nota compartida con quien derivó" value={note} onChange={setNote} max={1000} />
    </FormDialog>
  );
};
