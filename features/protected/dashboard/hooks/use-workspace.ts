'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { canAccess, demoInstitutionNames, demoUserNames, institutionModules, rolePermissions } from '../data/permissions';
import type { InstitutionType, ModuleKey, PermissionAction, Role, UseWorkspaceResult, Workspace } from '../types';

const STORAGE_KEY = 'joseph-workspace';
const DEFAULT_WORKSPACE: Workspace = { institutionType: 'EBR', role: 'director' };

let cached: Workspace | null = null;
const listeners = new Set<() => void>();

const isWorkspace = (value: unknown): value is Workspace => {
  const candidate = value as Partial<Workspace> | null;
  return Boolean(candidate && candidate.institutionType && candidate.role && candidate.institutionType in institutionModules && candidate.role in rolePermissions);
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

  const setInstitutionType = useCallback((institutionType: InstitutionType): void => write({ ...read(), institutionType }), []);
  const setRole = useCallback((role: Role): void => write({ ...read(), role }), []);
  const can = useCallback((module: ModuleKey, action: PermissionAction = 'view'): boolean => canAccess(workspace.institutionType, workspace.role, module, action), [workspace]);

  return {
    ...workspace,
    institutionName: demoInstitutionNames[workspace.institutionType],
    userName: demoUserNames[workspace.role],
    setInstitutionType,
    setRole,
    can,
  };
};
