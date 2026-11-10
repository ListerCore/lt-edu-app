'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { JSX } from 'react';
import { House, LayoutDashboard, LogOut, UserRound } from 'lucide';
import { sileo } from 'sileo';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MorphIcon } from '@/components/ui/morph-icon';
import { signOutAction } from '@/features/auth/actions/auth-actions';
import { endSession } from '@/features/auth/hooks/use-session';
import { accountPhotoKey } from '@/features/protected/account/data/account-data';
import { useCardholderPhotos } from '@/features/protected/cards/hooks/use-cardholder-photos';
import { UserAvatar } from '@/features/protected/dashboard/components/user-avatar';
import { ACCOUNT_PATH, DASHBOARD_PATH } from '@/features/protected/dashboard/data/dashboard-navigation';
import { useWorkspace } from '@/features/protected/dashboard/hooks/use-workspace';

// Avatar (photo or initials) with the account menu; from the public site it leads to the panel, from the panel to the site
export const UserMenu = (): JSX.Element => {
  const router = useRouter();
  const pathname = usePathname();
  const { userName, avatarUrl: demoAvatarUrl, roleLabel, institutionName, institutionType, role } = useWorkspace();
  // The photo uploaded in Mi cuenta (or Carnets, same photo) wins over the demo one
  const photos = useCardholderPhotos();
  const avatarUrl = photos[accountPhotoKey(institutionType, role)] ?? demoAvatarUrl;
  const inPanel = pathname.startsWith(DASHBOARD_PATH);

  const onSignOut = async (): Promise<void> => {
    await signOutAction();
    endSession();
    sileo.success({ title: 'Sesión cerrada', description: 'Vuelve cuando quieras desde Ingresar.' });
    router.push('/');
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={`Cuenta de ${userName}`} className="flex items-center gap-2.5 rounded-full p-0.5 pr-1 ring-offset-2 ring-offset-background transition-shadow outline-none hover:ring-2 hover:ring-brand/40 focus-visible:ring-2 focus-visible:ring-brand data-popup-open:ring-2 data-popup-open:ring-brand">
        <UserAvatar name={userName} avatarUrl={avatarUrl} className="size-8" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-3 py-2">
            <UserAvatar name={userName} avatarUrl={avatarUrl} className="size-10" />
            <span className="grid min-w-0 leading-tight">
              <span className="truncate text-sm font-semibold text-foreground">{userName}</span>
              <span className="mt-1 w-fit pill bg-brand-soft px-2 text-[11px] text-brand">{roleLabel}</span>
              <span className="mt-1 truncate text-xs font-normal text-muted-foreground">{institutionName}</span>
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {inPanel ? (
            <DropdownMenuItem render={<Link href="/" />}>
              <MorphIcon icon={House} />
              Ir al inicio
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem render={<Link href={DASHBOARD_PATH} />}>
              <MorphIcon icon={LayoutDashboard} />
              Ir al panel
            </DropdownMenuItem>
          )}
          <DropdownMenuItem render={<Link href={ACCOUNT_PATH} />}>
            <MorphIcon icon={UserRound} />
            Ver cuenta
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={onSignOut}>
          <MorphIcon icon={LogOut} />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
