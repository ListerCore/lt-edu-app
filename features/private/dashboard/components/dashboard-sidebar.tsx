'use client';

import { useState, type JSX } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Award, CheckSquare, ChevronLeft, ChevronRight, FileText, GraduationCap, LayoutDashboard, LogIn, ShieldCheck, Users, X } from 'lucide-react';
import type { DashboardSidebarProps } from '../types';

export const DashboardSidebar = ({ totalEvents = 0, activeEvents = 0, isOpenMobile = false, onCloseMobile }: DashboardSidebarProps): JSX.Element => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const navSections = [
    {
      title: 'Principal',
      items: [
        {
          href: '/dashboard',
          label: 'Dashboard (Inicio)',
          shortLabel: 'Inicio',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'Gestión Escolar',
      items: [
        {
          href: '/enrollment',
          label: 'Matrícula & Fichas',
          shortLabel: 'Matrícula',
          icon: FileText,
        },
        {
          href: '/students',
          label: 'Estudiantes & Nóminas',
          shortLabel: 'Estudiantes',
          icon: Users,
        },
      ],
    },
    {
      title: 'Pedagógico',
      items: [
        {
          href: '/evaluations',
          label: 'Evaluación CNEB',
          shortLabel: 'Evaluación',
          icon: CheckSquare,
        },
      ],
    },
    {
      title: 'Administración & MINEDU',
      items: [
        {
          href: '/certificates',
          label: 'Actas & Certificados',
          shortLabel: 'Certificados',
          icon: Award,
        },
      ],
    },
    {
      title: 'Sistema',
      items: [
        {
          href: '/login',
          label: 'Acceso Institucional',
          shortLabel: 'Acceso',
          icon: LogIn,
        },
      ],
    },
  ];

  return (
    <>
      {isOpenMobile && <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden" onClick={onCloseMobile} />}

      <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[#22334F] bg-[#0B1528] transition-all duration-300 lg:static lg:z-10 ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${isCollapsed ? 'lg:w-20' : 'lg:w-68'} w-72 h-screen shrink-0`}>
        <div className="flex h-16 items-center justify-between border-b border-[#22334F] px-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
              <GraduationCap className="h-6 w-6" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="truncate text-sm font-bold text-white tracking-tight">CEBA Joseph Lister</span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-[#94A3B8]">UGEL 03 • DRELM</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg border border-[#22334F] bg-[#141B2D] text-[#94A3B8] hover:border-emerald-500/50 hover:text-white transition-all cursor-pointer"
              title={isCollapsed ? 'Expandir panel lateral' : 'Colapsar panel lateral'}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
            {onCloseMobile && (
              <button type="button" onClick={onCloseMobile} className="flex lg:hidden h-8 w-8 items-center justify-center rounded-lg text-[#94A3B8] hover:bg-white/10 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {!isCollapsed && (
          <div className="border-b border-[#22334F]/60 bg-[#070E1D]/50 px-4 py-2.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#94A3B8]">
                CÓD. MODULAR: <strong className="font-mono text-white">0648923</strong>
              </span>
              <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">Activo EBA</span>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              {!isCollapsed && <div className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">{section.title}</div>}
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    title={item.label}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${isActive ? 'border border-emerald-500/40 bg-emerald-500/15 text-emerald-400 shadow-sm' : 'border border-transparent text-[#94A3B8] hover:border-[#22334F] hover:bg-[#141B2D] hover:text-white'}`}
                  >
                    <IconComponent className={`h-4 w-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-[#94A3B8]'}`} />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}

          {!isCollapsed && (
            <div className="rounded-xl border border-[#22334F]/80 bg-[#141B2D]/60 p-3 text-xs space-y-1.5">
              <span className="text-[11px] font-semibold text-[#94A3B8] uppercase block">Resumen Actividades</span>
              <div className="flex justify-between items-center text-white">
                <span>Total Registrados:</span>
                <strong className="font-bold text-emerald-400">{totalEvents}</strong>
              </div>
              <div className="flex justify-between items-center text-white">
                <span>En Ejecución:</span>
                <strong className="font-bold text-teal-300">{activeEvents}</strong>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-[#22334F] bg-[#070E1D]/60 p-3">
          <div className="flex items-center gap-2.5 rounded-xl border border-[#22334F] bg-[#141B2D]/80 p-2.5">
            <div className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 truncate">
                <p className="truncate text-[11px] font-bold text-white">SIAGIE 3.0 Sync</p>
                <p className="truncate text-[10px] text-emerald-400">Enlace Seguro v2.4</p>
              </div>
            )}
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          </div>
        </div>
      </aside>
    </>
  );
};
