import type { Metadata } from 'next';
import type { JSX } from 'react';
import { AccountPage } from '@/features/protected/account/components/account-page';

export const metadata: Metadata = { title: 'Mi cuenta' };

const Page = (): JSX.Element => <AccountPage />;

export default Page;
