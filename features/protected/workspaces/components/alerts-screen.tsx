'use client';

import type { JSX } from 'react';
import { IntelligenceReferencePanels, IntelligenceAdminPanels } from './workspace-reference-panels';
import { BookOpen, CircleAlert, ClipboardCheck, Download, MessageCircle, Users } from 'lucide-react';
import { Action, Badge, Metric, Section, useWorkspaceNotice, WorkspaceShell } from './workspace-ui';

const AlertsScreen = (): JSX.Element => {
  const { notify, notice } = useWorkspaceNotice();
  return (
    <WorkspaceShell eyebrow={'INNOVACIÓN TECNOLÓGICA · IA EBA V2.6'} title={'IA Educativa y Motor Predictivo de Rendimiento EBA'} description={'Herramientas de inteligencia artificial generativa y predictiva adaptadas a las trayectorias de jóvenes y adultos trabajadores de la región Ayacucho.'} actions={['Ajustes del modelo / tokens', 'Historial de prompts guardados', 'Nueva consulta IA']} onAction={notify} notice={notice}>
      {
        <>
          <div className="flex flex-wrap gap-2">
            <Badge tone="green">Motor Llama-3-Edu PE calibrado CNEB</Badge>
            <Badge>R.V.M. N.° 125-2020-MINEDU</Badge>
            <Badge tone="green">Inferencia en tiempo real</Badge>
          </div>
          <div className="flex flex-wrap gap-2 rounded-md bg-accent/50 p-2">
            {['Generador de evaluaciones CNEB', 'Asistente docente · sesiones y recursos', 'Tutor inteligente estudiantil', 'Análisis de deserción'].map((x, i) => (
              <button key={x} onClick={(): void => notify(x)} className={`rounded px-3 py-2 text-[9px] font-semibold ${i === 0 ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground'}`}>
                {x}
              </button>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ['Evaluaciones generadas', '184', '98% alineamiento', ClipboardCheck],
              ['Sesiones curriculares', '312', '90 min promedio', BookOpen],
              ['Tutor virtual estudiantil', '1,420', '94% satisfacción', MessageCircle],
              ['Riesgo de deserción', '11', 'Casos mitigados', CircleAlert],
            ].map(([a, b, c, Icon]) => (
              <Metric key={String(a)} label={String(a)} value={String(b)} detail={String(c)} icon={Icon as typeof Users} tone={a === 'Riesgo de deserción' ? 'red' : 'primary'} />
            ))}
          </div>
          <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(19rem,.8fr)]">
            <div className="flex min-w-0 flex-col gap-4">
              <Section title="Generador de evaluaciones por competencias CNEB" subtitle="Modo asistido · contextualizado al perfil de egreso EBA">
                <div className="grid gap-3 p-4 sm:grid-cols-2">
                  {[
                    ['Área curricular', 'Ciencias: Matemática Funcional'],
                    ['Ciclo y grado EBA', 'Ciclo Avanzado · 2.° Grado B'],
                    ['Competencia priorizada', 'Resuelve problemas de cantidad'],
                    ['Nivel y enfoque andino', 'Intermedio / Contexto laboral'],
                  ].map(([a, b]) => (
                    <label key={a} className="text-[9px] font-medium text-muted-foreground">
                      {a}
                      <select className="mt-1 block h-9 w-full rounded-md border border-border bg-background px-2 text-[9px] text-foreground">
                        <option>{b}</option>
                      </select>
                    </label>
                  ))}
                  <label className="text-[9px] font-medium text-muted-foreground sm:col-span-2">
                    Estructura del instrumento
                    <input className="mt-1 block h-9 w-full rounded-md border border-border bg-background px-2 text-[9px] text-foreground" defaultValue="Rúbrica analítica + 5 ítems contextualizados + 1 caso práctico" />
                  </label>
                  <button onClick={(): void => notify('Generar evaluación con IA')} className="rounded-md bg-primary px-4 py-2.5 text-[9px] font-semibold text-primary-foreground sm:col-span-2">
                    Generar evaluación por competencias
                  </button>
                </div>
                <div className="border-t border-border bg-accent/40 p-4">
                  <Badge tone="green">Generación completada · Llama-3-Edu</Badge>
                  <h3 className="mt-2 text-[11px] font-bold text-foreground">Evaluación formativa N.° 3: Cálculo de márgenes y ratios de costo</h3>
                  <p className="mt-2 rounded-md bg-card p-3 text-[9px] leading-5 text-muted-foreground">Caso aplicado en Huamanga: un taller artesanal analiza costos y venta de mantas tradicionales. El instrumento incluye problema contextualizado, clave de respuesta y rúbrica CNEB con niveles AD, A, B y C.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Action onClick={(): void => notify('Exportar a Google Forms / Moodle')}>
                      <Download className="size-3.5" />
                      Exportar a Google Forms / Moodle
                    </Action>
                    <Action onClick={(): void => notify('Guardar en banco de ítems')}>Guardar en banco de ítems</Action>
                  </div>
                </div>
              </Section>
              <Section title="Asistente docente para sesiones y materiales">
                <div className="grid gap-2 p-4 sm:grid-cols-3">
                  {['Guía de autoaprendizaje · cuadernillo PDF', 'Resumen en audio / podcast', 'Caso de estudio para foro'].map((x) => (
                    <button key={x} onClick={(): void => notify(x)} className="rounded-md bg-accent/50 p-3 text-left text-[9px] text-foreground">
                      {x}
                    </button>
                  ))}
                </div>
              </Section>
            </div>
            <aside className="flex min-w-0 flex-col gap-4">
              <Section title="Tutor inteligente para estudiantes" subtitle="Simulador de acompañamiento empático 24/7">
                <div className="space-y-3 p-4">
                  <div className="flex items-center gap-2 rounded-md bg-accent/50 p-3">
                    <span className="grid size-8 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">SC</span>
                    <div>
                      <p className="text-[9px] font-semibold text-foreground">Silvia Cárdenas Palomino</p>
                      <p className="text-[8px] text-muted-foreground">2.° Avanzado B · Especialidad confecciones</p>
                    </div>
                  </div>
                  <div className="rounded-md bg-muted p-3 text-[9px] leading-4 text-foreground">“Profesor bot, tengo turno nocturno en el taller y no entiendo cómo simplificar fracciones complejas para el cálculo de metros de tela.”</div>
                  <div className="rounded-md bg-primary p-3 text-[9px] leading-4 text-primary-foreground">Respuesta sugerida: contextualiza la práctica al horario laboral y propone una guía breve de fracciones aplicada a confección.</div>
                  <div className="flex gap-2">
                    <Action onClick={(): void => notify('Audio en quechua / español')}>Audio bilingüe</Action>
                    <Action onClick={(): void => notify('Sugerir ejercicio práctico')}>Sugerir ejercicio</Action>
                  </div>
                </div>
              </Section>
              <Section title="Análisis y predicción de deserción" subtitle="Semáforo de retención estudiantil EBA 2026-II">
                <div className="space-y-3 p-4">
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-[78%] rounded-full bg-destructive" />
                  </div>
                  {[
                    ['Silvia Cárdenas Palomino', '78% riesgo alto', 'Turno laboral nocturno · 6 días sin interacción'],
                    ['Brayan Quispe Sulca', '62% riesgo medio', 'Temporada de cosecha · baja cobertura móvil'],
                  ].map((r, i) => (
                    <article key={r[0]} className="rounded-md bg-accent/40 p-3">
                      <div className="flex flex-wrap justify-between gap-2">
                        <b className="text-[9px] text-foreground">{r[0]}</b>
                        <Badge tone={i ? 'amber' : 'red'}>{r[1]}</Badge>
                      </div>
                      <p className="mt-2 text-[8px] text-muted-foreground">Causa raíz: {r[2]}</p>
                      <p className="mt-2 rounded bg-card p-2 text-[8px] leading-4 text-foreground">Acción sugerida: flexibilidad de cronograma asíncrono y entrega vía WhatsApp.</p>
                      <button onClick={(): void => notify('Ejecutar plan de retención')} className="mt-2 w-full rounded bg-secondary px-2 py-2 text-[9px] font-semibold text-secondary-foreground">
                        Ejecutar plan de retención
                      </button>
                    </article>
                  ))}
                </div>
              </Section>
            </aside>
          </div>
          <IntelligenceReferencePanels onAction={notify} />
          <IntelligenceAdminPanels onAction={notify} />
        </>
      }
    </WorkspaceShell>
  );
};

export { AlertsScreen };
