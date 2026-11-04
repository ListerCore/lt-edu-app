'use client';

import { Suspense, type JSX } from 'react';
import { ThemeSwitcher } from '@/components/layout/theme-switcher';
import { UserMenu } from '@/components/layout/user-menu';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardWorkspaceSelects } from './dashboard-workspace-selects';

// Top bar of the panel: sidebar toggle, then institution type, role, theme and the account menu on the right
// The account menu reads the pathname, so it streams inside Suspense on routes with runtime params
export const DashboardHeader = (): JSX.Element => (
  <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/85 px-4 backdrop-blur-md">
    <SidebarTrigger className="-ml-1" />
    <Separator orientation="vertical" className="mr-2 h-4" />
    <span className="hidden text-sm font-medium text-muted-foreground sm:inline">Panel</span>
    <div className="ml-auto flex items-center gap-2.5">
      <DashboardWorkspaceSelects />
      <ThemeSwitcher className="hidden sm:flex" />
      <Suspense fallback={<span aria-hidden="true" className="size-9 rounded-full bg-surface" />}>
        <UserMenu />
      </Suspense>
    </div>
  </header>
);
