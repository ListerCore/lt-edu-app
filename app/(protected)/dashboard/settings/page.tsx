import type { Metadata } from 'next';
import type { JSX } from 'react';
import { SettingsPage } from '@/features/private/settings/components/settings-page';

export const metadata: Metadata = {
  title: 'Administración, roles y seguridad | SIGE-JL',
  description: 'Centro de control de identidad, cuentas, roles y seguridad institucional de SIGE-JL.',
};

const DashboardSettingsPage = (): JSX.Element => <SettingsPage />;

export default DashboardSettingsPage;
