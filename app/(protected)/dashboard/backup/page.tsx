import type { Metadata } from 'next';
import type { JSX } from 'react';
import { BackupPage } from '@/features/private/backup/components/backup-page';

export const metadata: Metadata = {
  title: 'Backup y recuperación | SIGE-JL',
  description: 'Estado de respaldos, continuidad operativa y recuperación de datos institucionales.',
};

const DashboardBackupPage = (): JSX.Element => <BackupPage />;

export default DashboardBackupPage;
