'use client';

import Link from 'next/link';
import type { JSX } from 'react';
import { ArrowLeft } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AcademicPage, LoadError, PageSkeleton } from '@/features/protected/academic/components/academic-ui';
import { itemKinds, roomPath } from '../data/classroom-data';
import { useGetAssessment } from '../hooks/use-get-assessment';
import type { AssessmentPageProps } from '../types';
import { AssessmentStaff } from './assessment-staff';
import { AssessmentStudent } from './assessment-student';

// A quiz or task: the teacher configures and grades it; the student takes it and reads the results
export const AssessmentPage = ({ roomId, itemId }: AssessmentPageProps): JSX.Element => {
  const { data, error, isLoading, reload } = useGetAssessment(itemId);
  const back = (
    <Link href={roomPath(roomId)} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand">
      <MorphIcon icon={ArrowLeft} size={14} />
      Volver al aula
    </Link>
  );
  return (
    <AcademicPage titleId="assessment-title" title={data?.assessment.title ?? 'Evaluación'} description={data ? itemKinds[data.assessment.kind]?.label ?? '' : ''} context={null} back={back}>
      {error ? (
        <LoadError message={error} onRetry={reload} />
      ) : isLoading || !data ? (
        <PageSkeleton />
      ) : data.family ? (
        <AssessmentStudent roomId={roomId} data={data} onChanged={reload} />
      ) : (
        <AssessmentStaff key={data.assessment.questions.map((q) => q.id).join()} roomId={roomId} data={data} onChanged={reload} />
      )}
    </AcademicPage>
  );
};
