import type { JSX } from 'react';
import { Plus, Activity, CalendarCheck, Users, GraduationCap } from 'lucide-react';
import type { DashboardHeaderProps } from '../types';

export const DashboardHeader = ({ title, subtitle, onOpenCreateModal, stats }: DashboardHeaderProps): JSX.Element => {
  return (
    <header className="relative w-full rounded-2xl border border-[#22334F] bg-linear-to-b from-[#16233B]/90 to-[#0D1C2E]/90 p-6 md:p-8 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              SISTEMA ACADÉMICO ACTIVO
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-[#2D4163] bg-[#132036] px-2.5 py-0.5 text-xs font-mono text-[#94A3B8]">CEBA LISTER v2.6.4</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-emerald-400 inline-block" />
            {title}
          </h1>
          <p className="text-sm md:text-base text-[#94A3B8] max-w-2xl font-medium">{subtitle}</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="group relative inline-flex items-center justify-center gap-2.5 rounded-xl bg-linear-to-r from-emerald-600 via-emerald-500 to-teal-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 transition-all duration-300 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-[#0B1528] cursor-pointer"
          >
            <Plus className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
            <span>Crear evento</span>
          </button>
        </div>
      </div>

      <div className="relative z-10 mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-6 border-t border-[#22334F]/60">
        <div className="flex items-center gap-3.5 rounded-xl bg-[#0B1528]/70 border border-[#22334F]/50 p-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CalendarCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Total Actividades</p>
            <p className="text-xl font-bold text-white tracking-tight">{stats.totalEvents}</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-xl bg-[#0B1528]/70 border border-[#22334F]/50 p-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Actividades Activas</p>
            <p className="text-xl font-bold text-teal-400 tracking-tight">{stats.activeEvents}</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-xl bg-[#0B1528]/70 border border-[#22334F]/50 p-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Estudiantes Registrados</p>
            <p className="text-xl font-bold text-white tracking-tight">{stats.totalAttendees.toLocaleString('es-ES')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-xl bg-[#0B1528]/70 border border-[#22334F]/50 p-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <span className="text-base font-bold">%</span>
          </div>
          <div>
            <p className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider">Tasa Asistencia / Aforo</p>
            <p className="text-xl font-bold text-indigo-300 tracking-tight">{stats.averageOccupancyRate}%</p>
          </div>
        </div>
      </div>
    </header>
  );
};
