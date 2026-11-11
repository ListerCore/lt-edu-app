'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { JSX } from 'react';
import { House, LayoutDashboard, LogOut, Pencil, X } from 'lucide';
import { sileo } from 'sileo';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MorphIcon } from '@/components/ui/morph-icon';
import { signOutAction } from '@/features/auth/actions/auth-actions';
import { endSession } from '@/features/auth/hooks/use-session';
import { accountPhotoKey } from '@/features/protected/account/data/account-data';
import { useCardholderPhotos } from '@/features/protected/cards/hooks/use-cardholder-photos';
import { UserAvatar } from '@/features/protected/dashboard/components/user-avatar';
import { ACCOUNT_PATH, DASHBOARD_PATH } from '@/features/protected/dashboard/data/dashboard-navigation';
import { useWorkspace } from '@/features/protected/dashboard/hooks/use-workspace';
import { cn } from '@/lib/utils';
import { BrandMark } from './brand-mark';

// Avatar (photo or initials) with the account panel; from the public site it leads to the panel, from the panel to the site
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
      {/* Account panel in the manner of Google's: stacked blocks on a soft sheet, a pill to manage the account and the legal links */}
      <DropdownMenuContent align="end" sideOffset={10} className="w-[min(19rem,calc(100vw-1.5rem))] rounded-3xl bg-card p-2 shadow-xl ring-border">
        <div className="relative flex h-8 items-center justify-center px-9">
          <p className="truncate text-xs text-muted-foreground">Cuenta de {institutionName}</p>
          <DropdownMenuItem aria-label="Cerrar el menú" className="absolute right-0 size-8 justify-center rounded-full p-0 text-muted-foreground">
            <MorphIcon icon={X} size={16} />
          </DropdownMenuItem>
        </div>

        <DropdownMenuGroup className="mt-1.5 grid gap-0.5">
          <DropdownMenuLabel className="flex items-center gap-3 rounded-t-[18px] rounded-b-md bg-background px-3 py-3">
            {/* The pencil leads to Mi cuenta, where the photo is changed */}
            <span className="relative shrink-0">
              <UserAvatar name={userName} avatarUrl={avatarUrl} className="size-11 [&_[data-slot=avatar-fallback]]:text-sm" />
              <DropdownMenuItem
                render={<Link href={ACCOUNT_PATH} />}
                aria-label="Cambiar la foto en Mi cuenta"
                className="absolute -right-1.5 -bottom-1 size-5 justify-center rounded-full bg-secondary p-0 text-foreground ring-2 ring-background focus:bg-brand focus:text-brand-foreground"
              >
                <MorphIcon icon={Pencil} size={10} />
              </DropdownMenuItem>
            </span>
            <span className="grid min-w-0 leading-tight">
              <span className="truncate text-sm font-semibold text-foreground">{userName}</span>
              <span className="mt-1 w-fit pill bg-brand-soft px-2 text-[11px] text-brand">{roleLabel}</span>
            </span>
          </DropdownMenuLabel>
          {inPanel ? (
            <DropdownMenuItem render={<Link href="/" />} className={rowClass}>
              <MorphIcon icon={House} size={18} />
              Ir al inicio
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem render={<Link href={DASHBOARD_PATH} />} className={rowClass}>
              <MorphIcon icon={LayoutDashboard} size={18} />
              Ir al panel
            </DropdownMenuItem>
          )}
          <DropdownMenuItem variant="destructive" onClick={onSignOut} className={cn(rowClass, 'rounded-b-[18px] data-[variant=destructive]:focus:bg-destructive/10')}>
            <MorphIcon icon={LogOut} size={18} />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuItem render={<Link href={ACCOUNT_PATH} />} className="mt-2 h-10 justify-center gap-2.5 rounded-full bg-background px-5 text-sm font-medium text-foreground focus:bg-accent">
          <BrandMark className="size-4" />
          Gestionar tu cuenta
        </DropdownMenuItem>

        <div className="mt-2 mb-0.5 flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <DropdownMenuItem render={<Link href="/legal/privacy" />} className="rounded-md px-2 py-1 text-xs text-muted-foreground">
            Privacidad
          </DropdownMenuItem>
          <span aria-hidden="true">•</span>
          <DropdownMenuItem render={<Link href="/legal/terms" />} className="rounded-md px-2 py-1 text-xs text-muted-foreground">
            Términos
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// One row of the account block: full width on the white sheet, square inner corners like Google's stacked list
const rowClass = 'h-10 gap-3 rounded-md bg-background px-4 text-sm text-foreground focus:bg-accent';
