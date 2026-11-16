'use client';

import Link from 'next/link';
import type { JSX } from 'react';
import { FileSpreadsheet, FileText } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { usePdf } from '@/features/protected/documents/lib/use-pdf';
import { studentPath } from '@/features/protected/people/data/people-data';
import { cn } from '@/lib/utils';
import { permanencePdfAction } from '../actions/permanence-pdf';
import { permanenceXlsxAction } from '../actions/permanence-xlsx';
import { percentClass, shortDay, stamp, statusLabels } from '../data/participation-data';
import type { SectionTableProps } from '../types';
import { WeekStrip } from './week-strip';

// The permanence of a distance section: each student with the weeks, percent, activity and days since the last action
export const SectionTable = ({ slug, sectionId, data, onAdjust }: SectionTableProps): JSX.Element => {
  const [isDownloading, download] = usePdf();
  const rule = data.rule ?? { windowDays: 7, minActiveDays: 1, inactiveDays: 14, lowPercent: 60, updatedByName: '', updatedAt: '' };
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {data.label} · del {shortDay(data.from)} al {shortDay(data.to)}
          {data.canAdjust && ' · Toca una semana para ajustarla.'}
        </p>
        <div className="flex gap-2">
          <button type="button" className="btn-alt" disabled={isDownloading || data.students.length === 0} onClick={(): void => download(() => permanencePdfAction(slug, sectionId))}>
            <MorphIcon icon={FileText} size={16} />
            PDF
          </button>
          <button type="button" className="btn-alt" disabled={isDownloading || data.students.length === 0} onClick={(): void => download(() => permanenceXlsxAction(slug, sectionId))}>
            <MorphIcon icon={FileSpreadsheet} size={16} />
            Excel
          </button>
        </div>
      </div>
      {data.students.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">Esta sección no tiene estudiantes matriculados.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-background">
          <table className="w-full min-w-[56rem] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th scope="col" className="px-4 py-3 font-medium">Estudiante</th>
                <th scope="col" className="px-4 py-3 font-medium">Permanencia</th>
                <th scope="col" className="px-4 py-3 font-medium">Semanas</th>
                <th scope="col" className="px-4 py-3 font-medium">Actividad</th>
                <th scope="col" className="px-4 py-3 font-medium">Última acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.students.map((s) => {
                const a = s.activity;
                const idle = s.status === 'active' && s.idleDays >= rule.inactiveDays;
                return (
                  <tr key={s.enrollmentId} className={cn(s.status !== 'active' && 'opacity-60')}>
                    <td className="px-4 py-3">
                      <Link href={studentPath(s.studentId)} className="font-medium text-foreground hover:text-brand">
                        {s.studentName}
                      </Link>
                      <span className="block text-xs text-muted-foreground">
                        {s.studentCode}
                        {statusLabels[s.status] && ` · ${statusLabels[s.status]}`}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('text-base font-semibold tabular-nums', percentClass(s.percent, rule.lowPercent))}>{s.percent} %</span>
                      <span className="block text-xs text-muted-foreground tabular-nums">
                        {s.present} de {s.counted} semanas
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <WeekStrip student={s} canAdjust={data.canAdjust} onPick={(w): void => onAdjust({ student: s, window: w })} />
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">
                      {a ? `${a.activeDays} días · ${a.views + a.live} accesos · ${a.submissions} entregas · ${a.posts} foros` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('text-sm', idle ? 'font-medium text-destructive' : 'text-foreground')}>{stamp(a?.lastAt ?? '')}</span>
                      {idle && <span className="block text-xs text-destructive">{s.idleDays} días sin conectarse</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="size-3 rounded-[3px] bg-success" />Cumple la regla</span>
        <span className="flex items-center gap-1.5"><span className="size-3 rounded-[3px] bg-destructive/60" />No cumple</span>
        <span className="flex items-center gap-1.5"><span className="size-3 rounded-[3px] bg-warning" />Ajustada por el tutor</span>
        <span>La semana en curso (con borde) solo suma cuando ya cumple.</span>
      </p>
    </div>
  );
};
