'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import { FileCheck2, GraduationCap, Users } from 'lucide-react';
import { StudentsProfilePanels } from './workspace-reference-panels';
import { Badge, Metric, Section, useWorkspaceNotice, WorkspaceShell } from './workspace-ui';

const StudentsScreen = (): JSX.Element => {
  const { notify, notice } = useWorkspaceNotice();
  const [query, setQuery] = useState('');
  return (
    <WorkspaceShell eyebrow={'PADRÓN INSTITUCIONAL · PERIODO 2026-II'} title={'Estudiantes y expedientes EBA'} description={'Padrón de estudiantes con búsqueda por DNI, ciclo, estado de matrícula y avance documental.'} actions={['Exportar padrón', 'Nuevo estudiante']} onAction={notify} notice={notice}>
      {
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <Metric label="Estudiantes matriculados" value="1,485" detail="Periodo vigente" icon={Users} />
            <Metric label="Ciclo avanzado" value="885" detail="60% del padrón" icon={GraduationCap} tone="green" />
            <Metric label="Expedientes observados" value="12" detail="Revisión documental" icon={FileCheck2} tone="amber" />
          </div>
          <Section title="Padrón de estudiantes y expedientes" subtitle="Consulta de ficha personal, trayectoria y documentación">
            <div className="flex flex-wrap gap-2 border-b border-border p-3">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por DNI, nombres o código modular" className="h-9 min-w-48 flex-1 rounded-md border border-border bg-background px-3 text-[10px] text-foreground" />
              <select className="h-9 rounded-md border border-border bg-background px-2 text-[9px] text-foreground">
                <option>Todos los ciclos</option>
                <option>Inicial</option>
                <option>Intermedio</option>
                <option>Avanzado</option>
              </select>
              <select className="h-9 rounded-md border border-border bg-background px-2 text-[9px] text-foreground">
                <option>Todos los estados</option>
                <option>Activo</option>
                <option>Observado</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-195 text-left text-[9px]">
                <thead className="bg-accent/60 text-[8px] uppercase text-muted-foreground">
                  <tr>
                    {['Estudiante / identificación', 'Ciclo y grado', 'Sede / modalidad', 'Avance académico', 'Expediente', 'Estado'].map((x) => (
                      <th key={x} className="px-3 py-3">
                        {x}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    ['Juan Pérez Huamán', 'DNI 47829103', 'Avanzado · 2.°', 'Ayacucho · Virtual', '86%', 'Completo', 'Activo'],
                    ['Roxana Quispe Sulca', 'DNI 71203948', 'Avanzado · 4.°', 'Huanta · Virtual', '92%', 'Completo', 'Activo'],
                    ['Edwin Mendoza Alarcón', 'DNI 42918274', 'Intermedio · 3.°', 'Cangallo · Virtual', '68%', 'En revisión', 'Pendiente'],
                    ['Silvia Cárdenas Palomino', 'DNI 74819203', 'Avanzado · 1.°', 'Ayacucho · Virtual', '54%', 'Incompleto', 'Observado'],
                  ]
                    .filter((r) => r.join(' ').toLowerCase().includes(query.toLowerCase()))
                    .map((r) => (
                      <tr key={r[1]}>
                        <td className="px-3 py-3">
                          <b className="text-foreground">{r[0]}</b>
                          <p className="mt-1 text-muted-foreground">{r[1]}</p>
                        </td>
                        <td className="px-3 py-3 text-foreground">{r[2]}</td>
                        <td className="px-3 py-3 text-muted-foreground">{r[3]}</td>
                        <td className="px-3 py-3">
                          <div className="w-24">
                            <div className="h-1.5 rounded-full bg-muted">
                              <div className="h-full rounded-full bg-secondary" style={{ width: r[4] }} />
                            </div>
                            <p className="mt-1 text-[8px] text-muted-foreground">{r[4]}</p>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-foreground">{r[5]}</td>
                        <td className="px-3 py-3">
                          <Badge tone={r[6] === 'Activo' ? 'green' : r[6] === 'Observado' ? 'red' : 'amber'}>{r[6]}</Badge>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Section>
          <StudentsProfilePanels onAction={notify} />
        </>
      }
    </WorkspaceShell>
  );
};

export { StudentsScreen };
