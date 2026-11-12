'use client';

import { useMemo } from 'react';
import { dashboardNavigation, resolveLabel } from '../data/dashboard-navigation';
import type { ResolvedItem, ResolvedSection } from '../types';
import { useWorkspace } from './use-workspace';

// Sidebar tree for the current workspace: leaves without permission drop out, parents with no leaves left drop out,
// parents with one leaf collapse into it, empty sections drop out, and labels take the institution and management
// type's wording
export const useDashboardNavigation = (): ResolvedSection[] => {
  const { institutionType, management, can } = useWorkspace();

  return useMemo(
    () =>
      dashboardNavigation
        .map((section) => ({
          label: section.label,
          items: section.items
            .map((item): ResolvedItem | null => {
              if (item.children) {
                const children = item.children.filter((leaf) => can(leaf.module)).map((leaf) => ({ label: resolveLabel(leaf.label, institutionType, management), href: leaf.href, icon: leaf.icon }));
                if (children.length === 0) return null;
                // A group left with a single leaf for this type and role becomes that leaf, so no folder holds just one link
                if (children.length === 1) return { label: children[0].label, icon: children[0].icon, href: children[0].href, children: [] };
                return { label: resolveLabel(item.label, institutionType, management), icon: item.icon, children };
              }
              return item.module && item.href && can(item.module) ? { label: resolveLabel(item.label, institutionType, management), icon: item.icon, href: item.href, children: [] } : null;
            })
            .filter((item): item is ResolvedItem => item !== null),
        }))
        .filter((section) => section.items.length > 0),
    [institutionType, management, can],
  );
};
