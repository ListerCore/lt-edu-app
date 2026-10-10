import type { JSX } from 'react';
import { CheckSquare } from 'lucide-react';
import type { EvaluationsHeaderProps } from '../types';

export const EvaluationsHeader = ({ totalEvaluated, outstandingCount, riskCount }: EvaluationsHeaderProps): JSX.Element => {
  return (
    <div className="relative w-full rounded-2xl border border-[#22334F] bg-linear-to-b from-[#16233B]/90 to-[#0D1C2E]/90 p-6 md:p-8 backdrop-blur-xl shadow-xl overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#22334F]/60">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckSquare className="h-6 w-6" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">CNEB / MINEDU Acreditado</span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">Registro Auxiliar de Evaluación por Competencias</h1>
            <p className="text-xs md:text-sm text-[#94A3B8]">Calificación cualitativa (AD, A, B, C) y alertas de riesgo pedagógico CEBA Lister</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
        <div className="rounded-xl border border-[#22334F]/60 bg-[#0B1528]/80 p-4">
          <span className="text-xs text-[#94A3B8] uppercase block">Estudiantes Evaluados</span>
          <strong className="text-2xl font-bold text-white mt-1 block">{totalEvaluated} registrados</strong>
        </div>

        <div className="rounded-xl border border-[#22334F]/60 bg-[#0B1528]/80 p-4">
          <span className="text-xs text-[#94A3B8] uppercase block">Logro Destacado (AD)</span>
          <strong className="text-2xl font-bold text-emerald-400 mt-1 block">{outstandingCount} estudiantes</strong>
        </div>

        <div className="rounded-xl border border-[#22334F]/60 bg-[#0B1528]/80 p-4">
          <span className="text-xs text-[#94A3B8] uppercase block">Alumnos en Riesgo Pedagógico</span>
          <strong className="text-2xl font-bold text-rose-400 mt-1 block">{riskCount} en refuerzo</strong>
        </div>
      </div>
    </div>
  );
};
