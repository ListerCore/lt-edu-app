import type { JSX } from 'react';
import { ChevronLeft, ChevronRight, Filter, Loader2, PlusCircle, Search, Sparkles } from 'lucide-react';
import type { DashboardTableProps } from '../types';
import { DashboardTableRow } from './dashboard-table-row';

export const DashboardTable = ({ events, pagination, isLoading, searchTerm, selectedCategory, selectedStatus, onSearchChange, onCategoryChange, onStatusChange, onPageChange, onNextPage, onPrevPage, onOpenCreateModal }: DashboardTableProps): JSX.Element => {
  const startItem = pagination.totalItems === 0 ? 0 : (pagination.currentPage - 1) * pagination.itemsPerPage + 1;
  const endItem = Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems);

  return (
    <div className="w-full rounded-2xl border border-[#2E3545]/80 bg-[#141B2D]/80 backdrop-blur-xl shadow-xl overflow-hidden flex flex-col">
      <div className="p-5 md:p-6 border-b border-[#2E3545]/60 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-[#191F2F]/40">
        <div className="relative flex-1 max-w-lg">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#908FA0]">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por actividad académica, código, docente o aula..."
            className="w-full rounded-xl border border-[#2E3545] bg-[#0C1322] pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#908FA0] focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#908FA0]" />
            <span className="text-xs font-medium text-[#908FA0] uppercase tracking-wider">Categoría:</span>
            <select value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)} className="rounded-lg border border-[#2E3545] bg-[#0C1322] px-3 py-2 text-xs font-medium text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer">
              <option value="TODAS">Todas las categorías</option>
              <option value="MATRICULA">Matrícula</option>
              <option value="EVALUACION">Evaluación</option>
              <option value="TALLER_NIVELACION">Taller de Nivelación</option>
              <option value="CONFERENCIA_DOCENTE">Jornada Docente</option>
              <option value="CAPACITACION">Capacitación</option>
              <option value="GRADUACION">Graduación</option>
              <option value="MODULO_ACADEMICO">Módulo Formativo</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#908FA0] uppercase tracking-wider">Estado:</span>
            <select value={selectedStatus} onChange={(e) => onStatusChange(e.target.value)} className="rounded-lg border border-[#2E3545] bg-[#0C1322] px-3 py-2 text-xs font-medium text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer">
              <option value="TODOS">Todos los estados</option>
              <option value="ACTIVO">Activo</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="FINALIZADO">Finalizado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#2E3545] bg-[#0C1322]/60 text-xs font-semibold uppercase tracking-wider text-[#908FA0]">
              <th scope="col" className="py-3.5 px-4 md:px-6">
                Código / Actividad Académica
              </th>
              <th scope="col" className="py-3.5 px-4">
                Categoría
              </th>
              <th scope="col" className="py-3.5 px-4">
                Fecha & Aula / Lugar
              </th>
              <th scope="col" className="py-3.5 px-4">
                Ocupación / Vacantes
              </th>
              <th scope="col" className="py-3.5 px-4">
                Estado
              </th>
              <th scope="col" className="py-3.5 px-4 text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2E3545]/40 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-[#908FA0]">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
                    <p className="text-sm font-medium">Cargando actividades del sistema...</p>
                  </div>
                </td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-[#908FA0]">
                  <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
                    <div className="h-12 w-12 rounded-full bg-zinc-800/80 flex items-center justify-center text-zinc-400">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <p className="text-base font-semibold text-white">No se encontraron actividades</p>
                    <p className="text-xs text-[#908FA0]">No hay registros que coincidan con los criterios de búsqueda actuales.</p>
                    <button type="button" onClick={onOpenCreateModal} className="mt-2 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-all cursor-pointer">
                      <PlusCircle className="h-4 w-4" />
                      Crear nueva actividad
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              events.map((event) => <DashboardTableRow key={event.id} event={event} />)
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 md:px-6 border-t border-[#2E3545]/60 bg-[#0C1322]/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-[#908FA0]">
        <div>
          Mostrando <strong className="text-white">{startItem}</strong> - <strong className="text-white">{endItem}</strong> de <strong className="text-white">{pagination.totalItems}</strong> actividades registradas
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button type="button" disabled={!pagination.hasPrevPage || isLoading} onClick={onPrevPage} className="inline-flex items-center gap-1 rounded-lg border border-[#2E3545] bg-[#141B2D] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#191F2F] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer">
            <ChevronLeft className="h-4 w-4" />
            <span>Anterior</span>
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`h-7 w-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${pageNum === pagination.currentPage ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'border border-[#2E3545] bg-[#0C1322] text-[#908FA0] hover:text-white hover:border-indigo-500/50'}`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button type="button" disabled={!pagination.hasNextPage || isLoading} onClick={onNextPage} className="inline-flex items-center gap-1 rounded-lg border border-[#2E3545] bg-[#141B2D] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#191F2F] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer">
            <span>Siguiente</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
