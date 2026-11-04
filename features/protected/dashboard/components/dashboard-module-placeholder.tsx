'use client';

import { usePathname } from 'next/navigation';
import type { JSX } from 'react';
import { Construction } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { ACCOUNT_PATH, dashboardNavigation, resolveLabel } from '../data/dashboard-navigation';
import { useWorkspace } from '../hooks/use-workspace';

// Any module route without a screen yet: shows the module name from the navigation tree
export const DashboardModulePlaceholder = (): JSX.Element => {
  const pathname = usePathname();
  const { institutionType } = useWorkspace();
  const leaf = dashboardNavigation.flatMap(({ items }) => items.flatMap((item) => (item.children ? item.children : item.href ? [{ label: item.label, href: item.href }] : []))).find(({ href }) => href === pathname);

  return (
    <section className="flex flex-col items-start gap-4 px-6 py-10 md:px-10">
      <span className="icon-box bg-brand-soft text-brand">
        <MorphIcon icon={Construction} size={22} />
      </span>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">{leaf ? resolveLabel(leaf.label, institutionType) : pathname === ACCOUNT_PATH ? 'Mi cuenta' : 'Módulo'}</h1>
      <p className="text-muted-foreground">Este módulo está en construcción.</p>
    </section>
  );
};
