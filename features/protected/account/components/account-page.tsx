'use client';

import type { JSX } from 'react';
import { RefreshCw } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Skeleton } from '@/components/ui/skeleton';
import { useCardholderPhotos } from '@/features/protected/cards/hooks/use-cardholder-photos';
import { useUpdateCardholderPhoto } from '@/features/protected/cards/hooks/use-update-cardholder-photo';
import { useWorkspace } from '@/features/protected/dashboard/hooks/use-workspace';
import { accountPhotoKey } from '../data/account-data';
import { useAccount } from '../hooks/use-account';
import { AccountHeader } from './account-header';
import { AccountRolesCard } from './account-roles-card';
import { AccountSecurityCard } from './account-security-card';
import { TwoFactorCard } from './two-factor-card';

// Mi cuenta: the signed-in account from joseph-api (identity, roles, security) and its two-step verification
export const AccountPage = (): JSX.Element => {
  const { account, twoFactor, error, isLoading, reload } = useAccount();
  const { institutionType, role } = useWorkspace();
  const photos = useCardholderPhotos();
  const { setPhoto, error: photoError, isPending: isPhotoPending } = useUpdateCardholderPhoto();
  const photoKey = accountPhotoKey(institutionType, role);

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 md:px-8 md:py-10">
        <Skeleton className="h-44 rounded-2xl" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </section>
    );
  }

  if (!account || !twoFactor) {
    return (
      <section className="mx-auto flex w-full max-w-md flex-col items-center gap-4 px-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">{error ?? 'No pudimos cargar tu cuenta.'}</p>
        <button type="button" onClick={reload} className="btn-alt">
          <MorphIcon icon={RefreshCw} size={16} />
          Reintentar
        </button>
      </section>
    );
  }

  const activeRole = account.roles.find(({ id }) => id === account.activeRoleId) ?? null;

  return (
    <section aria-label="Mi cuenta" className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 md:px-8 md:py-10">
      <AccountHeader account={account} activeRole={activeRole} photoUrl={photos[photoKey] ?? null} isPhotoPending={isPhotoPending} photoError={photoError} onPhotoSelect={(file): void => setPhoto(photoKey, file)} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex min-w-0 flex-col gap-6">
          <TwoFactorCard status={twoFactor} email={account.email} onChanged={reload} />
          <AccountRolesCard account={account} onSwitched={reload} />
        </div>
        <div className="flex flex-col gap-6 lg:sticky lg:top-20 lg:self-start">
          <AccountSecurityCard account={account} />
        </div>
      </div>
    </section>
  );
};
