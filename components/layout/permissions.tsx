import type { JSX } from 'react';
import Link from 'next/link';
import { ChevronDown, GraduationCap, LifeBuoy, ShieldCheck } from 'lucide-react';
import { SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import type { DashboardPermissionsProps } from '@/features/private/dashboard/types';

const Permissions = ({ placement }: DashboardPermissionsProps): JSX.Element =>
  placement === 'header' ? (
    <SidebarHeader className="group-data-[collapsible=icon]:items-center gap-3 border-b border-sidebar-border px-4 py-4 group-data-[collapsible=icon]:px-2">
      <Link href="/dashboard" aria-label="SIGE-JL, panel principal" className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
        <span className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <GraduationCap className="size-5" />
        </span>
        <span className="min-w-0 group-data-[collapsible=icon]:hidden">
          <span className="block font-heading text-sm font-extrabold tracking-tight text-sidebar-foreground">SIGE-JL</span>
          <span className="mt-0.5 block truncate text-[10px] text-muted-foreground">CEBA Virtual Ayacucho</span>
        </span>
      </Link>
      <button type="button" className="flex w-full items-center gap-3 rounded-md bg-sidebar-accent px-3 py-3 text-left text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
          <GraduationCap className="size-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[11px] font-bold">Promotor General</span>
          <span className="mt-0.5 block truncate text-[10px] text-muted-foreground">Sede Central Ayacucho</span>
        </span>
        <ChevronDown aria-hidden="true" className="size-4 text-muted-foreground" />
      </button>
    </SidebarHeader>
  ) : (
    <SidebarFooter className="border-t border-sidebar-border p-3 group-data-[collapsible=icon]:hidden">
      <div className="rounded-md bg-secondary/10 p-3">
        <p className="flex items-center gap-2 text-[10px] font-bold text-secondary">
          <ShieldCheck aria-hidden="true" className="size-3.5" />
          Homologación MINEDU
        </p>
        <p className="mt-1.5 text-[10px] leading-4 text-muted-foreground">Sistema preparado para la gestión EBA.</p>
        <Link href="/help" className="mt-3 flex h-8 items-center justify-center gap-2 rounded border border-border bg-card text-[10px] font-semibold text-foreground hover:bg-muted">
          <LifeBuoy aria-hidden="true" className="size-3.5" />
          Mesa de ayuda
        </Link>
      </div>
      <p className="px-1 text-[9px] text-muted-foreground">Versión 1.0 · Periodo 2026-II</p>
    </SidebarFooter>
  );

export { Permissions };
