'use client';

import { useMemo, useState } from 'react';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { isClassroomEvent } from '@/hooks/use-live';
import { getDeliveriesAction } from '../actions/get-deliveries';
import { saveDeliveryAction } from '../actions/save-delivery';
import type { UseDeliveriesResult } from '../types';

// Itinerant deliveries of a unit: who got the printed package and who returned it. Each date change saves at once
export const useDeliveries = (unitId: string): UseDeliveriesResult => {
  const slug = useInstitutionSlug();
  const remote = useAcademicData(`classroom-deliveries:${slug}:${unitId}`, () => getDeliveriesAction(slug, unitId), isClassroomEvent);
  const [savingId, setSavingId] = useState<string | null>(null);
  const save = (studentId: string, deliveredOn: string, returnedOn: string): void => {
    setSavingId(studentId);
    // Clearing the delivery clears the return too
    void runAcademicAction(saveDeliveryAction(slug, { unitId, studentId, deliveredOn, returnedOn: deliveredOn ? returnedOn : '', notes: '' }))
      .then((result): void => {
        if (result.ok) remote.reload();
      })
      .finally((): void => setSavingId(null));
  };
  const { delivered, returned } = useMemo(
    () => ({ delivered: (remote.data ?? []).filter((d) => d.deliveredOn).length, returned: (remote.data ?? []).filter((d) => d.returnedOn).length }),
    [remote.data],
  );
  return { ...remote, save, savingId, delivered, returned };
};
