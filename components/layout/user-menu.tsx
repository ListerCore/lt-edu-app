'use client';

import { useEffect, useRef, type JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Home, LayoutDashboard, LogOut, Settings2, UserRound } from 'lucide-react';
import { setAuthSession } from '@/lib/auth-session';

interface UserMenuProps {
  className?: string;
  showRoleLabel?: boolean;
}

const UserMenu = ({ className = '', showRoleLabel = true }: UserMenuProps): JSX.Element => {
  const pathname = usePathname();
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const isDashboard = pathname.startsWith('/dashboard');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (detailsRef.current && !detailsRef.current.contains(event.target as Node)) {
        detailsRef.current.removeAttribute('open');
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const closeMenu = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    event.currentTarget.closest('details')?.removeAttribute('open');
  };

  const handleSignOut = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    closeMenu(event);
    setAuthSession(false);
  };

  return (
    <details ref={detailsRef} className={`group relative ${className}`}>
      <summary
        aria-label="Abrir menú de usuario"
        className="flex cursor-pointer list-none items-center gap-2 rounded-md px-1.5 py-1 hover:bg-muted [&::-webkit-details-marker]:hidden"
      >
        <Image
          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&h=96&q=80"
          alt=""
          width={34}
          height={34}
          unoptimized
          className="size-8.5 rounded-full border border-border object-cover"
        />
        {showRoleLabel && (
          <span className="hidden text-left sm:block">
            <span className="block text-[10px] font-bold text-card-foreground">Fernando Prado</span>
            <span className="mt-0.5 block text-[9px] text-muted-foreground">Promotor General</span>
          </span>
        )}
        <ChevronDown
          aria-hidden="true"
          className="hidden size-3.5 text-muted-foreground transition-transform group-open:rotate-180 sm:block"
        />
      </summary>

      <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-border bg-card p-1.5 shadow-lg">
        <div className="border-b border-border px-2.5 py-2 sm:hidden">
          <p className="text-xs font-semibold text-card-foreground">Fernando Prado</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">Promotor General</p>
        </div>

        {isDashboard ? (
          <Link
            href="/"
            onClick={closeMenu}
            className="flex min-h-10 items-center gap-2.5 rounded-md px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Home aria-hidden="true" className="size-4 text-muted-foreground" />
            Ir al inicio
          </Link>
        ) : (
          <Link
            href="/dashboard"
            onClick={closeMenu}
            className="flex min-h-10 items-center gap-2.5 rounded-md px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            <LayoutDashboard aria-hidden="true" className="size-4 text-muted-foreground" />
            Ir al panel
          </Link>
        )}

        <Link
          href="/profile"
          onClick={closeMenu}
          className="flex min-h-10 items-center gap-2.5 rounded-md px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          <UserRound aria-hidden="true" className="size-4 text-muted-foreground" />
          Mi perfil
        </Link>

        <Link
          href="/dashboard/settings"
          onClick={closeMenu}
          className="flex min-h-10 items-center gap-2.5 rounded-md px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Settings2 aria-hidden="true" className="size-4 text-muted-foreground" />
          Configuración
        </Link>

        <div className="my-1 border-t border-border" />

        <Link
          href="/auth/signin"
          onClick={handleSignOut}
          className="flex min-h-10 items-center gap-2.5 rounded-md px-2.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut aria-hidden="true" className="size-4" />
          Cerrar sesión
        </Link>
      </div>
    </details>
  );
};

export { UserMenu };
