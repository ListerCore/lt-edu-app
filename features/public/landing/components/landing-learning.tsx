import type { JSX } from 'react';
import { CheckCircle2, ClipboardCheck, HeartHandshake, MonitorPlay, Video } from 'lucide-react';
import { benefits } from './landing-data';

const LearningSection = (): JSX.Element => (
  <section id="virtual-learning" className="scroll-mt-24 py-16 sm:py-20" aria-labelledby="benefits-title">
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-secondary">Aprende a tu manera</p>
      <h2 id="benefits-title" className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Una experiencia que se adapta a ti
      </h2>
      <p className="mt-3 text-xs leading-5 text-muted-foreground sm:text-sm">Herramientas y acompañamiento para que mantengas el ritmo y avances con confianza.</p>
    </div>
    <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {benefits.map(({ title, description, icon: Icon }, index) => (
        <article key={title} className="rounded-xl border border-border bg-card p-4">
          <span className={`grid size-9 place-items-center rounded-lg ${index % 2 ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
            <Icon className="size-4" />
          </span>
          <h3 className="mt-3 text-xs font-bold text-foreground">{title}</h3>
          <p className="mt-1.5 text-[10px] leading-5 text-muted-foreground">{description}</p>
        </article>
      ))}
    </div>
    <div className="mt-5 grid items-center gap-5 rounded-2xl border border-border bg-card p-4 sm:p-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-xl bg-primary p-4 text-primary-foreground sm:p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-white/10">
              <MonitorPlay className="size-4" />
            </span>
            <div>
              <p className="text-[10px] font-bold">SIGE-JL · Aula Virtual</p>
              <p className="text-[9px] text-primary-foreground/70">Tu espacio de aprendizaje</p>
            </div>
          </div>
          <span className="rounded-full bg-secondary px-2 py-1 text-[8px] font-bold">CAMPUS VIRTUAL</span>
        </div>
        <div className="mt-4 rounded-lg bg-white/10 p-3">
          <div className="flex items-center justify-between text-[9px]">
            <span className="font-semibold">Mi progreso de aprendizaje</span>
            <span className="text-primary-foreground/70">Este periodo</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              ['Actividades', '12'],
              ['Evaluaciones', '08'],
              ['Avance', '75%'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-white/10 p-2">
                <p className="text-[8px] text-primary-foreground/70">{label}</p>
                <p className="mt-1 text-sm font-bold">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-[9px] text-primary-foreground/80">
          <CheckCircle2 className="size-3.5 text-secondary" /> Clases, recursos y seguimiento en un solo lugar
        </div>
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-secondary">Conoce SIGE-JL</p>
        <h3 className="mt-2 text-lg font-bold tracking-tight text-foreground">Tu aprendizaje, siempre a mano</h3>
        <div className="mt-4 space-y-3">
          {[
            { title: 'Clases y materiales', text: 'Consulta tus recursos desde el aula virtual.', icon: Video },
            { title: 'Acompañamiento pedagógico', text: 'Comunícate con tu equipo docente cuando lo necesites.', icon: HeartHandshake },
            { title: 'Seguimiento de avances', text: 'Mantente al día con tus actividades y evaluaciones.', icon: ClipboardCheck },
          ].map(({ title, text, icon: Icon }) => (
            <div key={title} className="flex gap-2.5">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-secondary">
                <Icon className="size-4" />
              </span>
              <div>
                <p className="text-[10px] font-semibold text-foreground">{title}</p>
                <p className="mt-0.5 text-[9px] leading-4 text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export { LearningSection };
