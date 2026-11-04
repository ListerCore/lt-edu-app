import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Private area: never indexed, whatever the page sets
export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

interface ProtectedLayoutProps {
  children: ReactNode;
}

// Group wrapper for the signed-in area; the session check goes here once auth talks to joseph-api
const ProtectedLayout = ({ children }: ProtectedLayoutProps): ReactNode => children;

export default ProtectedLayout;
