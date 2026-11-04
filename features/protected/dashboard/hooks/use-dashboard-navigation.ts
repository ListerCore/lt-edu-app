'use client';

import { useMemo } from 'react';
import { dashboardNavigation, resolveLabel } from '../data/dashboard-navigation';
import type { ResolvedItem, ResolvedSection } from '../types';
import { useWorkspace } from './use-workspace';

// Sidebar tree for the current workspace: leaves without permission drop out, parents with no leaves left
// drop out, empty sections drop out, and labels take the institution type's wording
export const useDashboardNavigation = (): ResolvedSection[] => {
  const { institutionType, can } = useWorkspace();

  return useMemo(
    () =>
      dashboardNavigation
        .map((section) => ({
          label: section.label,
          items: section.items
            .map((item): ResolvedItem | null => {
              if (item.children) {
                const children = item.children.filter((leaf) => can(leaf.module)).map((leaf) => ({ label: resolveLabel(leaf.label, institutionType), href: leaf.href, icon: leaf.icon }));
                return children.length > 0 ? { label: resolveLabel(item.label, institutionType), icon: item.icon, children } : null;
              }
              return item.module && item.href && can(item.module) ? { label: resolveLabel(item.label, institutionType), icon: item.icon, href: item.href, children: [] } : null;
            })
            .filter((item): item is ResolvedItem => item !== null),
        }))
        .filter((section) => section.items.length > 0),
    [institutionType, can],
  );
};
