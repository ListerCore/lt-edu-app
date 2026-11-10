'use client';

import { useRouter } from 'next/navigation';
import { useLiveRefresh } from '@/hooks/use-live';

// Re-renders the page when the institution publishes something public (live channel), instead of polling
export const NewsLiveRefresh = (): null => {
  const router = useRouter();
  useLiveRefresh(
    (event) => event.type === 'announcement.published' && event.data.public === 'true',
    () => router.refresh(),
  );
  return null;
};
