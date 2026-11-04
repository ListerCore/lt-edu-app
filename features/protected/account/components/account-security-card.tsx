import Link from 'next/link';
import type { JSX } from 'react';
import { KeyRound, ShieldCheck } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { formatDate, formatDateTime } from '../data/account-data';
import type { AccountProfileProps } from '../types';

// Security status: two-step verification, last password change and last access, with the way to change the password
export const AccountSecurityCard = ({ profile }: AccountProfileProps): JSX.Element => (
  <section aria-labelledby="account-security" className="rounded-2xl border border-border bg-background p-6">
    <h2 id="account-security" className="flex items-center gap-2.5 text-base font-semibold text-foreground">
      <span className="flex size-8 items-center justify-center rounded-lg bg-success/12 text-success">
        <MorphIcon icon={ShieldCheck} size={16} />
      </span>
      Seguridad
    </h2>
    <dl className="mt-5 space-y-4 text-sm">
      <div className="flex items-center justify-between gap-3">
        <dt className="text-muted-foreground">Verificación en dos pasos</dt>
        <dd className="pill bg-success/12 text-success">{profile.security.twoFactor ? 'Activa' : 'Inactiva'}</dd>
      </div>
      <div>
        <dt className="text-xs text-muted-foreground">Contraseña</dt>
        <dd className="mt-0.5 text-foreground">Cambiada el {formatDate(profile.security.passwordUpdatedAt)}</dd>
      </div>
      <div>
        <dt className="text-xs text-muted-foreground">Último acceso</dt>
        <dd className="mt-0.5 text-foreground">{formatDateTime(profile.security.lastAccessAt)}</dd>
        <dd className="text-xs text-muted-foreground">{profile.security.lastAccessFrom}</dd>
      </div>
    </dl>
    <Link href="/auth/change-password" className="btn-alt mt-6 w-full">
      <MorphIcon icon={KeyRound} size={16} />
      Cambiar contraseña
    </Link>
  </section>
);
