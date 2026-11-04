'use client';

import type { JSX } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useCardholderPhotos } from '@/features/protected/cards/hooks/use-cardholder-photos';
import { useUpdateCardholderPhoto } from '@/features/protected/cards/hooks/use-update-cardholder-photo';
import { useGetAccountProfile } from '../hooks/use-get-account-profile';
import { usePrintProfileReport } from '../hooks/use-print-profile-report';
import { AccountActivityCard } from './account-activity-card';
import { AccountContactCard } from './account-contact-card';
import { AccountHeader } from './account-header';
import { AccountLinkedCard } from './account-linked-card';
import { AccountReport } from './account-report';
import { AccountSectionCard } from './account-section-card';
import { AccountSecurityCard } from './account-security-card';

// Mi cuenta: everything on file for the signed-in person, editable contact, photo (shared with the ID card) and the profile report
export const AccountPage = (): JSX.Element => {
  const { profile, isLoading, applyContact } = useGetAccountProfile();
  const photos = useCardholderPhotos();
  const { setPhoto, error: photoError, isPending: isPhotoPending } = useUpdateCardholderPhoto();
  const { generatedAt, print } = usePrintProfileReport();

  if (isLoading || !profile) {
    return (
      <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 md:px-8 md:py-10">
        <Skeleton className="h-44 rounded-2xl" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <Skeleton className="h-[32rem] rounded-2xl" />
          <Skeleton className="h-[32rem] rounded-2xl" />
        </div>
      </section>
    );
  }

  const photoUrl = photos[profile.photoKey] ?? null;

  return (
    <section aria-label="Mi cuenta" className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 md:px-8 md:py-10">
      <AccountHeader {...profile} photoUrl={photoUrl} isPhotoPending={isPhotoPending} photoError={photoError} onPhotoSelect={(file): void => setPhoto(profile.photoKey, file)} onDownloadReport={print} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex min-w-0 flex-col gap-6">
          {profile.sections.slice(0, 2).map((section): JSX.Element => (
            <AccountSectionCard key={section.id} section={section} />
          ))}
          {profile.linked.length > 0 && <AccountLinkedCard profile={profile} />}
          <AccountContactCard key={`${profile.role}-${profile.institutionType}`} contact={profile.contact} onSaved={applyContact} />
          {profile.sections.slice(2).map((section): JSX.Element => (
            <AccountSectionCard key={section.id} section={section} />
          ))}
        </div>
        <div className="flex flex-col gap-6 lg:sticky lg:top-20 lg:self-start">
          <AccountSecurityCard profile={profile} />
          <AccountActivityCard profile={profile} />
        </div>
      </div>

      {generatedAt && <AccountReport profile={profile} photoUrl={photoUrl} generatedAt={generatedAt} />}
    </section>
  );
};
