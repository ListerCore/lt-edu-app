'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { JSX } from 'react';
import { ArrowUpRight, BookOpen, FileText, LifeBuoy, Mail, MonitorPlay, ShieldCheck } from 'lucide';
import type { IconInput } from 'morphicons/react';
import { MorphIcon } from '@/components/ui/morph-icon';
import { siteConfig } from '@/lib/site';
import { BrandMark } from './brand-mark';

const legalIcons: IconInput[] = [ShieldCheck, FileText, BookOpen];

const contacts: Array<{ label: string; email: string; icon: IconInput }> = [
  { label: 'Ventas e implementación', email: siteConfig.emails.sales, icon: Mail },
  { label: 'Soporte', email: siteConfig.emails.support, icon: LifeBuoy },
];

// Footer column heading; ids tie each list to its heading for screen readers
const ColumnHeading = ({ id, children }: { id: string; children: string }): JSX.Element => (
  <h2 id={id} className="text-sm font-semibold text-foreground">
    {children}
  </h2>
);

// Public footer: brand blurb with demo CTA, product modules, institution types, legal links and contact channels
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
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">Una sola plataforma para colegios, CEBA, CEBE, pre-universitarios e institutos. Cada institución usa los módulos de su tipo y cada usuario ve lo que su rol le permite.</p>
            <Link href="/demo" className="btn-brand">
              <MorphIcon icon={MonitorPlay} size={16} />
              Probar la demo
            </Link>
          </div>

          <nav aria-labelledby="footer-product">
            <ColumnHeading id="footer-product">Plataforma</ColumnHeading>
            <ul className="mt-4 space-y-3">
              {siteConfig.product.map(
                ({ href, label }): JSX.Element => (
                  <li key={label}>
                    <Link href={href} className={linkClass(href)}>
                      <span className="link-underline">{label}</span>
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <section aria-labelledby="footer-institutions">
            <ColumnHeading id="footer-institutions">Instituciones</ColumnHeading>
            <ul className="mt-4 space-y-3">
              {siteConfig.institutions.map(
                ({ code, label }): JSX.Element => (
                  <li key={code} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <span className="pill min-w-14 justify-center bg-brand-soft font-mono text-brand">{code}</span>
                    {label}
                  </li>
                ),
              )}
            </ul>
          </section>

          <div className="space-y-8">
            <section aria-labelledby="footer-contact">
              <ColumnHeading id="footer-contact">Contacto</ColumnHeading>
              <ul className="mt-4 space-y-3">
                {contacts.map(
                  ({ label, email, icon }): JSX.Element => (
                    <li key={label}>
                      <a href={`mailto:${email}`} className="group inline-flex items-start gap-2.5 text-sm">
                        <MorphIcon icon={icon} size={16} className="mt-0.5 shrink-0 text-muted-foreground transition-colors group-hover:text-brand" />
                        <span>
                          <span className="block text-xs text-muted-foreground">{label}</span>
                          <span className="link-underline text-foreground group-hover:text-brand">{email}</span>
                        </span>
                      </a>
                    </li>
                  ),
                )}
              </ul>
              <Link href="/contact" aria-current={pathname === '/contact' ? 'page' : undefined} className={`group mt-4 inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${pathname === '/contact' ? 'text-brand' : 'text-foreground hover:text-brand'}`}>
                <span className="link-underline">Solicitar implementación</span>
                <MorphIcon icon={ArrowUpRight} size={14} />
              </Link>
            </section>
          </div>
        </div>

        <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-3 border-t border-border py-6">
          {siteConfig.legal.map(
            ({ href, label }, index): JSX.Element => (
              <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined} className={linkClass(href)}>
                <MorphIcon icon={legalIcons[index] ?? FileText} size={16} />
                <span className="link-underline">{label}</span>
              </Link>
            ),
          )}
        </nav>

        <div className="flex flex-col items-center justify-between gap-1 border-t border-border py-6 text-center text-sm text-muted-foreground sm:flex-row">
          <p>© 2026 {siteConfig.name} · Todos los derechos reservados</p>
          <p>Hecho en el Perú · Ley N.° 29733</p>
        </div>
      </div>
    </footer>
  );
};
