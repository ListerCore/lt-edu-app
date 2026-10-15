import type { ReactNode } from 'react';

export interface DashboardLayoutProps {
  children: ReactNode;
}

export interface DashboardMetric {
  label: string;
  value: string;
  detail: string;
  icon: string;
  tone: 'blue' | 'green' | 'amber' | 'red';
}

export interface DashboardNotFoundProps {
  path?: string;
}

export interface DashboardNavigationProps {
  children: React.ReactNode;
}

export interface DashboardNavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface DashboardNavigationSection {
  label: string;
  items: DashboardNavigationItem[];
}

export interface DashboardPermissionsProps {
  placement: 'header' | 'footer';
}
