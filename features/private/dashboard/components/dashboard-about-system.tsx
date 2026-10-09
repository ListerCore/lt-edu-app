import type { JSX } from 'react';
import { Award, BookOpen, CheckCircle, Clock, Cpu, Layers, Server, Zap } from 'lucide-react';
import type { DashboardAboutSystemProps } from '../types';

export const DashboardAboutSystem = ({ systemInfo, stats }: DashboardAboutSystemProps): JSX.Element => {
  return (
    <section className="w-full rounded-2xl border border-[#2E3545]/80 bg-linear-to-b from-[#141B2D]/90 to-[#0C1322]/95 p-6 md:p-8 backdrop-blur-xl shadow-xl overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#2E3545]/60">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Acerca del sistema</h2>
            <p className="text-xs md:text-sm text-[#908FA0]">Información de la infraestructura académica y estado del CEBA Joseph Lister</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
            <CheckCircle className="h-4 w-4" />
            Normativa EBA / MINEDU Acreditada
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col justify-between rounded-xl border border-[#2E3545]/60 bg-[#191F2F]/40 p-5 md:p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Layers className="h-4 w-4" />
              <span>Propósito y Modelo Educativo</span>
            </div>
            <p className="text-sm text-[#DCE2F7] leading-relaxed">{systemInfo.description}</p>
            <p className="text-xs text-[#908FA0] leading-relaxed">Orientado a la inclusión y culminación de estudios de jóvenes y adultos, el sistema integra la administración curricular de ciclos formativos (Inicial, Intermedio y Avanzado) con certificación modular progresiva.</p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#2E3545]/40 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[#908FA0] block">Entorno Académico:</span>
              <strong className="text-white font-medium">{systemInfo.environment}</strong>
            </div>
            <div>
              <span className="text-[#908FA0] block">Última Sincronización:</span>
              <strong className="text-white font-medium">{systemInfo.lastSync}</strong>
            </div>
            <div>
              <span className="text-[#908FA0] block">Actividades Registradas:</span>
              <strong className="text-indigo-400 font-bold">{stats.totalEvents} actividades</strong>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3.5 rounded-xl border border-[#2E3545]/60 bg-[#191F2F]/40 p-5 md:p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Server className="h-4 w-4" />
              Telemetría del Servidor
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="space-y-3 mt-2">
            <div className="flex items-center justify-between rounded-lg bg-[#0C1322]/80 border border-[#2E3545]/40 p-2.5 text-xs">
              <span className="text-[#908FA0] flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-indigo-400" />
                Disponibilidad (Uptime):
              </span>
              <strong className="text-white font-mono">{systemInfo.uptime}</strong>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-[#0C1322]/80 border border-[#2E3545]/40 p-2.5 text-xs">
              <span className="text-[#908FA0] flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                Latencia Base de Datos:
              </span>
              <strong className="text-emerald-400 font-mono">{systemInfo.databaseLatencyMs} ms</strong>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-[#0C1322]/80 border border-[#2E3545]/40 p-2.5 text-xs">
              <span className="text-[#908FA0] flex items-center gap-2">
                <Cpu className="h-3.5 w-3.5 text-purple-400" />
                Versión del Motor:
              </span>
              <strong className="text-white font-mono">{systemInfo.version}</strong>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-[#0C1322]/80 border border-[#2E3545]/40 p-2.5 text-xs">
              <span className="text-[#908FA0] flex items-center gap-2">
                <Award className="h-3.5 w-3.5 text-sky-400" />
                Estado Operativo:
              </span>
              <span className="font-bold text-emerald-400">{systemInfo.status}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
