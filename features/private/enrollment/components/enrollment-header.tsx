import type { JSX } from 'react';
import { CheckCircle, FileText, ShieldAlert } from 'lucide-react';
import type { EnrollmentHeaderProps } from '../types';

export const EnrollmentHeader = ({ title, subtitle }: EnrollmentHeaderProps): JSX.Element => {
  return (
    <div className="relative w-full rounded-2xl border border-[#22334F] bg-linear-to-b from-[#16233B]/90 to-[#0D1C2E]/90 p-6 md:p-8 backdrop-blur-xl shadow-xl overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                <CheckCircle className="h-3.5 w-3.5" />
                SIAGIE 3.0 Conectado
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">{title}</h1>
            <p className="text-xs md:text-sm text-[#94A3B8]">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-[#0B1528] border border-[#22334F] p-3 text-xs text-[#94A3B8]">
          <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
          <span>Ficha oficial según Resolución Viceministerial N° 084-2019-MINEDU</span>
        </div>
      </div>
    </div>
  );
};
