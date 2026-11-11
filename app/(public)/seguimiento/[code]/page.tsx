import type { Metadata } from 'next';
import { Suspense, type JSX } from 'react';
import { TrackingDetail, TrackingSkeleton } from '@/features/public/tracking/components/tracking-detail';

export const metadata: Metadata = {
  title: 'Seguimiento de documento',
  description: 'Comprueba si un documento emitido por la institución es la versión vigente, quién lo firmó y su historial.',
  robots: { index: false },
};

// Tracking codes are not known at build time: one placeholder lets the shell prerender (like /news/[slug]) and every
// real code renders on its first visit; the placeholder itself falls through to notFound()
export const generateStaticParams = (): Array<{ code: string }> => [{ code: '000000000000' }];

// Where the QR of a printed document leads: the code is read inside <Suspense>, so the shell is shared
const Page = ({ params, searchParams }: PageProps<'/seguimiento/[code]'>): JSX.Element => (
  <section className="mx-auto max-w-3xl px-6 pt-10 pb-20 md:px-8 md:pt-14 md:pb-28">
    <Suspense fallback={<TrackingSkeleton />}>
      <TrackingDetail params={params} searchParams={searchParams} />
    </Suspense>
  </section>
);

export default Page;
