import type { Metadata } from 'next';
import { Suspense, type JSX } from 'react';
import { newsPath } from '@/features/protected/announcements/data/announcements-data';
import { NewsDetail, NewsDetailSkeleton } from '@/features/public/news/components/news-detail';
import { getPublicNews, getPublicNewsItem } from '@/features/public/news/lib/news';

// Placeholder when the API is unreachable at build time (Docker): Next needs one param; it renders as a 404
const BUILD_PLACEHOLDER = '000000000000000000';

// Public announcements at build time are prerendered; ones published later render on their first visit (and are
// cached), and unknown or internal slugs fall through to notFound()
export const generateStaticParams = async (): Promise<Array<{ slug: string }>> => {
  const news = await getPublicNews();
  const slugs = news.ok ? news.items.map(({ slug }) => ({ slug })) : [];
  return slugs.length > 0 ? slugs : [{ slug: BUILD_PLACEHOLDER }];
};

export const generateMetadata = async ({ params }: PageProps<'/news/[slug]'>): Promise<Metadata> => {
  const { slug } = await params;
  const result = await getPublicNewsItem(slug);
  if (!result.ok || !result.item) return { title: 'Comunicado' };
  const { item } = result;
  const description = item.body.length > 160 ? `${item.body.slice(0, 157).trimEnd()}…` : item.body;
  return { title: item.title, description, alternates: { canonical: newsPath(item.slug) }, openGraph: { title: item.title, description, type: 'article', publishedTime: item.publishedAt } };
};

// The slug is read inside <Suspense>, so the page shell is shared and the publication streams in
const Page = ({ params }: PageProps<'/news/[slug]'>): JSX.Element => (
  <section className="mx-auto max-w-4xl px-6 pt-10 pb-20 md:px-8 md:pt-14 md:pb-28">
    <Suspense fallback={<NewsDetailSkeleton />}>
      <NewsDetail params={params} />
    </Suspense>
  </section>
);

export default Page;
