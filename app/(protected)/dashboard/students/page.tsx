import type { Metadata } from 'next';
import type { JSX } from 'react';
import { StudentsPage } from '@/features/protected/people/components/students-page';

export const metadata: Metadata = { title: 'Estudiantes' };

const Page = (): JSX.Element => <StudentsPage />;

export default Page;
