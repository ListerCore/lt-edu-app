'use client';

import type { JSX } from 'react';
import { institutionTypeLabels, roleLabels } from '../data/permissions';
import { useWorkspace } from '../hooks/use-workspace';

// Dashboard landing placeholder: greets the simulated user in their institution
export const DashboardHome = (): JSX.Element => {
  const { userName, role, institutionName, institutionType } = useWorkspace();
  return (
    <section className="px-6 py-10 md:px-10">
      <p className="pill bg-brand-soft text-brand">
        {institutionTypeLabels[institutionType]} · {roleLabels[role]}
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
        Hola, <span className="text-gradient">{userName.split(' ')[0]}</span>
      </h1>
      <p className="mt-2 text-muted-foreground">{institutionName}. Usa el menú lateral para entrar a los módulos de tu rol.</p>
    </section>
  );
};
