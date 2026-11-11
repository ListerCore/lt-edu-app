'use client';

import { useMemo, useState, type JSX } from 'react';
import { ArrowLeft, Plus, Printer } from 'lucide';
import { FormField } from '@/components/ui/form-field';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AcademicPage, ConfirmDelete, LoadError, PageSkeleton, SelectField } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { formatDay } from '@/features/protected/academic/data/academic-data';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { SearchBox } from '@/features/protected/people/components/people-ui';
import { isWellbeingEvent } from '@/hooks/use-live';
import { cn } from '@/lib/utils';
import { deletePlanAction, getPlanAction, listPlansAction, savePlanAction, setPlanStatusAction } from '../actions/wellbeing-actions';
import { planStatusLabels } from '../data/wellbeing-data';
import type { IndividualPlan, PlansBoard } from '../types';
import { TextArea, useAct } from './wellbeing-ui';

const fold = (v: string): string => v.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

// The sections of a POI, in the order of the printed document
const sections: Array<{ key: keyof IndividualPlan; label: string; max: number; hint?: string; placeholder: string }> = [
  { key: 'needs', label: 'Necesidades educativas', max: 2000, hint: 'Diagnóstico o condición y barreras para aprender y participar.', placeholder: 'Ej.: Trastorno del espectro autista; dificultad para seguir consignas largas' },
  { key: 'strengths', label: 'Fortalezas e intereses', max: 2000, placeholder: 'Ej.: Le gusta dibujar y recuerda bien lo que ve' },
  { key: 'educationalResponse', label: 'Respuesta educativa', max: 4000, hint: 'Cómo se organiza la enseñanza y los apoyos para este estudiante.', placeholder: 'Ej.: Apoyo de la docente SAANEE dos veces por semana' },
  { key: 'curricularAdaptations', label: 'Adaptaciones curriculares', max: 4000, hint: 'Competencias priorizadas y desempeños ajustados.', placeholder: 'Ej.: Prioriza «Resuelve problemas de cantidad» con números hasta el 100' },
  { key: 'accessAdaptations', label: 'Adaptaciones de acceso', max: 4000, hint: 'Materiales, espacio, comunicación, tiempos.', placeholder: 'Ej.: Pictogramas, ubicación cerca de la pizarra, más tiempo en las evaluaciones' },
  { key: 'evaluationCriteria', label: 'Criterios de evaluación', max: 2000, hint: 'Escala AD/A/B/C frente a lo previsto en las adaptaciones.', placeholder: 'Ej.: Logro esperado si resuelve sumas con apoyo concreto' },
  { key: 'actors', label: 'Actores que intervienen', max: 2000, placeholder: 'Ej.: Docente de aula, terapeuta de lenguaje, familia' },
  { key: 'familyCommitments', label: 'Compromisos de la familia', max: 2000, placeholder: 'Ej.: Practicar en casa las tareas de terapia' },
];

// Planes de orientación individual (EBE): coordinación opens each plan and assigns the specialist, who writes it;
// coordinación approves it and then the family can read it
export const PlansPage = (): JSX.Element => {
  const slug = useInstitutionSlug();
  const { data, error, reload } = useAcademicData(`wb-plans:${slug}`, () => listPlansAction(slug), isWellbeingEvent);
  const [open, setOpen] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState('');
  const rows = useMemo(() => (data?.plans ?? []).filter((p) => !query || fold(`${p.studentName} ${p.placement} ${p.specialistName}`).includes(fold(query))), [data, query]);
  const missing = (data?.students ?? []).filter((s) => s.specialNeeds && !s.hasPlan);
  return (
    <AcademicPage
      titleId="poi-title"
      title="Planes de orientación individual"
      description="La respuesta educativa de cada estudiante con necesidades educativas especiales: adaptaciones curriculares y de acceso, criterios de evaluación y quiénes intervienen."
      // The buttons below already follow what the API allows this person
      context={{ canManage: true }}
      actions={
        data?.canManage && (
          <button type="button" className="btn-brand" onClick={(): void => setCreating(true)}>
            <MorphIcon icon={Plus} size={16} />
            Nuevo plan
          </button>
        )
      }
    >
      {error ? (
        <LoadError message={error} onRetry={reload} />
      ) : !data ? (
        <PageSkeleton />
      ) : open ? (
        <PlanScreen slug={slug} id={open} board={data} onBack={(): void => setOpen(null)} />
      ) : (
        <div className="space-y-4">
          {data.canManage && missing.length > 0 && (
            <p className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-foreground">
              {missing.length === 1 ? '1 estudiante con necesidades especiales aún no tiene plan' : `${missing.length} estudiantes con necesidades especiales aún no tienen plan`} en {data.periodName}.
            </p>
          )}
          {data.plans.length > 8 && <SearchBox value={query} onChange={setQuery} placeholder="Buscar estudiante, sección o especialista" />}
          {rows.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">{data.plans.length === 0 ? 'No hay planes a tu cargo en el periodo.' : 'Nada coincide con la búsqueda.'}</p>
          ) : (
            <ul className="divide-y divide-border rounded-2xl border border-border bg-background">
              {rows.map((p) => (
                <li key={p.id}>
                  <button type="button" onClick={(): void => setOpen(p.id)} className="flex w-full flex-wrap items-center gap-3 px-4 py-3 text-left hover:bg-surface">
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-foreground">{p.studentName}</span>
                      <span className="block text-xs text-muted-foreground">
                        {p.placement} · {p.specialistName || 'sin especialista'} · {p.therapies === 1 ? '1 sesión de terapia' : `${p.therapies} sesiones de terapia`}
                      </span>
                    </span>
                    <span className={cn('pill', p.status === 'approved' ? 'bg-success/12 text-success' : 'bg-secondary text-muted-foreground')}>{planStatusLabels[p.status]}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {creating && data && (
        <NewPlanDialog
          slug={slug}
          board={data}
          onClose={(): void => setCreating(false)}
          onSaved={(id): void => {
            setCreating(false);
            setOpen(id);
          }}
        />
      )}
    </AcademicPage>
  );
};

// Coordinación opens a plan: the student and the specialist who will write it
const NewPlanDialog = ({ slug, board, onClose, onSaved }: { slug: string; board: PlansBoard; onClose: () => void; onSaved: (id: string) => void }): JSX.Element => {
  const [isPending, act] = useAct();
  const candidates = board.students.filter((s) => !s.hasPlan).sort((a, b) => Number(b.specialNeeds) - Number(a.specialNeeds));
  const [studentId, setStudentId] = useState(candidates[0]?.id ?? '');
  const [specialistId, setSpecialistId] = useState('');
  return (
    <FormDialog
      title="Nuevo plan de orientación individual"
      description={`Periodo ${board.periodName}. El especialista asignado lo redacta y coordinación lo aprueba.`}
      submitLabel="Crear plan"
      isPending={isPending}
      disabled={!studentId}
      onSubmit={(): void =>
        act(
          async () => {
            const r = await savePlanAction(slug, { ...emptyPlan, studentId, specialistId, periodId: board.periodId });
            if (r.ok) onSaved(r.data.id);
            return r;
          },
        )
      }
      onClose={onClose}
    >
      <FormField id="np-student" label="Estudiante" required hint="Primero los que tienen necesidades educativas especiales registradas.">
        <SelectField id="np-student" value={studentId} options={candidates.map((s) => ({ value: s.id, label: `${s.name} · ${s.placement}${s.specialNeeds ? ' · NEE' : ''}` }))} onChange={setStudentId} />
      </FormField>
      <FormField id="np-specialist" label="Especialista a cargo">
        <SelectField id="np-specialist" value={specialistId} placeholder="Elige al especialista" options={board.specialists.map((s) => ({ value: s.id, label: `${s.name} · ${s.position}` }))} onChange={setSpecialistId} />
      </FormField>
    </FormDialog>
  );
};

const emptyPlan: IndividualPlan = {
  id: '',
  studentId: '',
  studentName: '',
  placement: '',
  periodId: '',
  periodName: '',
  specialistId: '',
  specialistName: '',
  needs: '',
  strengths: '',
  educationalResponse: '',
  curricularAdaptations: '',
  accessAdaptations: '',
  evaluationCriteria: '',
  actors: '',
  familyCommitments: '',
  status: 'draft',
  approvedName: '',
  approvedOn: '',
  updatedAt: '',
  therapies: 0,
};

// One plan as a printable document, with its editor, approval and deletion
const PlanScreen = ({ slug, id, board, onBack }: { slug: string; id: string; board: PlansBoard; onBack: () => void }): JSX.Element => {
  const { data, error, reload } = useAcademicData(`wb-plan:${slug}:${id}`, () => getPlanAction(slug, id), isWellbeingEvent);
  const [isPending, act] = useAct();
  const [editing, setEditing] = useState(false);
  if (error) return <LoadError message={error} onRetry={reload} />;
  if (!data) return <PageSkeleton />;
  const p = data.plan;
  const draft = p.status === 'draft';
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between gap-2 print:hidden">
        <button type="button" className="btn-alt" onClick={onBack}>
          <MorphIcon icon={ArrowLeft} size={16} />
          Volver
        </button>
        <span className="flex flex-wrap gap-2">
          {draft && board.canWrite && (
            <button type="button" className="btn-alt" onClick={(): void => setEditing(true)}>
              Editar
            </button>
          )}
          {board.canManage && (
            <button type="button" className="btn-alt" disabled={isPending} onClick={(): void => act(() => setPlanStatusAction(slug, p.id, draft ? 'approved' : 'draft'), reload)}>
              {draft ? 'Aprobar' : 'Reabrir'}
            </button>
          )}
          {board.canManage && draft && <ConfirmDelete compact title="Eliminar el plan" description="Se borra el borrador; las terapias registradas se conservan." isPending={isPending} onConfirm={(): void => act(() => deletePlanAction(slug, p.id), onBack)} />}
          <button type="button" className="btn-brand" onClick={(): void => window.print()}>
            <MorphIcon icon={Printer} size={16} />
            Imprimir
          </button>
        </span>
      </div>
      <div data-print-cards>
        <article data-print-card className="mx-auto max-w-3xl space-y-5 rounded-2xl border border-border bg-background p-8 print:border-0 print:p-0">
          <header className="border-b-2 border-brand pb-3">
            <p className="font-semibold text-brand">{data.institution}</p>
            <h2 className="text-xl font-semibold text-foreground">Plan de orientación individual · {p.periodName}</h2>
            <p className="text-sm text-muted-foreground">
              {p.studentName} · {p.placement}
            </p>
            <p className="text-xs text-muted-foreground">
              Especialista a cargo: {p.specialistName || '—'} · {planStatusLabels[p.status]}
              {p.approvedOn && ` el ${formatDay(p.approvedOn)} por ${p.approvedName}`}
            </p>
          </header>
          {sections.map((s) => (
            <section key={s.key} className="break-inside-avoid">
              <h3 className="text-sm font-semibold text-foreground">{s.label}</h3>
              <p className="mt-1 text-sm whitespace-pre-line text-muted-foreground">{String(p[s.key] || '—')}</p>
            </section>
          ))}
        </article>
      </div>
      {editing && (
        <PlanEditor
          slug={slug}
          plan={p}
          board={board}
          onClose={(): void => setEditing(false)}
          onSaved={(): void => {
            setEditing(false);
            reload();
          }}
        />
      )}
    </div>
  );
};

// Writes the sections of the plan (coordinación may also change the specialist)
const PlanEditor = ({ slug, plan, board, onClose, onSaved }: { slug: string; plan: IndividualPlan; board: PlansBoard; onClose: () => void; onSaved: () => void }): JSX.Element => {
  const [isPending, act] = useAct();
  const [v, setV] = useState<IndividualPlan>(plan);
  return (
    <FormDialog title="Editar el plan" description={`${plan.studentName} · ${plan.periodName}`} submitLabel="Guardar plan" isPending={isPending} wide onSubmit={(): void => act(() => savePlanAction(slug, v), onSaved)} onClose={onClose}>
      {board.canManage && (
        <FormField id="pe-specialist" label="Especialista a cargo">
          <SelectField id="pe-specialist" value={v.specialistId} options={board.specialists.map((s) => ({ value: s.id, label: `${s.name} · ${s.position}` }))} onChange={(x): void => setV({ ...v, specialistId: x })} />
        </FormField>
      )}
      {sections.map((s) => (
        <TextArea key={s.key} id={`pe-${s.key}`} label={s.label} hint={s.hint} value={String(v[s.key])} max={s.max} onChange={(x): void => setV({ ...v, [s.key]: x })} rows={s.max > 2000 ? 4 : 3} placeholder={s.placeholder} />
      ))}
    </FormDialog>
  );
};
