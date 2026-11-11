'use client';

import { useState, useTransition, type JSX } from 'react';
import { GraduationCap, Pencil, Plus } from 'lucide';
import { sileo } from 'sileo';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AcademicPage, ConfirmDelete, LoadError, PageSkeleton, SelectField } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { formatDay } from '@/features/protected/academic/data/academic-data';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useAcademicForm } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { SearchBox } from '@/features/protected/people/components/people-ui';
import { useDebounced } from '@/features/protected/people/hooks/use-debounced';
import { isExamsEvent } from '@/hooks/use-live';
import { cn } from '@/lib/utils';
import { deleteAdmissionAction, findStudentsAction, getExamsOverviewAction, getMyExamsAction, listAdmissionsAction, saveAdmissionAction } from '../actions/exams-actions';
import { formatScore } from '../data/exams-data';
import type { Admission, AdmissionValues } from '../types';
import { MockResultsView } from './mock-results';
import { StudentExamsView } from './student-exams';

type Tab = 'ranking' | 'admissions';

// Ranking: the published mock exams of each cycle, and the students who got into university
export const RankingsPage = (): JSX.Element => {
  const slug = useInstitutionSlug();
  const [periodId, setPeriodId] = useState('');
  const [mockId, setMockId] = useState('');
  const [tab, setTab] = useState<Tab>('ranking');
  const { data, error, reload } = useAcademicData(`exams-rank:${slug}:${periodId}`, () => getExamsOverviewAction(slug, periodId), isExamsEvent);
  const mine = useAcademicData(`my-exams:${slug}`, () => getMyExamsAction(slug), isExamsEvent);

  if (mine.data && mine.data.length > 0)
    return (
      <AcademicPage titleId="rank-title" title="Ranking" description="Tu puesto en cada simulacro: en tu aula, en tu área y en todo el ciclo." context={null}>
        <StudentExamsView items={mine.data} />
      </AcademicPage>
    );

  const published = (data?.mocks ?? []).filter((m) => m.status === 'published');
  const mock = published.find((m) => m.id === mockId) ?? published[0];

  return (
    <AcademicPage titleId="rank-title" title="Ranking e ingresantes" description="Los puestos de cada simulacro publicado por aula, área y ciclo, y los alumnos que ingresaron a la universidad." context={null}>
      {error ? (
        <LoadError message={error} onRetry={reload} />
      ) : !data ? (
        <PageSkeleton />
      ) : (
        <div className="space-y-5">
          <div role="tablist" aria-label="Vistas" className="flex gap-1 border-b border-border">
            {(
              [
                ['ranking', 'Ranking'],
                ['admissions', 'Ingresantes'],
              ] as Array<[Tab, string]>
            ).map(([k, label]) => (
              <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={(): void => setTab(k)} className={cn('-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors', tab === k ? 'border-brand text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground')}>
                {label}
              </button>
            ))}
          </div>
          {tab === 'ranking' ? (
            <>
              <div className="flex flex-wrap gap-3">
                {data.periods.length > 1 && (
                  <div className="w-60">
                    <SelectField
                      id="rank-period"
                      value={data.period?.id ?? ''}
                      options={data.periods.map((p) => ({ value: p.id, label: p.name }))}
                      onChange={(v): void => {
                        setPeriodId(v);
                        setMockId('');
                      }}
                    />
                  </div>
                )}
                {published.length > 0 && (
                  <div className="w-80">
                    <SelectField id="rank-mock" value={mock?.id ?? ''} options={published.map((m) => ({ value: m.id, label: `${m.name} · ${formatDay(m.heldOn, false)}` }))} onChange={setMockId} />
                  </div>
                )}
              </div>
              {mock ? <MockResultsView key={mock.id} slug={slug} id={mock.id} levels={data.levels} /> : <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">Este ciclo aún no tiene simulacros publicados.</p>}
            </>
          ) : (
            <Admissions slug={slug} />
          )}
        </div>
      )}
    </AcademicPage>
  );
};

const Admissions = ({ slug }: { slug: string }): JSX.Element => {
  const { data, error, reload } = useAcademicData(`admissions:${slug}`, () => listAdmissionsAction(slug), isExamsEvent);
  const [editing, setEditing] = useState<Admission | 'new' | null>(null);
  const [isPending, startTransition] = useTransition();
  if (error) return <LoadError message={error} onRetry={reload} />;
  if (!data) return <PageSkeleton />;
  const byExam = new Map<string, Admission[]>();
  for (const a of data.admissions) byExam.set(a.exam, [...(byExam.get(a.exam) ?? []), a]);
  const remove = (a: Admission): void =>
    startTransition(async () => {
      const r = await deleteAdmissionAction(slug, a.id);
      if (!r.ok) sileo.error({ title: 'No se pudo eliminar', description: r.message });
      else reload();
    });
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {data.admissions.length} {data.admissions.length === 1 ? 'ingresante registrado' : 'ingresantes registrados'}.
        </p>
        {data.canManage && (
          <button type="button" className="btn-brand" onClick={(): void => setEditing('new')}>
            <MorphIcon icon={Plus} size={16} />
            Registrar ingresante
          </button>
        )}
      </div>
      {data.admissions.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">Aún no hay ingresantes registrados.</p>
      ) : (
        [...byExam].map(([exam, list]) => (
          <section key={exam} aria-label={exam} className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">
              {exam} <span className="font-normal text-muted-foreground">· {list.length}</span>
            </h3>
            <ul className="grid gap-3 md:grid-cols-2">
              {list.map((a) => (
                <li key={a.id} className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-success/12 text-success">
                    <MorphIcon icon={GraduationCap} size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-foreground">{a.studentName}</span>
                    <span className="block text-sm text-foreground">{a.career}</span>
                    <span className="block text-xs text-muted-foreground">
                      {a.university} · {formatDay(a.admittedOn)}
                      {a.place && ` · puesto ${a.place}`}
                      {a.score !== undefined && ` · ${formatScore(a.score)} puntos`}
                    </span>
                  </span>
                  {data.canManage && (
                    <span className="flex gap-1">
                      <button type="button" className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label={`Editar ${a.studentName}`} onClick={(): void => setEditing(a)}>
                        <MorphIcon icon={Pencil} size={14} />
                      </button>
                      <ConfirmDelete compact title={`Quitar a ${a.studentName}`} description="Deja de figurar como ingresante." isPending={isPending} onConfirm={(): void => remove(a)} />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
      {editing && (
        <AdmissionDialog
          slug={slug}
          admission={editing === 'new' ? null : editing}
          onClose={(): void => setEditing(null)}
          onSaved={(): void => {
            setEditing(null);
            reload();
          }}
        />
      )}
    </div>
  );
};

const AdmissionDialog = ({ slug, admission, onClose, onSaved }: { slug: string; admission: Admission | null; onClose: () => void; onSaved: () => void }): JSX.Element => {
  const [query, setQuery] = useState('');
  const debounced = useDebounced(query);
  const found = useAcademicData(`admission-find:${slug}:${debounced}`, async () => (debounced.trim().length < 2 ? { ok: true as const, data: [] } : findStudentsAction(slug, debounced)), () => false);
  const [picked, setPicked] = useState<{ id: string; name: string } | null>(admission ? { id: admission.studentId, name: admission.studentName } : null);
  const form = useAcademicForm<AdmissionValues, Admission>({
    initial: {
      studentId: admission?.studentId ?? '',
      university: admission?.university ?? 'Universidad Nacional Mayor de San Marcos',
      career: admission?.career ?? '',
      exam: admission?.exam ?? '',
      admittedOn: admission?.admittedOn ?? '',
      place: admission?.place ? String(admission.place) : '',
      score: admission?.score !== undefined ? String(admission.score) : '',
    },
    validate: (v): Record<string, string> => {
      const e: Record<string, string> = {};
      if (!picked) e.studentId = 'Elige al alumno.';
      if (!v.career.trim()) e.career = 'Indica la carrera.';
      if (!v.exam.trim()) e.exam = 'Indica el examen.';
      if (!v.admittedOn) e.admittedOn = 'Indica la fecha.';
      return e;
    },
    save: (v) => saveAdmissionAction(slug, admission?.id ?? '', { ...v, studentId: picked?.id ?? '' }),
    onSaved,
  });
  const { values, errors, setField } = form;
  return (
    <FormDialog title={admission ? 'Editar ingresante' : 'Registrar ingresante'} submitLabel={admission ? 'Guardar' : 'Registrar'} isPending={form.isPending} onSubmit={form.submit} onClose={onClose} wide>
      <FormField id="adm-student" label="Alumno" required error={errors.studentId} hint="Alumnos actuales o egresados de la academia.">
        {picked ? (
          <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
            <span className="font-medium text-foreground">{picked.name}</span>
            {!admission && (
              <button type="button" className="text-xs text-brand hover:underline" onClick={(): void => setPicked(null)}>
                Cambiar
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <SearchBox value={query} onChange={setQuery} placeholder="Nombre, código o DNI" />
            <ul className="max-h-40 divide-y divide-border overflow-y-auto rounded-lg border border-border">
              {(found.data ?? []).map((s) => (
                <li key={s.id}>
                  <button type="button" className="flex w-full justify-between px-3 py-2 text-left text-sm hover:bg-surface" onClick={(): void => setPicked({ id: s.id, name: s.name })}>
                    <span className="text-foreground">{s.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {s.code}
                      {s.status === 'graduated' && ' · egresado'}
                    </span>
                  </button>
                </li>
              ))}
              {debounced.trim().length >= 2 && found.data?.length === 0 && <li className="px-3 py-2 text-sm text-muted-foreground">Sin resultados.</li>}
            </ul>
          </div>
        )}
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="adm-uni" label="Universidad" required error={errors.university}>
          <Input placeholder="Ej.: UNSCH" id="adm-uni" value={values.university} maxLength={120} onChange={(e): void => setField('university', e.target.value)} />
        </FormField>
        <FormField id="adm-career" label="Carrera" required error={errors.career}>
          <Input placeholder="Ej.: Medicina Humana" id="adm-career" value={values.career} maxLength={160} onChange={(e): void => setField('career', e.target.value)} aria-invalid={Boolean(errors.career)} />
        </FormField>
        <FormField id="adm-exam" label="Examen" required error={errors.exam} hint="Por ejemplo, Admisión 2027-I.">
          <Input placeholder="Ej.: Examen ordinario 2026-II" id="adm-exam" value={values.exam} maxLength={120} onChange={(e): void => setField('exam', e.target.value)} aria-invalid={Boolean(errors.exam)} />
        </FormField>
        <FormField id="adm-date" label="Fecha del examen" required error={errors.admittedOn}>
          <Input id="adm-date" type="date" value={values.admittedOn} onChange={(e): void => setField('admittedOn', e.target.value)} aria-invalid={Boolean(errors.admittedOn)} />
        </FormField>
        <FormField id="adm-place" label="Puesto" error={errors.place}>
          <Input placeholder="Ej.: 12" id="adm-place" inputMode="numeric" value={values.place} onChange={(e): void => setField('place', e.target.value.replace(/\D/g, '').slice(0, 6))} />
        </FormField>
        <FormField id="adm-score" label="Puntaje" error={errors.score}>
          <Input placeholder="Ej.: 1520,5" id="adm-score" inputMode="decimal" value={values.score} onChange={(e): void => setField('score', e.target.value.replace(/[^\d.,]/g, '').slice(0, 10))} />
        </FormField>
      </div>
    </FormDialog>
  );
};
