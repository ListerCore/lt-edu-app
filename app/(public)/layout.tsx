import type { JSX, ReactNode } from 'react';
import { Footer } from '../../components/layout/footer';
import { Navbar } from '../../components/layout/navbar';

interface PublicLayoutProps {
  children: ReactNode;
}

const PublicLayout = ({ children }: PublicLayoutProps): JSX.Element => (
  <>
    <Navbar />
    <main className="mx-auto min-h-dvh w-full max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">{children}</main>
    <Footer />
  </>
);

export default PublicLayout;
