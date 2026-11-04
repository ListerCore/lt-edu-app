import type { JSX, ReactNode } from 'react';
import { SiteBackground } from '@/components/layout/site-background';

interface PublicLayoutProps {
  children: ReactNode;
}

// Public pages share the brand backdrop; navbar and footer go here once they exist
const PublicLayout = ({ children }: PublicLayoutProps): JSX.Element => (
  <div className="isolate flex min-h-screen flex-col">
    <SiteBackground />
    <main className="flex-1">{children}</main>
  </div>
);

export default PublicLayout;
