'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { JSX } from 'react';
import { ArrowUpRight, BookOpen, FileText, LifeBuoy, LogIn, Mail, ShieldCheck } from 'lucide';
import type { IconInput } from 'morphicons/react';
import { MorphIcon } from '@/components/ui/morph-icon';
import { siteConfig } from '@/lib/site';
import { BrandMark } from './brand-mark';
import { NavLabel } from './nav-label';

const legalIcons: IconInput[] = [ShieldCheck, FileText, BookOpen];

const contacts: Array<{ label: string; email: string; icon: IconInput }> = [
  { label: 'Informes y admisión', email: siteConfig.emails.info, icon: Mail },
  { label: 'Soporte técnico', email: siteConfig.emails.support, icon: LifeBuoy },
];

// Site sections without Contacto, which has its own column
const sections = siteConfig.navigation.filter(({ href }) => href !== '/contact');

// Footer column heading; ids tie each list to its heading for screen readers
const ColumnHeading = ({ id, children }: { id: string; children: string }): JSX.Element => (
  <h2 id={id} className="text-sm font-semibold text-foreground">
    {children}
  </h2>
);

// Public footer of the institution's site: blurb with sign-in, site sections, account access, contact and legal links
export const Footer = (): JSX.Element => {
  const pathname = usePathname();
  const linkClass = (href: string): string => `group inline-flex items-center gap-2.5 text-sm transition-colors ${pathname === href ? 'text-brand' : 'text-muted-foreground hover:text-brand'}`;

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[minmax(16rem,1.4fr)_repeat(3,minmax(0,1fr))] lg:gap-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <BrandMark className="size-7" />
              <span className="text-base font-semibold">{siteConfig.name}</span>
              <span className="text-xs text-muted-foreground">{siteConfig.tagline}</span>
            </Link>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">Estudiantes, familias y docentes conectados en un solo lugar: horarios, asistencia, notas y comunicados de la institución, siempre al día.</p>
            <Link href="/auth/signin" className="btn-brand">
              <MorphIcon icon={LogIn} size={16} />
              Ingresar a mi cuenta
            </Link>
          </div>

          <nav aria-labelledby="footer-sections">
            <ColumnHeading id="footer-sections">Institución</ColumnHeading>
            <ul className="mt-4 space-y-3">
              {sections.map((link): JSX.Element => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass(link.href)}>
                    <NavLabel link={link} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-access">
            <ColumnHeading id="footer-access">Accesos</ColumnHeading>
            <ul className="mt-4 space-y-3">
              {siteConfig.access.map(({ href, label }): JSX.Element => (
                <li key={label}>
                  <Link href={href} className={linkClass(href)}>
                    <span className="link-underline">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section aria-labelledby="footer-contact">
            <ColumnHeading id="footer-contact">Contacto</ColumnHeading>
            <ul className="mt-4 space-y-3">
              {contacts.map(({ label, email, icon }): JSX.Element => (
                <li key={label}>
                  <a href={`mailto:${email}`} className="group inline-flex items-start gap-2.5 text-sm">
                    <MorphIcon icon={icon} size={16} className="mt-0.5 shrink-0 text-muted-foreground transition-colors group-hover:text-brand" />
                    <span>
                      <span className="block text-xs text-muted-foreground">{label}</span>
                      <span className="link-underline text-foreground group-hover:text-brand">{email}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <Link href="/contact" aria-current={pathname === '/contact' ? 'page' : undefined} className={`group mt-4 inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${pathname === '/contact' ? 'text-brand' : 'text-foreground hover:text-brand'}`}>
              <span className="link-underline">Ir a la página de contacto</span>
              <MorphIcon icon={ArrowUpRight} size={14} />
            </Link>
          </section>
        </div>

        <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-3 border-t border-border py-6">
          {siteConfig.legal.map(({ href, label }, index): JSX.Element => (
            <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined} className={linkClass(href)}>
              <MorphIcon icon={legalIcons[index] ?? FileText} size={16} />
              <span className="link-underline">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex flex-col items-center justify-between gap-1 border-t border-border py-6 text-center text-sm text-muted-foreground sm:flex-row">
          <p>© 2026 {siteConfig.name} · Todos los derechos reservados</p>
          <p>Hecho en el Perú · Ley N.° 29733</p>
        </div>
      </div>
    </footer>
  );
};
