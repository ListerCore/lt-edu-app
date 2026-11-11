'use client';

import { useState, useTransition, type JSX } from 'react';
import { ArrowLeft, Eye, EyeOff, Pencil, Plus, Printer } from 'lucide';
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
import { useWorkspace } from '@/features/protected/dashboard/hooks/use-workspace';
import { isExamsEvent } from '@/hooks/use-live';
import { cn } from '@/lib/utils';
import { deleteMockAction, getExamsOverviewAction, getMockAction, getMyExamsAction, publishMockAction, saveMockAction } from '../actions/exams-actions';
import type { ExamsOverview, MockExam, MockValues } from '../types';
import { BookletView } from './booklet-view';
import { MockKey } from './mock-key';
import { MockResultsView } from './mock-results';
import { MockSheets } from './mock-sheets';
import { MockStructure } from './mock-structure';
import { StudentExamsView } from './student-exams';

type Tab = 'structure' | 'key' | 'sheets' | 'results';

// Simulacros: the mock exams of each cycle, from their structure to the published ranking. Students and families see
// their own results here
export const MocksPage = (): JSX.Element => {
  const slug = useInstitutionSlug();
  const [periodId, setPeriodId] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const { data, error, reload } = useAcademicData(`exams:${slug}:${periodId}`, () => getExamsOverviewAction(slug, periodId), isExamsEvent);
  const mine = useAcademicData(`my-exams:${slug}`, () => getMyExamsAction(slug), isExamsEvent);

  if (mine.data && mine.data.length > 0)
    return (
      <AcademicPage titleId="mocks-title" title="Simulacros" description="Tus puntajes, tu puesto y cómo vas en cada curso, simulacro tras simulacro." context={null}>
        <StudentExamsView items={mine.data} />
      </AcademicPage>
    );

  return (
    <AcademicPage
      titleId="mocks-title"
      title="Simulacros"
      description="Exámenes tipo admisión por ciclo: los cursos y el peso de cada uno por área, la clave, las respuestas de cada alumno y el ranking."
      context={data && !open ? { canManage: data.canManage } : null}
      actions={
        <button type="button" className="btn-brand" onClick={(): void => setCreating(true)}>
          <MorphIcon icon={Plus} size={16} />
          Nuevo simulacro
        </button>
      }
    >
      {error ? <LoadError message={error} onRetry={reload} /> : !data ? <PageSkeleton /> : open ? <MockView key={open} slug={slug} id={open} overview={data} onBack={(): void => setOpen(null)} /> : <MockList data={data} onPeriod={setPeriodId} onOpen={setOpen} />}
      {creating && data?.period && (
        <MockDialog
          slug={slug}
          periodId={data.period.id}
          mock={null}
          onClose={(): void => setCreating(false)}
          onSaved={(m): void => {
            setCreating(false);
            setOpen(m.id);
          }}
        />
      )}
    </AcademicPage>
  );
};

const MockList = ({ data, onPeriod, onOpen }: { data: ExamsOverview; onPeriod: (id: string) => void; onOpen: (id: string) => void }): JSX.Element => (
  <div className="space-y-4">
    {data.periods.length > 1 && (
      <div className="w-64">
        <SelectField id="mocks-period" value={data.period?.id ?? ''} options={data.periods.map((p) => ({ value: p.id, label: p.name }))} onChange={onPeriod} />
      </div>
    )}
    {data.mocks.length === 0 ? (
      <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">Este ciclo aún no tiene simulacros.</p>
    ) : (
      <ul className="grid gap-3 md:grid-cols-2">
        {data.mocks.map((m) => {
          const areas = new Set(m.weights.map((w) => w.levelId));
          const names = data.levels.filter((l) => areas.has(l.id)).map((l) => l.name.replace('San Marcos · ', ''));
          return (
            <li key={m.id}>
              <button type="button" onClick={(): void => onOpen(m.id)} className="w-full rounded-2xl border border-border bg-background p-4 text-left transition-colors hover:border-foreground/25">
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block font-semibold text-foreground">{m.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {formatDay(m.heldOn)} · {m.questions} preguntas · {m.durationMinutes} min
                    </span>
                  </span>
                  <span className={cn('pill shrink-0', m.status === 'published' ? 'bg-success/12 text-success' : 'bg-secondary text-muted-foreground')}>{m.status === 'published' ? 'Publicado' : 'Borrador'}</span>
                </span>
                <span className="mt-3 block truncate text-xs text-muted-foreground">{names.length ? names.join(' · ') : 'Sin áreas todavía'}</span>
                <span className="mt-2 flex gap-4 text-xs text-muted-foreground tabular-nums">
                  <span className={cn(m.questions > 0 && m.keyed < m.questions && 'text-warning')}>
                    Clave {m.keyed}/{m.questions}
                  </span>
                  <span>{m.sheets} hojas de respuestas</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    )}
  </div>
);

const MockView = ({ slug, id, overview, onBack }: { slug: string; id: string; overview: ExamsOverview; onBack: () => void }): JSX.Element => {
  const { data, error, reload } = useAcademicData(
    `mock:${slug}:${id}`,
    () => getMockAction(slug, id),
    () => false,
  );
  const [tab, setTab] = useState<Tab | null>(null);
  const [editing, setEditing] = useState(false);
  const [booklet, setBooklet] = useState<'booklet' | 'key' | null>(null);
  const [isPending, startTransition] = useTransition();
  // Tabs follow the role in use (data/permissions.ts pageTabs): the answer key and the sheets stay with who prepares them
  const { canTab } = useWorkspace();
  if (error) return <LoadError message={error} onRetry={reload} />;
  if (!data?.mock) return <PageSkeleton />;
  const m = data.mock;
  const tabs = (
    [
      ['structure', 'Cursos y pesos'],
      ['key', `Clave (${m.keyed}/${m.questions})`],
      ['sheets', `Respuestas (${m.sheets})`],
      ['results', 'Resultados'],
    ] as Array<[Tab, string]>
  ).filter(([k]) => canTab('mocks', k));
  const preferred: Tab = tab ?? (m.questions === 0 ? 'structure' : m.keyed < m.questions ? 'key' : m.sheets === 0 ? 'sheets' : 'results');
  const current: Tab | undefined = tabs.some(([k]) => k === preferred) ? preferred : tabs[0]?.[0];
  if (booklet) return <BookletView slug={slug} id={id} withKey={booklet === 'key'} onBack={(): void => setBooklet(null)} />;

  const act = (work: () => Promise<{ ok: boolean; message?: string }>, after?: () => void): void =>
    startTransition(async () => {
      const r = await work();
      if (!r.ok) sileo.error({ title: 'No se pudo completar', description: r.message });
      else {
        if (r.message) sileo.success({ title: r.message });
        after?.();
        reload();
      }
    });

  return (
    <div className="space-y-5">
      <button type="button" className="btn-alt" onClick={onBack}>
        <MorphIcon icon={ArrowLeft} size={16} />
        Todos los simulacros
      </button>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-foreground">
            {m.name}
            <span className={cn('pill', m.status === 'published' ? 'bg-success/12 text-success' : 'bg-secondary text-muted-foreground')}>{m.status === 'published' ? 'Publicado' : 'Borrador'}</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            {m.periodName} · {formatDay(m.heldOn)} · {m.durationMinutes} min · +{m.pointsRight} por acierto, −{m.pointsWrong} por error · {data.students} alumnos lo rinden
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {m.questions > 0 && (
            <>
              <button type="button" className="btn-alt" onClick={(): void => setBooklet('booklet')}>
                <MorphIcon icon={Printer} size={16} />
                Cuadernillo
              </button>
              <button type="button" className="btn-alt" onClick={(): void => setBooklet('key')}>
                <MorphIcon icon={Printer} size={16} />
                Clave
              </button>
            </>
          )}
          {data.canEdit && (
            <>
              <button type="button" className="btn-alt" onClick={(): void => setEditing(true)}>
                <MorphIcon icon={Pencil} size={16} />
                Datos
              </button>
              <button type="button" className={m.status === 'published' ? 'btn-alt' : 'btn-brand'} disabled={isPending} onClick={(): void => act(() => publishMockAction(slug, id, m.status !== 'published'))}>
                <MorphIcon icon={m.status === 'published' ? EyeOff : Eye} size={16} />
                {m.status === 'published' ? 'Retirar publicación' : 'Publicar resultados'}
              </button>
              <ConfirmDelete title={`Eliminar «${m.name}»`} description={m.sheets > 0 ? `Se borran también sus ${m.sheets} hojas de respuestas.` : 'No se puede deshacer.'} isPending={isPending} onConfirm={(): void => act(() => deleteMockAction(slug, id), onBack)} />
            </>
          )}
        </div>
      </div>
      <div role="tablist" aria-label="Simulacro" className="flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map(([k, label]) => (
          <button key={k} type="button" role="tab" aria-selected={current === k} onClick={(): void => setTab(k)} className={cn('-mb-px border-b-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors', current === k ? 'border-brand text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground')}>
            {label}
          </button>
        ))}
      </div>
      {current === 'structure' && <MockStructure slug={slug} detail={data} overview={overview} onSaved={reload} />}
      {current === 'key' && <MockKey slug={slug} detail={data} onSaved={reload} />}
      {current === 'sheets' && <MockSheets slug={slug} detail={data} canLoad={overview.canLoad} onSaved={reload} />}
      {current === 'results' && <MockResultsView slug={slug} id={id} levels={overview.levels} />}
      {editing && (
        <MockDialog
          slug={slug}
          periodId={m.periodId}
          mock={m}
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

const MockDialog = ({ slug, periodId, mock, onClose, onSaved }: { slug: string; periodId: string; mock: MockExam | null; onClose: () => void; onSaved: (m: MockExam) => void }): JSX.Element => {
  const form = useAcademicForm<MockValues, MockExam>({
    initial: {
      name: mock?.name ?? '',
      heldOn: mock?.heldOn ?? '',
      duration: String(mock?.durationMinutes ?? 180),
      pointsRight: String(mock?.pointsRight ?? 20),
      pointsWrong: String(mock?.pointsWrong ?? 1.125),
      notes: mock?.notes ?? '',
    },
    validate: (v): Record<string, string> => {
      const e: Record<string, string> = {};
      if (!v.name.trim()) e.name = 'Ponle un nombre, por ejemplo «Simulacro San Marcos N.° 4».';
      if (!v.heldOn) e.heldOn = 'Indica la fecha.';
      return e;
    },
    save: (v) => saveMockAction(slug, periodId, mock?.id ?? '', v),
    onSaved,
  });
  const { values, errors, setField } = form;
  return (
    <FormDialog title={mock ? 'Datos del simulacro' : 'Nuevo simulacro'} description="Después eliges los cursos, sus preguntas y el peso por área." submitLabel={mock ? 'Guardar' : 'Crear'} isPending={form.isPending} onSubmit={form.submit} onClose={onClose}>
      <FormField id="mock-name" label="Nombre" required error={errors.name}>
        <Input placeholder="Ej.: Simulacro tipo San Marcos 3" id="mock-name" value={values.name} maxLength={120} onChange={(e): void => setField('name', e.target.value)} aria-invalid={Boolean(errors.name)} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="mock-date" label="Fecha" required error={errors.heldOn}>
          <Input id="mock-date" type="date" value={values.heldOn} onChange={(e): void => setField('heldOn', e.target.value)} aria-invalid={Boolean(errors.heldOn)} />
        </FormField>
        <FormField id="mock-duration" label="Duración (minutos)" error={errors.duration}>
          <Input placeholder="Ej.: 180" id="mock-duration" inputMode="numeric" value={values.duration} onChange={(e): void => setField('duration', e.target.value.replace(/\D/g, '').slice(0, 3))} />
        </FormField>
        <FormField id="mock-right" label="Puntos por acierto" error={errors.pointsRight}>
          <Input placeholder="Ej.: 20" id="mock-right" inputMode="decimal" value={values.pointsRight} onChange={(e): void => setField('pointsRight', e.target.value.replace(/[^\d.,]/g, ''))} />
        </FormField>
        <FormField id="mock-wrong" label="Descuento por error" error={errors.pointsWrong} hint="La pregunta en blanco no suma ni resta.">
          <Input placeholder="Ej.: 1,125" id="mock-wrong" inputMode="decimal" value={values.pointsWrong} onChange={(e): void => setField('pointsWrong', e.target.value.replace(/[^\d.,]/g, ''))} />
        </FormField>
      </div>
      <FormField id="mock-notes" label="Notas">
        <Textarea placeholder="Indicaciones para los estudiantes" id="mock-notes" value={values.notes} rows={2} maxLength={1000} onChange={(e): void => setField('notes', e.target.value)} />
      </FormField>
    </FormDialog>
  );
};
