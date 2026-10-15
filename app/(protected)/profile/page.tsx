import type { Metadata } from 'next';
import type { JSX } from 'react';
import { ProfilePage } from '@/features/private/profile/components/profile-page';

export const metadata: Metadata = {
  title: 'Mi perfil | SIGE-JL',
  description: 'Consulta tu información y preferencias institucionales en SIGE-JL.',
};

const ProfileRoute = (): JSX.Element => <ProfilePage />;

export default ProfileRoute;
