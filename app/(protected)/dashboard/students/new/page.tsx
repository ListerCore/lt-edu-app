import type { Metadata } from 'next';
import type { JSX } from 'react';
import { NewStudentPage } from '@/features/protected/people/components/new-student-page';

export const metadata: Metadata = { title: 'Nuevo estudiante' };

const Page = (): JSX.Element => <NewStudentPage />;

export default Page;
