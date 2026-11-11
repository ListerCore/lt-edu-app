'use client';

import { useSyncExternalStore } from 'react';
import { todayISO } from '../data/academic-data';

const noSubscription = (): (() => void) => () => undefined;

// Today as YYYY-MM-DD in the browser; empty while prerendering, so nothing about "today" is baked into the shell
export const useToday = (): string => useSyncExternalStore(noSubscription, todayISO, () => '');
