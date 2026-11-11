'use client';

import { useState, type JSX } from 'react';
import { FilePlus } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { LoadError, PageSkeleton } from '@/features/protected/academic/components/academic-ui';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useToday } from '@/features/protected/academic/hooks/use-today';
import { isAttendanceEvent } from '@/hooks/use-live';
import { getStudentAttendanceAction } from '../actions/attendance-actions';
import { SubmitJustificationDialog } from './justifications-view';
import { StudentRecord } from './student-record';

// The student's page, Asistencia tab: the same record the family sees, and a paper justification for the office
export const StudentAttendanceTab = ({ slug, studentId }: { slug: string; studentId: string }): JSX.Element => {
  const today = useToday();
  const { data, error, reload } = useAcademicData(`att-student:${slug}:${studentId}`, () => getStudentAttendanceAction(slug, studentId), isAttendanceEvent);
  const [open, setOpen] = useState(false);
  if (error) return <LoadError message={error} onRetry={reload} />;
  if (!data) return <PageSkeleton />;
  return (
    <>
      <StudentRecord
        record={data}
        showToday
        actions={
          <button type="button" className="btn-alt" onClick={(): void => setOpen(true)}>
            <MorphIcon icon={FilePlus} size={16} />
            Registrar justificación
          </button>
        }
      />
      {open && today && (
        <SubmitJustificationDialog
          slug={slug}
          today={today}
          students={[{ id: studentId, name: data.student?.name ?? '' }]}
          onClose={(): void => setOpen(false)}
          onDone={(): void => {
            setOpen(false);
            reload();
          }}
        />
      )}
    </>
  );
};
