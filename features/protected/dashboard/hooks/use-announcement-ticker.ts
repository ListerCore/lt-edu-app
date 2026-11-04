'use client';

import { useCallback, useState } from 'react';
import { useRotatingIndex } from '@/hooks/use-rotating-index';
import type { Announcement } from '@/features/protected/announcements/types';
import type { UseAnnouncementTickerResult } from '../types';

// Milliseconds each message stays in the header before the next one
const TICKER_INTERVAL_MS = 2000;

// Cycles through the announcements every TICKER_INTERVAL_MS; pausing (hover/focus) lets people finish reading
export const useAnnouncementTicker = (announcements: Announcement[]): UseAnnouncementTickerResult => {
  const [paused, setPaused] = useState(false);
  const index = useRotatingIndex(announcements.length, TICKER_INTERVAL_MS, paused);

  const pause = useCallback((): void => setPaused(true), []);
  const resume = useCallback((): void => setPaused(false), []);

  return { current: announcements[index], index, total: announcements.length, pause, resume };
};
