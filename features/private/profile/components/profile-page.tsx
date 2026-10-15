import type { JSX } from 'react';
import { ProfileActivityAndPreferences } from './profile-activity-and-preferences';
import { ProfileHeader } from './profile-header';
import { ProfileInformation } from './profile-information';
import { ProfileOverview } from './profile-overview';

const ProfilePage = (): JSX.Element => (
  <div className="min-h-svh bg-background">
    <ProfileHeader />
    <main className="px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 sm:gap-6">
        <div className="grid gap-5 xl:grid-cols-12 xl:gap-6">
          <ProfileInformation />
          <ProfileOverview />
        </div>
        <ProfileActivityAndPreferences />
      </div>
    </main>
  </div>
);

export { ProfilePage };
