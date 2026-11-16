'use client';

import { useCallback, useMemo } from 'react';
import { useNow } from '@/features/protected/apafa/hooks/use-now';
import { formatLive, LIVE_OPENS_BEFORE_MIN } from '../data/classroom-data';
import type { Item, LiveState, RoomPageState } from '../types';
import { useGetRoom } from './use-get-room';

// Room page: the room plus, for a student, how much of the open material they already opened, and the next live
// session (the link opens 15 minutes before it starts and closes when it ends)
export const useRoomPage = (id: string): RoomPageState => {
  const remote = useGetRoom(id);
  const now = useNow();

  const liveOf = useCallback(
    (item: Item): LiveState | null => {
      if (item.kind !== 'live' || !item.startsAt) return null;
      const start = Date.parse(item.startsAt);
      const end = start + (item.durationMinutes ?? 60) * 60_000;
      const phase = now === 0 || now < start - LIVE_OPENS_BEFORE_MIN * 60_000 ? 'upcoming' : now <= end ? 'open' : 'ended';
      return { label: formatLive(item.startsAt), phase };
    },
    [now],
  );

  const { progress, nextLive } = useMemo(() => {
    const units = remote.data?.units ?? [];
    const items = units.flatMap((u) => u.items.map((item) => ({ item, unitTitle: u.title })));
    const lives = items
      .map((x) => ({ ...x, live: liveOf(x.item) }))
      .filter((x): x is { item: Item; unitTitle: string; live: LiveState } => x.live !== null && x.live.phase !== 'ended')
      .sort((a, b) => Date.parse(a.item.startsAt) - Date.parse(b.item.startsAt));
    const family = remote.data?.family ?? false;
    return {
      progress: family ? { viewed: items.filter((x) => x.item.viewed).length, total: items.length } : null,
      nextLive: lives[0] ?? null,
    };
  }, [remote.data, liveOf]);

  return { ...remote, progress, nextLive, liveOf };
};
