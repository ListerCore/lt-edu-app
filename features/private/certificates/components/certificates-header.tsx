import type { JSX } from 'react';
import { Award, ShieldCheck } from 'lucide-react';
import type { CertificatesHeaderProps } from '../types';

export const CertificatesHeader = ({ totalActas, totalCertificates }: CertificatesHeaderProps): JSX.Element => {
  return (
    <div className="relative w-full rounded-2xl border border-[#22334F] bg-linear-to-b from-[#16233B]/90 to-[#0D1C2E]/90 p-6 md:p-8 backdrop-blur-xl shadow-xl overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#22334F]/60">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                Firma Digital y Código QR MINEDU
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">Actas Oficiales & Certificados EBA</h1>
            <p className="text-xs md:text-sm text-[#94A3B8]">Emisión, verificación y custodia digital de documentos oficiales de graduación</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-6">
        <div className="rounded-xl border border-[#22334F]/60 bg-[#0B1528]/80 p-4">
          <span className="text-xs text-[#94A3B8] uppercase block">Actas Consolidadas Registradas</span>
          <strong className="text-2xl font-bold text-white mt-1 block">{totalActas} actas oficiales</strong>
        </div>

        <div className="rounded-xl border border-[#22334F]/60 bg-[#0B1528]/80 p-4">
          <span className="text-xs text-[#94A3B8] uppercase block">Certificados y Módulos Emitidos</span>
          <strong className="text-2xl font-bold text-emerald-400 mt-1 block">{totalCertificates} documentos</strong>
        </div>
      </div>
    </div>
  );
};
