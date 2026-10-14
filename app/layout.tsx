import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import type { JSX, ReactNode } from 'react';
import './globals.css';
import { AppProviders } from '../components/providers/providers';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'CEBA Joseph Lister | Sistema de Gestión Académica',
  description: 'Plataforma centralizada de gestión académica, matrículas y ciclos formativos para el Centro de Educación Básica Alternativa Joseph Lister.',
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps): JSX.Element => {
  return (
    <html lang="es" className={`${manrope.variable} ${inter.variable} h-full dark`} suppressHydrationWarning>
      <body className="min-h-full bg-background font-sans text-foreground">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
};

export default RootLayout;
