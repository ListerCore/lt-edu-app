'use client';

import type { JSX, ReactNode } from 'react';
import { formatDay } from '@/features/protected/academic/data/academic-data';
import { cn } from '@/lib/utils';
import { absentPercent, attendedPercent, formatClock, markLabels, percent, sourceLabels, tallyTotal } from '../data/attendance-data';
import type { StudentAttendance } from '../types';
import { Empty, MarkPill, TallyBar, TallyLine } from './attendance-ui';
import { JustificationCard } from './justifications-view';

interface StudentRecordProps {
  record: StudentAttendance;
  // Shown above the justifications (the family's "Justificar" button)
  actions?: ReactNode;
  // Today's line is the first thing families look at
  showToday?: boolean;
}

// One student's attendance: today, the period in numbers, the days that were not plain present, classes per subject
// and the justifications. Used by the family view and the student's page
export const StudentRecord = ({ record, actions, showToday }: StudentRecordProps): JSX.Element => {
  const limit = record.limit || 30;
  const pct = absentPercent(record.days);
  const today = record.today;
  return (
    <div className="space-y-6">
      {showToday && (
        <div className={cn('rounded-2xl border p-5', !today ? 'border-border bg-background' : today.status === 'present' ? 'border-success/40 bg-success/8' : today.status === 'late' ? 'border-warning/40 bg-warning/10' : 'border-destructive/30 bg-destructive/8')}>
          <p className="text-sm text-muted-foreground">Hoy</p>
          <p className="mt-1 text-xl font-semibold text-foreground">
            {!today ? 'Aún no registra su llegada' : today.arrivedAt ? `${markLabels[today.status]}: llegó a las ${formatClock(today.arrivedAt)}` : markLabels[today.status]}
          </p>
          {today?.note && <p className="mt-1 text-sm text-muted-foreground">{today.note}</p>}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Figure label="Asistencia del periodo" value={percent(attendedPercent(record.days))} detail={`${tallyTotal(record.days)} días registrados`} />
        <Figure label="Faltas sin justificar" value={String(record.days?.absent ?? 0)} detail={`${percent(pct)} · límite ${limit} %`} tone={pct >= limit ? 'danger' : pct >= limit * 0.75 ? 'warn' : undefined} />
        <Figure label="Tardanzas" value={String(record.days?.late ?? 0)} detail={(record.days?.justified ?? 0) === 1 ? '1 falta justificada' : `${record.days?.justified ?? 0} faltas justificadas`} />
      </div>
      <div className="space-y-2">
        <TallyBar tally={record.days} className="h-3" />
        <TallyLine tally={record.days} />
      </div>

      {record.subjects.length > 0 && (
        <section aria-label="Asistencia por curso" className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Por curso</h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {record.subjects.map((s) => {
              // Fewer than 4 classes say too little to color a subject as an alert
              const p = tallyTotal(s.classes) >= 4 ? absentPercent(s.classes) : 0;
              return (
                <li key={s.assignmentId} className="rounded-xl border border-border bg-background px-4 py-3">
                  <span className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate font-medium text-foreground">{s.subjectName}</span>
                    <span className={cn('shrink-0 text-xs tabular-nums', p >= limit ? 'font-semibold text-destructive' : p >= limit * 0.75 ? 'text-warning' : 'text-muted-foreground')}>
                      {s.classes?.absent ?? 0}/{tallyTotal(s.classes)} faltas
                    </span>
                  </span>
                  <TallyBar tally={s.classes} className="mt-2" />
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section aria-label="Días con novedad" className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Días con novedad</h3>
        {record.marks.length === 0 ? (
          <Empty>Asistió puntual todos los días del periodo.</Empty>
        ) : (
          <ul className="divide-y divide-border rounded-2xl border border-border bg-background">
            {record.marks.map((m) => (
              <li key={m.day} className="flex flex-wrap items-center gap-3 px-4 py-2.5 text-sm">
                <span className="w-32 text-foreground tabular-nums">{formatDay(m.day)}</span>
                <MarkPill status={m.status} />
                <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                  {m.arrivedAt && `Llegó ${formatClock(m.arrivedAt)} · `}
                  {sourceLabels[m.source] ?? m.source}
                  {m.note && ` · ${m.note}`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-label="Justificaciones" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-foreground">Justificaciones</h3>
          {actions}
        </div>
        {record.justifications.length === 0 ? <Empty>No hay justificaciones enviadas.</Empty> : <div className="grid gap-3 lg:grid-cols-2">{record.justifications.map((j) => <JustificationCard key={j.id} j={j} showStudent={false} />)}</div>}
      </section>
    </div>
  );
};

const Figure = ({ label, value, detail, tone }: { label: string; value: string; detail: string; tone?: 'warn' | 'danger' }): JSX.Element => (
  <div className="rounded-2xl border border-border bg-background p-4">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className={cn('mt-1 text-2xl font-semibold tracking-tight tabular-nums', tone === 'danger' ? 'text-destructive' : tone === 'warn' ? 'text-warning' : 'text-foreground')}>{value}</p>
    <p className="mt-1 text-xs text-muted-foreground tabular-nums">{detail}</p>
  </div>
);
