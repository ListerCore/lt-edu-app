'use client';

import { useRouter } from 'next/navigation';
import { isAnnouncementEvent, useLiveRefresh } from '@/hooks/use-live';

// Re-renders the page when a public announcement is published, edited or deleted (live channel), instead of polling
export const NewsLiveRefresh = (): null => {
  const router = useRouter();
  useLiveRefresh(
    (event) => isAnnouncementEvent(event.type) && event.data.public === 'true',
    () => router.refresh(),
  );
  return null;
};
