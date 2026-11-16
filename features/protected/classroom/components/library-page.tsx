'use client';

import { useState, type JSX } from 'react';
import { Pencil, Plus, Search } from 'lucide';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AcademicPage, ConfirmDelete, LoadError, PageSkeleton, SelectField, controlClassName } from '@/features/protected/academic/components/academic-ui';
import { AttachmentsButton } from '@/features/protected/attachments/components/attachments-button';
import { itemKinds, libraryKinds, materialCategories } from '../data/classroom-data';
import { useDeleteLibraryItem } from '../hooks/use-delete-library-item';
import { useLibraryPage } from '../hooks/use-library-page';
import type { LibraryItem } from '../types';
import { LibraryDialog } from './library-dialog';

// Biblioteca: reusable readings, files, videos and links of the institution; any teacher adds them to a unit
export const LibraryPage = (): JSX.Element => {
  const page = useLibraryPage();
  const [editing, setEditing] = useState<LibraryItem | 'new' | null>(null);
  const del = useDeleteLibraryItem(page.reload);
  const canEdit = page.data?.canEdit ?? false;
  const kindOptions = [{ value: '', label: 'Todos los tipos' }, ...libraryKinds.map((k) => ({ value: k, label: itemKinds[k].label }))];

  return (
    <AcademicPage
      titleId="library-title"
      title="Biblioteca"
      description="Material digital y recursos educativos reutilizables. Se agregan a cualquier unidad desde el aula y se actualizan en todas a la vez."
      context={canEdit ? { canManage: true } : null}
      actions={
        <button type="button" className="btn-brand" onClick={(): void => setEditing('new')}>
          <MorphIcon icon={Plus} size={16} />
          Nuevo recurso
        </button>
      }
    >
      <div className="flex flex-wrap gap-3">
        <label className="relative min-w-0 flex-1 basis-64">
          <span className="sr-only">Buscar en la biblioteca</span>
          <MorphIcon icon={Search} size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
          <Input value={page.query} onChange={(e): void => page.setQuery(e.target.value)} placeholder="Buscar por título, tema o descripción" className={`${controlClassName} pl-9`} />
        </label>
        <div className="w-full sm:w-48">
          <SelectField id="library-kind" value={page.kind} options={kindOptions} onChange={page.setKind} />
        </div>
      </div>
      <div className="mt-6">
        {page.error ? (
          <LoadError message={page.error} onRetry={page.reload} />
        ) : page.isLoading ? (
          <PageSkeleton />
        ) : page.filtered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">{page.query || page.kind ? 'Ningún recurso coincide con la búsqueda.' : 'La biblioteca está vacía. Agrega el primer recurso.'}</p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {page.filtered.map((l) => {
              const meta = itemKinds[l.kind];
              return (
                <li key={l.id} className="flex flex-col rounded-xl border border-border bg-background p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand" aria-hidden="true">
                      {meta && <MorphIcon icon={meta.icon} size={16} />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-brand">
                        {meta?.label}
                        {l.topic && ` · ${l.topic}`}
                      </p>
                      <p className="text-sm font-semibold break-words text-foreground">{l.title}</p>
                      {l.description && <p className="mt-1 text-xs leading-5 text-muted-foreground">{l.description}</p>}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
                    <span className="text-xs text-muted-foreground">{l.uses === 0 ? 'No se usa en ningún aula' : `En ${l.uses} ${l.uses === 1 ? 'aula' : 'aulas'}`}</span>
                    <div className="flex items-center gap-1">
                      {(l.kind === 'file' || l.files > 0) && <AttachmentsButton ownerKind="library_item" ownerId={l.id} title={`Archivos de ${l.title}`} categories={[...materialCategories]} readOnly={!canEdit} label={l.files > 0 ? `${l.files}` : 'Adjuntar'} />}
                      {canEdit && (
                        <>
                          <button type="button" onClick={(): void => setEditing(l)} aria-label={`Editar ${l.title}`} className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground">
                            <MorphIcon icon={Pencil} size={14} />
                          </button>
                          <ConfirmDelete
                            compact
                            title={`¿Eliminar «${l.title}»?`}
                            description="Sale de la biblioteca. No se puede deshacer."
                            disabled={l.uses > 0 || l.files > 0}
                            disabledReason="Quítalo de las aulas y elimina sus archivos primero."
                            isPending={del.deletingId === l.id}
                            onConfirm={(): void => del.remove(l.id)}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {editing && <LibraryDialog entry={editing === 'new' ? null : editing} onClose={(): void => setEditing(null)} onSaved={page.reload} />}
    </AcademicPage>
  );
};
