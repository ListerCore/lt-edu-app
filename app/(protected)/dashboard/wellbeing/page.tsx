import type { Metadata } from 'next';
import type { JSX } from 'react';
import { WellbeingPage } from '@/features/protected/wellbeing/components/wellbeing-page';

export const metadata: Metadata = {
  title: 'Tutoría integral y bienestar | SIGE-JL',
  description: 'Seguimiento de tutoría, permanencia y bienestar de estudiantes EBA.',
};

const DashboardWellbeingPage = (): JSX.Element => <WellbeingPage />;

export default DashboardWellbeingPage;
