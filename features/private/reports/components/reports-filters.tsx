'use client';

import type { JSX } from 'react';
import { CalendarDays, Filter, GraduationCap, MapPin, RotateCcw, Shapes } from 'lucide-react';

export interface ReportFiltersState {
  area: string;
  grade: string;
  site: string;
  period: string;
}

export const defaultReportFilters: ReportFiltersState = { area: 'all', grade: 'all', site: 'central', period: '2026-II' };

const ReportsFilters = ({ filters, onChange, onReset }: { filters: ReportFiltersState; onChange: (key: keyof ReportFiltersState, value: string) => void; onReset: () => void }): JSX.Element => {
  const activeCount = Object.entries(filters).filter(([key, value]) => value !== defaultReportFilters[key as keyof ReportFiltersState]).length;

  return (
    <section aria-labelledby="report-filters-heading" className="min-w-0 rounded-lg border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Filter aria-hidden="true" className="size-4 text-primary" />
          <h2 id="report-filters-heading" className="text-[11px] font-bold text-foreground">
            Filtros paramétricos de auditoría
          </h2>
        </div>
        <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
          <span>
            Criterios activos: <strong className="rounded bg-accent px-1.5 py-1 text-primary">{activeCount}</strong>
          </span>
          <button type="button" onClick={onReset} className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
            <RotateCcw aria-hidden="true" className="size-3" />
            Restablecer
          </button>
        </div>
      </div>
      <div className="mt-3 grid min-w-0 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
        <label className="min-w-0">
          <span className="mb-1.5 block text-[8px] font-semibold text-muted-foreground">Área curricular / campo</span>
          <span className="relative block">
            <Shapes aria-hidden="true" className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-primary" />
            <select value={filters.area} onChange={(event): void => onChange('area', event.target.value)} className="h-9 w-full min-w-0 appearance-none rounded-md border border-border bg-muted/50 pl-8 pr-2 text-[9px] text-foreground">
              <option value="all">Todos los campos EBA</option>
              <option value="matematica">Matemática y Lógica Aplicada</option>
              <option value="humanidades">Comunicación y Humanidades</option>
              <option value="dpc">Desarrollo Personal y Ciudadano</option>
              <option value="cts">Ciencia, Tecnología y Salud</option>
              <option value="ept">Educación para el Trabajo</option>
            </select>
          </span>
        </label>
        <label className="min-w-0">
          <span className="mb-1.5 block text-[8px] font-semibold text-muted-foreground">Ciclo y grado EBA</span>
          <span className="relative block">
            <GraduationCap aria-hidden="true" className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-primary" />
            <select value={filters.grade} onChange={(event): void => onChange('grade', event.target.value)} className="h-9 w-full min-w-0 appearance-none rounded-md border border-border bg-muted/50 pl-8 pr-2 text-[9px] text-foreground">
              <option value="all">Todos los ciclos y grados</option>
              <option value="Avanzado">Ciclo avanzado</option>
              <option value="4° Grado">Avanzado 4°</option>
              <option value="3° Grado">Avanzado 3°</option>
              <option value="2° Grado">Avanzado 2°</option>
              <option value="1° Grado">Avanzado 1°</option>
              <option value="Intermedio">Ciclo intermedio</option>
              <option value="Inicial">Ciclo inicial</option>
            </select>
          </span>
        </label>
        <label className="min-w-0">
          <span className="mb-1.5 block text-[8px] font-semibold text-muted-foreground">Sede y modalidad</span>
          <span className="relative block">
            <MapPin aria-hidden="true" className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-primary" />
            <select value={filters.site} onChange={(event): void => onChange('site', event.target.value)} className="h-9 w-full min-w-0 appearance-none rounded-md border border-border bg-muted/50 pl-8 pr-2 text-[9px] text-foreground">
              <option value="central">Sede Central Huamanga</option>
              <option value="distance">Soporte periférico VRAEM</option>
              <option value="intensive">Turno intensivo adultos</option>
              <option value="all">Consolidado multisede DREA</option>
            </select>
          </span>
        </label>
        <label className="min-w-0">
          <span className="mb-1.5 block text-[8px] font-semibold text-muted-foreground">Rango temporal / bimestre</span>
          <span className="relative block">
            <CalendarDays aria-hidden="true" className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-primary" />
            <select value={filters.period} onChange={(event): void => onChange('period', event.target.value)} className="h-9 w-full min-w-0 appearance-none rounded-md border border-border bg-muted/50 pl-8 pr-2 text-[9px] text-foreground">
              <option value="2026-II">Bimestre II · corte oficial</option>
              <option value="2026-I">Bimestre I · SIAGIE</option>
              <option value="annual">Anual acumulado 2026</option>
              <option value="recovery">Recuperación pedagógica</option>
            </select>
          </span>
        </label>
      </div>
    </section>
  );
};

export { ReportsFilters };
