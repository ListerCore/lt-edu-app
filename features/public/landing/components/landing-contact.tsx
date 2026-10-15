import type { JSX } from 'react';
import Link from 'next/link';
import { ArrowDown, MapPin, MessageCircle, Phone, Sparkles, WalletCards } from 'lucide-react';

const ContactSection = (): JSX.Element => (
  <section className="py-12 sm:py-16" aria-labelledby="contact-title">
    <div className="rounded-2xl bg-primary px-5 py-10 text-center text-primary-foreground sm:px-10 sm:py-12">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em]">
        <Sparkles className="size-3.5 text-secondary" /> Da el primer paso
      </span>
      <h2 id="contact-title" className="mx-auto mt-4 max-w-2xl font-heading text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
        Tu futuro empieza hoy. Nunca es tarde para seguir aprendiendo.
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-xs leading-5 text-primary-foreground/75">Conversa con nuestro equipo y recibe orientación para retomar tu educación básica.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2.5">
        <Link className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-secondary px-4 text-[10px] font-semibold text-secondary-foreground transition-colors hover:bg-secondary/85" href="/contact">
          <MessageCircle aria-hidden="true" className="size-4" /> Hablar con admisión
        </Link>
        <a className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-white/30 bg-transparent px-4 text-[10px] font-semibold text-white transition-colors hover:bg-white/10" href="tel:+51966845120">
          <Phone aria-hidden="true" className="size-4" /> Llamar al equipo
        </a>
      </div>
      <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[9px] text-primary-foreground/70">
        <span className="inline-flex items-center gap-1">
          <MapPin className="size-3" /> Huamanga, Ayacucho
        </span>
        <span className="inline-flex items-center gap-1">
          <WalletCards className="size-3" /> Orientación de matrícula
        </span>
      </div>
    </div>
    <div className="mt-3 flex items-center justify-center gap-2 text-[9px] text-muted-foreground">
      <ArrowDown className="size-3" /> También puedes revisar los enlaces institucionales al pie de página
    </div>
  </section>
);

export { ContactSection };
