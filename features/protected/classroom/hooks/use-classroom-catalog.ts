'use client';

import { useMemo, useState } from 'react';
import type { CatalogPageState, Room, RoomGroup } from '../types';
import { useGenerateRooms } from './use-generate-rooms';
import { useGetRooms } from './use-get-rooms';

const fold = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

// Aula virtual catalog: the period (the one in course by default), a search by area, grade or teacher, and the rooms
// grouped by cycle and grade in the order of the structure
export const useClassroomCatalog = (): CatalogPageState => {
  const [periodId, setPeriodId] = useState('');
  const [query, setQuery] = useState('');
  const remote = useGetRooms(periodId);
  const { generate, isGenerating } = useGenerateRooms(remote.reload);
  const data = remote.data;

  const groups = useMemo((): RoomGroup[] => {
    const needle = fold(query.trim());
    const out: RoomGroup[] = [];
    (data?.rooms ?? [])
      .filter((r: Room) => !needle || fold(`${r.subjectName} ${r.gradeName} ${r.levelName} ${r.staffName}`).includes(needle))
      .forEach((r: Room): void => {
        const key = `${r.levelId}|${r.gradeId}`;
        const last = out.at(-1);
        if (last?.key === key) last.rooms.push(r);
        else out.push({ key, title: r.gradeName ? `${r.levelName} · ${r.gradeName}` : r.levelName, rooms: [r] });
      });
    return out;
  }, [data, query]);

  return {
    ...remote,
    periodId: periodId || data?.periodId || '',
    setPeriodId,
    query,
    setQuery,
    groups,
    total: data?.rooms.length ?? 0,
    drafts: data?.rooms.filter((r) => r.status === 'draft').length ?? 0,
    generate: (): void => generate(periodId || data?.periodId || ''),
    isGenerating,
  };
};
