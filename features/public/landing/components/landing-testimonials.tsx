import type { JSX } from 'react';
import { GraduationCap, Sparkles } from 'lucide-react';

const TestimonialsSection = (): JSX.Element => (
  <section className="py-16 sm:py-20" aria-labelledby="testimonials-title">
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-secondary">Historias que inspiran</p>
      <h2 id="testimonials-title" className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Cada meta empieza con una decisión
      </h2>
      <p className="mt-3 text-xs leading-5 text-muted-foreground sm:text-sm">Retomar tus estudios puede abrir nuevas posibilidades para ti y tu familia.</p>
    </div>
    <div className="mt-8 grid gap-3 md:grid-cols-3">
      {[
        { name: 'Tu historia', role: 'Un nuevo comienzo', text: 'Cada persona avanza a su propio ritmo. Con orientación y constancia, puedes dar el siguiente paso hacia tus metas.' },
        { name: 'Tu esfuerzo', role: 'Un logro que cuenta', text: 'Estudiar mientras atiendes otras responsabilidades requiere dedicación. Reconoce cada avance que consigues.' },
        { name: 'Tu futuro', role: 'Más oportunidades', text: 'Completar tu educación básica puede ayudarte a continuar aprendiendo y explorar nuevos caminos.' },
      ].map(({ name, role, text }) => (
        <article key={name} className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <div className="flex gap-1 text-secondary" aria-label="Testimonio destacado">
            {Array.from({ length: 5 }, (_, index) => (
              <Sparkles key={index} className="size-3" />
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-5 text-muted-foreground">“{text}”</p>
          <div className="mt-4 flex items-center gap-2.5 border-t border-border pt-3">
            <span className="grid size-8 place-items-center rounded-full bg-secondary/10 text-secondary">
              <GraduationCap className="size-4" />
            </span>
            <div>
              <p className="text-[10px] font-bold text-foreground">{name}</p>
              <p className="text-[9px] text-muted-foreground">{role}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export { TestimonialsSection };
