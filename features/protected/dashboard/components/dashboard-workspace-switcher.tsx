'use client';

import type { JSX } from 'react';
import { ChevronsUpDown, School } from 'lucide';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MorphIcon } from '@/components/ui/morph-icon';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { institutionTypeLabels, roleLabels } from '../data/permissions';
import { useWorkspace } from '../hooks/use-workspace';
import type { InstitutionType, Role } from '../types';

const institutionTypes = Object.keys(institutionTypeLabels) as InstitutionType[];
const roles = Object.keys(roleLabels) as Role[];

// Demo switcher: institution type and role decide the modules and permissions shown in the sidebar
export const DashboardWorkspaceSwitcher = (): JSX.Element => {
  const { institutionType, role, institutionName, setInstitutionType, setRole } = useWorkspace();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton size="lg" tooltip={institutionName} className="gap-3 border border-sidebar-border bg-background data-popup-open:bg-sidebar-accent" />}>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-brand-soft text-brand">
              <MorphIcon icon={School} size={16} />
            </span>
            <span className="grid flex-1 text-left leading-tight">
              <span className="truncate text-sm font-semibold text-foreground">{institutionName}</span>
              <span className="truncate text-[11px] text-muted-foreground">
                {institutionTypeLabels[institutionType]} · {roleLabels[role]}
              </span>
            </span>
            <MorphIcon icon={ChevronsUpDown} size={14} className="text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" sideOffset={6} className="w-64">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Tipo de institución</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={institutionType} onValueChange={(value): void => setInstitutionType(value as InstitutionType)}>
                {institutionTypes.map((type): JSX.Element => (
                  <DropdownMenuRadioItem key={type} value={type}>
                    {institutionTypeLabels[type]}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Rol</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={role} onValueChange={(value): void => setRole(value as Role)}>
                {roles.map((item): JSX.Element => (
                  <DropdownMenuRadioItem key={item} value={item}>
                    {roleLabels[item]}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
