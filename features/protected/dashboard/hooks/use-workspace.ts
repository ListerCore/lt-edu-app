'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { canAccess, canSeeTab, demoAvatarUrls, demoInstitutionNames, demoUserNames, institutionRoles, institutionTypeLabels, roleLabel } from '../data/permissions';
import type { InstitutionType, ModuleKey, PermissionAction, Role, UseWorkspaceResult, Workspace } from '../types';
import type { TabPage } from '../data/permissions';

const STORAGE_KEY = 'joseph-workspace';
const DEFAULT_WORKSPACE: Workspace = { institutionType: 'EBR', role: 'director' };

let cached: Workspace | null = null;
const listeners = new Set<() => void>();

// Valid only when the role exists in that institution type
const isWorkspace = (value: unknown): value is Workspace => {
  const candidate = value as Partial<Workspace> | null;
  return Boolean(candidate?.institutionType && candidate.role && candidate.institutionType in institutionRoles && institutionRoles[candidate.institutionType].includes(candidate.role));
};

// Simulated session in localStorage; a module-level cache keeps the snapshot stable between renders
const read = (): Workspace => {
  if (cached) return cached;
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    cached = isWorkspace(parsed) ? parsed : DEFAULT_WORKSPACE;
  } catch {
    cached = DEFAULT_WORKSPACE;
  }
  return cached;
};

const write = (next: Workspace): void => {
  cached = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Blocked storage: the choice lasts until the page reloads
  }
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

// Current institution type + role (simulated until joseph-api provides the session) and the permission check
export const useWorkspace = (): UseWorkspaceResult => {
  const workspace = useSyncExternalStore(subscribe, read, () => DEFAULT_WORKSPACE);

  // Changing the type keeps the role when that type has it; otherwise falls back to the type's first role
  const setInstitutionType = useCallback((institutionType: InstitutionType): void => {
    const roles = institutionRoles[institutionType];
    const { role } = read();
    write({ institutionType, role: roles.includes(role) ? role : roles[0] });
  }, []);

  const setRole = useCallback((role: Role): void => {
    const current = read();
    if (institutionRoles[current.institutionType].includes(role)) write({ ...current, role });
  }, []);

  const can = useCallback((module: ModuleKey, action: PermissionAction = 'view'): boolean => canAccess(workspace.institutionType, workspace.role, module, action), [workspace]);

  const canTab = useCallback((page: TabPage, tab: string): boolean => canSeeTab(workspace.role, page, tab), [workspace]);

  return {
    ...workspace,
    institutionName: demoInstitutionNames[workspace.institutionType],
    institutionTypeLabel: institutionTypeLabels[workspace.institutionType],
    userName: demoUserNames[workspace.role],
    avatarUrl: demoAvatarUrls[workspace.role] ?? null,
    roleLabel: roleLabel(workspace.role, workspace.institutionType),
    availableRoles: institutionRoles[workspace.institutionType],
    setInstitutionType,
    setRole,
    can,
    canTab,
  };
};
