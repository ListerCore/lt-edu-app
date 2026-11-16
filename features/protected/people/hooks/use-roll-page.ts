'use client';

import { useMemo, useState } from 'react';
import type { PeopleContextData, RollFilter, RollPageState } from '../types';
import { useRoll } from './use-roll';
import { useSetSiagie } from './use-set-siagie';

// Nómina page: the filter (the running period first), the rows, the sections in them and the selection the bulk
// SIAGIE actions apply to. Changing the filter clears the selection
export const useRollPage = (slug: string, ctx: PeopleContextData): RollPageState => {
  const initialPeriod = (ctx.periods.find((p) => p.status === 'active') ?? ctx.periods.find((p) => p.status === 'planning') ?? ctx.periods[0])?.id ?? '';
  const [filter, setFilterState] = useState<RollFilter>({ periodId: initialPeriod, levelId: '', gradeId: '', sectionId: '', siagieStatus: '', all: false });
  const [selected, setSelected] = useState<string[]>([]);
  const remote = useRoll(slug, filter);
  const { set, isSetting } = useSetSiagie(slug, (): void => {
    setSelected([]);
    remote.reload();
  });
  const data = remote.data;
  const sections = useMemo(() => {
    const seen = new Map<string, string>();
    for (const r of data?.rows ?? []) if (r.sectionId && filter.gradeId && !seen.has(r.sectionId)) seen.set(r.sectionId, `Sección ${r.sectionName}`);
    return [...seen].map(([value, label]) => ({ value, label }));
  }, [data, filter.gradeId]);
  const rows = data?.rows ?? [];

  return {
    ...remote,
    filter,
    setFilter: (patch: Partial<RollFilter>): void => {
      setSelected([]);
      setFilterState((f) => ({ ...f, ...patch }));
    },
    sections,
    selected,
    toggle: (id: string, on: boolean): void => setSelected((s) => (on ? [...s, id] : s.filter((x) => x !== id))),
    toggleAll: (on: boolean): void => setSelected(on ? rows.map((r) => r.enrollmentId) : []),
    mark: (status: 'pending' | 'exported'): void => {
      void set(selected, status, '');
    },
    isMarking: isSetting,
  };
};
