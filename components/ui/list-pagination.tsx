'use client';

import type { JSX } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PAGE_SIZES, type Pagination } from '@/lib/api/list';
import { cn } from '@/lib/utils';

interface ListPaginationProps {
  pagination: Pagination;
  onPage: (page: number) => void;
  onPageSize: (size: number) => void;
  // Plural noun for the range text ("estudiantes", "registros")
  noun?: string;
  className?: string;
}

// First, last, and the pages around the current one; gaps become an ellipsis
const pageWindow = (current: number, total: number): Array<number | 'gap'> => {
  const pages = new Set([1, total, current - 1, current, current + 1].filter((page) => page >= 1 && page <= total));
  const sorted = [...pages].sort((a, b) => a - b);
  return sorted.flatMap((page, index) => (index > 0 && page - sorted[index - 1] > 1 ? ['gap' as const, page] : [page]));
};

const sizeItems = PAGE_SIZES.map((size) => ({ value: String(size), label: String(size) }));

// Footer of a paged list: rows per page and range on the left, page numbers on the right (all from the API's meta)
export const ListPagination = ({ pagination, onPage, onPageSize, noun = 'registros', className }: ListPaginationProps): JSX.Element => {
  const { current_page: page, total_pages: pages, page_size: size, total_items: total, has_prev_page: hasPrev, has_next_page: hasNext } = pagination;
  const from = total === 0 ? 0 : (page - 1) * size + 1;
  const to = Math.min(total, page * size);
  const buttonClassName = 'flex h-8 min-w-8 items-center justify-center rounded-lg px-2 font-mono text-xs tabular-nums transition-colors disabled:pointer-events-none disabled:opacity-40';

  return (
    <nav aria-label="Paginación" className={cn('flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between', className)}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-2">
          Filas
          <Select items={sizeItems} value={String(size)} onValueChange={(value): void => onPageSize(Number(value))}>
            <SelectTrigger size="sm" aria-label="Filas por página" className="h-8 w-[4.5rem] rounded-lg bg-background font-mono text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sizeItems.map((item): JSX.Element => (
                <SelectItem key={item.value} value={item.value} className="font-mono text-xs">
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </span>
        <span aria-live="polite" className="tabular-nums">
          {from}–{to} de {total} {noun}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button type="button" aria-label="Página anterior" disabled={!hasPrev} onClick={(): void => onPage(page - 1)} className={cn(buttonClassName, 'hover:bg-accent hover:text-foreground')}>
          <MorphIcon icon={ChevronLeft} size={16} />
        </button>
        {pageWindow(page, pages).map((entry, index): JSX.Element =>
          entry === 'gap' ? (
            <span key={`gap-${index}`} aria-hidden="true" className="px-1">
              …
            </span>
          ) : (
            <button key={entry} type="button" aria-label={`Página ${entry}`} aria-current={entry === page ? 'page' : undefined} onClick={(): void => onPage(entry)} className={cn(buttonClassName, entry === page ? 'bg-brand-solid font-semibold text-white' : 'hover:bg-accent hover:text-foreground')}>
              {entry}
            </button>
          ),
        )}
        <button type="button" aria-label="Página siguiente" disabled={!hasNext} onClick={(): void => onPage(page + 1)} className={cn(buttonClassName, 'hover:bg-accent hover:text-foreground')}>
          <MorphIcon icon={ChevronRight} size={16} />
        </button>
      </div>
    </nav>
  );
};
