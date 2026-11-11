'use client';

import type { JSX, ReactNode } from 'react';
import { Check, Eye, LoaderCircle, Trash2 } from 'lucide';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { AcademicContext } from '../types';

export const controlClassName = 'h-10 w-full rounded-lg bg-background';

interface AcademicPageProps {
  titleId: string;
  title: string;
  description: string;
  // Only canManage is required: pages outside the academic structure pass just that
  context: (Partial<AcademicContext> & { canManage: boolean }) | null;
  actions?: ReactNode;
  back?: ReactNode;
  // Full width for modules with wide grids and tables (timetables, reports, grades, attendance, payments)
  wide?: boolean;
  children: ReactNode;
}

// Shell of every academic page: title, which institution it is, the page actions and a notice for read-only roles
export const AcademicPage = ({ titleId, title, description, context, actions, back, wide, children }: AcademicPageProps): JSX.Element => (
  <section aria-labelledby={titleId} className={cn('mx-auto w-full px-4 py-8 md:px-8 md:py-10', wide ? 'max-w-none' : 'max-w-6xl')}>
    {back}
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {context?.institutionName && <p className="text-sm font-medium text-brand">{context.institutionName}</p>}
        <h1 id={titleId} className="mt-1 text-2xl font-semibold tracking-tight text-balance text-foreground md:text-3xl">
          {title}
        </h1>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {context?.canManage && actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
    {context && !context.canManage && (
      <p className="mt-6 flex items-center gap-2 rounded-lg bg-secondary px-4 py-3 text-sm text-muted-foreground">
        <MorphIcon icon={Eye} size={16} />
        Solo lectura: los cambios los hace dirección o coordinación académica.
      </p>
    )}
    <div className="mt-8">{children}</div>
  </section>
);

export const PageSkeleton = (): JSX.Element => (
  <div className="space-y-4" aria-busy="true" aria-label="Cargando">
    <Skeleton className="h-28 w-full rounded-xl" />
    <Skeleton className="h-48 w-full rounded-xl" />
    <Skeleton className="h-48 w-full rounded-xl" />
  </div>
);

export const LoadError = ({ message, onRetry }: { message: string; onRetry: () => void }): JSX.Element => (
  <div role="alert" className="rounded-xl border border-border p-8 text-center">
    <p className="font-medium text-foreground">No se pudo cargar</p>
    <p className="mt-1 text-sm text-muted-foreground">{message}</p>
    <button type="button" onClick={onRetry} className="btn-alt mt-5">
      Reintentar
    </button>
  </div>
);

interface SelectFieldProps {
  id: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
  invalid?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export const SelectField = ({ id, value, options, onChange, invalid, disabled, placeholder }: SelectFieldProps): JSX.Element => (
  <Select items={options} value={options.some((option) => option.value === value) ? value : null} onValueChange={(next): void => onChange(String(next ?? ''))} disabled={disabled}>
    <SelectTrigger id={id} aria-invalid={invalid} className={controlClassName}>
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent>
      {options.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

interface ChipsProps {
  label: string;
  options: Array<{ value: string; label: string; hint?: string }>;
  selected: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
  invalid?: boolean;
}

// Multiple choice as toggle chips (shifts, forms of attention, grades)
export const ChoiceChips = ({ label, options, selected, onChange, disabled, invalid }: ChipsProps): JSX.Element => (
  <div role="group" aria-label={label} className={cn('flex flex-wrap gap-2', invalid && 'rounded-lg ring-2 ring-destructive/30 ring-offset-2 ring-offset-background')}>
    {options.map((option) => {
      const on = selected.includes(option.value);
      return (
        <button
          key={option.value}
          type="button"
          aria-pressed={on}
          title={option.hint}
          disabled={disabled}
          onClick={(): void => onChange(on ? selected.filter((value) => value !== option.value) : [...selected, option.value])}
          className={cn('inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors disabled:opacity-60', on ? 'border-brand bg-brand-soft text-brand' : 'border-border text-foreground hover:border-brand/50')}
        >
          {on && <MorphIcon icon={Check} size={14} strokeWidth={2.5} />}
          {option.label}
        </button>
      );
    })}
  </div>
);

interface ConfirmDeleteProps {
  title: string;
  description: string;
  onConfirm: () => void;
  isPending?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  label?: string;
  compact?: boolean;
}

// Delete button guarded by a confirmation; disabled with its reason when the row is still in use
export const ConfirmDelete = ({ title, description, onConfirm, isPending, disabled, disabledReason, label = 'Eliminar', compact }: ConfirmDeleteProps): JSX.Element => (
  <AlertDialog>
    <AlertDialogTrigger
      render={
        <button
          type="button"
          disabled={disabled || isPending}
          title={disabled ? disabledReason : label}
          aria-label={compact ? `${label}: ${title}` : undefined}
          className={cn(compact ? 'inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground' : 'btn-alt text-destructive')}
        />
      }
    >
      <MorphIcon icon={isPending ? LoaderCircle : Trash2} size={compact ? 15 : 16} className={isPending ? 'animate-spin' : ''} />
      {!compact && label}
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction variant="destructive" onClick={onConfirm}>
          {label}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export const StatusPill = ({ className, children }: { className: string; children: ReactNode }): JSX.Element => <span className={cn('pill', className)}>{children}</span>;
