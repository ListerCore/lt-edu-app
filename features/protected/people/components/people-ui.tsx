'use client';

import type { JSX } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { cn } from '@/lib/utils';

interface PagerProps {
  page: number;
  pageSize: number;
  total: number;
  noun: string;
  onPage: (page: number) => void;
}

// "26–50 de 599 estudiantes" with previous and next
export const Pager = ({ page, pageSize, total, noun, onPage }: PagerProps): JSX.Element | null => {
  if (total === 0) return null;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  const button = 'inline-flex size-9 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:hover:bg-transparent';
  return (
    <div className="flex items-center justify-between gap-4 pt-4 text-sm text-muted-foreground">
      <span className="tabular-nums">
        {from}–{to} de {total} {noun}
      </span>
      <div className="flex items-center gap-2">
        <button type="button" className={button} disabled={page <= 1} onClick={(): void => onPage(page - 1)} aria-label="Página anterior">
          <MorphIcon icon={ChevronLeft} size={16} />
        </button>
        <span className="tabular-nums">
          {page} / {pages}
        </span>
        <button type="button" className={button} disabled={page >= pages} onClick={(): void => onPage(page + 1)} aria-label="Página siguiente">
          <MorphIcon icon={ChevronRight} size={16} />
        </button>
      </div>
    </div>
  );
};

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
  autoFocus?: boolean;
}

export const SearchBox = ({ value, onChange, placeholder, className, autoFocus }: SearchBoxProps): JSX.Element => (
  <label className={cn('relative block', className)}>
    <span className="sr-only">{placeholder}</span>
    <MorphIcon icon={Search} size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
    <Input type="search" value={value} autoFocus={autoFocus} placeholder={placeholder} maxLength={80} onChange={(e): void => onChange(e.target.value)} className="h-10 w-full rounded-lg bg-background pl-9" />
  </label>
);
