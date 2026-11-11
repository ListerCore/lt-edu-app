'use client';

import { useState, type JSX } from 'react';
import { ShieldAlert } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Input } from '@/components/ui/input';
import { AcademicPage, LoadError, PageSkeleton } from '@/features/protected/academic/components/academic-ui';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { isWellbeingEvent } from '@/hooks/use-live';
import { cn } from '@/lib/utils';
import { getDisciplineAction } from '../actions/wellbeing-actions';
import { measureKindLabels, severityLabels } from '../data/wellbeing-data';
import { IncidentCard, MeasureLine, StudentFileView } from './student-file';
import { IncidentDialog } from './wellbeing-dialogs';
import { Filter } from './wellbeing-ui';

type Tab = 'faults' | 'measures';

// Convivencia escolar (DS 021-2026-MINEDU): the register of faults with their measures, and the suspensions,
// conditional enrollments and expulsions of the year with their reconsiderations. Families see their children's
export const DisciplinePage = (): JSX.Element => {
  const slug = useInstitutionSlug();
  const [f, setF] = useState({ from: '', to: '', severity: '', status: '' });
  const { data, error, reload } = useAcademicData(`wb-discipline:${slug}:${f.from}:${f.to}:${f.severity}:${f.status}`, () => getDisciplineAction(slug, f), isWellbeingEvent);
  const [tab, setTab] = useState<Tab>('faults');
  const [open, setOpen] = useState<string | null>(null);
  const [report, setReport] = useState(false);
  const counts = { faults: data?.incidents.length ?? 0, measures: data?.measures.length ?? 0 };
  return (
    <AcademicPage
      titleId="disc-title"
      title="Convivencia escolar"
      description="Faltas leves, graves y muy graves con sus medidas. Las leves las atiende el docente; la suspensión (hasta tres días hábiles), la matrícula condicional y la expulsión las decide la dirección, y la familia puede pedir reconsideración dentro de los tres días hábiles."
      // The buttons below already follow what the API allows this person
      context={{ canManage: true }}
      actions={
        data?.canReport && (
          <button type="button" className="btn-brand" onClick={(): void => setReport(true)}>
            <MorphIcon icon={ShieldAlert} size={16} />
            Registrar falta
          </button>
        )
      }
    >
      {error ? (
        <LoadError message={error} onRetry={reload} />
      ) : !data ? (
        <PageSkeleton />
      ) : open ? (
        <StudentFileView slug={slug} studentId={open} initialTab="discipline" onBack={(): void => setOpen(null)} />
      ) : (
        <div className="space-y-5">
          {data.pending > 0 && data.canDecide && (
            <button type="button" onClick={(): void => setTab('measures')} className="w-full rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-left text-sm text-foreground">
              <span className="font-medium">{data.pending === 1 ? '1 reconsideración por resolver' : `${data.pending} reconsideraciones por resolver`}</span> · la dirección tiene cinco días hábiles desde el pedido.
            </button>
          )}
          <div role="tablist" aria-label="Vistas" className="flex gap-1 border-b border-border">
            {(
              [
                ['faults', 'Faltas'],
                ['measures', 'Medidas del año'],
              ] as Array<[Tab, string]>
            ).map(([k, label]) => (
              <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={(): void => setTab(k)} className={cn('-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium', tab === k ? 'border-brand text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground')}>
                {label}
                <span className="text-xs tabular-nums opacity-70">{counts[k]}</span>
              </button>
            ))}
          </div>
          {tab === 'faults' ? (
            <>
              <div className="flex flex-wrap items-end gap-3">
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-foreground">Desde</span>
                  <Input type="date" value={f.from} max={data.today} onChange={(e): void => setF({ ...f, from: e.target.value })} />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-foreground">Hasta</span>
                  <Input type="date" value={f.to} max={data.today} onChange={(e): void => setF({ ...f, to: e.target.value })} />
                </label>
                <Filter id="disc-sev" label="Gravedad" value={f.severity} options={[{ value: '', label: 'Todas' }, ...Object.entries(severityLabels).map(([value, label]) => ({ value, label }))]} onChange={(v): void => setF({ ...f, severity: v })} />
                <Filter
                  id="disc-status"
                  label="Estado"
                  value={f.status}
                  options={[
                    { value: '', label: 'Todas' },
                    { value: 'open', label: 'Abiertas' },
                    { value: 'closed', label: 'Cerradas' },
                  ]}
                  onChange={(v): void => setF({ ...f, status: v })}
                />
              </div>
              {data.incidents.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">No hay faltas con esos filtros.</p>
              ) : (
                <ul className="space-y-3">
                  {data.incidents.slice(0, 200).map((x) => (
                    <IncidentCard key={x.id} slug={slug} x={x} catalog={data.catalog} canDecide={data.canDecide} family={data.family} today={data.today} onChanged={reload} showStudent onStudent={setOpen} />
                  ))}
                </ul>
              )}
            </>
          ) : data.measures.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">No hay suspensiones, matrículas condicionales ni expulsiones este año.</p>
          ) : (
            <ul className="space-y-3">
              {data.measures.map((m) => (
                <li key={m.id} className="rounded-xl border border-border bg-background px-4 py-3">
                  <button type="button" className="mb-1 text-left text-sm font-medium text-brand hover:underline" onClick={(): void => setOpen(m.studentId)}>
                    {m.studentName} <span className="font-normal text-muted-foreground">· {m.placement}</span>
                  </button>
                  <span className="sr-only">{measureKindLabels[m.kind]}</span>
                  <MeasureLine slug={slug} m={m} canDecide={data.canDecide} family={data.family} today={data.today} onChanged={reload} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {report && data && (
        <IncidentDialog
          slug={slug}
          student={null}
          catalog={data.catalog}
          onClose={(): void => setReport(false)}
          onSaved={(): void => {
            setReport(false);
            reload();
          }}
        />
      )}
    </AcademicPage>
  );
};
