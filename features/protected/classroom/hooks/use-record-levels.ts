'use client';

import { useState } from 'react';
import { sileo } from 'sileo';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { recordLevelsAction } from '../actions/record-levels';
import type { UseRecordLevelsResult } from '../types';

// Takes the graded levels to the official record; the toast says how many went and how many were left out
export const useRecordLevels = (itemId: string, onDone: () => void): UseRecordLevelsResult => {
  const slug = useInstitutionSlug();
  const [isRecording, setIsRecording] = useState(false);
  const record = (): void => {
    setIsRecording(true);
    void runAcademicAction(recordLevelsAction(slug, itemId))
      .then((r): void => {
        if (!r.ok) return;
        sileo.success({
          title: r.data.recorded === 1 ? 'Un estudiante llevado al registro' : `${r.data.recorded} estudiantes llevados al registro`,
          description: r.data.skipped > 0 ? `${r.data.skipped} no se llevaron: su sección no tiene docente del área o su registro está cerrado.` : 'Puedes revisarlos en Evaluación › Notas.',
        });
        onDone();
      })
      .finally((): void => setIsRecording(false));
  };
  return { record, isRecording };
};
