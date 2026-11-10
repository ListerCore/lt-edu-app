import Link from 'next/link';
import type { JSX } from 'react';
import { KeyRound, LockKeyhole } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { GoogleIcon } from '@/features/auth/components/google-icon';
import { formatDate, formatDateTime } from '../data/account-data';
import type { AccountSecurityCardProps } from '../types';

// Password, last sign-in and the linked Google account, with the way to change the password
export const AccountSecurityCard = ({ account }: AccountSecurityCardProps): JSX.Element => (
  <section aria-labelledby="account-security" className="rounded-2xl border border-border bg-background p-6">
    <h2 id="account-security" className="flex items-center gap-2.5 text-base font-semibold text-foreground">
      <span className="flex size-8 items-center justify-center rounded-lg bg-brand-soft text-brand">
        <MorphIcon icon={LockKeyhole} size={16} />
      </span>
      Seguridad
    </h2>
    <dl className="mt-5 space-y-4 text-sm">
      <div>
        <dt className="text-xs text-muted-foreground">Contraseña</dt>
        <dd className="mt-0.5 text-foreground">{!account.hasPassword ? 'Sin contraseña (ingresas con Google)' : account.passwordChangedAt ? `Cambiada el ${formatDate(account.passwordChangedAt)}` : 'Configurada'}</dd>
      </div>
      <div>
        <dt className="text-xs text-muted-foreground">Último ingreso</dt>
        <dd className="mt-0.5 text-foreground">{account.lastSignInAt ? formatDateTime(account.lastSignInAt) : '—'}</dd>
      </div>
      <div className="flex items-center justify-between gap-3">
        <dt className="flex items-center gap-2 text-muted-foreground">
          <GoogleIcon className="size-4" />
          Google
        </dt>
        <dd className={account.googleLinked ? 'pill bg-success/12 text-success' : 'pill bg-surface text-muted-foreground'}>{account.googleLinked ? 'Vinculada' : 'No vinculada'}</dd>
      </div>
      <div>
        <dt className="text-xs text-muted-foreground">Cuenta creada</dt>
        <dd className="mt-0.5 text-foreground">{formatDate(account.createdAt)}</dd>
      </div>
    </dl>
    {account.hasPassword && (
      <Link href="/auth/change-password" className="btn-alt mt-6 w-full">
        <MorphIcon icon={KeyRound} size={16} />
        Cambiar contraseña
      </Link>
    )}
  </section>
);
