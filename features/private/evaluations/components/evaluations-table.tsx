import type { JSX } from 'react';
import { AlertCircle, Filter, Loader2, Search } from 'lucide-react';
import type { EvaluationsTableProps, GradeLevel } from '../types';

export const EvaluationsTable = ({ records, isLoading, searchTerm, selectedGrade, onSearchChange, onGradeChange, onUpdateScore }: EvaluationsTableProps): JSX.Element => {
  const gradeOptions: GradeLevel[] = ['AD', 'A', 'B', 'C'];

  return (
    <div className="w-full rounded-2xl border border-[#22334F] bg-[#141B2D]/80 backdrop-blur-xl shadow-xl overflow-hidden flex flex-col">
      <div className="p-5 md:p-6 border-b border-[#22334F]/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#191F2F]/40">
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#94A3B8]">
            <Search className="h-4 w-4" />
          </div>
          <input type="text" value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} placeholder="Buscar estudiante o DNI..." className="w-full rounded-xl border border-[#22334F] bg-[#0B1528] pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#94A3B8] focus:border-emerald-500 focus:outline-none" />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#94A3B8]" />
          <select value={selectedGrade} onChange={(e) => onGradeChange(e.target.value)} className="rounded-lg border border-[#22334F] bg-[#0B1528] px-3 py-2 text-xs font-medium text-white focus:border-emerald-500 focus:outline-none cursor-pointer">
            <option value="TODOS">Todos los Grados</option>
            <option value="Avanzado 4°">Avanzado 4°</option>
            <option value="Avanzado 3°">Avanzado 3°</option>
            <option value="Avanzado 2°">Avanzado 2°</option>
            <option value="Avanzado 1°">Avanzado 1°</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#22334F] bg-[#0B1528]/60 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              <th scope="col" className="py-3.5 px-4 md:px-6">
                Estudiante
              </th>
              <th scope="col" className="py-3.5 px-3 text-center">
                C1: Oral
              </th>
              <th scope="col" className="py-3.5 px-3 text-center">
                C2: Lee
              </th>
              <th scope="col" className="py-3.5 px-3 text-center">
                C3: Escribe
              </th>
              <th scope="col" className="py-3.5 px-3 text-center">
                Nivel Logro
              </th>
              <th scope="col" className="py-3.5 px-4">
                Conclusión Descriptiva CNEB
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#22334F]/40 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-[#94A3B8]">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-emerald-400 mb-2" />
                  <span>Cargando evaluaciones...</span>
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-[#94A3B8]">
                  <span>No hay registros para mostrar.</span>
                </td>
              </tr>
            ) : (
              records.map((r) => (
                <tr key={r.id} className="hover:bg-[#191F2F]/60 transition-colors">
                  <td className="py-4 px-4 md:px-6">
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">{r.studentName}</span>
                      <span className="text-xs text-[#94A3B8]">
                        DNI {r.studentDni} • {r.cycleGrade}
                      </span>
                    </div>
                  </td>

                  {(['competency1', 'competency2', 'competency3'] as const).map((comp) => (
                    <td key={comp} className="py-4 px-3 text-center">
                      <select
                        value={r[comp]}
                        onChange={(e) => onUpdateScore(r.id, comp, e.target.value as GradeLevel)}
                        className={`rounded-lg px-2 py-1 text-xs font-bold border ${
                          r[comp] === 'AD' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : r[comp] === 'A' ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' : r[comp] === 'B' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                        }`}
                      >
                        {gradeOptions.map((g) => (
                          <option key={g} value={g} className="bg-[#0B1528] text-white">
                            {g}
                          </option>
                        ))}
                      </select>
                    </td>
                  ))}

                  <td className="py-4 px-3 text-center whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold ${r.finalScore === 'AD' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : r.finalScore === 'C' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'}`}>
                      {r.finalScore}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-xs text-[#94A3B8]">
                    <div className="flex items-center gap-2">
                      {r.isPedagogicalRisk && <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />}
                      <span className={r.isPedagogicalRisk ? 'text-rose-300 font-medium' : ''}>{r.descriptiveConclusion}</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
