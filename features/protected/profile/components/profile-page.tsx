import type { JSX } from 'react';
import { Suspense } from 'react';
import { NavbarProtected } from '@/components/layout/navbar-protected';
import { Footer } from '@/components/layout/footer';
import { ProfileHeader } from './profile-header';
import { ProfileTabContent } from './profile-tab-content';

const ProfilePage = (): JSX.Element => (
  <div className="min-h-svh bg-background">
    <NavbarProtected />
    <main className="min-h-[calc(100svh-7rem)] px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 sm:gap-6">
        <div className="sticky top-28 z-30 bg-background pb-4">
          <ProfileHeader />
        </div>
        <Suspense fallback={<div aria-hidden="true" className="min-h-64 rounded-xl border border-border bg-card" />}>
          <ProfileTabContent />
        </Suspense>
      </div>
    </main>
    <Footer />
  </div>
);

export { ProfilePage };
