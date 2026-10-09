import type { JSX } from 'react';
import { Plus, Activity, CalendarCheck, Users, GraduationCap } from 'lucide-react';
import type { DashboardHeaderProps } from '../types';

export const DashboardHeader = ({ title, subtitle, onOpenCreateModal, stats }: DashboardHeaderProps): JSX.Element => {
  return (
    <header className="relative w-full rounded-2xl border border-[#2E3545]/80 bg-linear-to-b from-[#191F2F]/90 to-[#141B2D]/90 p-6 md:p-8 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              SISTEMA ACADÉMICO ACTIVO
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-[#464554] bg-[#1E2538] px-2.5 py-0.5 text-xs font-mono text-[#C7C4D7]">CEBA LISTER v2.6.4</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-indigo-400 inline-block" />
            {title}
          </h1>
          <p className="text-sm md:text-base text-[#908FA0] max-w-2xl font-medium">{subtitle}</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="group relative inline-flex items-center justify-center gap-2.5 rounded-xl bg-linear-to-r from-indigo-600 via-indigo-500 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition-all duration-300 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#0C1322] cursor-pointer"
          >
            <Plus className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
            <span>Crear evento</span>
          </button>
        </div>
      </div>

      <div className="relative z-10 mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-6 border-t border-[#2E3545]/60">
        <div className="flex items-center gap-3.5 rounded-xl bg-[#0F1626]/70 border border-[#2E3545]/50 p-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <CalendarCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-[#908FA0] uppercase tracking-wider">Total Actividades</p>
            <p className="text-xl font-bold text-white tracking-tight">{stats.totalEvents}</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-xl bg-[#0F1626]/70 border border-[#2E3545]/50 p-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-[#908FA0] uppercase tracking-wider">Actividades Activas</p>
            <p className="text-xl font-bold text-emerald-400 tracking-tight">{stats.activeEvents}</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-xl bg-[#0F1626]/70 border border-[#2E3545]/50 p-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-[#908FA0] uppercase tracking-wider">Estudiantes Registrados</p>
            <p className="text-xl font-bold text-white tracking-tight">{stats.totalAttendees.toLocaleString('es-ES')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-xl bg-[#0F1626]/70 border border-[#2E3545]/50 p-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <span className="text-base font-bold">%</span>
          </div>
          <div>
            <p className="text-xs font-medium text-[#908FA0] uppercase tracking-wider">Tasa Asistencia / Aforo</p>
            <p className="text-xl font-bold text-purple-300 tracking-tight">{stats.averageOccupancyRate}%</p>
          </div>
        </div>
      </div>
    </header>
  );
};
