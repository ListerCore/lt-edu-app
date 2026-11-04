'use client';

import Link from 'next/link';
import { useState, type JSX } from 'react';
import { LogIn, Menu, MonitorPlay, X } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { siteConfig } from '@/lib/site';
import { BrandMark } from './brand-mark';
import { ThemeSwitcher } from './theme-switcher';
import { useIsActiveLink } from './section-activity';

// Public header: logo, section links, theme switcher, demo CTA and sign-in; collapses into a sheet below lg
export const Navbar = (): JSX.Element => {
  const [open, setOpen] = useState(false);
  const close = (): void => setOpen(false);
  const isActive = useIsActiveLink();
  const current = siteConfig.navigation.find(({ href }) => isActive(href));

  // Hash links mark the section being read ("location"); route links mark the page
  const ariaCurrent = (href: string): 'location' | 'page' | undefined => (isActive(href) ? (href.includes('#') ? 'location' : 'page') : undefined);

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-360 items-center justify-between gap-4 px-6 md:px-12 xl:px-16">
          <Link href="/" onClick={close} className="flex items-center gap-2.5" aria-label={`${siteConfig.name}, inicio`}>
            <BrandMark className="size-7" />
            <span className="text-xl leading-none font-light tracking-tight whitespace-nowrap text-foreground">
              {siteConfig.name.toLowerCase()}
              <span className="ml-1 text-xs font-medium text-muted-foreground lg:max-xl:hidden">{siteConfig.tagline.toLowerCase()}</span>
            </span>
          </Link>

          {/* Compact "you are here" chip for small screens, where the section links are hidden */}
          {current && (
            <p className="mr-auto hidden min-w-0 items-center gap-1.5 truncate rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand min-[400px]:flex lg:hidden">
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-brand" />
              <span className="sr-only">Estás en </span>
              {current.label}
            </p>
          )}

          <div className="flex items-center">
            <nav className="hidden items-center lg:flex" aria-label="Secciones">
              {siteConfig.navigation.map(
                (link): JSX.Element => (
                  <Link key={link.href} href={link.href} aria-current={ariaCurrent(link.href)} className={`group flex h-16 items-center px-2 text-sm font-medium transition-colors xl:px-3 ${isActive(link.href) ? 'text-brand' : 'text-foreground hover:text-brand'}`}>
                    <span className="link-underline">{link.label}</span>
                  </Link>
                ),
              )}
            </nav>

            <span aria-hidden="true" className="mx-3 hidden h-6 w-px bg-border lg:block" />

            <div className="flex items-center gap-2.5">
              <ThemeSwitcher />
              <Link href="/auth/signin" className="hidden h-8 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold text-foreground transition-colors hover:bg-accent sm:inline-flex lg:max-xl:hidden">
                <MorphIcon icon={LogIn} size={14} />
                Ingresar
              </Link>
              <Link href="/demo" className="hidden h-8 items-center gap-1.5 rounded-full bg-brand-solid px-4 text-[13px] font-semibold text-white transition-colors hover:bg-brand-solid-hover sm:inline-flex">
                <MorphIcon icon={MonitorPlay} size={14} />
                Ver demo
              </Link>
              <button type="button" onClick={(): void => setOpen(!open)} aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open} aria-controls="mobile-menu" className="flex size-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent lg:hidden">
                <MorphIcon icon={open ? X : Menu} size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu: height animates open; inert keeps hidden links out of the tab order */}
        <div id="mobile-menu" className={`overflow-hidden transition-all duration-300 lg:hidden ${open ? 'max-h-128 border-t border-border' : 'max-h-0'}`} inert={!open}>
          <nav className="mx-auto max-w-md px-6 py-4" aria-label="Menú móvil">
            {siteConfig.navigation.map(
              (link): JSX.Element => (
                <Link key={link.href} href={link.href} onClick={close} aria-current={ariaCurrent(link.href)} className={`flex min-h-12 items-center gap-2.5 border-b border-border text-sm font-medium transition-colors ${isActive(link.href) ? 'text-brand' : 'text-foreground hover:text-brand'}`}>
                  <span aria-hidden="true" className={`h-4 w-0.5 rounded-full transition-colors ${isActive(link.href) ? 'bg-brand' : 'bg-transparent'}`} />
                  {link.label}
                </Link>
              ),
            )}
            <div className="mt-5 grid gap-2.5">
              <Link href="/demo" onClick={close} className="btn-brand w-full">
                <MorphIcon icon={MonitorPlay} size={16} />
                Ver demo
              </Link>
              <Link href="/auth/signin" onClick={close} className="btn-alt w-full">
                <MorphIcon icon={LogIn} size={16} />
                Ingresar
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
