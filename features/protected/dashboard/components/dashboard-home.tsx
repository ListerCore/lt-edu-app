'use client';

import type { JSX } from 'react';
import { useDashboardHome } from '../hooks/use-dashboard-home';
import { DashboardHomeActivity } from './dashboard-home-activity';
import { DashboardHomeAnnouncements } from './dashboard-home-announcements';
import { DashboardHomeShortcuts } from './dashboard-home-shortcuts';

// Dashboard landing: greeting, quick access to the role's modules, latest announcements and recent activity
export const DashboardHome = (): JSX.Element => {
  const home = useDashboardHome();

  return (
    <section aria-labelledby="home-title" className="mx-auto w-full max-w-6xl px-4 py-8 md:px-10 md:py-10">
      <header>
        <p className="pill bg-brand-soft text-brand">
          {home.institutionTypeLabel} · {home.roleLabel}
        </p>
        <h1 id="home-title" className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
          Hola, <span className="text-gradient">{home.firstName}</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          {home.institutionName}
          {/* The date only exists in the browser, so the prerendered shell never shows a stale day */}
          {home.todayLabel && <span> · {home.todayLabel}</span>}
        </p>
      </header>

      <div className="mt-10 flex flex-col gap-10">
        <DashboardHomeShortcuts shortcuts={home.shortcuts} />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          {home.showAnnouncements && <DashboardHomeAnnouncements announcements={home.announcements} isLoading={home.isLoadingAnnouncements} />}
          <DashboardHomeActivity notifications={home.notifications} isLoading={home.isLoadingNotifications} unreadCount={home.unreadCount} now={home.now} isRead={home.isRead} onOpen={home.markRead} />
        </div>
      </div>
    </section>
  );
};
