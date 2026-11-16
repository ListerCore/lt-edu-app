'use client';

import { useState } from 'react';
import { sileo } from 'sileo';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { generateRoomsAction } from '../actions/generate-rooms';

// Creates the rooms the plans in force are missing for a period; the toast says how many
export const useGenerateRooms = (onDone: () => void): { generate: (periodId: string) => void; isGenerating: boolean } => {
  const slug = useInstitutionSlug();
  const [isGenerating, setIsGenerating] = useState(false);
  const generate = (periodId: string): void => {
    if (!periodId) return;
    setIsGenerating(true);
    void runAcademicAction(generateRoomsAction(slug, periodId))
      .then((result): void => {
        if (!result.ok) return;
        sileo.success(
          result.data > 0
            ? { title: `${result.data} aulas creadas`, description: 'Quedan como borrador hasta que las publiques.' }
            : { title: 'No faltaba ninguna aula', description: 'Cada área del plan de estudios ya tiene su aula en este periodo.' },
        );
        onDone();
      })
      .finally((): void => setIsGenerating(false));
  };
  return { generate, isGenerating };
};
