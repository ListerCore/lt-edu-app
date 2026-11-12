'use client';

import { useRef, type JSX } from 'react';
import { CloudUpload, LoaderCircle, Upload, X } from 'lucide';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFileDrop } from '@/hooks/use-file-drop';
import { cn } from '@/lib/utils';
import { ATTACHMENT_ACCEPT, ATTACHMENT_TYPES_HINT, fileKindMeta } from '../data/attachments-data';
import type { AttachmentUploaderProps } from '../types';

const noop = (): void => undefined;

// Drop zone + picker for several files, then the staged list with one category and an optional title for the
// whole upload. Hands raw files and values to the panel hook; it validates and uploads
export const AttachmentUploader = ({ variant, inputId, staged, stageError, categories, category, title, isUploading, canSubmit, remaining, onAdd, onUnstage, onClear, onCategory, onTitle, onSubmit }: AttachmentUploaderProps): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isDragging, dropHandlers } = useFileDrop(noop, onAdd);
  const compact = variant === 'compact';
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        disabled={isUploading}
        onClick={(): void => inputRef.current?.click()}
        {...dropHandlers}
        aria-describedby={stageError ? errorId : `${inputId}-hint`}
        className={cn('flex items-center gap-3 rounded-xl border-2 border-dashed text-left transition-colors disabled:opacity-60', compact ? 'px-3 py-3' : 'flex-col justify-center px-4 py-6 text-center', isDragging ? 'border-brand bg-brand-soft' : stageError ? 'border-destructive/60' : 'border-border hover:border-brand hover:bg-surface')}
      >
        <span className={cn('flex shrink-0 items-center justify-center rounded-full transition-colors', compact ? 'size-8' : 'size-10', isDragging ? 'bg-brand-solid text-white' : 'bg-brand-soft text-brand')}>
          <MorphIcon icon={CloudUpload} size={compact ? 15 : 18} />
        </span>
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground">{isDragging ? 'Suelta los archivos aquí' : compact ? 'Adjuntar archivos' : 'Arrastra archivos o haz clic para elegirlos'}</span>
          <span id={`${inputId}-hint`} className="text-xs text-muted-foreground">
            {ATTACHMENT_TYPES_HINT} · quedan {remaining}
          </span>
        </span>
      </button>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        multiple
        accept={ATTACHMENT_ACCEPT}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event): void => {
          const picked = Array.from(event.target.files ?? []);
          if (picked.length > 0) onAdd(picked);
          // Allows picking the same file again after removing it
          event.target.value = '';
        }}
      />

      {staged.length > 0 && (
        <div className="flex flex-col gap-3 rounded-xl bg-surface p-3">
          <ul aria-label="Archivos por subir" className="flex flex-col gap-1.5">
            {staged.map((item): JSX.Element => {
              const meta = fileKindMeta[item.fileKind];
              return (
                <li key={item.key} className="flex items-center gap-2.5 rounded-lg bg-background px-2.5 py-1.5 text-sm">
                  <span className={cn('flex size-7 shrink-0 items-center justify-center rounded-md', meta.className)} aria-hidden="true">
                    <MorphIcon icon={meta.icon} size={14} />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-foreground" title={item.file.name}>
                    {item.file.name}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground tabular-nums">{item.sizeLabel}</span>
                  <button type="button" disabled={isUploading} onClick={(): void => onUnstage(item.key)} aria-label={`Quitar ${item.file.name}`} className="flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-destructive">
                    <MorphIcon icon={X} size={12} />
                  </button>
                </li>
              );
            })}
          </ul>

          <div className={cn('grid gap-2', !compact && 'sm:grid-cols-2')}>
            <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
              Categoría
              <Select items={categories} value={category} onValueChange={(value): void => onCategory(value ?? '')}>
                <SelectTrigger className="h-9 w-full rounded-lg bg-background" aria-label="Categoría de los archivos">
                  <SelectValue placeholder="Elige una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((option): JSX.Element => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
              <span>
                Título <span className="font-normal">· opcional</span>
              </span>
              <Input
                value={title}
                maxLength={160}
                placeholder="Ej. DNI del estudiante"
                disabled={isUploading}
                onChange={(event): void => onTitle(event.target.value)}
                // Enter uploads instead of submitting the edit dialog the panel may sit in
                onKeyDown={(event): void => {
                  if (event.key !== 'Enter') return;
                  event.preventDefault();
                  if (canSubmit) onSubmit();
                }}
                className="h-9 rounded-lg bg-background"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <button type="button" disabled={isUploading} onClick={onClear} className="btn-alt h-9 px-4">
              Cancelar
            </button>
            <button type="button" disabled={!canSubmit} onClick={onSubmit} className="btn-brand h-9 px-4">
              <MorphIcon icon={isUploading ? LoaderCircle : Upload} size={15} className={isUploading ? 'animate-spin' : ''} />
              {isUploading ? 'Subiendo…' : staged.length === 1 ? 'Subir archivo' : `Subir ${staged.length} archivos`}
            </button>
          </div>
        </div>
      )}

      {stageError && (
        <p id={errorId} role="alert" className="text-xs text-destructive">
          {stageError}
        </p>
      )}
    </div>
  );
};
