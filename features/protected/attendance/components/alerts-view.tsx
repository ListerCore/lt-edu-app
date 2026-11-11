'use client';

import Link from 'next/link';
import { useState, type JSX } from 'react';
import { LoadError, PageSkeleton, SelectField } from '@/features/protected/academic/components/academic-ui';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { DASHBOARD_PATH } from '@/features/protected/dashboard/data/dashboard-navigation';
import { isAttendanceEvent } from '@/hooks/use-live';
import { cn } from '@/lib/utils';
import { getReportAction } from '../actions/attendance-actions';
import { absentPercent, percent, tallyTotal } from '../data/attendance-data';
import type { Overview } from '../types';
import { Empty, TallyBar } from './attendance-ui';

const studentAttendancePath = (id: string): string => `${DASHBOARD_PATH}/students/${id}?tab=attendance`;

// Alertas: who is close to (or past) the absence limit of the institution, by day and by subject
export const AlertsView = ({ slug, overview }: { slug: string; overview: Overview }): JSX.Element => {
  const [sectionId, setSectionId] = useState('');
  const [all, setAll] = useState(false);
  const { data, error, reload } = useAcademicData(`att-report:${slug}:${sectionId}`, () => getReportAction(slug, sectionId), isAttendanceEvent);
  const sectionWord = overview.vocabulary?.section ?? 'Sección';

  if (error) return <LoadError message={error} onRetry={reload} />;
  if (!data) return <PageSkeleton />;
  const limit = data.limit || 30;
  const warn = limit * 0.75;
  const rows = [...data.students].map((s) => ({ ...s, pct: absentPercent(s.days) })).sort((a, b) => b.pct - a.pct || (b.days?.absent ?? 0) - (a.days?.absent ?? 0));
  const flagged = rows.filter((r) => r.pct >= warn);
  const shown = all ? rows : flagged;
  const over = flagged.filter((r) => r.pct >= limit).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="w-full max-w-sm">
          <SelectField id="att-alert-section" value={sectionId} options={[{ value: '', label: `Todas las ${sectionWord.toLowerCase()}es` }, ...overview.sections.map((s) => ({ value: s.sectionId, label: s.sectionLabel }))]} onChange={setSectionId} />
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={all} onChange={(e): void => setAll(e.target.checked)} className="size-4 accent-brand" />
          Ver a todos los estudiantes
        </label>
      </div>
      <p className="text-sm text-muted-foreground">
        El límite de inasistencias es {limit} % de los días con asistencia del periodo; desde {percent(warn)} aparece aquí como aviso.{' '}
        {flagged.length > 0 && (
          <span className="text-foreground">
            {over} {over === 1 ? 'pasó' : 'pasaron'} el límite y {flagged.length - over} {flagged.length - over === 1 ? 'está cerca' : 'están cerca'}.
          </span>
        )}
      </p>

      {shown.length === 0 ? (
        <Empty>Nadie está cerca del límite de inasistencias.</Empty>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-background">
          <table className="w-full min-w-[46rem] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th scope="col" className="px-4 py-3 font-medium">Estudiante</th>
                <th scope="col" className="px-4 py-3 font-medium">{sectionWord}</th>
                <th scope="col" className="w-72 px-4 py-3 font-medium">Días</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Faltas</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Inasistencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {shown.slice(0, 300).map((r) => (
                <tr key={r.studentId}>
                  <td className="px-4 py-2.5">
                    <Link href={studentAttendancePath(r.studentId)} className="font-medium text-foreground hover:underline">
                      {r.name}
                    </Link>
                    <span className="block text-xs text-muted-foreground tabular-nums">{r.code}</span>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{r.sectionLabel}</td>
                  <td className="px-4 py-2.5">
                    <TallyBar tally={r.days} />
                    <span className="mt-1 block text-xs whitespace-nowrap text-muted-foreground tabular-nums">
                      {tallyTotal(r.days)} días · {r.days?.late ?? 0} tardanzas · {r.days?.justified ?? 0} justificadas
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{r.days?.absent ?? 0}</td>
                  <td className="px-4 py-2.5 text-right">
                    <span className={cn('pill tabular-nums', r.pct >= limit ? 'bg-destructive/12 text-destructive' : r.pct >= warn ? 'bg-warning/14 text-warning' : 'bg-secondary text-muted-foreground')}>{percent(r.pct)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.subjects.length > 0 && (
        <section aria-labelledby="att-subjects" className="space-y-3">
          <h2 id="att-subjects" className="text-lg font-semibold text-foreground">
            Por curso
          </h2>
          <p className="text-sm text-muted-foreground">Faltas a las clases de un curso o unidad (desde 4 clases registradas). En institutos, pasar el {limit} % impide aprobar la unidad.</p>
          <ul className="divide-y divide-border rounded-2xl border border-border bg-background">
            {[...data.subjects]
              .sort((a, b) => absentPercent(b.classes) - absentPercent(a.classes))
              .slice(0, 100)
              .map((t) => {
                const pct = absentPercent(t.classes);
                return (
                  <li key={`${t.studentId}:${t.assignmentId}`} className="flex flex-wrap items-center gap-3 px-4 py-3">
                    <span className="min-w-0 flex-1">
                      <Link href={studentAttendancePath(t.studentId)} className="block truncate text-sm font-medium text-foreground hover:underline">
                        {t.studentName}
                      </Link>
                      <span className="block truncate text-xs text-muted-foreground">
                        {t.subjectName} · {t.sectionLabel}
                      </span>
                    </span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {t.classes?.absent ?? 0} de {tallyTotal(t.classes)} clases
                    </span>
                    <span className={cn('pill tabular-nums', pct >= limit ? 'bg-destructive/12 text-destructive' : 'bg-warning/14 text-warning')}>{percent(pct)}</span>
                  </li>
                );
              })}
          </ul>
        </section>
      )}
    </div>
  );
};
