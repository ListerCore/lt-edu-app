'use client';

import { useState, useTransition, type JSX } from 'react';
import { ArrowLeft, ClipboardCheck, Pencil, Plus } from 'lucide';
import { sileo } from 'sileo';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Textarea } from '@/components/ui/textarea';
import { AcademicPage, ConfirmDelete, LoadError, PageSkeleton, SelectField } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { formatDay } from '@/features/protected/academic/data/academic-data';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useAcademicForm } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { useToday } from '@/features/protected/academic/hooks/use-today';
import { SearchBox } from '@/features/protected/people/components/people-ui';
import { isProgramsEvent } from '@/hooks/use-live';
import { cn } from '@/lib/utils';
import { addLogAction, deleteInternshipAction, deleteLogAction, evaluateAction, getInternshipAction, getMyRecordsAction, getProgramsAction, getRecordAction, listInternshipsAction, listProgramStudentsAction, saveInternshipAction } from '../actions/programs-actions';
import { hoursText, internshipClass, internshipLabels } from '../data/programs-data';
import type { AcademicResult } from '@/features/protected/academic/types';
import type { Internship, InternshipDetail, InternshipValues, StudentRecord } from '../types';

const fold = (v: string): string => v.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

// Experiencias formativas: where each student does the placement of each module, their hours and the supervisor's
// evaluation
export const InternshipsPage = (): JSX.Element => {
  const slug = useInstitutionSlug();
  const mine = useAcademicData(`my-records:${slug}`, () => getMyRecordsAction(slug), isProgramsEvent);
  const programs = useAcademicData(`programs:${slug}`, () => getProgramsAction(slug), isProgramsEvent);
  const [levelId, setLevelId] = useState('');
  const [status, setStatus] = useState('ongoing');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const list = useAcademicData(`internships:${slug}:${levelId}:${status}`, () => listInternshipsAction(slug, levelId, status), isProgramsEvent);

  if (mine.data && mine.data.length > 0) {
    const own = mine.data[0].modules.flatMap((m) => m.units.flatMap((u) => u.internships));
    return (
      <AcademicPage titleId="intern-title" title="Experiencias formativas" description="Tus experiencias formativas en situaciones reales de trabajo, con las horas registradas y su evaluación." context={null}>
        {open ? <Detail slug={slug} id={open} onBack={(): void => setOpen(null)} /> : <InternshipList items={own} onOpen={setOpen} />}
      </AcademicPage>
    );
  }

  const rows = (list.data?.internships ?? []).filter((x) => !query || fold(`${x.studentName} ${x.company} ${x.studentCode}`).includes(fold(query)));
  return (
    <AcademicPage
      titleId="intern-title"
      title="Experiencias formativas"
      description="Las experiencias formativas en situaciones reales de trabajo (EFSRT) de cada módulo: la empresa, el supervisor, las horas y la evaluación."
      context={list.data ? { canManage: list.data.canManage } : null}
      actions={
        <button type="button" className="btn-brand" onClick={(): void => setCreating(true)}>
          <MorphIcon icon={Plus} size={16} />
          Registrar experiencia
        </button>
      }
    >
      {open ? (
        <Detail slug={slug} id={open} onBack={(): void => setOpen(null)} />
      ) : (
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <SearchBox value={query} onChange={setQuery} placeholder="Buscar estudiante o empresa" />
            <SelectField id="intern-program" value={levelId} options={[{ value: '', label: 'Todos los programas' }, ...(programs.data?.programs ?? []).map((p) => ({ value: p.levelId, label: p.name }))]} onChange={setLevelId} />
            <SelectField id="intern-status" value={status} options={[{ value: 'ongoing', label: 'En curso' }, { value: 'approved', label: 'Aprobadas' }, { value: 'failed', label: 'Desaprobadas' }, { value: '', label: 'Todas' }]} onChange={setStatus} />
          </div>
          {list.error ? <LoadError message={list.error} onRetry={list.reload} /> : !list.data ? <PageSkeleton /> : <InternshipList items={rows} onOpen={setOpen} showStudent />}
        </div>
      )}
      {creating && programs.data && (
        <NewDialog
          slug={slug}
          programs={programs.data.programs.filter((p) => p.canManage).map((p) => ({ value: p.levelId, label: p.name }))}
          onClose={(): void => setCreating(false)}
          onSaved={(x): void => {
            setCreating(false);
            setOpen(x.id);
          }}
        />
      )}
    </AcademicPage>
  );
};

const InternshipList = ({ items, onOpen, showStudent }: { items: Internship[]; onOpen: (id: string) => void; showStudent?: boolean }): JSX.Element =>
  items.length === 0 ? (
    <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">No hay experiencias formativas con esos filtros.</p>
  ) : (
    <ul className="grid gap-3 lg:grid-cols-2">
      {items.map((x) => {
        const pct = Math.min(100, ((x.loggedHours ?? 0) * 100) / (x.requiredHours || 1));
        const ready = x.status === 'ongoing' && (x.loggedHours ?? 0) >= x.requiredHours;
        return (
          <li key={x.id}>
            <button type="button" onClick={(): void => onOpen(x.id)} className="w-full rounded-2xl border border-border bg-background p-4 text-left transition-colors hover:border-foreground/25">
              <span className="flex items-start justify-between gap-3">
                <span className="min-w-0">
                  {showStudent && <span className="block truncate font-semibold text-foreground">{x.studentName}</span>}
                  <span className={cn('block truncate', showStudent ? 'text-xs text-muted-foreground' : 'font-semibold text-foreground')}>
                    {x.subjectName} · {x.programName}
                  </span>
                  <span className="block truncate text-sm text-foreground">{x.company}</span>
                </span>
                <span className={cn('pill shrink-0', ready ? 'bg-warning/14 text-warning' : internshipClass[x.status])}>{ready ? 'Por evaluar' : internshipLabels[x.status]}</span>
              </span>
              <span className="mt-3 flex items-center gap-3">
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary" aria-hidden="true">
                  <span className={cn('block h-full rounded-full', pct >= 100 ? 'bg-success' : 'bg-brand')} style={{ width: `${pct}%` }} />
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {hoursText(x.loggedHours)}/{x.requiredHours} h
                </span>
                {x.score !== undefined && <span className="text-xs font-semibold tabular-nums">Nota {String(x.score).padStart(2, '0')}</span>}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );

const Detail = ({ slug, id, onBack }: { slug: string; id: string; onBack: () => void }): JSX.Element => {
  const { data, error, reload } = useAcademicData(`internship:${slug}:${id}`, () => getInternshipAction(slug, id), isProgramsEvent);
  const today = useToday();
  const [log, setLog] = useState({ day: '', hours: '4', activity: '' });
  const [editing, setEditing] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [isPending, startTransition] = useTransition();
  if (error) return <LoadError message={error} onRetry={reload} />;
  if (!data?.internship) return <PageSkeleton />;
  const x = data.internship;
  const open = x.status === 'ongoing' && data.canEdit;
  const pct = Math.min(100, ((x.loggedHours ?? 0) * 100) / (x.requiredHours || 1));

  const act = (work: () => Promise<{ ok: boolean; message?: string }>, after?: () => void): void =>
    startTransition(async () => {
      const r = await work();
      if (!r.ok) sileo.error({ title: 'No se pudo completar', description: r.message });
      else {
        after?.();
        reload();
      }
    });

  return (
    <div className="space-y-5">
      <button type="button" className="btn-alt" onClick={onBack}>
        <MorphIcon icon={ArrowLeft} size={16} />
        Todas las experiencias
      </button>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{x.studentName}</h2>
          <p className="text-sm text-muted-foreground">
            {x.subjectName} · {x.moduleName} · {x.programName}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {open && (
            <>
              <button type="button" className="btn-alt" onClick={(): void => setEditing(true)}>
                <MorphIcon icon={Pencil} size={16} />
                Datos
              </button>
              <button type="button" className="btn-brand" onClick={(): void => setEvaluating(true)}>
                <MorphIcon icon={ClipboardCheck} size={16} />
                Evaluar
              </button>
              <ConfirmDelete title="Eliminar la experiencia formativa" description="Se borran también sus horas registradas." isPending={isPending} onConfirm={(): void => act(() => deleteInternshipAction(slug, id), onBack)} />
            </>
          )}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-2xl border border-border bg-background p-5 text-sm">
          <dt className="text-muted-foreground">Empresa</dt>
          <dd className="text-foreground">
            {x.company}
            {x.companyRuc && <span className="text-muted-foreground"> · RUC {x.companyRuc}</span>}
          </dd>
          <dt className="text-muted-foreground">Área</dt>
          <dd className="text-foreground">{x.area || '—'}</dd>
          <dt className="text-muted-foreground">Supervisor(a)</dt>
          <dd className="text-foreground">
            {x.supervisor}
            {x.supervisorContact && <span className="block text-xs text-muted-foreground">{x.supervisorContact}</span>}
          </dd>
          <dt className="text-muted-foreground">Fechas</dt>
          <dd className="text-foreground">
            {formatDay(x.startsOn)}
            {x.endsOn && ` – ${formatDay(x.endsOn)}`}
          </dd>
        </dl>
        <div className="rounded-2xl border border-border bg-background p-5">
          <p className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Horas</span>
            <span className={cn('pill', internshipClass[x.status])}>{internshipLabels[x.status]}</span>
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground tabular-nums">
            {hoursText(x.loggedHours)} <span className="text-base font-normal text-muted-foreground">de {x.requiredHours} h</span>
          </p>
          <span className="mt-2 block h-2 overflow-hidden rounded-full bg-secondary" aria-hidden="true">
            <span className={cn('block h-full rounded-full', pct >= 100 ? 'bg-success' : 'bg-brand')} style={{ width: `${pct}%` }} />
          </span>
          {x.status !== 'ongoing' && (
            <p className="mt-4 text-sm text-foreground">
              <span className="font-semibold tabular-nums">Nota {String(x.score ?? 0).padStart(2, '0')}</span> · {x.evaluation}
              <span className="block text-xs text-muted-foreground">Evaluó {x.evaluatedName}</span>
            </p>
          )}
        </div>
      </div>
      {open && (
        <form
          className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-background p-4"
          onSubmit={(e): void => {
            e.preventDefault();
            act(() => addLogAction(slug, id, { ...log, day: log.day || today }), () => setLog({ day: '', hours: '4', activity: '' }));
          }}
        >
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-foreground">Día</span>
            <Input type="date" value={log.day || today} max={today || undefined} onChange={(e): void => setLog((l) => ({ ...l, day: e.target.value }))} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-foreground">Horas</span>
            <Input placeholder="Ej.: 6" inputMode="decimal" value={log.hours} onChange={(e): void => setLog((l) => ({ ...l, hours: e.target.value.replace(/[^\d.,]/g, '').slice(0, 4) }))} className="w-20" />
          </label>
          <label className="flex min-w-60 flex-1 flex-col gap-1 text-sm">
            <span className="font-medium text-foreground">Actividad</span>
            <Input value={log.activity} maxLength={300} onChange={(e): void => setLog((l) => ({ ...l, activity: e.target.value }))} placeholder="Qué hizo ese día" />
          </label>
          <button type="submit" className="btn-brand" disabled={isPending}>
            Registrar horas
          </button>
        </form>
      )}
      <section aria-label="Horas registradas" className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Registro de horas</h3>
        {data.logs.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border px-6 py-8 text-center text-sm text-muted-foreground">Aún no hay horas registradas.</p>
        ) : (
          <ul className="max-h-96 divide-y divide-border overflow-y-auto rounded-2xl border border-border bg-background">
            {data.logs.map((l) => (
              <li key={l.id} className="flex items-center gap-3 px-4 py-2 text-sm">
                <span className="w-28 text-foreground tabular-nums">{formatDay(l.day)}</span>
                <span className="w-14 text-right font-semibold tabular-nums">{hoursText(l.hours)} h</span>
                <span className="min-w-0 flex-1 truncate text-muted-foreground">{l.activity}</span>
                {open && <ConfirmDelete compact title="Quitar el registro" description="Se restan esas horas." isPending={isPending} onConfirm={(): void => act(() => deleteLogAction(slug, id, l.id))} />}
              </li>
            ))}
          </ul>
        )}
      </section>
      {editing && <EditDialog slug={slug} x={x} onClose={(): void => setEditing(false)} onSaved={(): void => { setEditing(false); reload(); }} />}
      {evaluating && <EvaluateDialog slug={slug} detail={data} onClose={(): void => setEvaluating(false)} onSaved={(): void => { setEvaluating(false); reload(); }} />}
    </div>
  );
};

const companyFields = (values: InternshipValues, errors: Record<string, string>, setField: <K extends keyof InternshipValues>(k: K, v: InternshipValues[K]) => void): JSX.Element => (
  <>
    <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
      <FormField id="int-company" label="Empresa o institución" required error={errors.company}>
        <Input placeholder="Ej.: Clínica San Juan S.A.C." id="int-company" value={values.company} maxLength={160} onChange={(e): void => setField('company', e.target.value)} aria-invalid={Boolean(errors.company)} />
      </FormField>
      <FormField id="int-ruc" label="RUC" error={errors.companyRuc}>
        <Input placeholder="11 dígitos" id="int-ruc" inputMode="numeric" value={values.companyRuc} onChange={(e): void => setField('companyRuc', e.target.value.replace(/\D/g, '').slice(0, 11))} aria-invalid={Boolean(errors.companyRuc)} />
      </FormField>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField id="int-sup" label="Supervisor(a)" required error={errors.supervisor}>
        <Input placeholder="Nombre y apellidos" id="int-sup" value={values.supervisor} maxLength={160} onChange={(e): void => setField('supervisor', e.target.value)} aria-invalid={Boolean(errors.supervisor)} />
      </FormField>
      <FormField id="int-contact" label="Contacto del supervisor">
        <Input placeholder="Teléfono o correo" id="int-contact" value={values.supervisorContact} maxLength={160} onChange={(e): void => setField('supervisorContact', e.target.value)} />
      </FormField>
      <FormField id="int-area" label="Área" error={errors.area}>
        <Input placeholder="Ej.: Hospitalización" id="int-area" value={values.area} maxLength={120} onChange={(e): void => setField('area', e.target.value)} />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField id="int-start" label="Inicio" required error={errors.startsOn}>
          <Input id="int-start" type="date" value={values.startsOn} onChange={(e): void => setField('startsOn', e.target.value)} />
        </FormField>
        <FormField id="int-end" label="Fin" error={errors.endsOn}>
          <Input id="int-end" type="date" value={values.endsOn} min={values.startsOn} onChange={(e): void => setField('endsOn', e.target.value)} />
        </FormField>
      </div>
    </div>
  </>
);

const EditDialog = ({ slug, x, onClose, onSaved }: { slug: string; x: Internship; onClose: () => void; onSaved: () => void }): JSX.Element => {
  const form = useAcademicForm<InternshipValues, Internship>({
    initial: { studentId: x.studentId, subjectId: x.subjectId, company: x.company, companyRuc: x.companyRuc, area: x.area, supervisor: x.supervisor, supervisorContact: x.supervisorContact, startsOn: x.startsOn, endsOn: x.endsOn },
    save: (v) => saveInternshipAction(slug, x.id, v),
    onSaved,
  });
  return (
    <FormDialog title="Datos de la experiencia formativa" submitLabel="Guardar" isPending={form.isPending} onSubmit={form.submit} onClose={onClose} wide>
      {companyFields(form.values, form.errors, form.setField)}
    </FormDialog>
  );
};

const NewDialog = ({ slug, programs, onClose, onSaved }: { slug: string; programs: Array<{ value: string; label: string }>; onClose: () => void; onSaved: (x: Internship) => void }): JSX.Element => {
  const [levelId, setLevelId] = useState(programs[0]?.value ?? '');
  const students = useAcademicData(`intern-students:${slug}:${levelId}`, () => listProgramStudentsAction(slug, levelId, ''), () => false);
  const form = useAcademicForm<InternshipValues, Internship>({
    initial: { studentId: '', subjectId: '', company: '', companyRuc: '', area: '', supervisor: '', supervisorContact: '', startsOn: '', endsOn: '' },
    validate: (v): Record<string, string> => {
      const e: Record<string, string> = {};
      if (!v.studentId) e.studentId = 'Elige al estudiante.';
      if (!v.subjectId) e.subjectId = 'Elige la experiencia formativa.';
      if (!v.company.trim()) e.company = 'Indica la empresa.';
      if (!v.supervisor.trim()) e.supervisor = 'Indica el supervisor.';
      if (!v.startsOn) e.startsOn = 'Indica el inicio.';
      return e;
    },
    save: (v) => saveInternshipAction(slug, '', v),
    onSaved,
  });
  const { values, errors, setField } = form;
  const record = useAcademicData(`intern-record:${slug}:${values.studentId}`, async (): Promise<AcademicResult<StudentRecord | null>> => (values.studentId ? getRecordAction(slug, values.studentId) : { ok: true, data: null }), () => false);
  const efsrts = (record.data?.modules ?? []).flatMap((m) => m.units.filter((u) => u.kind === 'efsrt' && u.standing?.status !== 'approved' && !u.internships.some((i) => i.status === 'ongoing')).map((u) => ({ value: u.subjectId, label: `${u.name} · ${m.name} (${u.hours} h)` })));
  return (
    <FormDialog title="Registrar experiencia formativa" description="Las horas exigidas salen de los créditos de la experiencia: 32 horas por crédito práctico." submitLabel="Registrar" isPending={form.isPending} onSubmit={form.submit} onClose={onClose} wide>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="int-program" label="Programa" required>
          <SelectField id="int-program" value={levelId} options={programs} onChange={(v): void => { setLevelId(v); setField('studentId', ''); setField('subjectId', ''); }} />
        </FormField>
        <FormField id="int-student" label="Estudiante" required error={errors.studentId}>
          <SelectField id="int-student" value={values.studentId} placeholder="Elige" options={(students.data ?? []).filter((s) => s.status === 'active').map((s) => ({ value: s.id, label: `${s.name} · ${s.semester}` }))} onChange={(v): void => { setField('studentId', v); setField('subjectId', ''); }} invalid={Boolean(errors.studentId)} />
        </FormField>
      </div>
      <FormField id="int-subject" label="Experiencia formativa" required error={errors.subjectId} hint={values.studentId && efsrts.length === 0 ? 'No tiene experiencias formativas pendientes.' : undefined}>
        <SelectField id="int-subject" value={values.subjectId} placeholder="Elige" disabled={efsrts.length === 0} options={efsrts} onChange={(v): void => setField('subjectId', v)} invalid={Boolean(errors.subjectId)} />
      </FormField>
      {companyFields(values, errors, setField)}
    </FormDialog>
  );
};

const EvaluateDialog = ({ slug, detail, onClose, onSaved }: { slug: string; detail: InternshipDetail; onClose: () => void; onSaved: () => void }): JSX.Element => {
  const x = detail.internship;
  const [score, setScore] = useState('');
  const [text, setText] = useState('');
  const [isPending, startTransition] = useTransition();
  const n = /^\d{1,2}$/.test(score) ? Number(score) : -1;
  const missing = (x?.requiredHours ?? 0) - (x?.loggedHours ?? 0);
  return (
    <FormDialog
      title="Evaluación del supervisor"
      description={missing > 0 ? `Aún faltan ${hoursText(missing)} horas: solo se puede registrar una nota desaprobatoria.` : `Aprueba con ${detail.passingGrade}.`}
      submitLabel="Registrar evaluación"
      isPending={isPending}
      disabled={n < 0 || n > 20 || !text.trim()}
      onSubmit={(): void =>
        startTransition(async () => {
          const r = await evaluateAction(slug, x?.id ?? '', n, text.trim());
          if (!r.ok) sileo.error({ title: 'No se pudo registrar', description: r.message });
          else {
            sileo.success({ title: n >= detail.passingGrade ? 'Experiencia formativa aprobada' : 'Experiencia formativa desaprobada' });
            onSaved();
          }
        })
      }
      onClose={onClose}
    >
      <FormField id="eval-score" label="Nota (0 a 20)" required>
        <Input placeholder="0 a 20" id="eval-score" inputMode="numeric" value={score} onChange={(e): void => setScore(e.target.value.replace(/\D/g, '').slice(0, 2))} className="w-24" />
      </FormField>
      <FormField id="eval-text" label="Resumen de la evaluación" required hint="Lo que dijo el supervisor sobre su desempeño.">
        <Textarea placeholder="Desempeño del practicante y recomendaciones" id="eval-text" value={text} rows={4} maxLength={1000} onChange={(e): void => setText(e.target.value)} />
      </FormField>
    </FormDialog>
  );
};
