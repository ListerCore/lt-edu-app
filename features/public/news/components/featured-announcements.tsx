import { connection } from 'next/server';
import type { JSX } from 'react';
import { getFeaturedNews } from '../lib/news';
import { FeaturedAnnouncementsModal } from './featured-announcements-modal';

// Server part of the home modal: the announcements in their validity window, rendered per request inside Suspense
// (the list itself is cached). Nothing renders when there is none or the API is down
export const FeaturedAnnouncements = async (): Promise<JSX.Element | null> => {
  await connection();
  const featured = await getFeaturedNews();
  if (!featured.ok || featured.items.length === 0) return null;
  return <FeaturedAnnouncementsModal announcements={featured.items} />;
};
