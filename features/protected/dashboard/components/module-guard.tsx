'use client';

import type { JSX, ReactNode } from 'react';
import { useWorkspace } from '../hooks/use-workspace';
import type { ModuleKey, PermissionAction } from '../types';
import { DashboardForbidden } from './dashboard-forbidden';

interface ModuleGuardProps {
  module: ModuleKey;
  action?: PermissionAction;
  children: ReactNode;
}

// Page gate: the module renders only when the current institution type and role may perform the action on it;
// otherwise the panel's 403 takes its place inside the sidebar shell. Re-evaluates on every role or type change.
// The API still checks every call; this keeps a role from landing on a page it cannot use
export const ModuleGuard = ({ module, action = 'view', children }: ModuleGuardProps): JSX.Element => {
  const { can } = useWorkspace();
  return can(module, action) ? <>{children}</> : <DashboardForbidden />;
};
