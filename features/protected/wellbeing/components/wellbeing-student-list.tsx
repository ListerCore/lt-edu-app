'use client';

import type { JSX } from 'react';
import { useMemo, useState } from 'react';
import { CalendarClock, MessageCircle, NotebookPen, Search, UserRound } from 'lucide-react';
import { wellbeingStudents, type RiskLevel, type WellbeingStudent } from '../data/wellbeing-data';

const riskTone: Record<RiskLevel, string> = { Crítico: 'bg-destructive/10 text-destructive', Moderado: 'bg-chart-3/10 text-chart-3', Estable: 'bg-secondary/10 text-secondary' };

const WellbeingStudentList = ({ selectedId, onSelect, onAction, onQuickNote }: { selectedId: string; onSelect: (student: WellbeingStudent) => void; onAction: (message: string) => void; onQuickNote: (student: WellbeingStudent) => void }): JSX.Element => {
  const [search, setSearch] = useState('');
  const [risk, setRisk] = useState('Todos los riesgos');
  const [cycle, setCycle] = useState('Todos los ciclos');
  const [intervention, setIntervention] = useState('Todos los estados');
  const filtered = useMemo(
    () =>
      wellbeingStudents.filter(
        (student) => `${student.name} ${student.dni} ${student.grade} ${student.occupation}`.toLowerCase().includes(search.toLowerCase()) && (risk === 'Todos los riesgos' || student.risk === risk) && (cycle === 'Todos los ciclos' || student.cycle === cycle) && (intervention === 'Todos los estados' || intervention === (student.risk === 'Estable' ? 'Compromiso cumplido' : student.id === 'silvia' ? 'Cita pendiente' : 'Seguimiento activo')),
      ),
    [search, risk, cycle, intervention],
  );

  return (
    <section aria-labelledby="wellbeing-students-heading" className="min-w-0 overflow-hidden rounded-lg border border-border bg-card">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 p-4">
        <div>
          <h2 id="wellbeing-students-heading" className="font-heading text-xs font-bold text-foreground sm:text-sm">
            Matriz de seguimiento y estudiantes asignados
          </h2>
          <p className="mt-1 text-[8px] text-muted-foreground">Supervisión individualizada por estudiante, causa de riesgo y plan de acción.</p>
        </div>
        <div className="flex gap-1.5 text-[8px]">
          <span className="rounded bg-destructive/10 px-1.5 py-1 font-semibold text-destructive">4 críticos</span>
          <span className="rounded bg-chart-3/10 px-1.5 py-1 font-semibold text-chart-3">7 moderados</span>
          <span className="rounded bg-secondary/10 px-1.5 py-1 font-semibold text-secondary">31 estables</span>
        </div>
      </header>
      <div className="grid min-w-0 gap-2 border-b border-border p-3 sm:grid-cols-2 xl:grid-cols-4">
        <label className="relative min-w-0">
          <Search aria-hidden="true" className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(event): void => setSearch(event.target.value)} placeholder="Buscar por DNI o nombres" className="h-9 w-full rounded-md border border-border bg-background pl-8 pr-3 text-[9px] text-foreground outline-none placeholder:text-muted-foreground focus:border-ring" />
        </label>
        <select aria-label="Filtrar por semáforo de riesgo" value={risk} onChange={(event): void => setRisk(event.target.value)} className="h-9 min-w-0 rounded-md border border-border bg-background px-2 text-[9px] text-foreground">
          <option>Todos los riesgos</option>
          <option>Crítico</option>
          <option>Moderado</option>
          <option>Estable</option>
        </select>
        <select aria-label="Filtrar por ciclo" value={cycle} onChange={(event): void => setCycle(event.target.value)} className="h-9 min-w-0 rounded-md border border-border bg-background px-2 text-[9px] text-foreground">
          <option>Todos los ciclos</option>
          <option>Avanzado</option>
          <option>Intermedio</option>
          <option>Inicial</option>
        </select>
        <select aria-label="Filtrar por intervención" value={intervention} onChange={(event): void => setIntervention(event.target.value)} className="h-9 min-w-0 rounded-md border border-border bg-background px-2 text-[9px] text-foreground">
          <option>Todos los estados</option>
          <option>Cita pendiente</option>
          <option>Seguimiento activo</option>
          <option>Compromiso cumplido</option>
        </select>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-230 border-collapse text-left">
          <thead className="bg-muted/30 text-[8px] font-bold uppercase tracking-wide text-muted-foreground">
            <tr>
              {['Estudiante / ocupación', 'Semáforo de riesgo', 'Indicadores EBA', 'Causa principal', 'Última intervención', 'Próxima cita', 'Acciones'].map((heading) => (
                <th key={heading} scope="col" className="px-3 py-3 first:pl-4">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((student) => (
              <tr key={student.id} onClick={(): void => onSelect(student)} className={`cursor-pointer transition-colors hover:bg-muted/30 ${selectedId === student.id ? 'bg-accent/40' : ''}`}>
                <th scope="row" className="px-3 py-3 pl-4">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-[8px] font-bold text-primary">{student.initials}</span>
                    <span className="min-w-0">
                      <span className="block max-w-40 truncate text-[9px] font-semibold text-foreground">{student.name}</span>
                      <span className="mt-0.5 block text-[8px] font-normal text-muted-foreground">
                        DNI {student.dni} · {student.grade}
                      </span>
                      <span className="mt-0.5 block max-w-40 truncate text-[8px] font-normal text-muted-foreground">{student.occupation}</span>
                    </span>
                  </span>
                </th>
                <td className="px-3 py-3">
                  <span className={`rounded-full px-2 py-1 text-[8px] font-semibold ${riskTone[student.risk]}`}>{student.risk === 'Crítico' ? 'Crítico · atención' : student.risk === 'Moderado' ? 'Riesgo moderado' : 'Estable'}</span>
                </td>
                <td className="px-3 py-3">
                  <span className="block text-[8px] text-muted-foreground">
                    Asist. LMS: <strong className={student.attendance < 60 ? 'text-destructive' : 'text-foreground'}>{student.attendance}%</strong>
                  </span>
                  <span className="mt-1 block text-[8px] text-muted-foreground">
                    Tareas: <strong className="text-foreground">{student.tasks}</strong>
                  </span>
                  <span className="mt-1 block text-[8px] text-muted-foreground">
                    Nivel: <strong className="text-foreground">{student.level}</strong>
                  </span>
                </td>
                <td className="max-w-36 px-3 py-3 text-[8px] leading-4 text-muted-foreground">{student.reason}</td>
                <td className="max-w-36 px-3 py-3 text-[8px] leading-4 text-muted-foreground">{student.lastIntervention}</td>
                <td className="max-w-32 px-3 py-3 text-[8px] leading-4 text-foreground">{student.nextAppointment}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label={`Ver ficha de ${student.name}`}
                      onClick={(event): void => {
                        event.stopPropagation();
                        onSelect(student);
                      }}
                      className="grid size-7 place-items-center rounded text-primary hover:bg-muted"
                    >
                      <UserRound aria-hidden="true" className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Registrar nota para ${student.name}`}
                      onClick={(event): void => {
                        event.stopPropagation();
                        onQuickNote(student);
                      }}
                      className="grid size-7 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <NotebookPen aria-hidden="true" className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Contactar a ${student.name}`}
                      onClick={(event): void => {
                        event.stopPropagation();
                        onAction(`Canal de tutoría preparado para ${student.name}.`);
                      }}
                      className="grid size-7 place-items-center rounded text-secondary hover:bg-secondary/10"
                    >
                      <MessageCircle aria-hidden="true" className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Programar cita con ${student.name}`}
                      onClick={(event): void => {
                        event.stopPropagation();
                        onAction(`Cita preparada para ${student.name}.`);
                      }}
                      className="grid size-7 place-items-center rounded text-muted-foreground hover:bg-muted"
                    >
                      <CalendarClock aria-hidden="true" className="size-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-xs text-muted-foreground">
                  No hay estudiantes que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-3 text-[8px] text-muted-foreground">
        <span>Mostrando {filtered.length} de 42 estudiantes asignados</span>
        <div className="flex items-center gap-1">
          <button type="button" disabled className="h-7 rounded px-2 disabled:opacity-50">
            Anterior
          </button>
          {['1', '2', '3'].map((page) => (
            <button key={page} type="button" aria-current={page === '1' ? 'page' : undefined} className={`size-7 rounded ${page === '1' ? 'bg-primary font-bold text-primary-foreground' : 'hover:bg-muted'}`}>
              {page}
            </button>
          ))}
          <button type="button" className="h-7 rounded px-2 hover:bg-muted">
            Siguiente
          </button>
        </div>
      </footer>
    </section>
  );
};

export { WellbeingStudentList };
