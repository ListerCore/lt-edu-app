'use client';

import type { JSX } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProfileActivity, ProfilePreferences } from './profile-activity-and-preferences';
import { InstitutionalData, PersonalInformation, ProfileInformation, SecurityInformation } from './profile-information';
import { NotificationSettings, ProfileOverview } from './profile-overview';
import type { ProfileTab } from '../types';

const profileTabs: ProfileTab[] = ['general', 'personal', 'institutional', 'security', 'notifications', 'activity'];

const getActiveProfileTab = (value: string | null): ProfileTab => (value && profileTabs.includes(value as ProfileTab) ? (value as ProfileTab) : 'general');

const ProfileTabContent = (): JSX.Element => {
  const searchParams = useSearchParams();
  const activeTab = getActiveProfileTab(searchParams.get('tab'));

  return (
    <div id="profile-tab-panel" role="tabpanel" aria-labelledby={`profile-tab-${activeTab}`} className="min-h-64">
      {activeTab === 'general' && (
        <>
          <div className="grid gap-5 xl:grid-cols-12 xl:gap-6">
            <ProfileInformation />
            <ProfileOverview />
          </div>
          <div className="mt-5 flex flex-col gap-5 xl:mt-6">
            <ProfileActivity />
            <ProfilePreferences />
          </div>
        </>
      )}
      {activeTab === 'personal' && <PersonalInformation />}
      {activeTab === 'institutional' && <InstitutionalData />}
      {activeTab === 'security' && <SecurityInformation />}
      {activeTab === 'notifications' && <NotificationSettings />}
      {activeTab === 'activity' && <ProfileActivity />}
    </div>
  );
};

export { ProfileTabContent };
