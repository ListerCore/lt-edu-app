import type { Metadata, Viewport } from 'next';
import { Geist_Mono, Inter } from 'next/font/google';
import type { JSX, ReactNode } from 'react';
import './globals.css';
import { AppProviders } from '@/components/providers/providers';
import { ThemeScript } from '@/components/providers/theme-script';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

// Site-wide defaults; pages override title/description as they are added
export const metadata: Metadata = {
  title: { default: 'Joseph', template: '%s | Joseph' },
  description: 'Joseph',
};

// Browser chrome follows the page background in each scheme
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#17120f' },
  ],
  colorScheme: 'light dark',
};

interface RootLayoutProps {
  children: ReactNode;
}

// Root shell: fonts, pre-hydration theme script and client providers
const RootLayout = ({ children }: RootLayoutProps): JSX.Element => (
  <html lang="es" className={`${inter.variable} ${geistMono.variable} h-full`} suppressHydrationWarning>
    <head>
      <ThemeScript />
    </head>
    <body className="flex min-h-full flex-col">
      <AppProviders>{children}</AppProviders>
    </body>
  </html>
);

export default RootLayout;
