import { Suspense, type JSX } from 'react';
import { LandingPage } from '@/features/public/landing/components/landing-page';
import { FeaturedAnnouncements } from '@/features/public/news/components/featured-announcements';

// The home modal streams in after the page (its data is per request), so the landing stays prerendered
const Page = (): JSX.Element => (
  <>
    <LandingPage />
    <Suspense fallback={null}>
      <FeaturedAnnouncements />
    </Suspense>
  </>
);

export default Page;
