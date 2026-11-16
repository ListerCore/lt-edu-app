'use client';

import { useMemo, useState } from 'react';
import { sileo } from 'sileo';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { copyRoomAction } from '../actions/copy-room';
import type { Room, UseCopyRoomParams, UseCopyRoomResult } from '../types';
import { useGetRooms } from './use-get-rooms';

// Copy the material of the same area in another period: picks the period (the previous one by default) and lists
// the rooms of that area there, the same grade first
export const useCopyRoom = ({ room, onCopied }: UseCopyRoomParams): UseCopyRoomResult => {
  const slug = useInstitutionSlug();
  const [periodId, setPeriodId] = useState('');
  const current = useGetRooms(room.periodId);
  const others = (current.data?.periods ?? []).filter((p) => p.id !== room.periodId);
  const chosen = periodId || others[0]?.id || '';
  const source = useGetRooms(chosen || room.periodId);
  const [isCopying, setIsCopying] = useState(false);

  const sources = useMemo(
    (): Room[] =>
      chosen
        ? (source.data?.rooms ?? []).filter((r) => r.subjectCode === room.subjectCode && r.id !== room.id && r.units > 0).sort((a, b) => Number(b.gradeName === room.gradeName) - Number(a.gradeName === room.gradeName))
        : [],
    [chosen, source.data, room],
  );

  const copy = (fromRoomId: string): void => {
    setIsCopying(true);
    void runAcademicAction(copyRoomAction(slug, room.id, fromRoomId))
      .then((result): void => {
        if (!result.ok) return;
        sileo.success({ title: `${result.data} unidades copiadas`, description: 'Quedan sin publicar: revisa fechas, enlaces y archivos antes de publicarlas.' });
        onCopied();
      })
      .finally((): void => setIsCopying(false));
  };

  return { periods: others, periodId: chosen, setPeriodId, sources, isLoading: current.isLoading || (Boolean(chosen) && source.isLoading), copy, isCopying };
};
