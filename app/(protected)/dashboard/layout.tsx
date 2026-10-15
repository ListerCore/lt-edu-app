import type { Metadata } from 'next';
import type { JSX } from 'react';
import { Navigation } from '@/components/layout/navigation';
import type { DashboardNavigationProps } from '@/features/private/dashboard/types';

export const metadata: Metadata = {
  title: 'Panel principal | SIGE-JL',
  description: 'Resumen de gestión académica del CEBA Privado Virtual Joseph Lister.',
};

const DashboardLayout = ({ children }: DashboardNavigationProps): JSX.Element => <Navigation>{children}</Navigation>;

export default DashboardLayout;
