import type { JSX } from 'react';
import { CheckCircle, Users } from 'lucide-react';
import type { StudentsHeaderProps } from '../types';

export const StudentsHeader = ({ totalStudents, activeCount, avgAttendance }: StudentsHeaderProps): JSX.Element => {
  return (
    <div className="relative w-full rounded-2xl border border-[#22334F] bg-linear-to-b from-[#16233B]/90 to-[#0D1C2E]/90 p-6 md:p-8 backdrop-blur-xl shadow-xl overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#22334F]/60">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                <CheckCircle className="h-3.5 w-3.5" />
                Padrón Oficial SIAGIE
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">Estudiantes y Nóminas Oficiales</h1>
            <p className="text-xs md:text-sm text-[#94A3B8]">Directorio general y control de permanencia escolar EBA CEBA Joseph Lister</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6">
        <div className="rounded-xl border border-[#22334F]/60 bg-[#0B1528]/80 p-4">
          <span className="text-xs text-[#94A3B8] uppercase block">Total Matriculados</span>
          <strong className="text-2xl font-bold text-white mt-1 block">{totalStudents} alumnos</strong>
        </div>

        <div className="rounded-xl border border-[#22334F]/60 bg-[#0B1528]/80 p-4">
          <span className="text-xs text-[#94A3B8] uppercase block">Matrículas Activas</span>
          <strong className="text-2xl font-bold text-emerald-400 mt-1 block">{activeCount} activos</strong>
        </div>

        <div className="rounded-xl border border-[#22334F]/60 bg-[#0B1528]/80 p-4 col-span-2 sm:col-span-1">
          <span className="text-xs text-[#94A3B8] uppercase block">Permanencia / Asistencia</span>
          <strong className="text-2xl font-bold text-indigo-300 mt-1 block">{avgAttendance}%</strong>
        </div>
      </div>
    </div>
  );
};
