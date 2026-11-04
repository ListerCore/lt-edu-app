'use client';

import type { JSX } from 'react';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu } from '@/components/ui/sidebar';
import { DASHBOARD_PATH } from '../data/dashboard-navigation';
import { useDashboardNavigation } from '../hooks/use-dashboard-navigation';
import type { SidebarNavProps } from '../types';
import { DashboardSidebarItem } from './dashboard-sidebar-item';

// Sections of the permission-filtered tree; pathname is null while it streams in, so nothing is marked active yet
export const DashboardSidebarNav = ({ pathname }: SidebarNavProps): JSX.Element => {
  const sections = useDashboardNavigation();
  const isActive = (href: string): boolean => (pathname === null ? false : href === DASHBOARD_PATH ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <>
      {sections.map((section): JSX.Element => (
        <SidebarGroup key={section.label} className="px-2 py-1">
          <SidebarGroupLabel className="text-[11px] tracking-wide text-sidebar-foreground/50 uppercase">{section.label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {section.items.map((item): JSX.Element => (
                <DashboardSidebarItem key={item.label} item={item} isActive={isActive} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
};
