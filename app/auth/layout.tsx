import type { Metadata } from 'next';
import Link from 'next/link';
import type { JSX, ReactNode } from 'react';
import { ArrowLeft } from 'lucide';
import { BrandMark } from '@/components/layout/brand-mark';
import { BrandWatermark } from '@/components/layout/brand-watermark';
import { SiteBackground } from '@/components/layout/site-background';
import { ThemeSwitcher } from '@/components/layout/theme-switcher';
import { MorphIcon } from '@/components/ui/morph-icon';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

interface AuthLayoutProps {
  children: ReactNode;
}

// Auth screens: site backdrop with the brand watermark, back link and theme switcher around a centered card
const AuthLayout = ({ children }: AuthLayoutProps): JSX.Element => (
  <div className="relative isolate flex min-h-screen flex-col">
    <SiteBackground />
    <BrandWatermark />
    <header className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 md:px-8">
      <Link href="/" className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-brand">
        <MorphIcon icon={ArrowLeft} size={16} />
        <span className="link-underline">Volver al sitio</span>
      </Link>
      <ThemeSwitcher />
    </header>
    <main className="flex flex-1 items-center justify-center px-6 pb-16">
      <div className="w-full max-w-md">
        <Link href="/" className="mx-auto flex w-fit items-center gap-2.5" aria-label={`${siteConfig.name}, inicio`}>
          <BrandMark className="size-10" />
          <span className="text-2xl leading-none font-light tracking-tight text-foreground">{siteConfig.name}</span>
        </Link>
        {children}
        <p className="mt-6 text-center text-xs text-muted-foreground">Modo simulado: los datos no se envían a ningún servidor.</p>
      </div>
    </main>
  </div>
);

export default AuthLayout;
