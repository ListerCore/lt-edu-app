import type { JSX } from 'react';
import { ChevronLeft, ChevronRight, Filter, Loader2, Search } from 'lucide-react';
import type { StudentsTableProps } from '../types';
import { StudentsRow } from './students-row';

export const StudentsTable = ({ students, pagination, isLoading, searchTerm, selectedCycle, selectedStatus, onSearchChange, onCycleChange, onStatusChange, onNextPage, onPrevPage }: StudentsTableProps): JSX.Element => {
  return (
    <div className="w-full rounded-2xl border border-[#22334F] bg-[#141B2D]/80 backdrop-blur-xl shadow-xl overflow-hidden flex flex-col">
      <div className="p-5 md:p-6 border-b border-[#22334F]/60 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-[#191F2F]/40">
        <div className="relative flex-1 max-w-lg">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#94A3B8]">
            <Search className="h-4 w-4" />
          </div>
          <input type="text" value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} placeholder="Buscar por DNI, código o apellidos del estudiante..." className="w-full rounded-xl border border-[#22334F] bg-[#0B1528] pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#94A3B8] focus:border-emerald-500 focus:outline-none" />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#94A3B8]" />
            <select value={selectedCycle} onChange={(e) => onCycleChange(e.target.value)} className="rounded-lg border border-[#22334F] bg-[#0B1528] px-3 py-2 text-xs font-medium text-white focus:border-emerald-500 focus:outline-none cursor-pointer">
              <option value="TODOS">Todos los Ciclos</option>
              <option value="INICIAL">Ciclo Inicial</option>
              <option value="INTERMEDIO">Ciclo Intermedio</option>
              <option value="AVANZADO_1">Avanzado 1°</option>
              <option value="AVANZADO_2">Avanzado 2°</option>
              <option value="AVANZADO_3">Avanzado 3°</option>
              <option value="AVANZADO_4">Avanzado 4°</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select value={selectedStatus} onChange={(e) => onStatusChange(e.target.value)} className="rounded-lg border border-[#22334F] bg-[#0B1528] px-3 py-2 text-xs font-medium text-white focus:border-emerald-500 focus:outline-none cursor-pointer">
              <option value="TODOS">Todos los Estados</option>
              <option value="MATRICULADO">Matriculado</option>
              <option value="EN_TRASLADO">En Traslado</option>
              <option value="EGRESADO">Egresado</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#22334F] bg-[#0B1528]/60 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              <th scope="col" className="py-3.5 px-4 md:px-6">
                Estudiante / Código
              </th>
              <th scope="col" className="py-3.5 px-4">
                Ciclo y Grado
              </th>
              <th scope="col" className="py-3.5 px-4">
                Modalidad & Turno
              </th>
              <th scope="col" className="py-3.5 px-4">
                Asistencia
              </th>
              <th scope="col" className="py-3.5 px-4">
                Estado Matrícula
              </th>
              <th scope="col" className="py-3.5 px-4 text-right">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#22334F]/40 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-[#94A3B8]">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-emerald-400 mb-2" />
                  <span>Cargando nómina oficial...</span>
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-[#94A3B8]">
                  <span>No se encontraron estudiantes para los filtros seleccionados.</span>
                </td>
              </tr>
            ) : (
              students.map((student) => <StudentsRow key={student.id} student={student} />)
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 md:px-6 border-t border-[#22334F]/60 bg-[#0B1528]/40 flex items-center justify-between text-xs text-[#94A3B8]">
        <div>
          Página <strong className="text-white">{pagination.currentPage}</strong> de <strong className="text-white">{pagination.totalPages}</strong>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" disabled={!pagination.hasPrevPage || isLoading} onClick={onPrevPage} className="inline-flex items-center gap-1 rounded-lg border border-[#22334F] bg-[#141B2D] px-3 py-1.5 text-xs text-white disabled:opacity-40">
            <ChevronLeft className="h-4 w-4" />
            <span>Anterior</span>
          </button>
          <button type="button" disabled={!pagination.hasNextPage || isLoading} onClick={onNextPage} className="inline-flex items-center gap-1 rounded-lg border border-[#22334F] bg-[#141B2D] px-3 py-1.5 text-xs text-white disabled:opacity-40">
            <span>Siguiente</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
