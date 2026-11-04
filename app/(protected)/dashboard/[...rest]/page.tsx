import { Suspense, type JSX } from 'react';
import { DashboardModulePlaceholder } from '@/features/protected/dashboard/components/dashboard-module-placeholder';

// Module routes without a screen yet; the placeholder reads the pathname, so it streams inside Suspense
const Page = (): JSX.Element => (
  <Suspense>
    <DashboardModulePlaceholder />
  </Suspense>
);

export default Page;
