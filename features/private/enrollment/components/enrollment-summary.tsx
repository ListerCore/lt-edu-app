import type { JSX } from 'react';
import { CheckCircle2, Plus, Printer } from 'lucide-react';
import type { EnrollmentSummaryProps } from '../types';

export const EnrollmentSummary = ({ lastRecord, onNewEnrollment }: EnrollmentSummaryProps): JSX.Element | null => {
  if (!lastRecord) return null;

  return (
    <div className="rounded-2xl border border-emerald-500/40 bg-linear-to-b from-emerald-950/40 to-[#0B1528] p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#22334F]/80">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider">CÓDIGO: {lastRecord.enrollmentCode}</span>
            <h2 className="text-xl md:text-2xl font-extrabold text-white">Constancia de Matrícula Generada</h2>
            <p className="text-xs text-[#94A3B8]">Estudiante registrado oficialmente en el padrón EBA 2026</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-xl border border-[#2D4163] bg-[#132036] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1A2942] transition-all cursor-pointer">
            <Printer className="h-4 w-4 text-emerald-400" />
            <span>Imprimir Ficha</span>
          </button>
          <button type="button" onClick={onNewEnrollment} className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-all cursor-pointer">
            <Plus className="h-4 w-4" />
            <span>Nueva Matrícula</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="rounded-xl border border-[#22334F] bg-[#132036]/60 p-3.5">
          <span className="text-[#94A3B8] block mb-1">Estudiante:</span>
          <strong className="text-white text-sm font-bold block">{`${lastRecord.paternalSurname} ${lastRecord.maternalSurname}, ${lastRecord.firstNames}`}</strong>
        </div>

        <div className="rounded-xl border border-[#22334F] bg-[#132036]/60 p-3.5">
          <span className="text-[#94A3B8] block mb-1">Documento:</span>
          <strong className="text-white text-sm font-mono block">{`${lastRecord.docType}: ${lastRecord.docNumber}`}</strong>
        </div>

        <div className="rounded-xl border border-[#22334F] bg-[#132036]/60 p-3.5">
          <span className="text-[#94A3B8] block mb-1">Ciclo & Grado:</span>
          <strong className="text-emerald-400 text-sm font-bold block">{lastRecord.cycleLevel}</strong>
        </div>

        <div className="rounded-xl border border-[#22334F] bg-[#132036]/60 p-3.5">
          <span className="text-[#94A3B8] block mb-1">Modalidad / Turno:</span>
          <strong className="text-white text-sm block">{`${lastRecord.modality} / ${lastRecord.availableShift}`}</strong>
        </div>
      </div>
    </div>
  );
};
