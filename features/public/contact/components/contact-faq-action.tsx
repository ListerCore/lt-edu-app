import Image from 'next/image';
import Link from 'next/link';
import type { JSX } from 'react';
import { BadgeCheck, CheckCircle2, ChevronDown, GraduationCap, MapPin } from 'lucide-react';
import { contactFaqs, whatsappHref } from './contact-data';

const ContactFaqAndAction = (): JSX.Element => (
  <>
    <section className="flex flex-col justify-between gap-5 py-7 sm:flex-row sm:items-end sm:py-9">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-secondary">Estamos para ayudarte</p>
        <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Contáctanos</h1>
        <p className="mt-2 max-w-xl text-xs leading-5 text-muted-foreground sm:text-sm">Estamos para ayudarte a empezar o continuar tus estudios. Escríbenos, llámanos o visítanos.</p>
      </div>
      <div className="flex flex-wrap gap-2 text-[9px] font-medium">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-secondary/20 bg-secondary/10 px-2.5 py-1.5 text-secondary">
          <CheckCircle2 className="size-3" /> Atención virtual
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1.5 text-muted-foreground">
          <MapPin className="size-3 text-secondary" /> Sede Huamanga
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1.5 text-muted-foreground">
          <BadgeCheck className="size-3 text-secondary" /> CEBA Joseph Lister
        </span>
      </div>
    </section>
    <section className="py-10" aria-labelledby="contact-faq-title">
      <div className="mx-auto max-w-2xl">
        <h2 id="contact-faq-title" className="text-center font-heading text-xl font-bold tracking-tight text-foreground">
          Dudas sobre contacto y atención
        </h2>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">Información útil para comunicarte con nuestra institución.</p>
        <div className="mt-5 space-y-2">
          {contactFaqs.map(({ question, answer }) => (
            <details key={question} className="group rounded-lg border border-border bg-card px-4">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-[10px] font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                {question}
                <ChevronDown className="size-3.5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <p className="pb-3 pr-5 text-[9px] leading-4 text-muted-foreground">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
    <section className="rounded-2xl bg-primary px-5 py-8 text-primary-foreground sm:flex sm:items-center sm:justify-between sm:gap-6 sm:px-8">
      <div>
        <span className="inline-flex rounded-full bg-white/10 px-2.5 py-1 text-[8px] font-bold uppercase tracking-wide">Matrículas abiertas</span>
        <h2 className="mt-2 font-heading text-xl font-bold tracking-tight">¿Listo para dar el siguiente paso?</h2>
        <p className="mt-1 max-w-xl text-[10px] leading-4 text-primary-foreground/75">Nunca es tarde para culminar tus estudios con horarios que se adaptan a ti.</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 sm:mt-0">
        <Link href="/#admissions" className="inline-flex h-9 items-center gap-1.5 rounded-md bg-secondary px-3 text-[9px] font-semibold text-secondary-foreground hover:bg-secondary/85">
          <GraduationCap className="size-3.5" /> Ver admisión
        </Link>
        <a href={`${whatsappHref}?text=Hola%2C%20deseo%20hablar%20con%20un%20asesor`} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-md bg-white/10 px-3 text-[9px] font-semibold text-white hover:bg-white/15">
          <Image src="/icons/whatsapp-icon.svg" alt="" width={14} height={14} className="size-3.5" /> Hablar con un asesor
        </a>
      </div>
    </section>
  </>
);

export { ContactFaqAndAction };
