import type { Metadata } from 'next';
import type { JSX } from 'react';
import { DashboardNotFound } from '@/features/protected/dashboard/components/dashboard-not-found';

export const metadata: Metadata = { title: 'Módulo no encontrado' };

// Panel 404: rendered by the dashboard layout, so the sidebar and header stay in place
const NotFound = (): JSX.Element => <DashboardNotFound />;

export default NotFound;
