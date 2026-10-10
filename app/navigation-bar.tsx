'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Award, CheckSquare, FileText, GraduationCap, LayoutDashboard, LogIn, Users } from 'lucide-react';

export const NavigationBar = (): JSX.Element => {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/enrollment', label: 'Matrícula', icon: FileText },
    { href: '/students', label: 'Estudiantes', icon: Users },
    { href: '/evaluations', label: 'Evaluación CNEB', icon: CheckSquare },
    { href: '/certificates', label: 'Actas y Certificados', icon: Award },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-[#22334F] bg-[#0B1528]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/20 transition-all">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-white text-sm sm:text-base tracking-tight leading-tight">CEBA Joseph Lister</span>
            <span className="text-[11px] font-mono text-emerald-400">Sistema Institucional EBA</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/');

            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${isActive ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'text-[#94A3B8] hover:bg-[#132036] hover:text-white border border-transparent'}`}>
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="flex items-center gap-2 rounded-xl border border-[#2D4163] bg-[#132036] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#1A2942] hover:border-emerald-500/40 transition-all">
            <LogIn className="h-4 w-4 text-emerald-400" />
            <span className="hidden sm:inline">Acceso</span>
          </Link>
        </div>
      </div>

      <div className="flex md:hidden overflow-x-auto px-4 py-2 border-t border-[#22334F]/40 gap-2 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/');

          return (
            <Link key={item.href} href={item.href} className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${isActive ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'text-[#94A3B8] hover:text-white'}`}>
              <Icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
