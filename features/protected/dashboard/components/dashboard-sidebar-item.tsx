'use client';

import Link from 'next/link';
import { useState, type JSX } from 'react';
import { ChevronRight } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import type { SidebarNavItemProps } from '../types';

// Muted icons; the active link in brand color
const itemClassName = cn('h-8 gap-2.5 px-2 text-sidebar-foreground/80 transition-colors [&_svg]:text-sidebar-foreground/55 hover:[&_svg]:text-sidebar-foreground', 'data-active:bg-brand-soft data-active:font-medium data-active:text-brand data-active:hover:bg-brand-soft data-active:hover:text-brand data-active:[&_svg]:text-brand');

// First-level entry: a direct link, or a folding parent whose leaves hang from a guide line (second and last level)
export const DashboardSidebarItem = ({ item, isActive }: SidebarNavItemProps): JSX.Element => {
  const { state, isMobile } = useSidebar();
  const hasActiveChild = item.children.some(({ href }) => isActive(href));
  const [open, setOpen] = useState(hasActiveChild);

  if (item.href) {
    const active = isActive(item.href);
    return (
      <SidebarMenuItem>
        <SidebarMenuButton isActive={active} tooltip={item.label} className={itemClassName} render={<Link href={item.href} aria-current={active ? 'page' : undefined} />}>
          <MorphIcon icon={item.icon} />
          <span>{item.label}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  // Collapsed to icons there is no row to fold, so the leaves always show; the branch with the current page stays open
  const expanded = open || hasActiveChild || (state === 'collapsed' && !isMobile);
  const id = `sidebar-${item.label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton aria-expanded={expanded} aria-controls={id} onClick={(): void => setOpen(!open)} tooltip={item.label} className={cn(itemClassName, 'group-data-[collapsible=icon]:hidden!', hasActiveChild && 'font-medium text-sidebar-foreground')}>
        <MorphIcon icon={item.icon} />
        <span className="flex-1 truncate">{item.label}</span>
        <MorphIcon icon={ChevronRight} size={14} className={cn('transition-transform duration-200', expanded && 'rotate-90')} />
      </SidebarMenuButton>
      <div id={id} inert={!expanded} className={cn('grid transition-[grid-template-rows] duration-200 ease-out', expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
        <ul className={cn('ml-[15px] flex min-h-0 min-w-0 flex-col gap-0.5 border-l border-sidebar-border py-0.5 pl-2 group-data-[collapsible=icon]:ml-0 group-data-[collapsible=icon]:border-l-0 group-data-[collapsible=icon]:pl-0', !expanded && 'overflow-hidden')}>
          {item.children.map((leaf): JSX.Element => {
            const active = isActive(leaf.href);
            return (
              <SidebarMenuItem key={leaf.href}>
                {active && <span aria-hidden="true" className="absolute inset-y-1 -left-[9px] w-0.5 rounded-full bg-brand group-data-[collapsible=icon]:hidden" />}
                <SidebarMenuButton isActive={active} tooltip={leaf.label} className={itemClassName} render={<Link href={leaf.href} aria-current={active ? 'page' : undefined} />}>
                  <MorphIcon icon={leaf.icon} />
                  <span>{leaf.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </ul>
      </div>
    </SidebarMenuItem>
  );
};
