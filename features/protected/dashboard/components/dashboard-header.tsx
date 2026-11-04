'use client';

import type { JSX } from 'react';
import { ThemeSwitcher } from '@/components/layout/theme-switcher';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

// Top bar of the panel: sidebar toggle and theme switcher
export const DashboardHeader = (): JSX.Element => (
  <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/85 px-4 backdrop-blur-md">
    <SidebarTrigger className="-ml-1" />
    <Separator orientation="vertical" className="mr-2 h-4" />
    <span className="text-sm font-medium text-muted-foreground">Panel</span>
    <ThemeSwitcher className="ml-auto" />
  </header>
);
