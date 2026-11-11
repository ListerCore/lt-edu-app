'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { JSX } from 'react';
import { ArrowLeft } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AcademicPage, LoadError, PageSkeleton } from '@/features/protected/academic/components/academic-ui';
import { STUDENTS_PATH, studentPath } from '../data/people-data';
import { usePeopleContext } from '../hooks/use-people-context';
import { StudentForm } from './student-form';

// Register a student; then its page asks for the family and the enrollment
export const NewStudentPage = (): JSX.Element => {
  const router = useRouter();
  const { data, error, isLoading, reload, slug } = usePeopleContext();
  return (
    <AcademicPage
      titleId="new-student-title"
      title="Nuevo estudiante"
      description="Registra sus datos. Después agregas a su familia y lo matriculas."
      context={data ? { ...data.context, canManage: data.canManage } : null}
      back={
        <Link href={STUDENTS_PATH} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
          <MorphIcon icon={ArrowLeft} size={15} />
          Estudiantes
        </Link>
      }
    >
      {isLoading ? <PageSkeleton /> : error || !data ? <LoadError message={error ?? 'Sin datos.'} onRetry={reload} /> : <StudentForm slug={slug} student={null} readOnly={!data.canManage} onSaved={(s): void => router.push(`${studentPath(s.id)}?tab=family`)} onCancel={(): void => router.push(STUDENTS_PATH)} />}
    </AcademicPage>
  );
};
