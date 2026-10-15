'use client';

import type { JSX } from 'react';
import { Activity, ArrowRight, ChevronRight, Laptop, Users } from 'lucide-react';
import { Badge, Metric, Section, useWorkspaceNotice, WorkspaceShell } from './workspace-ui';

const AcademicsScreen = (): JSX.Element => {
  const { notify, notice } = useWorkspaceNotice();
  return (
    <WorkspaceShell eyebrow={'ESTRUCTURA CURRICULAR EBA · RVM N.° 034-2019-MINEDU'} title={'Gestión académica institucional'} description={'Organización de ciclos, grados modulares y áreas curriculares para el periodo lectivo 2026-II.'} actions={['Descargar estructura', 'Gestionar secciones']} onAction={notify} notice={notice}>
      {
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <Metric label="Matrícula vigente" value="1,485" detail="Inicial 180 · Intermedio 420 · Avanzado 885" icon={Users} />
            <Metric label="Retención acumulada" value="96.7%" detail="Meta institucional cumplida" icon={Activity} tone="green" />
            <Metric label="Aulas virtuales activas" value="24" detail="6 sesiones en tiempo real" icon={Laptop} />
          </div>
          <Section title="Estructura curricular EBA · RVM N.° 034-2019-MINEDU" subtitle="Ciclos, grados académicos y áreas oficiales vigentes">
            <div className="grid gap-3 p-4 lg:grid-cols-3">
              {[
                { cycle: 'Ciclo inicial', count: '180', grades: '1.° y 2.° grado', areas: ['Comunicación', 'Matemática', 'Ciencia, Tecnología y Salud', 'Desarrollo Personal y Ciudadano', 'Educación para el Trabajo'] },
                { cycle: 'Ciclo intermedio', count: '420', grades: '1.°, 2.° y 3.° grado', areas: ['Áreas del ciclo inicial', 'Inglés como Lengua Extranjera', 'TIC y Competencia Digital'] },
                { cycle: 'Ciclo avanzado', count: '885', grades: '1.° a 4.° grado', areas: ['Áreas base + Inglés', 'Arte y Cultura', 'Educación Física y Bienestar', 'Certificación Técnica Modular'] },
              ].map((c, i) => (
                <article key={c.cycle} className={`rounded-lg border border-border p-4 ${i === 2 ? 'bg-primary text-primary-foreground' : 'bg-accent/30'}`}>
                  <div className="flex items-center justify-between">
                    <Badge tone={i === 2 ? 'green' : 'blue'}>{c.cycle}</Badge>
                    <span className="text-[8px]">{c.grades}</span>
                  </div>
                  <p className="mt-4 font-heading text-2xl font-bold">{c.count}</p>
                  <p className="text-[9px] opacity-70">estudiantes matriculados</p>
                  <p className="mt-4 text-[8px] font-bold uppercase tracking-wide opacity-70">Áreas curriculares</p>
                  <ul className="mt-2 space-y-1.5">
                    {c.areas.map((area) => (
                      <li key={area} className="text-[9px]">
                        • {area}
                      </li>
                    ))}
                  </ul>
                  <button onClick={(): void => notify(`Consultar ${c.cycle}`)} className="mt-4 flex items-center gap-1 text-[9px] font-semibold">
                    Ver distribución <ChevronRight className="size-3" />
                  </button>
                </article>
              ))}
            </div>
          </Section>
          <div className="grid gap-4 xl:grid-cols-2">
            <Section title="Escala oficial EBA" subtitle="Evaluación formativa estandarizada según CNEB">
              <div className="space-y-2 p-4">
                {[
                  ['AD', 'Logro destacado', 'Desempeño superior al esperado', 'green'],
                  ['A', 'Logro esperado', 'Competencia desarrollada para el grado', 'blue'],
                  ['B', 'En proceso', 'Requiere acompañamiento docente', 'amber'],
                  ['C', 'En inicio', 'Activa plan de recuperación pedagógica', 'red'],
                ].map((r) => (
                  <div key={r[0]} className="flex items-center gap-3 rounded-md bg-accent/30 p-2">
                    <Badge tone={r[3] as 'green' | 'blue' | 'amber' | 'red'}>{r[0]}</Badge>
                    <div>
                      <p className="text-[9px] font-semibold text-foreground">{r[1]}</p>
                      <p className="text-[8px] text-muted-foreground">{r[2]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
            <Section title="Operaciones académicas" subtitle="Seguimiento del periodo y coordinación docente">
              <div className="divide-y divide-border px-4">
                {[
                  ['Asignación de docentes', '24 aulas · 2 pendientes'],
                  ['Programación de sesiones', 'Calendario académico actualizado'],
                  ['Cierre de periodo', 'Evaluaciones y actas · 30 nov. 2026'],
                ].map((r) => (
                  <div key={r[0]} className="flex justify-between gap-2 py-3">
                    <div>
                      <p className="text-[9px] font-semibold text-foreground">{r[0]}</p>
                      <p className="mt-1 text-[8px] text-muted-foreground">{r[1]}</p>
                    </div>
                    <button onClick={(): void => notify(r[0])}>
                      <ArrowRight className="size-3.5 text-primary" />
                    </button>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </>
      }
    </WorkspaceShell>
  );
};

export { AcademicsScreen };
