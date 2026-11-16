'use client';

import type { JSX } from 'react';
import { AcademicPage } from '@/features/protected/academic/components/academic-ui';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { useWorkspace } from '@/features/protected/dashboard/hooks/use-workspace';
import { MyTutoringView } from './my-tutoring-view';
import { TutorDesk } from './tutor-desk';

// Tutoría virtual (EBA, phase E6): the tutor's desk, or the student's own tutoring
export const VirtualTutoringPage = (): JSX.Element => {
  const slug = useInstitutionSlug();
  const { role } = useWorkspace();
  const student = role === 'student';
  return (
    <AcademicPage
      wide
      titleId="vt-title"
      title={student ? 'Mi tutoría' : 'Tutoría virtual'}
      description={
        student
          ? 'Tu tutor te acompaña: escríbele, revisa tus próximas tutorías y los acuerdos.'
          : 'Tus estudiantes con lo que necesita atención (alertas de abandono, entregas, mensajes), las tutorías individuales y grupales, los mensajes y las derivaciones al SAANEE.'
      }
      context={null}
    >
      {student ? <MyTutoringView slug={slug} /> : <TutorDesk slug={slug} />}
    </AcademicPage>
  );
};
