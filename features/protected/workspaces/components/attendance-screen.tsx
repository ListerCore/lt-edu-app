'use client';

import type { JSX } from 'react';
import { AttendanceReferencePanels } from './workspace-reference-panels';
import { useState } from 'react';
import { Activity, CalendarDays, Check, CheckCircle2, CircleAlert, Clock3, Laptop, ShieldCheck, Users } from 'lucide-react';
import { Action, Badge, Metric, Section, useWorkspaceNotice, WorkspaceShell } from './workspace-ui';

const AttendanceScreen = (): JSX.Element => {
  const { notify, notice } = useWorkspaceNotice();
  const [query, setQuery] = useState('');
  return (
    <WorkspaceShell eyebrow={'ASISTENCIA VIRTUAL · EBA'} title={'Control de Asistencia y Seguimiento Virtual EBA'} description={'Sesión N.° 14 · Matemática Funcional · Ciclo Avanzado · 2.° Grado B · “Resolución de problemas con fracciones y números racionales”.'} actions={['Sincronizar SIAGIE', 'Parte diario (PDF)', 'Guardar y notificar WhatsApp IA']} onAction={notify} notice={notice}>
      {
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ['Fecha de clase', 'Miércoles, 02 sep. 2026'],
              ['Horario síncrono', '09:00–10:30 hrs'],
              ['Docente tutor', 'Mag. Sonia Morales Cárdenas'],
              ['Modalidad híbrida', 'Meet en vivo + Campus LMS'],
            ].map(([a, b], i) => (
              <div key={a} className="flex items-center gap-3 rounded-lg bg-accent/50 p-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-md bg-background text-primary">{i === 0 ? <CalendarDays className="size-4" /> : i === 1 ? <Clock3 className="size-4" /> : i === 2 ? <Users className="size-4" /> : <Laptop className="size-4" />}</span>
                <div className="min-w-0">
                  <p className="text-[8px] uppercase text-muted-foreground">{a}</p>
                  <p className="truncate text-[10px] font-semibold text-foreground">{b}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="grid gap-3 grid-cols-2 xl:grid-cols-6">
            {[
              ['Total alumnos', '28', 'Padrón vigente', 'primary'],
              ['Presentes', '22', '78.6%', 'green'],
              ['Tardanzas', '3', '10.7%', 'amber'],
              ['Inasistencias', '2', 'Alerta IA activa', 'red'],
              ['Justificadas', '1', 'Visado por tutoría', 'primary'],
              ['Permanencia vivo', '76 / 90m', '84.4% retención', 'green'],
            ].map(([a, b, c, t]) => (
              <Metric key={a} label={a} value={b} detail={c} icon={a === 'Total alumnos' ? Users : a === 'Presentes' ? CheckCircle2 : a === 'Tardanzas' ? Clock3 : a === 'Inasistencias' ? CircleAlert : a === 'Justificadas' ? ShieldCheck : Activity} tone={t as 'primary' | 'green' | 'amber' | 'red'} />
            ))}
          </div>
          <div className="flex flex-wrap gap-2 rounded-lg bg-accent/50 p-2">
            {['Toma de asistencia por clase', 'Seguimiento Campus LMS', 'Rescate y permanencia EBA'].map((x, i) => (
              <button key={x} onClick={(): void => notify(x)} className={`rounded-md px-4 py-2 text-[10px] font-semibold ${i === 0 ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:bg-card'}`}>
                {x}
              </button>
            ))}
          </div>
          <Section title="Registro de asistencia de la sesión" subtitle="Monitoreo de actividad en campus virtual · últimas 48 horas">
            <div className="flex flex-wrap gap-2 border-b border-border p-3">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filtrar por estudiante, DNI o estado..." className="h-9 min-w-48 flex-1 rounded-md border border-border bg-background px-3 text-[10px] text-foreground" />
              <select className="h-9 rounded-md border border-border bg-background px-2 text-[10px] text-foreground">
                <option>Todos los estados (28)</option>
                <option>Presentes</option>
                <option>Tardanzas</option>
                <option>Faltas</option>
              </select>
              <Action primary onClick={(): void => notify('Marcar todos presentes')}>
                <Check className="size-3.5" />
                Marcar todos presentes
              </Action>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-225 text-left text-[9px]">
                <thead className="bg-accent/60 text-[8px] uppercase text-muted-foreground">
                  <tr>
                    {['Estudiante EBA Ayacucho', 'Registro de estado', 'Conexión / tiempo en vivo', 'Interacción Meet', 'Observación y contexto laboral'].map((x) => (
                      <th key={x} className="px-3 py-3">
                        {x}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    ['Juan Pérez Huamán', 'Presentes', '08:58 · 92 min (100%)', 'Alta · 4 participaciones', 'Resolvió problemas de fracciones'],
                    ['Roxana Quispe Sulca', 'Presentes', '09:02 · 88 min (97%)', 'Media · chat activo', 'Participó desde su taller de costura'],
                    ['Edwin Mendoza Alarcón', 'Tardanza', '09:25 · 65 min (72%)', 'Pasivo · oyente', 'Conexión tras entregar turno de trabajo'],
                    ['Silvia Cárdenas Palomino', 'Falta', 'Sin ingreso · 0 min', 'Inactivo', 'IA: segunda inasistencia no avisada'],
                    ['Carlos Huamán Triveño', 'Presentes', '09:00 · 90 min (100%)', 'Alta · preguntas y aportes', 'Participó desde centro de labores'],
                    ['Brayan Quispe Sulca', 'Justificada', 'Revisar grabación', 'Asíncrono', 'Solicitud aprobada por tutoría'],
                  ]
                    .filter((r) => r.join(' ').toLowerCase().includes(query.toLowerCase()))
                    .map((r) => (
                      <tr key={r[0]} className={r[1] === 'Falta' ? 'bg-destructive/5' : ''}>
                        <td className="px-3 py-3 font-semibold text-foreground">{r[0]}</td>
                        <td className="px-3 py-3">
                          <select defaultValue={r[1]} className="rounded bg-accent px-2 py-1 text-[9px] text-foreground">
                            <option>Presentes</option>
                            <option>Tardanza</option>
                            <option>Falta</option>
                            <option>Justificada</option>
                          </select>
                        </td>
                        <td className="px-3 py-3 text-foreground">{r[2]}</td>
                        <td className="px-3 py-3">
                          <Badge tone={r[1] === 'Falta' ? 'red' : r[1] === 'Tardanza' ? 'amber' : 'green'}>{r[3]}</Badge>
                        </td>
                        <td className="px-3 py-3 text-muted-foreground">{r[4]}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <p className="border-t border-border bg-accent/30 px-4 py-3 text-[9px] text-muted-foreground">Convención EBA: P presente · T tardanza · F falta injustificada · J falta justificada.</p>
          </Section>
          <AttendanceReferencePanels onAction={notify} />
        </>
      }
    </WorkspaceShell>
  );
};

export { AttendanceScreen };
