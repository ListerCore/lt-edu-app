'use client';

import { useMemo, useState, type JSX } from 'react';
import { Check, Lock, NotebookPen, Send } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AcademicPage, LoadError, PageSkeleton, SelectField } from '@/features/protected/academic/components/academic-ui';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { isAssessmentEvent } from '@/hooks/use-live';
import { cn } from '@/lib/utils';
import { getGradebookAction } from '../actions/assessment-actions';
import { percent } from '../data/assessment-data';
import type { Gradebook, OpenSheet, SheetProgress, TutorProgress } from '../types';
import { AreaSheet } from './area-sheet';
import { TutorSheet } from './tutor-sheet';

// Notas: coordinación sees how far every sheet of the term went; each teacher opens their own registers
export const GradesPage = (): JSX.Element => {
  const slug = useInstitutionSlug();
  const [periodId, setPeriodId] = useState('');
  const [termId, setTermId] = useState('');
  const [open, setOpen] = useState<OpenSheet | null>(null);
  const { data, error, reload } = useAcademicData(`grades:${slug}:${periodId}:${termId}`, () => getGradebookAction(slug, periodId, termId), isAssessmentEvent);
  const numeric = data ? data.scale !== 'literal' : false;

  return (
    <AcademicPage wide
      titleId="grades-title"
      title={numeric ? 'Notas' : 'Notas por competencias'}
      description={
        numeric ? 'Las evaluaciones de cada unidad o curso con su peso, y el promedio que sale de ellas.' : 'El nivel de logro de cada competencia (AD, A, B, C) con sus conclusiones descriptivas, por periodo de evaluación.'
      }
      context={null}
    >
      {error ? (
        <LoadError message={error} onRetry={reload} />
      ) : !data ? (
        <PageSkeleton />
      ) : !data.period ? (
        <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">No hay un periodo en curso.</p>
      ) : open ? (
        open.kind === 'area' ? (
          <AreaSheet key={`${open.assignmentId}:${data.termId}`} slug={slug} assignmentId={open.assignmentId} termId={data.termId} onBack={(): void => setOpen(null)} />
        ) : (
          <TutorSheet key={`${open.sectionId}:${data.termId}`} slug={slug} sectionId={open.sectionId} termId={data.termId} onBack={(): void => setOpen(null)} />
        )
      ) : (
        <Overview
          data={data}
          onPeriod={(id): void => {
            setPeriodId(id);
            setTermId('');
          }}
          onTerm={setTermId}
          onOpen={setOpen}
        />
      )}
    </AcademicPage>
  );
};

interface OverviewProps {
  data: Gradebook;
  onPeriod: (id: string) => void;
  onTerm: (id: string) => void;
  onOpen: (sheet: OpenSheet) => void;
}

const Overview = ({ data, onPeriod, onTerm, onOpen }: OverviewProps): JSX.Element => {
  const [sectionId, setSectionId] = useState('');
  const [pendingOnly, setPendingOnly] = useState(false);
  const terms = data.period?.terms ?? [];
  const term = terms.find((t) => t.id === data.termId);
  const numeric = data.scale !== 'literal';

  const groups = useMemo(() => {
    const map = new Map<string, { id: string; label: string; sheets: SheetProgress[]; tutor?: TutorProgress }>();
    for (const s of data.sheets) {
      const g = map.get(s.sectionId) ?? { id: s.sectionId, label: s.sectionLabel, sheets: [] };
      g.sheets.push(s);
      map.set(s.sectionId, g);
    }
    for (const t of data.tutor) {
      const g = map.get(t.sectionId) ?? { id: t.sectionId, label: t.sectionLabel, sheets: [] };
      g.tutor = t;
      map.set(t.sectionId, g);
    }
    return [...map.values()];
  }, [data]);

  const all = [...data.sheets.map((s) => ({ sent: Boolean(s.submitted), filled: s.filled, expected: s.expected })), ...data.tutor.map((t) => ({ sent: Boolean(t.submitted), filled: t.filled, expected: t.expected }))];
  const sent = all.filter((x) => x.sent).length;
  const filled = all.reduce((n, x) => n + x.filled, 0);
  const expected = all.reduce((n, x) => n + x.expected, 0);
  const shown = groups
    .filter((g) => !sectionId || g.id === sectionId)
    .map((g) => ({ ...g, sheets: pendingOnly ? g.sheets.filter((s) => !s.submitted) : g.sheets, tutor: pendingOnly && g.tutor?.submitted ? undefined : g.tutor }))
    .filter((g) => g.sheets.length > 0 || g.tutor);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        {terms.length > 0 ? (
          <div role="tablist" aria-label="Periodos de evaluación" className="flex gap-1 overflow-x-auto border-b border-border">
            {terms.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={t.id === data.termId}
                onClick={(): void => onTerm(t.id)}
                className={cn('-mb-px flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors', t.id === data.termId ? 'border-brand text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground')}
              >
                {t.status === 'closed' && <MorphIcon icon={Lock} size={12} />}
                {t.name}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{data.period?.name}: se califica el periodo completo.</p>
        )}
        {data.periods.length > 1 && (
          <div className="w-60">
            <SelectField id="grades-period" value={data.period?.id ?? ''} options={data.periods.map((p) => ({ value: p.id, label: p.name }))} onChange={onPeriod} />
          </div>
        )}
      </div>

      {data.locked && (
        <p className="flex items-center gap-2 rounded-xl bg-secondary px-4 py-3 text-sm text-muted-foreground">
          <MorphIcon icon={Lock} size={16} />
          {term ? `${term.name} está cerrado: las notas se consultan, ya no se cambian. Coordinación puede reabrirlo desde Periodos.` : 'El periodo está cerrado.'}
        </p>
      )}

      {!data.ownOnly && all.length > 0 && (
        <div className="grid gap-4 rounded-2xl border border-border bg-background p-5 sm:grid-cols-3">
          <Figure label="Registros enviados" value={`${sent} de ${all.length}`} />
          <Figure label={numeric ? 'Notas puestas' : 'Niveles registrados'} value={`${percent(filled, expected)} %`} detail={`${filled.toLocaleString('es-PE')} de ${expected.toLocaleString('es-PE')}`} />
          <Figure label="Pendientes de enviar" value={String(all.length - sent)} />
        </div>
      )}

      {!data.ownOnly && groups.length > 1 && (
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-full max-w-xs">
            <SelectField id="grades-section" value={sectionId} options={[{ value: '', label: 'Todas las secciones' }, ...groups.map((g) => ({ value: g.id, label: g.label }))]} onChange={setSectionId} />
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={pendingOnly} onChange={(e): void => setPendingOnly(e.target.checked)} className="size-4 accent-brand" />
            Solo los que faltan enviar
          </label>
        </div>
      )}

      {shown.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
          {data.ownOnly ? 'No tienes cursos ni tutorías asignados en este periodo.' : pendingOnly ? 'Todo está enviado.' : 'No hay registros en este periodo.'}
        </p>
      ) : (
        <div className="space-y-6">
          {shown.map((g) => (
            <section key={g.id} aria-label={g.label} className="space-y-2">
              <h2 className="text-sm font-semibold text-foreground">{g.label}</h2>
              <ul className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                {g.tutor && (
                  <SheetCard
                    title="Tutoría"
                    detail={`${g.tutor.tutorName || 'Sin tutor'} · transversales${data.conduct ? ' y conducta' : ''}`}
                    filled={g.tutor.filled}
                    expected={g.tutor.expected}
                    sent={Boolean(g.tutor.submitted)}
                    tutor
                    onOpen={(): void => onOpen({ kind: 'tutor', sectionId: g.id, title: g.label })}
                  />
                )}
                {g.sheets.map((s) => (
                  <SheetCard
                    key={s.assignmentId}
                    title={s.subjectName}
                    detail={`${s.staffName || 'Sin docente'}${numeric ? ` · ${s.evaluations} ${s.evaluations === 1 ? 'evaluación' : 'evaluaciones'}` : ''}`}
                    filled={s.filled}
                    expected={s.expected}
                    sent={Boolean(s.submitted)}
                    onOpen={(): void => onOpen({ kind: 'area', assignmentId: s.assignmentId, title: s.subjectName })}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

const Figure = ({ label, value, detail }: { label: string; value: string; detail?: string }): JSX.Element => (
  <div>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground tabular-nums">{value}</p>
    {detail && <p className="text-xs text-muted-foreground tabular-nums">{detail}</p>}
  </div>
);

interface SheetCardProps {
  title: string;
  detail: string;
  filled: number;
  expected: number;
  sent: boolean;
  tutor?: boolean;
  onOpen: () => void;
}

const SheetCard = ({ title, detail, filled, expected, sent, tutor, onOpen }: SheetCardProps): JSX.Element => {
  const p = percent(filled, expected);
  return (
    <li>
      <button type="button" onClick={onOpen} className={cn('w-full rounded-2xl border bg-background p-4 text-left transition-colors hover:border-foreground/25', tutor ? 'border-brand/30' : 'border-border')}>
        <span className="flex items-start justify-between gap-3">
          <span className="min-w-0">
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              {tutor && <MorphIcon icon={NotebookPen} size={14} className="text-brand" />}
              <span className="truncate">{title}</span>
            </span>
            <span className="block truncate text-xs text-muted-foreground">{detail}</span>
          </span>
          {sent ? (
            <span className="pill shrink-0 bg-success/12 text-success">
              <MorphIcon icon={Check} size={12} />
              Enviado
            </span>
          ) : (
            p === 100 && (
              <span className="pill shrink-0 bg-warning/14 text-warning">
                <MorphIcon icon={Send} size={12} />
                Por enviar
              </span>
            )
          )}
        </span>
        <span className="mt-3 flex items-center gap-3">
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary" aria-hidden="true">
            <span className={cn('block h-full rounded-full', p === 100 ? 'bg-success' : 'bg-brand')} style={{ width: `${p}%` }} />
          </span>
          <span className="w-10 text-right text-xs text-muted-foreground tabular-nums">{expected === 0 ? '—' : `${p} %`}</span>
        </span>
      </button>
    </li>
  );
};
