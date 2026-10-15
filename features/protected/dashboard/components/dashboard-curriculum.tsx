import type { JSX } from 'react';
import Link from 'next/link';
import { ArrowRight, GraduationCap } from 'lucide-react';

const CurriculumPanel = (): JSX.Element => (
  <section className="min-w-0 rounded-lg border border-border bg-card p-4 sm:p-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="font-heading text-sm font-bold text-foreground">Estructura Curricular EBA — RVM N.° 034-2019-MINEDU</h2>
        <p className="mt-1 text-[10px] text-muted-foreground">Distribución por ciclos, grados académicos y áreas oficiales vigentes</p>
      </div>
      <span className="rounded-full bg-accent px-2.5 py-1 text-[8px] font-semibold text-primary">Modalidad semipresencial / virtual</span>
    </div>
    <div className="mt-4 grid gap-3 md:grid-cols-3">
      {[
        { name: 'CICLO INICIAL', grades: '1.° y 2.° grado', total: '180', areas: ['Comunicación', 'Matemática', 'Ciencia, Tecnología y Salud', 'Desarrollo Personal y Ciudadano', 'Educación para el Trabajo'], note: '6 áreas totales' },
        { name: 'CICLO INTERMEDIO', grades: '1.°, 2.° y 3.° grado', total: '420', areas: ['Áreas del Ciclo Inicial', 'Inglés como Lengua Extranjera', 'TIC y Competencia Digital'], note: '7 áreas + módulos' },
        { name: 'CICLO AVANZADO', grades: '1.° al 4.° grado', total: '885', areas: ['Áreas Base + Inglés', 'Arte y Cultura', 'Educación Física y Bienestar', 'Certificación Técnica Modular'], note: '9 áreas académicas' },
      ].map((cycle, index) => (
        <article key={cycle.name} className={`min-w-0 rounded-md border border-border p-3 ${index === 2 ? 'bg-primary text-primary-foreground' : 'bg-accent/30'}`}>
          <div className="flex items-center justify-between gap-2">
            <span className={`rounded px-2 py-1 text-[8px] font-bold ${index === 2 ? 'bg-primary-foreground/15 text-primary-foreground' : 'bg-card text-primary'}`}>{cycle.name}</span>
            <span className="text-[8px] opacity-70">{cycle.grades}</span>
          </div>
          <p className="mt-3 font-heading text-xl font-bold">{cycle.total}</p>
          <p className="text-[8px] opacity-70">estudiantes matriculados</p>
          <p className="mt-3 text-[8px] font-bold uppercase tracking-wide opacity-70">Áreas curriculares</p>
          <ul className="mt-2 space-y-1.5">
            {cycle.areas.map((area) => (
              <li key={area} className="flex items-start gap-1.5 text-[8px] leading-3.5">
                <span className={`mt-1 size-1 shrink-0 rounded-full ${index === 2 ? 'bg-primary-foreground/80' : 'bg-secondary'}`} />
                {area}
              </li>
            ))}
          </ul>
          <Link href="/dashboard/academics" className={`mt-3 flex items-center justify-between border-t pt-2 text-[8px] font-semibold ${index === 2 ? 'border-primary-foreground/20 text-primary-foreground' : 'border-border text-primary'}`}>
            {cycle.note}
            <ArrowRight aria-hidden="true" className="size-3" />
          </Link>
        </article>
      ))}
    </div>
  </section>
);

const AchievementScale = (): JSX.Element => (
  <section className="min-w-0 rounded-lg border border-border bg-card p-4 sm:p-5">
    <div className="flex items-center gap-2">
      <GraduationCap aria-hidden="true" className="size-4 text-primary" />
      <h2 className="font-heading text-sm font-bold text-foreground">Escala Oficial EBA</h2>
    </div>
    <p className="mt-1 text-[9px] text-muted-foreground">Criterios de evaluación formativa estandarizados según CNEB</p>
    <div className="mt-4 space-y-2">
      {[
        ['AD', 'Logro destacado', 'Desempeño superior al esperado para el grado', '24%', 'green'],
        ['A', 'Logro esperado', 'Competencia desarrollada según estándar', '62.8%', 'blue'],
        ['B', 'En proceso', 'Próximo al nivel esperado; requiere acompañamiento', '11.2%', 'amber'],
        ['C', 'En inicio', 'Activa plan de recuperación pedagógica', '2.0%', 'red'],
      ].map(([grade, label, detail, percent, tone]) => (
        <article key={grade} className="flex gap-2 rounded-md bg-accent/40 p-2">
          <span className={`grid size-7 shrink-0 place-items-center rounded text-[10px] font-bold ${tone === 'green' ? 'bg-secondary text-secondary-foreground' : tone === 'amber' ? 'bg-chart-3/20 text-chart-3' : tone === 'red' ? 'bg-destructive text-destructive-foreground' : 'bg-primary/10 text-primary'}`}>{grade}</span>
          <div className="min-w-0 flex-1">
            <div className="flex justify-between gap-2">
              <p className="text-[9px] font-bold text-foreground">{label}</p>
              <span className="text-[8px] font-bold text-primary">{percent}</span>
            </div>
            <p className="mt-0.5 text-[8px] leading-3.5 text-muted-foreground">{detail}</p>
          </div>
        </article>
      ))}
    </div>
    <Link href="/dashboard/evaluation" className="mt-3 flex items-center justify-between border-t border-border pt-3 text-[8px] font-semibold text-primary">
      Ver matriz de logros <ArrowRight aria-hidden="true" className="size-3" />
    </Link>
  </section>
);

export { CurriculumPanel, AchievementScale };
