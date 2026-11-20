'use client';

import Link from 'next/link';
import { useState, type JSX } from 'react';
import { ArrowDown, ArrowUp, CheckCircle2, ChevronDown, ExternalLink, Pencil, Video } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { ConfirmDelete } from '@/features/protected/academic/components/academic-ui';
import { AttachmentsPanel } from '@/features/protected/attachments/components/attachments-panel';
import { cn } from '@/lib/utils';
import { liveHref } from '@/features/protected/meetings/data/meetings-data';
import { assessmentPath, forumPath, itemKinds, materialCategories } from '../data/classroom-data';
import { useRecordView } from '../hooks/use-record-view';
import type { ItemRowProps } from '../types';

// One piece of material. Students open it (and that counts as viewed); staff also see how many opened it and, if
// they edit the room, move, edit or delete it and attach its files
export const ItemRow = ({ item, roomId, index, count, canEdit, family, live, isMoving, isDeleting, onMove, onEdit, onDelete }: ItemRowProps): JSX.Element => {
  const [open, setOpen] = useState(false);
  const recordView = useRecordView(family);
  const meta = itemKinds[item.kind];
  const ownerKind = item.libraryItemId ? 'library_item' : 'classroom_item';
  const ownerId = item.libraryItemId || item.id;
  const toggle = (): void => {
    if (!open) recordView(item.id);
    setOpen(!open);
  };

  return (
    <li className={cn('rounded-xl border bg-background', item.published ? 'border-border' : 'border-dashed border-border')}>
      <div className="flex items-start gap-3 p-3">
        <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg', item.complementary ? 'bg-secondary text-muted-foreground' : 'bg-brand-soft text-brand')} aria-hidden="true">
          {meta && <MorphIcon icon={meta.icon} size={16} />}
        </span>
        <button type="button" onClick={toggle} aria-expanded={open} className="min-w-0 flex-1 text-left">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-foreground">
            <span className="break-words">{item.title}</span>
            {family && item.viewed && <MorphIcon icon={CheckCircle2} size={14} className="text-success" aria-label="Ya lo abriste" />}
          </p>
          <p className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-muted-foreground">
            <span>{meta?.label ?? item.kind}</span>
            {item.complementary && <span>· Complementario</span>}
            {item.libraryItemId && !family && <span>· De la biblioteca</span>}
            {!item.published && <span className="text-warning">· Sin publicar</span>}
            {live && <span>· {live.label}</span>}
            {item.files > 0 && <span>· {item.files === 1 ? '1 archivo' : `${item.files} archivos`}</span>}
            {!family && item.published && <span>· {item.views === 1 ? '1 estudiante lo abrió' : `${item.views} estudiantes lo abrieron`}</span>}
          </p>
        </button>
        <div className="flex shrink-0 items-center">
          {canEdit && (
            <>
              <button type="button" disabled={index === 0 || isMoving} onClick={(): void => onMove(-1)} aria-label="Subir" className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary disabled:opacity-30">
                <MorphIcon icon={ArrowUp} size={14} />
              </button>
              <button type="button" disabled={index === count - 1 || isMoving} onClick={(): void => onMove(1)} aria-label="Bajar" className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary disabled:opacity-30">
                <MorphIcon icon={ArrowDown} size={14} />
              </button>
              <button type="button" onClick={onEdit} aria-label={`Editar ${item.title}`} className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground">
                <MorphIcon icon={Pencil} size={14} />
              </button>
              <ConfirmDelete
                compact
                title={`¿Eliminar «${item.title}»?`}
                description="Los estudiantes dejan de verlo. No se puede deshacer."
                disabled={item.files > 0 && !item.libraryItemId}
                disabledReason="Primero elimina sus archivos adjuntos."
                isPending={isDeleting}
                onConfirm={onDelete}
              />
            </>
          )}
          <button type="button" onClick={toggle} aria-label={open ? 'Cerrar' : 'Abrir'} className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary">
            <MorphIcon icon={ChevronDown} size={16} className={cn('transition-transform', open && 'rotate-180')} />
          </button>
        </div>
      </div>

      {open && (
        <div className="space-y-3 border-t border-border px-4 py-4">
          {item.body && <p className="text-sm leading-7 whitespace-pre-line text-foreground">{item.body}</p>}
          {item.kind === 'live' && live && (
            <div className="flex flex-wrap items-center gap-3 rounded-lg bg-secondary px-3 py-2.5 text-sm">
              <MorphIcon icon={Video} size={16} className="text-brand" />
              <span className="flex-1">{live.phase === 'ended' ? 'La sesión ya terminó.' : live.phase === 'open' ? `La sesión está abierta (${item.provider === 'platform' ? 'en la plataforma' : 'por Google Meet'}).` : `Empieza el ${live.label}${item.provider === 'platform' ? ', en la plataforma' : ', por Google Meet'}. El botón se activa 15 minutos antes.`}</span>
              {(live.phase === 'open' || (canEdit && live.phase !== 'ended')) && (
                <Link href={liveHref('class', item.id)} className="btn-brand h-9 px-4 text-sm">
                  {canEdit && live.phase !== 'open' ? 'Abrir la sala' : 'Entrar a la sesión'}
                </Link>
              )}
              {live.phase === 'ended' && item.recordingUrl && (
                <a href={item.recordingUrl} target="_blank" rel="noreferrer" className="btn-alt h-9 px-4 text-sm">
                  Ver grabación
                </a>
              )}
            </div>
          )}
          {(item.kind === 'video' || item.kind === 'link') && item.url && (
            <a href={item.url} target="_blank" rel="noreferrer" onClick={(): void => recordView(item.id)} className="btn-alt inline-flex h-9 px-4 text-sm">
              <MorphIcon icon={ExternalLink} size={14} />
              {item.kind === 'video' ? 'Ver el video' : 'Abrir el enlace'}
            </a>
          )}
          {(item.kind === 'quiz' || item.kind === 'task') && (
            <Link href={assessmentPath(roomId, item.id)} onClick={(): void => recordView(item.id)} className="btn-brand inline-flex h-9 px-4 text-sm">
              {family ? (item.kind === 'quiz' ? 'Ir al cuestionario' : 'Ir a la tarea') : canEdit ? 'Configurar y calificar' : 'Ver entregas'}
            </Link>
          )}
          {item.kind === 'forum' && (
            <Link href={forumPath(roomId, item.id)} onClick={(): void => recordView(item.id)} className="btn-brand inline-flex h-9 px-4 text-sm">
              {family ? 'Entrar al foro' : 'Abrir y moderar el foro'}
            </Link>
          )}
          {item.kind !== 'quiz' && item.kind !== 'task' && item.kind !== 'forum' && (item.kind === 'file' || item.files > 0 || (canEdit && !item.libraryItemId)) && (
            <AttachmentsPanel
              ownerKind={ownerKind}
              ownerId={ownerId}
              module="classroom"
              variant="compact"
              title="Archivos"
              categories={[...materialCategories]}
              readOnly={!canEdit || Boolean(item.libraryItemId)}
            />
          )}
        </div>
      )}
    </li>
  );
};
