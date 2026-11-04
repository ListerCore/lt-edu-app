'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense, type JSX } from 'react';
import { BrandMark } from '@/components/layout/brand-mark';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from '@/components/ui/sidebar';
import { siteConfig } from '@/lib/site';
import { DASHBOARD_PATH } from '../data/dashboard-navigation';
import { useWorkspace } from '../hooks/use-workspace';
import { DashboardSidebarNav } from './dashboard-sidebar-nav';

const ActiveSidebarNav = (): JSX.Element => <DashboardSidebarNav pathname={usePathname()} />;

// Dashboard sidebar: brand with the institution name and the permission-filtered two-level tree (icons when collapsed, sheet on mobile)
export const DashboardSidebar = (): JSX.Element => {
  const { institutionName } = useWorkspace();
  return (
    <Sidebar collapsible="icon" className="border-r-0!">
      <SidebarHeader className="pb-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip={siteConfig.name} className="gap-3 hover:bg-transparent active:bg-transparent" render={<Link href={DASHBOARD_PATH} />}>
              <BrandMark className="size-8 shrink-0" />
              <span className="grid flex-1 text-left leading-tight">
                <span className="truncate text-base font-light tracking-tight text-foreground">{siteConfig.name.toLowerCase()}</span>
                <span className="truncate text-[11px] text-muted-foreground">{institutionName}</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <Suspense fallback={<DashboardSidebarNav pathname={null} />}>
          <ActiveSidebarNav />
        </Suspense>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
};
