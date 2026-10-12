import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import type { JSX, ReactNode } from 'react';
import './globals.css';
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });

const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CEBA Joseph Lister | Sistema de Gestión Académica',
  description: 'Plataforma centralizada de gestión académica, matrículas y ciclos formativos para el Centro de Educación Básica Alternativa Joseph Lister.',
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps): JSX.Element => {
  return (
    <html lang="es" className={cn("h-full", "antialiased", "dark", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}>
      <body className="min-h-full flex flex-col bg-[#070E1D] text-[#DCE2F7]">
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
};

export default RootLayout;
