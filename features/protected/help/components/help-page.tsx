'use client';

import Link from 'next/link';
import type { JSX } from 'react';
import { ArrowRight } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AcademicPage } from '@/features/protected/academic/components/academic-ui';
import { DASHBOARD_PATH } from '@/features/protected/dashboard/data/dashboard-navigation';
import { useWorkspace } from '@/features/protected/dashboard/hooks/use-workspace';
import type { Role } from '@/features/protected/dashboard/types';
import { guides, type Guide } from '../data/guides';

const GuideSteps = ({ guide }: { guide: Guide }): JSX.Element => (
  <ol className="space-y-3">
    {guide.steps.map((s, i) => (
      <li key={s.title} className="flex gap-4 rounded-2xl border border-border bg-background p-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-brand tabular-nums">{i + 1}</span>
        <span className="min-w-0 flex-1">
          <span className="block font-medium text-foreground">{s.title}</span>
          <span className="mt-0.5 block text-sm text-muted-foreground">{s.text}</span>
        </span>
        {s.href && (
          <Link href={`${DASHBOARD_PATH}/${s.href}`} className="btn-alt h-8 shrink-0 self-center px-3 text-xs">
            Ir
            <MorphIcon icon={ArrowRight} size={14} />
          </Link>
        )}
      </li>
    ))}
  </ol>
);

// Guías breves por rol (phase E9): the steps of the viewer's role first, the other roles below
export const HelpPage = (): JSX.Element => {
  const { role } = useWorkspace();
  const mine = guides[role];
  const others = (Object.entries(guides) as Array<[Role, Guide]>).filter(([r]) => r !== role);
  return (
    <AcademicPage titleId="help-title" title="Guía rápida" description={mine ? mine.intro : 'Los primeros pasos de cada rol en el panel.'} context={null}>
      <div className="space-y-8">
        {mine && (
          <section aria-labelledby="help-mine" className="space-y-3">
            <h2 id="help-mine" className="text-lg font-semibold text-foreground">
              {mine.title}
            </h2>
            <GuideSteps guide={mine} />
          </section>
        )}
        <section aria-labelledby="help-others" className="space-y-2">
          <h2 id="help-others" className="text-sm font-semibold text-foreground">
            Otros roles
          </h2>
          {others.map(([r, g]) => (
            <details key={r} className="rounded-2xl border border-border bg-background px-4 py-3">
              <summary className="cursor-pointer font-medium text-foreground">{g.title}</summary>
              <p className="mt-2 mb-3 text-sm text-muted-foreground">{g.intro}</p>
              <GuideSteps guide={g} />
            </details>
          ))}
        </section>
      </div>
    </AcademicPage>
  );
};
