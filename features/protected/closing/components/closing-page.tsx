'use client';

import Link from 'next/link';
import { useState, type JSX } from 'react';
import { ArrowLeft, Check, Download, Lock } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AcademicPage, LoadError, PageSkeleton, SelectField } from '@/features/protected/academic/components/academic-ui';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { DASHBOARD_PATH } from '@/features/protected/dashboard/data/dashboard-navigation';
import { recordPdfAction } from '@/features/protected/documents/actions/document-actions';
import { usePdf } from '@/features/protected/documents/lib/use-pdf';
import { isAssessmentEvent } from '@/hooks/use-live';
import { cn } from '@/lib/utils';
import { getClosingAction, getRecordAction } from '../actions/closing-actions';
import { situationBar, situationLabels, unitClass, unitLabels } from '../data/closing-data';
import type { ClosingOverview } from '../types';
import { RecordList } from './record-list';
import { RecordView } from './record-view';
import { SectionClosingView } from './section-closing';
import { UnitClosingView } from './unit-closing';

type Open = { kind: 'section'; id: string } | { kind: 'unit'; id: string } | { kind: 'record'; id: string } | null;

// Cierre del año y actas: the final situation of every student (or the result of every IEST unit), the team's
// decisions, recovery, the actas and the export for SIAGIE
export const ClosingPage = (): JSX.Element => {
  const slug = useInstitutionSlug();
  const [periodId, setPeriodId] = useState('');
  const [open, setOpen] = useState<Open>(null);
  const { data, error, reload } = useAcademicData(`closing:${slug}:${periodId}`, () => getClosingAction(slug, periodId), isAssessmentEvent);
  const units = data?.mode === 'units';
  const back = (): void => setOpen(null);

  return (
    <AcademicPage wide
      titleId="closing-title"
      title={units ? 'Cierre del semestre y actas' : 'Cierre del año y actas'}
      description={
        units
          ? 'El promedio final de cada unidad didáctica, la recuperación, las actas de unidad y la exportación de notas.'
          : 'La situación final de cada estudiante (promovido, recuperación o permanece), las decisiones del equipo de evaluación, la recuperación pedagógica, las actas y la exportación para el SIAGIE.'
      }
      context={null}
    >
      {error ? (
        <LoadError message={error} onRetry={reload} />
      ) : !data ? (
        <PageSkeleton />
      ) : !data.period ? (
        <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">No hay un periodo para cerrar.</p>
      ) : open?.kind === 'section' ? (
        <SectionClosingView key={open.id} slug={slug} sectionId={open.id} onBack={back} onRecord={(id): void => setOpen({ kind: 'record', id })} />
      ) : open?.kind === 'unit' ? (
        <UnitClosingView key={open.id} slug={slug} assignmentId={open.id} onBack={back} onRecord={(id): void => setOpen({ kind: 'record', id })} />
      ) : open?.kind === 'record' ? (
        <RecordScreen slug={slug} id={open.id} onBack={back} />
      ) : (
        <Overview data={data} onPeriod={setPeriodId} onOpen={setOpen} />
      )}
    </AcademicPage>
  );
};

const Overview = ({ data, onPeriod, onOpen }: { data: ClosingOverview; onPeriod: (id: string) => void; onOpen: (o: Open) => void }): JSX.Element => {
  const terms = data.period?.terms ?? [];
  const last = terms[terms.length - 1];
  const issued = data.records.filter((r) => r.status === 'issued');
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {data.periods.length > 1 ? (
          <div className="w-64">
            <SelectField id="closing-period" value={data.period?.id ?? ''} options={data.periods.map((p) => ({ value: p.id, label: p.name }))} onChange={onPeriod} />
          </div>
        ) : (
          <p className="text-sm font-medium text-foreground">{data.period?.name}</p>
        )}
        {!data.lastTermClosed && data.mode === 'basic' && (
          <p className="flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm text-muted-foreground">
            <MorphIcon icon={Lock} size={16} />
            {last ? `${last.name} sigue abierto: puedes ver el cierre, pero se confirma cuando lo cierres en ` : 'Se confirma cuando cierres el periodo en '}
            <Link href={`${DASHBOARD_PATH}/academic/periods`} className="font-medium text-brand hover:underline">
              Periodos
            </Link>
            .
          </p>
        )}
      </div>

      {data.mode === 'basic' ? (
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {data.sections.map((s) => {
            const total = Math.max(1, s.students);
            return (
              <li key={s.sectionId}>
                <button type="button" onClick={(): void => onOpen({ kind: 'section', id: s.sectionId })} className="w-full rounded-2xl border border-border bg-background p-4 text-left transition-colors hover:border-foreground/25">
                  <span className="flex items-start justify-between gap-3">
                    <span className="font-semibold text-foreground">{s.label}</span>
                    {s.confirmed === s.students && s.students > 0 ? (
                      <span className="pill shrink-0 bg-success/12 text-success">
                        <MorphIcon icon={Check} size={12} />
                        Confirmado
                      </span>
                    ) : (
                      <span className="pill shrink-0 bg-secondary text-muted-foreground">Vista previa</span>
                    )}
                  </span>
                  <span className="mt-3 flex h-2 overflow-hidden rounded-full bg-secondary" aria-hidden="true">
                    {['PRO', 'RR', 'PER', 'PEN'].map((k) => (s.counts[k] ? <span key={k} className={situationBar[k]} style={{ width: `${(s.counts[k] * 100) / total}%` }} /> : null))}
                  </span>
                  <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground tabular-nums">
                    {['PRO', 'RR', 'PER', 'PEN'].map((k) =>
                      s.counts[k] ? (
                        <span key={k}>
                          {s.counts[k]} {situationLabels[k].toLowerCase()}
                        </span>
                      ) : null,
                    )}
                    {s.recovered > 0 && <span>· {s.recovered} ya recuperaron</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {data.units.map((u) => (
            <li key={u.assignmentId}>
              <button type="button" onClick={(): void => onOpen({ kind: 'unit', id: u.assignmentId })} className="w-full rounded-2xl border border-border bg-background p-4 text-left transition-colors hover:border-foreground/25">
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-foreground">{u.subjectName}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {u.sectionLabel} · {u.staffName || 'Sin docente'}
                    </span>
                  </span>
                  <span className={cn('pill shrink-0', u.confirmed ? 'bg-success/12 text-success' : 'bg-secondary text-muted-foreground')}>{u.confirmed ? 'Confirmada' : 'Vista previa'}</span>
                </span>
                <span className="mt-3 flex flex-wrap gap-1.5">
                  {u.confirmed ? (
                    Object.entries(u.counts).map(([k, n]) => (
                      <span key={k} className={cn('pill', unitClass[k])}>
                        {n} {unitLabels[k]?.toLowerCase()}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">{u.students} estudiantes</span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <section aria-labelledby="closing-records" className="space-y-3">
        <h2 id="closing-records" className="text-lg font-semibold text-foreground">
          Actas emitidas
        </h2>
        {issued.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border px-6 py-8 text-center text-sm text-muted-foreground">Aún no hay actas. Se emiten desde cada {data.mode === 'units' ? 'unidad' : 'sección'} después de confirmar sus resultados.</p>
        ) : (
          <RecordList records={issued} onOpen={(id): void => onOpen({ kind: 'record', id })} />
        )}
      </section>
    </div>
  );
};

const RecordScreen = ({ slug, id, onBack }: { slug: string; id: string; onBack: () => void }): JSX.Element => {
  const { data, error, reload } = useAcademicData(`record:${slug}:${id}`, () => getRecordAction(slug, id), () => false);
  const [isPending, pdf] = usePdf();
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <button type="button" className="btn-alt" onClick={onBack}>
          <MorphIcon icon={ArrowLeft} size={16} />
          Volver
        </button>
        <button type="button" className="btn-brand" disabled={!data || isPending} onClick={(): void => pdf(() => recordPdfAction(slug, id))}>
          <MorphIcon icon={Download} size={16} />
          {isPending ? 'Generando PDF…' : 'Descargar PDF'}
        </button>
      </div>
      {error ? <LoadError message={error} onRetry={reload} /> : !data ? <PageSkeleton /> : <RecordView data={data} />}
      {data && <p className="text-xs text-muted-foreground print:hidden">El contenido del acta quedó fijo al emitirla; si cambian los resultados, emite una nueva y esta quedará como reemplazada.</p>}
    </div>
  );
};
