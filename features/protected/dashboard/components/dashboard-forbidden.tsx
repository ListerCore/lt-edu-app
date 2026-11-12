'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { JSX } from 'react';
import { ArrowLeft, LayoutDashboard } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { RequestedPath } from '@/features/public/system/components/requested-path';
import { DASHBOARD_PATH } from '../data/dashboard-navigation';
import { useWorkspace } from '../hooks/use-workspace';
import { DashboardForbiddenIllustration } from './dashboard-forbidden-illustration';

// 403 inside the panel shell (sidebar stays available): the route exists but the current role cannot open it
export const DashboardForbidden = (): JSX.Element => {
  const router = useRouter();
  const { roleLabel } = useWorkspace();

  return (
    <section aria-labelledby="dashboard-forbidden-title" className="mx-auto flex min-h-[calc(100svh-3.5rem)] w-full max-w-2xl flex-col items-center justify-center px-4 py-12 text-center md:px-8">
      <DashboardForbiddenIllustration />

      <div className="mt-6 w-full max-w-md rounded-lg border border-border bg-surface px-3 py-2 text-left">
        <RequestedPath status={403} />
      </div>

      <h1 id="dashboard-forbidden-title" className="mt-6 text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight font-bold tracking-tight text-balance text-foreground">
        Esta aula <span className="text-gradient">está cerrada para ti.</span>
      </h1>
      <p className="mt-3 max-w-md text-base leading-7 text-muted-foreground">
        Con el rol <span className="font-medium text-foreground">{roleLabel}</span> no tienes acceso a este módulo. Cambia de rol o pide el permiso a la dirección.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href={DASHBOARD_PATH} className="btn-brand">
          <MorphIcon icon={LayoutDashboard} size={16} />
          Volver al inicio del panel
        </Link>
        <button type="button" onClick={(): void => router.back()} className="btn-alt">
          <MorphIcon icon={ArrowLeft} size={16} />
          Regresar
        </button>
      </div>
    </section>
  );
};
