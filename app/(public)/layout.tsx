import type { JSX, ReactNode } from 'react';
import { Footer } from '../../components/layout/footer';
import { Navbar } from '../../components/layout/navbar';
import { ParticleNetwork } from '@/features/public/landing/components/particle-network';
import { ActiveNavigationProvider } from '@/components/layout/active-navigation';

interface PublicLayoutProps {
  children: ReactNode;
}

const PublicLayout = ({ children }: PublicLayoutProps): JSX.Element => (
  <ActiveNavigationProvider>
    <ParticleNetwork />
    <Navbar />
    <main className="relative z-10 mx-auto min-h-dvh w-full max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">{children}</main>
    <div className="relative z-10"><Footer /></div>
  </ActiveNavigationProvider>
);

export default PublicLayout;
