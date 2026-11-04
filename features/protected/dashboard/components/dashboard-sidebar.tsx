'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense, type JSX } from 'react';
import { LogOut } from 'lucide';
import { BrandMark } from '@/components/layout/brand-mark';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from '@/components/ui/sidebar';
import { siteConfig } from '@/lib/site';
import { DASHBOARD_PATH } from '../data/dashboard-navigation';
import { roleLabels } from '../data/permissions';
import { useWorkspace } from '../hooks/use-workspace';
import { DashboardSidebarNav } from './dashboard-sidebar-nav';
import { DashboardWorkspaceSwitcher } from './dashboard-workspace-switcher';

const ActiveSidebarNav = (): JSX.Element => <DashboardSidebarNav pathname={usePathname()} />;

// Signed-in user (simulated) and sign out
const SidebarUser = (): JSX.Element => {
  const { userName, role } = useWorkspace();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" tooltip="Cerrar sesión" className="gap-3" render={<Link href="/auth/signin" />}>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-brand">
            {userName
              .split(' ')
              .map((part) => part[0])
              .join('')
              .slice(0, 2)}
          </span>
          <span className="grid flex-1 text-left leading-tight">
            <span className="truncate text-sm font-medium text-foreground">{userName}</span>
            <span className="truncate text-[11px] text-muted-foreground">{roleLabels[role]}</span>
          </span>
          <MorphIcon icon={LogOut} size={16} className="text-muted-foreground" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

// Dashboard sidebar: brand, institution/role switcher, permission-filtered two-level tree and the user (icons when collapsed, sheet on mobile)
export const DashboardSidebar = (): JSX.Element => (
  <Sidebar collapsible="icon" className="border-r-0!">
    <SidebarHeader className="gap-3 pb-1">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" tooltip={siteConfig.name} className="gap-3 hover:bg-transparent active:bg-transparent" render={<Link href={DASHBOARD_PATH} />}>
            <BrandMark className="size-8 shrink-0" />
            <span className="grid flex-1 text-left leading-tight">
              <span className="truncate text-base font-light tracking-tight text-foreground">{siteConfig.name.toLowerCase()}</span>
              <span className="truncate text-[11px] text-muted-foreground">{siteConfig.tagline}</span>
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <DashboardWorkspaceSwitcher />
    </SidebarHeader>

    <SidebarContent>
      <Suspense fallback={<DashboardSidebarNav pathname={null} />}>
        <ActiveSidebarNav />
      </Suspense>
    </SidebarContent>

    <SidebarFooter>
      <SidebarUser />
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
);
