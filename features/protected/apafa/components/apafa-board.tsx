'use client';

import { useState, type JSX } from 'react';
import { Pencil, Phone, Plus, UsersRound } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { ConfirmDelete } from '@/features/protected/academic/components/academic-ui';
import { cn } from '@/lib/utils';
import { useDeleteBoardMember } from '../hooks/use-delete-board-member';
import type { BoardMember, BoardSectionProps } from '../types';
import { ApafaBoardDialog } from './apafa-board-dialog';

// The APAFA board: who holds each office and until when; dirección and secretaría keep it up to date
export const ApafaBoard = ({ members, canManage, onChanged }: BoardSectionProps): JSX.Element => {
  const [editing, setEditing] = useState<BoardMember | 'new' | null>(null);
  const { remove, deletingId } = useDeleteBoardMember(onChanged);
  return (
    <section aria-labelledby="apafa-board-title" className="rounded-2xl border border-border bg-background p-5">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-brand-soft text-brand" aria-hidden="true">
            <MorphIcon icon={UsersRound} size={16} />
          </span>
          <h2 id="apafa-board-title" className="text-base font-semibold text-foreground">
            Consejo directivo
          </h2>
        </div>
        {canManage && (
          <button type="button" className="btn-alt h-8 px-3 text-xs" onClick={(): void => setEditing('new')}>
            <MorphIcon icon={Plus} size={14} />
            Agregar
          </button>
        )}
      </header>
      {members.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Aún no se registró el consejo directivo de la APAFA.</p>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {members.map((b) => (
            <li key={b.id} className={cn('flex items-start justify-between gap-3 py-2.5', !b.current && 'opacity-60')}>
              <div className="min-w-0">
                <p className="text-xs font-medium text-brand">{b.positionLabel}</p>
                <p className="truncate text-sm font-semibold text-foreground">{b.fullName}</p>
                <p className="flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
                  <span>{b.current ? b.periodLabel : `Periodo anterior · ${b.periodLabel}`}</span>
                  {b.phone && (
                    <a href={`tel:${b.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-1 hover:text-brand">
                      <MorphIcon icon={Phone} size={12} />
                      {b.phone}
                    </a>
                  )}
                </p>
              </div>
              {canManage && (
                <div className="flex shrink-0 items-center">
                  <button type="button" onClick={(): void => setEditing(b.raw)} aria-label={`Editar: ${b.fullName}`} className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                    <MorphIcon icon={Pencil} size={15} />
                  </button>
                  <ConfirmDelete compact title={`Quitar a ${b.fullName}`} description="Deja de figurar en el consejo directivo." isPending={deletingId === b.id} onConfirm={(): void => remove(b.id)} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      {editing && <ApafaBoardDialog member={editing === 'new' ? null : editing} onClose={(): void => setEditing(null)} onSaved={onChanged} />}
    </section>
  );
};
