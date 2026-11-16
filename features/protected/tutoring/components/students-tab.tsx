'use client';

import { useMemo, useState, type JSX } from 'react';
import { CalendarPlus, HandHelping, MessageCircle } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { SearchBox } from '@/features/protected/people/components/people-ui';
import { cn } from '@/lib/utils';
import { alertCodeClass, alertCodeLabels, alertReasons, formatWhen, idleText, saaneeStatusClass, saaneeStatusLabels } from '../data/tutoring-data';
import type { SessionDraft, TutorBoard, TutorBoardRow } from '../types';

interface Props {
  board: TutorBoard;
  onWrite: (row: TutorBoardRow) => void;
  onSchedule: (draft: SessionDraft) => void;
  onSaanee: (row: TutorBoardRow) => void;
}

const fold = (v: string): string => v.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

// The tutor's students with what needs attention, and the alerts to act on (write, schedule a session)
export const StudentsTab = ({ board, onWrite, onSchedule, onSaanee }: Props): JSX.Element => {
  const [query, setQuery] = useState('');
  const [onlyAlerts, setOnlyAlerts] = useState(false);
  const rows = useMemo(
    () => board.rows.filter((r) => (!onlyAlerts || r.alerts.length > 0 || r.unread > 0) && (!query || fold(`${r.student?.name} ${r.student?.code} ${r.student?.placement}`).includes(fold(query)))),
    [board.rows, query, onlyAlerts],
  );
  const byStudent = new Map(board.rows.map((r) => [r.student?.studentId ?? '', r]));
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <section aria-label="Mis estudiantes" className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-56 flex-1">
            <SearchBox value={query} onChange={setQuery} placeholder="Buscar estudiante o sección" />
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" className="size-4 accent-brand" checked={onlyAlerts} onChange={(e): void => setOnlyAlerts(e.target.checked)} />
            Solo con alertas o mensajes
          </label>
        </div>
        {rows.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">{board.rows.length === 0 ? 'No tienes estudiantes a cargo en el periodo.' : 'Nadie coincide con el filtro.'}</p>
        ) : (
          <ul className="divide-y divide-border rounded-2xl border border-border bg-background">
            {rows.map((r) => {
              const s = r.student;
              if (!s) return null;
              return (
                <li key={s.studentId} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
                  <span className="min-w-0 flex-1 basis-56">
                    <span className="block text-sm font-medium text-foreground">
                      {s.name}
                      {s.individual && <span className="pill ml-2 bg-secondary text-muted-foreground">Tutor propio</span>}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {s.placement} · Última actividad: {idleText(r.idleDays, s.lastAt)}
                      {r.nextSession && ` · Tutoría ${formatWhen(r.nextSession)}`}
                    </span>
                  </span>
                  <span className="flex flex-wrap gap-1">
                    {[...new Set(r.alerts)].map((a) => (
                      <span key={a} className={cn('pill', alertCodeClass[a])}>
                        {alertCodeLabels[a] ?? a}
                      </span>
                    ))}
                    {r.overdue > 0 && <span className="pill bg-warning/12 text-warning">{r.overdue} sin entregar</span>}
                    {r.dueSoon > 0 && <span className="pill bg-secondary text-foreground">{r.dueSoon} por vencer</span>}
                    {r.unread > 0 && <span className="pill bg-brand text-brand-foreground">{r.unread} sin leer</span>}
                    {r.saanee && <span className={cn('pill', saaneeStatusClass[r.saanee])}>SAANEE: {saaneeStatusLabels[r.saanee]?.toLowerCase()}</span>}
                  </span>
                  <span className="flex gap-1">
                    {board.canMessage && (
                      <button type="button" className="btn-alt h-8 px-3 text-xs" onClick={(): void => onWrite(r)} aria-label={`Escribir a ${s.name}`}>
                        <MorphIcon icon={MessageCircle} size={14} />
                        Escribir
                      </button>
                    )}
                    <button type="button" className="btn-alt h-8 px-3 text-xs" onClick={(): void => onSchedule({ studentIds: [s.studentId], kind: 'individual', reason: '', alertKind: '' })} aria-label={`Agendar tutoría con ${s.name}`}>
                      <MorphIcon icon={CalendarPlus} size={14} />
                      Agendar
                    </button>
                    <button type="button" className="btn-alt h-8 px-3 text-xs" onClick={(): void => onSaanee(r)} aria-label={`SAANEE de ${s.name}`}>
                      <MorphIcon icon={HandHelping} size={14} />
                      SAANEE
                    </button>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <aside className="space-y-6">
        <section aria-labelledby="tb-alerts" className="space-y-2">
          <h2 id="tb-alerts" className="text-sm font-semibold text-foreground">
            Alertas por atender ({board.alerts.length})
          </h2>
          {board.alerts.length === 0 ? (
            <p className="text-sm text-muted-foreground">Ninguna. Tus estudiantes se conectan y entregan a tiempo.</p>
          ) : (
            <ul className="space-y-2">
              {board.alerts.slice(0, 15).map((a, i) => {
                const row = byStudent.get(a.studentId);
                return (
                  <li key={`${a.studentId}-${a.code}-${i}`} className={cn('rounded-xl border bg-background px-3 py-2.5 text-sm', a.level === 'high' ? 'border-destructive/40' : 'border-border')}>
                    <span className="block font-medium text-foreground">{a.studentName}</span>
                    <span className="block text-muted-foreground">
                      {a.title}: {a.detail}
                    </span>
                    <span className="mt-2 flex gap-1">
                      {board.canMessage && row && (
                        <button type="button" className="btn-alt h-7 px-2.5 text-xs" onClick={(): void => onWrite(row)}>
                          Escribir
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn-alt h-7 px-2.5 text-xs"
                        onClick={(): void => onSchedule({ studentIds: [a.studentId], kind: 'individual', reason: alertReasons[a.code] ?? '', alertKind: a.code === 'commitment' ? '' : a.code })}
                      >
                        Agendar tutoría
                      </button>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
        <section aria-labelledby="tb-pending" className="space-y-2">
          <h2 id="tb-pending" className="text-sm font-semibold text-foreground">
            Entregas pendientes
          </h2>
          {board.pending.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nada vencido ni por vencer esta semana.</p>
          ) : (
            <ul className="divide-y divide-border rounded-xl border border-border bg-background text-sm">
              {board.pending.slice(0, 12).map((w) => (
                <li key={`${w.studentId}-${w.itemId}`} className="px-3 py-2">
                  <span className="block text-foreground">{byStudent.get(w.studentId)?.student?.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {w.subject}: {w.title} · <span className={w.overdue ? 'text-destructive' : ''}>{w.overdue ? 'venció' : 'vence'} {formatWhen(w.closesAt)}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </aside>
    </div>
  );
};
