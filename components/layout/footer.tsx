import Image from 'next/image';
import Link from 'next/link';
import type { JSX } from 'react';
import { BadgeCheck, BookOpen, ChevronRight, Clock3, Gavel, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';

const institutionalLinks: Array<{ label: string; href: string }> = [
  { label: 'Inicio', href: '/' },
  { label: 'Nosotros y Misión', href: '/#about-us' },
  { label: 'Ciclos: Inicial, Intermedio y Avanzado', href: '/#programs' },
  { label: 'Plataforma Virtual 100% Flexible', href: '/#virtual-learning' },
  { label: 'Requisitos de Admisión', href: '/#admissions' },
  { label: 'Contacto y atención', href: '/contact' },
];

const InstitutionalLinks = (): JSX.Element => (
  <ul className="mt-4 space-y-2.5">
    {institutionalLinks.map((item): JSX.Element => (
      <li key={item.label}>
        <Link href={item.href} className="group inline-flex items-start gap-1.5 text-xs leading-5 text-muted-foreground transition-colors hover:text-secondary">
          <ChevronRight aria-hidden="true" className="mt-0.5 size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
          {item.label}
        </Link>
      </li>
    ))}
  </ul>
);

const Footer = (): JSX.Element => (
  <footer className="border-t border-border bg-background text-foreground">
    <div className="mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 lg:px-8 lg:pt-12">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.1fr] lg:gap-10">
        <section aria-labelledby="footer-brand-title">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <Image src="/logo.png" alt="" width={36} height={36} className="size-9 object-contain" />
            <span id="footer-brand-title" className="font-heading text-sm font-bold tracking-tight">
              CEBA Joseph Lister
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-xs leading-5 text-muted-foreground">Institución Educativa de Educación Básica Alternativa privada autorizada en Ayacucho. Culmina tu secundaria con validez oficial ante el MINEDU y estudia con horarios flexibles y campus virtual las 24 horas.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-md border border-border bg-card px-2.5 py-1.5 text-[10px] font-medium text-muted-foreground">Resolución Directoral EBA</span>
            <span className="rounded-md border border-secondary/40 bg-secondary/10 px-2.5 py-1.5 text-[10px] font-semibold text-secondary">Oficial MINEDU</span>
          </div>
        </section>

        <section aria-labelledby="footer-navigation-title">
          <h2 id="footer-navigation-title" className="font-heading text-sm font-semibold tracking-tight">
            Navegación Institucional
          </h2>
          <InstitutionalLinks />
        </section>

        <section aria-labelledby="footer-contact-title">
          <h2 id="footer-contact-title" className="font-heading text-sm font-semibold tracking-tight">
            Sede y Atención
          </h2>
          <address className="mt-4 space-y-3 not-italic text-xs leading-5 text-muted-foreground">
            <p className="flex items-start gap-2.5">
              <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-secondary" />
              <span>Jr. 28 de Julio N.° 342, Centro Histórico, Huamanga, Ayacucho, Perú</span>
            </p>
            <a className="flex items-center gap-2.5 transition-colors hover:text-foreground" href="tel:+5166314520">
              <Phone aria-hidden="true" className="size-4 shrink-0 text-secondary" />
              <span>(066) 31-4520 / +51 966 845 120</span>
            </a>
            <a className="flex items-center gap-2.5 break-all transition-colors hover:text-foreground" href="mailto:informes@cebajosephlister.edu.pe">
              <Mail aria-hidden="true" className="size-4 shrink-0 text-secondary" />
              <span>informes@cebajosephlister.edu.pe</span>
            </a>
            <p className="flex items-center gap-2.5">
              <Clock3 aria-hidden="true" className="size-4 shrink-0 text-secondary" />
              <span>Lunes a sábado: 8:00 a. m. - 7:00 p. m.</span>
            </p>
          </address>
        </section>

        <section aria-labelledby="footer-legal-title">
          <h2 id="footer-legal-title" className="font-heading text-sm font-semibold tracking-tight">
            Transparencia y Legal
          </h2>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">Accede a nuestros canales de transparencia y atención al estudiante.</p>
          <div className="mt-4 space-y-2.5">
            <Link href="/legal/complaints" className="group flex min-h-11 items-center justify-between gap-3 rounded-lg border border-border bg-card px-3.5 py-2.5 text-xs font-medium text-foreground transition-colors hover:border-ring">
              <span className="inline-flex items-center gap-2">
                <BookOpen aria-hidden="true" className="size-4 text-secondary" />
                Libro de Reclamaciones
              </span>
              <ChevronRight aria-hidden="true" className="size-4 text-muted-foreground group-hover:text-foreground" />
            </Link>
            <Link href="/legal/privacy" className="group flex min-h-11 items-center justify-between gap-3 rounded-lg border border-border bg-card px-3.5 py-2.5 text-xs font-medium text-foreground transition-colors hover:border-ring">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck aria-hidden="true" className="size-4 text-secondary" />
                Política de Privacidad
              </span>
              <ChevronRight aria-hidden="true" className="size-4 text-muted-foreground group-hover:text-foreground" />
            </Link>
            <Link href="/legal/terms" className="group flex min-h-11 items-center justify-between gap-3 rounded-lg border border-border bg-card px-3.5 py-2.5 text-xs font-medium text-foreground transition-colors hover:border-ring">
              <span className="inline-flex items-center gap-2">
                <Gavel aria-hidden="true" className="size-4 text-secondary" />
                Términos del Servicio
              </span>
              <ChevronRight aria-hidden="true" className="size-4 text-muted-foreground group-hover:text-foreground" />
            </Link>
          </div>
        </section>
      </div>

      <div className="mt-10 flex flex-col items-start justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center">
        <p>© 2026 CEBA Privado Virtual Joseph Lister · Huamanga, Ayacucho. Todos los derechos reservados.</p>
        <p className="inline-flex items-center gap-1.5 font-medium">
          <BadgeCheck aria-hidden="true" className="size-4 text-secondary" />
          Certificación de Secundaria Oficial MINEDU
        </p>
      </div>
    </div>
  </footer>
);

export { Footer };
