'use client';

import type { JSX } from 'react';
import { SearchX } from 'lucide';
import { Checkbox } from '@/components/ui/checkbox';
import { MorphIcon } from '@/components/ui/morph-icon';
import { UserAvatar } from '@/features/protected/dashboard/components/user-avatar';
import { cn } from '@/lib/utils';
import type { CardholdersListProps } from '../types';

// One page of the roster: round photo (the one the card prints), name, detail and code; multi-select for batch printing
export const CardholdersList = ({ cardholders, isFetching, selectedIds, activeId, onToggle, onToggleAll, onPreview }: CardholdersListProps): JSX.Element => {
  const allSelected = cardholders.length > 0 && cardholders.every(({ id }) => selectedIds.includes(id));

  return (
    <div aria-busy={isFetching} className="overflow-hidden rounded-xl border border-border">
      <label className="flex cursor-pointer items-center gap-3 border-b border-border bg-surface px-4 py-2.5 text-xs font-medium text-muted-foreground">
        <Checkbox checked={allSelected} onCheckedChange={(checked): void => onToggleAll(checked)} aria-label="Seleccionar esta página" />
        Seleccionar esta página
      </label>
      {cardholders.length === 0 ? (
        <p className="flex flex-col items-center gap-3 px-6 py-14 text-center text-sm text-muted-foreground">
          <MorphIcon icon={SearchX} size={24} />
          No hay resultados para tu búsqueda.
        </p>
      ) : (
        <ul className={cn('divide-y divide-border transition-opacity', isFetching && 'opacity-60')}>
          {cardholders.map((person): JSX.Element => {
            const active = person.id === activeId;
            return (
              <li key={person.id} className={cn('flex items-center gap-3 px-4 py-2.5 transition-colors', active ? 'bg-brand-soft' : 'hover:bg-surface')}>
                <Checkbox checked={selectedIds.includes(person.id)} onCheckedChange={(checked): void => onToggle(person.id, checked)} aria-label={`Seleccionar a ${person.name}`} />
                <button type="button" onClick={(): void => onPreview(person.id)} aria-current={active ? 'true' : undefined} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                  <UserAvatar name={person.name} avatarUrl={person.photoUrl} className={cn('size-10 shrink-0 ring-2', active ? 'ring-brand' : 'ring-transparent')} />
                  <span className="min-w-0 flex-1">
                    <span className={cn('block truncate text-sm', active ? 'font-semibold text-brand' : 'font-medium text-foreground')}>{person.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">{person.detail}</span>
                  </span>
                  <span className="hidden shrink-0 text-right sm:block">
                    <span className="block font-mono text-xs text-foreground">{person.code}</span>
                    {!person.photoUrl && <span className="block text-[11px] text-warning">Sin foto</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
