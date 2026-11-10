import { connection } from 'next/server';
import type { JSX } from 'react';
import { CloudOff } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AnnouncementTabs } from '@/features/protected/announcements/components/announcement-tabs';
import { getPublicNews } from '../lib/news';
import { NewsLiveRefresh } from './news-live-refresh';

// The list itself, rendered per request (inside the page's Suspense) from the cached public feed
export const NewsFeed = async (): Promise<JSX.Element> => {
  await connection();
  const news = await getPublicNews();
  if (!news.ok) {
    return (
      <p className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
        <MorphIcon icon={CloudOff} size={24} />
        No pudimos cargar los comunicados. Vuelve a intentarlo en unos minutos.
      </p>
    );
  }
  return (
    <>
      <NewsLiveRefresh />
      <AnnouncementTabs announcements={news.items} linkToDetail emptyText="Por ahora no hay publicaciones de este tipo." />
    </>
  );
};
