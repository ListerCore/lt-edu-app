import type { JSX } from 'react';
import { Download } from 'lucide-react';
import type { CertificatesTableProps } from '../types';

export const CertificatesTable = ({ records }: CertificatesTableProps): JSX.Element => {
  return (
    <div className="w-full rounded-2xl border border-[#22334F] bg-[#141B2D]/80 backdrop-blur-xl shadow-xl overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#22334F] bg-[#0B1528]/60 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              <th scope="col" className="py-3.5 px-4 md:px-6">
                Documento Oficial
              </th>
              <th scope="col" className="py-3.5 px-4">
                Periodo / Grado
              </th>
              <th scope="col" className="py-3.5 px-4">
                Aprobados
              </th>
              <th scope="col" className="py-3.5 px-4">
                Firmante / Registro SIAGIE
              </th>
              <th scope="col" className="py-3.5 px-4 text-right">
                Descargar
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#22334F]/40 text-sm">
            {records.map((rec) => (
              <tr key={rec.id} className="hover:bg-[#191F2F]/60 transition-colors">
                <td className="py-4 px-4 md:px-6">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-xs font-bold text-emerald-400">{rec.actaNumber}</span>
                    <span className="font-semibold text-white">{rec.title}</span>
                    <span className="text-xs text-[#94A3B8]">Tipo: {rec.type}</span>
                  </div>
                </td>

                <td className="py-4 px-4 whitespace-nowrap text-xs">
                  <div className="flex flex-col">
                    <span className="text-white font-medium">{rec.cycleGrade}</span>
                    <span className="text-[#94A3B8]">Periodo {rec.period}</span>
                  </div>
                </td>

                <td className="py-4 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-xs font-bold text-emerald-400">{rec.approvedCount} aprobados</span>
                </td>

                <td className="py-4 px-4 text-xs text-[#94A3B8]">
                  <div className="flex flex-col">
                    <span className="text-white">{rec.signerName}</span>
                    <span className="font-mono text-[11px] text-emerald-400/80">{rec.siagieCode}</span>
                  </div>
                </td>

                <td className="py-4 px-4 text-right whitespace-nowrap">
                  <button type="button" onClick={() => alert(`Descargando documento oficial: ${rec.actaNumber}`)} className="inline-flex items-center gap-1.5 rounded-lg border border-[#22334F] bg-[#0B1528] px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600 hover:border-emerald-500 transition-all cursor-pointer">
                    <Download className="h-3.5 w-3.5 text-emerald-400" />
                    <span>PDF Oficial</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
