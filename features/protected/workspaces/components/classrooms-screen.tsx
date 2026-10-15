'use client';

import type { JSX } from 'react';
import { ClassroomReferencePanels } from './workspace-reference-panels';
import { ArrowRight, ClipboardCheck, Download, MessageCircle, Plus, Video } from 'lucide-react';
import { Action, Badge, Section, useWorkspaceNotice, WorkspaceShell } from './workspace-ui';

const ClassroomsScreen = (): JSX.Element => {
  const { notify, notice } = useWorkspaceNotice();
  return (
    <WorkspaceShell eyebrow={'PLATAFORMA ACADÉMICA OFICIAL · CEBA JOSEPH LISTER'} title={'Aula Virtual y Entorno de Aprendizaje EBA'} description={'Modalidad virtual · homologado RVM N.° 125-2020-MINEDU · Ciclo Avanzado, 2.° Grado B · Periodo promocional 2026-II.'} actions={['Publicar anuncio', 'Programar clase en vivo', 'Nueva sesión / recurso']} onAction={notify} notice={notice}>
      {
        <>
          <div className="grid gap-2 sm:grid-cols-3">
            <select className="h-9 rounded-md border border-border bg-card px-3 text-[9px] text-foreground">
              <option>Matemática funcional</option>
              <option>Comunicación</option>
            </select>
            <select className="h-9 rounded-md border border-border bg-card px-3 text-[9px] text-foreground">
              <option>Ciclo Avanzado · 2.° Grado B</option>
            </select>
            <select className="h-9 rounded-md border border-border bg-card px-3 text-[9px] text-foreground">
              <option>Unidad 2: Modelación financiera</option>
            </select>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {[
              ['Progreso general', '68%', 'Semana 8 de 12'],
              ['Estudiantes activos', '27 / 28', '96.4% interacción semanal'],
              ['Evidencias pendientes', '5', 'Por retroalimentar'],
              ['Sesión síncrona', 'Miércoles 10 AM', 'Google Meet + pizarra'],
              ['Permanencia campus', '4.8 h/sem', 'Cumple estándar EBA'],
            ].map(([a, b, c], i) => (
              <article key={a} className="rounded-lg border border-border bg-card p-3">
                <p className="text-[8px] uppercase text-muted-foreground">{a}</p>
                <p className="mt-2 font-heading text-lg font-bold text-foreground">{b}</p>
                <p className="mt-1 text-[9px] text-muted-foreground">{c}</p>
                {i === 0 && (
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-[68%] bg-secondary" />
                  </div>
                )}
              </article>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 rounded-md border border-border bg-card p-2">
            {['Plan de aprendizaje', 'Tareas y entregables · 5', 'Evaluaciones en línea · 3'].map((x, i) => (
              <button key={x} onClick={(): void => notify(x)} className={`rounded px-3 py-2 text-[9px] font-semibold ${i === 0 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
                {x}
              </button>
            ))}
          </div>
          <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(17rem,.8fr)]">
            <div className="flex min-w-0 flex-col gap-4">
              <article className="rounded-lg bg-primary p-5 text-primary-foreground">
                <Badge tone="green">UNIDAD DIDÁCTICA N.° 02</Badge>
                <h2 className="mt-3 font-heading text-lg font-bold">Modelación financiera y fracciones en emprendimientos de Ayacucho</h2>
                <p className="mt-2 max-w-2xl text-[10px] leading-5 text-primary-foreground/75">Aplicación de operaciones fraccionarias en costos de producción textil y comercio local. Vigencia: 15 oct. – 05 nov.</p>
                <button onClick={(): void => notify('Descargar sílabo de unidad')} className="mt-3 rounded-md bg-primary-foreground px-3 py-2 text-[9px] font-semibold text-primary">
                  <Download className="mr-1 inline size-3" />
                  Descargar sílabo
                </button>
              </article>
              <Section title="Sesión N.° 6: Resolución de problemas con fracciones en costos de producción">
                <div className="flex flex-wrap items-center justify-between gap-2 p-4">
                  <div>
                    <Badge tone="green">Publicado y activo</Badge>
                    <p className="mt-2 text-[9px] text-muted-foreground">Docente: Mg. Raúl Alarcón P. · Fecha límite: domingo 27 de octubre, 23:59 hrs</p>
                  </div>
                  <Action onClick={(): void => notify('Editar sesión')}>
                    <ClipboardCheck className="size-3.5" />
                    Editar sesión
                  </Action>
                </div>
              </Section>
              <Section title="Videoclase magistral y taller síncrono">
                <div className="grid gap-3 p-4 sm:grid-cols-[1fr_1.2fr]">
                  <div className="grid min-h-36 place-items-center rounded-md bg-accent text-primary">
                    <Video className="size-10" />
                    <span className="text-[9px]">Grabación · 48 min</span>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold text-foreground">Taller práctico de costos y rentabilidad fraccionaria</h3>
                    <p className="mt-2 text-[9px] leading-4 text-muted-foreground">Ejemplos de distribución de gastos fijos y costos de materia prima en talleres textiles locales.</p>
                    <Action onClick={(): void => notify('Ver grabación completa')}>Ver grabación completa</Action>
                  </div>
                </div>
              </Section>
              <Section title="Material de estudio y recursos didácticos">
                <div className="grid gap-2 p-4 sm:grid-cols-2">
                  {['Guía didáctica N.° 06 · PDF oficial MINEDU', 'Plantilla Excel · hoja de costos interactiva', 'Foro: cálculo fraccionario en el trabajo', 'Evidencia 06 · hoja de presupuesto'].map((x) => (
                    <button key={x} onClick={(): void => notify(x)} className="flex items-center justify-between rounded-md bg-accent/50 p-3 text-left text-[9px] font-medium text-foreground">
                      {x}
                      <ArrowRight className="size-3.5 text-primary" />
                    </button>
                  ))}
                </div>
              </Section>
            </div>
            <aside className="flex min-w-0 flex-col gap-4">
              <Section title="Crear y publicar recurso">
                <div className="grid grid-cols-2 gap-2 p-3">
                  {['Nueva sesión', 'Subir guía PDF', 'Crear tarea', 'Nueva evaluación'].map((x) => (
                    <button key={x} onClick={(): void => notify(x)} className="min-h-16 rounded-md bg-accent/50 p-2 text-left text-[9px] font-semibold text-foreground hover:bg-accent">
                      <Plus className="mb-1 size-3.5 text-primary" />
                      {x}
                    </button>
                  ))}
                </div>
              </Section>
              <Section title="Monitor de estudiantes en alerta">
                <div className="divide-y divide-border px-3">
                  {['Carlos Ramos Quispe · 4 días sin ingresar', 'Marilú Acapuclla T. · no descargó la guía', 'Joel Escalante M. · trabajo nocturno'].map((x) => (
                    <div key={x} className="flex items-center justify-between gap-2 py-3 text-[9px] text-foreground">
                      {x}
                      <button onClick={(): void => notify('Contactar estudiante')}>
                        <MessageCircle className="size-3.5 text-primary" />
                      </button>
                    </div>
                  ))}
                </div>
              </Section>
              <Section title="Validación de asistencia virtual">
                <div className="p-4">
                  <p className="text-[9px] text-muted-foreground">Última sincronización SIAGIE · Hoy a las 08:30 AM</p>
                  <button onClick={(): void => notify('Sincronizar asistencia')} className="mt-3 w-full rounded-md bg-accent px-3 py-2 text-[9px] font-semibold text-primary">
                    Sincronizar
                  </button>
                </div>
              </Section>
              <Section title="Enlaces de interés y autoaprendizaje">
                <div className="space-y-2 p-3">
                  {['Khan Academy EBA en Español', 'Repositorio Digital MINEDU', 'Simulador GeoGebra'].map((x) => (
                    <button key={x} className="block w-full rounded bg-accent/50 p-2 text-left text-[9px] text-foreground">
                      {x}
                    </button>
                  ))}
                </div>
              </Section>
            </aside>
          </div>
          <ClassroomReferencePanels onAction={notify} />
        </>
      }
    </WorkspaceShell>
  );
};

export { ClassroomsScreen };
