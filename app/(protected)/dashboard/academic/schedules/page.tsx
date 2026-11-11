import type { Metadata } from 'next';
import type { JSX } from 'react';
import { SchedulesPage } from '@/features/protected/schedules/components/schedules-page';

export const metadata: Metadata = { title: 'Horarios' };

const Page = (): JSX.Element => <SchedulesPage />;

export default Page;
