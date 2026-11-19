import type { JSX, ReactNode } from 'react';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { SectionActivityProvider } from '@/components/providers/section-activity';
import { SiteBackground } from '@/components/layout/site-background';
import { WhatsAppButton } from '@/components/layout/whatsapp-button';
import { siteConfig } from '@/lib/site';
import { ScrollReveal } from '@/components/providers/scroll-reveal';

interface PublicLayoutProps {
  children: ReactNode;
}

// Public pages share the backdrop, header, footer, WhatsApp button and scroll reveals
const PublicLayout = ({ children }: PublicLayoutProps): JSX.Element => (
  <SectionActivityProvider>
    <div className="isolate flex min-h-screen flex-col">
      <SiteBackground />
      <ScrollReveal />
      <Navbar />
      <main className="min-h-[calc(100svh-4rem)] flex-1">{children}</main>
      <Footer />
      {siteConfig.whatsapp.number && <WhatsAppButton number={siteConfig.whatsapp.number} message={siteConfig.whatsapp.message} />}
    </div>
  </SectionActivityProvider>
);

export default PublicLayout;
