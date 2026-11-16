'use client';

import { useState, type JSX } from 'react';
import { ArrowDown, ArrowUp, CalendarDays, LibraryBig, Pencil, Plus, Printer, Truck } from 'lucide';
import Link from 'next/link';
import { MorphIcon } from '@/components/ui/morph-icon';
import { ConfirmDelete } from '@/features/protected/academic/components/academic-ui';
import { formatDay } from '@/features/protected/academic/data/academic-data';
import { useToday } from '@/features/protected/academic/hooks/use-today';
import { cn } from '@/lib/utils';
import { unitPrintPath } from '../data/classroom-data';
import { useDeleteItem } from '../hooks/use-delete-item';
import { useDeleteUnit } from '../hooks/use-delete-unit';
import { useReorderItems } from '../hooks/use-reorder-items';
import type { Item, UnitSectionProps } from '../types';
import { DeliveriesDialog } from './deliveries-dialog';
import { ItemDialog } from './item-dialog';
import { ItemRow } from './item-row';
import { LibraryPickerDialog } from './library-picker-dialog';

// One unit: when it opens, its material in order and, for editors, adding material (own or from the library), the
// printable package and the itinerant deliveries
export const UnitSection = ({ unit, index, count, room, canEdit, family, liveOf, isMoving, onMove, onEdit, onChanged }: UnitSectionProps): JSX.Element => {
  const today = useToday();
  const [editing, setEditing] = useState<Item | 'new' | null>(null);
  const [picking, setPicking] = useState(false);
  const [delivering, setDelivering] = useState(false);
  const items = useReorderItems(unit.id, onChanged);
  const delItem = useDeleteItem(onChanged);
  const delUnit = useDeleteUnit(onChanged);
  const ids = unit.items.map((i) => i.id);
  const notYet = Boolean(unit.opensOn && today && unit.opensOn > today);

  return (
    <section aria-labelledby={`unit-${unit.id}`} className={cn('rounded-2xl border bg-surface p-4 md:p-5', unit.published ? 'border-border' : 'border-dashed border-border')}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 id={`unit-${unit.id}`} className="text-base font-semibold text-foreground">
            {unit.title}
          </h2>
          {unit.summary && <p className="mt-1 text-sm leading-6 text-muted-foreground">{unit.summary}</p>}
          {!family && (
            <p className="mt-1.5 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
              <span className={unit.published ? 'text-success' : 'text-warning'}>{unit.published ? 'Publicada' : 'Sin publicar'}</span>
              {unit.opensOn && (
                <span className="inline-flex items-center gap-1">
                  <MorphIcon icon={CalendarDays} size={12} />
                  {notYet ? `Se abre el ${formatDay(unit.opensOn)}` : `Abierta desde el ${formatDay(unit.opensOn)}`}
                </span>
              )}
            </p>
          )}
        </div>
        {canEdit && (
          <div className="flex flex-wrap items-center">
            <button type="button" disabled={index === 0 || isMoving} onClick={(): void => onMove(-1)} aria-label="Subir unidad" className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary disabled:opacity-30">
              <MorphIcon icon={ArrowUp} size={14} />
            </button>
            <button type="button" disabled={index === count - 1 || isMoving} onClick={(): void => onMove(1)} aria-label="Bajar unidad" className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary disabled:opacity-30">
              <MorphIcon icon={ArrowDown} size={14} />
            </button>
            <button type="button" onClick={onEdit} aria-label={`Editar ${unit.title}`} className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground">
              <MorphIcon icon={Pencil} size={14} />
            </button>
            <ConfirmDelete compact title={`¿Eliminar «${unit.title}»?`} description="Solo se puede eliminar una unidad sin material." disabled={unit.items.length > 0} disabledReason="Primero elimina su material." isPending={delUnit.deletingId === unit.id} onConfirm={(): void => delUnit.remove(unit.id)} />
          </div>
        )}
      </header>

      {unit.items.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-border px-4 py-5 text-center text-sm text-muted-foreground">{canEdit ? 'Aún no hay material. Agrégalo con los botones de abajo.' : 'Aún no hay material en esta unidad.'}</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {unit.items.map((item, i) => (
            <ItemRow
              key={item.id}
              item={item}
              index={i}
              count={unit.items.length}
              canEdit={canEdit}
              family={family}
              live={liveOf(item)}
              isMoving={items.isMoving}
              isDeleting={delItem.deletingId === item.id}
              onMove={(delta): void => items.move(ids, i, delta)}
              onEdit={(): void => setEditing(item)}
              onDelete={(): void => delItem.remove(item.id)}
            />
          ))}
        </ul>
      )}

      {canEdit && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="btn-alt h-9 px-3 text-sm" onClick={(): void => setEditing('new')}>
            <MorphIcon icon={Plus} size={14} />
            Material
          </button>
          <button type="button" className="btn-alt h-9 px-3 text-sm" onClick={(): void => setPicking(true)}>
            <MorphIcon icon={LibraryBig} size={14} />
            Desde la biblioteca
          </button>
          <Link href={unitPrintPath(room.id, unit.id)} target="_blank" className="btn-alt h-9 px-3 text-sm">
            <MorphIcon icon={Printer} size={14} />
            Imprimir
          </Link>
          <button type="button" className="btn-alt h-9 px-3 text-sm" onClick={(): void => setDelivering(true)}>
            <MorphIcon icon={Truck} size={14} />
            Entregas itinerantes
          </button>
        </div>
      )}

      {editing && <ItemDialog unitId={unit.id} item={editing === 'new' ? null : editing} onClose={(): void => setEditing(null)} onSaved={onChanged} />}
      {picking && <LibraryPickerDialog unitId={unit.id} onClose={(): void => setPicking(false)} onAdded={onChanged} />}
      {delivering && <DeliveriesDialog unit={unit} onClose={(): void => setDelivering(false)} />}
    </section>
  );
};
