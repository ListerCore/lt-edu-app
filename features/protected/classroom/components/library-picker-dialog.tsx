'use client';

import type { JSX } from 'react';
import { Plus, Search } from 'lucide';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { SelectField, controlClassName } from '@/features/protected/academic/components/academic-ui';
import { itemKinds, libraryKinds } from '../data/classroom-data';
import { useAddFromLibrary } from '../hooks/use-add-from-library';
import { useLibraryPage } from '../hooks/use-library-page';
import type { LibraryPickerProps } from '../types';

// Pick library entries to add to a unit; each one is added unpublished so the teacher reviews it first
export const LibraryPickerDialog = ({ unitId, onClose, onAdded }: LibraryPickerProps): JSX.Element => {
  const page = useLibraryPage();
  const { add, addingId } = useAddFromLibrary(onAdded);
  const kindOptions = [{ value: '', label: 'Todos los tipos' }, ...libraryKinds.map((k) => ({ value: k, label: itemKinds[k].label }))];
  return (
    <Dialog open onOpenChange={(open): void => (open ? undefined : onClose())}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Agregar desde la biblioteca</DialogTitle>
          <DialogDescription>Los recursos se agregan sin publicar. Si alguien edita el recurso en la biblioteca, se actualiza en todas las aulas.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap gap-2">
          <label className="relative min-w-0 flex-1 basis-56">
            <span className="sr-only">Buscar en la biblioteca</span>
            <MorphIcon icon={Search} size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
            <Input value={page.query} onChange={(e): void => page.setQuery(e.target.value)} placeholder="Buscar por título o tema" className={`${controlClassName} pl-9`} />
          </label>
          <div className="w-full sm:w-44">
            <SelectField id="picker-kind" value={page.kind} options={kindOptions} onChange={page.setKind} />
          </div>
        </div>
        <ul className="max-h-[50vh] divide-y divide-border overflow-y-auto">
          {page.isLoading ? (
            <li className="py-6 text-center text-sm text-muted-foreground">Cargando…</li>
          ) : page.filtered.length === 0 ? (
            <li className="py-6 text-center text-sm text-muted-foreground">No hay recursos con esa búsqueda.</li>
          ) : (
            page.filtered.map((l) => {
              const meta = itemKinds[l.kind];
              return (
                <li key={l.id} className="flex items-center gap-3 py-3">
                  {meta && (
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-brand-soft text-brand" aria-hidden="true">
                      <MorphIcon icon={meta.icon} size={15} />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{l.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {meta?.label}
                      {l.topic && ` · ${l.topic}`}
                      {l.uses > 0 && ` · en ${l.uses} ${l.uses === 1 ? 'aula' : 'aulas'}`}
                    </p>
                  </div>
                  <button type="button" className="btn-alt h-8 px-3 text-xs" disabled={addingId !== null} onClick={(): void => add(unitId, l)}>
                    <MorphIcon icon={Plus} size={14} />
                    {addingId === l.id ? 'Agregando…' : 'Agregar'}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </DialogContent>
    </Dialog>
  );
};
