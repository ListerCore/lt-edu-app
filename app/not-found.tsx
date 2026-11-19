import type { Metadata } from 'next';
import type { JSX } from 'react';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { SectionActivityProvider } from '@/components/providers/section-activity';
import { SiteBackground } from '@/components/layout/site-background';
import { WhatsAppButton } from '@/components/layout/whatsapp-button';
import { siteConfig } from '@/lib/site';
import { NotFoundPage } from '@/features/public/system/components/not-found-page';

export const metadata: Metadata = { title: 'Página no encontrada' };

// Root 404 renders outside the (public) group, so it brings its own chrome (navbar needs the section context)
const NotFound = (): JSX.Element => (
  <SectionActivityProvider>
    <div className="isolate flex min-h-screen flex-col">
      <SiteBackground />
      <Navbar />
      <main className="min-h-[calc(100svh-4rem)] flex-1">
        <NotFoundPage />
      </main>
      <Footer />
      {siteConfig.whatsapp.number && <WhatsAppButton number={siteConfig.whatsapp.number} message={siteConfig.whatsapp.message} />}
    </div>
  </SectionActivityProvider>
);

export default NotFound;
