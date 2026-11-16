'use client';

import { useMemo, useState } from 'react';
import type { LibraryPageState } from '../types';
import { useGetLibrary } from './use-get-library';

const fold = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

// Library page and picker: search by title, topic or description, and filter by kind
export const useLibraryPage = (): LibraryPageState => {
  const remote = useGetLibrary();
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('');
  const filtered = useMemo(() => {
    const needle = fold(query.trim());
    return (remote.data?.items ?? []).filter((l) => (!kind || l.kind === kind) && (!needle || fold(`${l.title} ${l.topic} ${l.description}`).includes(needle)));
  }, [remote.data, query, kind]);
  return { ...remote, query, setQuery, kind, setKind, filtered };
};
