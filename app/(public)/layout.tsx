import type { JSX, ReactNode } from 'react';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { SectionActivityProvider } from '@/components/providers/section-activity';
import { SiteBackground } from '@/components/layout/site-background';

interface PublicLayoutProps {
  children: ReactNode;
}

// Public pages share the backdrop, header and footer
const PublicLayout = ({ children }: PublicLayoutProps): JSX.Element => (
  <SectionActivityProvider>
    <div className="isolate flex min-h-screen flex-col">
      <SiteBackground />
      <Navbar />
      <main className="min-h-[calc(100svh-4rem)] flex-1">{children}</main>
      <Footer />
    </div>
  </SectionActivityProvider>
);

export default PublicLayout;
