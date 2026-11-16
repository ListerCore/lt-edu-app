'use client';

import { useState, type JSX } from 'react';
import { EyeOff, Pencil, Pin, PinOff, Trash2, Undo2 } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { staffAuthorRoles } from '../data/classroom-data';
import type { PostCardProps } from '../types';

const postTime = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'America/Lima' });

// One post: author (staff marked), when, the text or the moderator's note, and the actions the person may take
export const PostCard = ({ post, isMine, canModerate, busy, reply, onEdit, onDelete, onPin, onHide, onShow }: PostCardProps): JSX.Element => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(post.body);
  const staff = staffAuthorRoles.includes(post.authorRole);
  const initials = post.authorName
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
  const iconButton = 'inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-40';

  return (
    <article className={cn('flex gap-3', reply ? 'py-3' : 'p-4', post.isNew && !reply && 'bg-brand-soft/40')} aria-busy={busy}>
      <span className={cn('flex shrink-0 items-center justify-center rounded-full text-xs font-semibold', reply ? 'size-7' : 'size-9', staff ? 'bg-brand text-white' : 'bg-secondary text-foreground')} aria-hidden="true">
        {initials}
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
          <span className="text-sm font-medium text-foreground">{post.authorName}</span>
          {staff && <span className="rounded bg-brand-soft px-1.5 py-0.5 font-medium text-brand">Docente</span>}
          {post.pinned && <span className="inline-flex items-center gap-1 text-brand"><MorphIcon icon={Pin} size={11} />Fijado</span>}
          <time>{postTime.format(new Date(post.createdAt))}</time>
          {post.editedAt && <span>· editado</span>}
          {post.isNew && <span className="font-medium text-brand">· nuevo</span>}
        </p>
        {post.hidden && !post.body ? (
          <p className="mt-1 text-sm text-muted-foreground italic">El moderador ocultó este mensaje.</p>
        ) : editing ? (
          <div className="mt-2 space-y-2">
            <Textarea aria-label="Editar mensaje" rows={3} value={text} maxLength={5000} onChange={(e): void => setText(e.target.value)} />
            <div className="flex justify-end gap-2">
              <button type="button" className="btn-alt h-8 px-3 text-xs" onClick={(): void => setEditing(false)}>
                Cancelar
              </button>
              <button type="button" className="btn-brand h-8 px-3 text-xs" disabled={!text.trim()} onClick={(): void => void onEdit(text).then((ok): void => setEditing(!ok))}>
                Guardar
              </button>
            </div>
          </div>
        ) : (
          <p className={cn('mt-1 text-sm leading-6 whitespace-pre-line text-foreground', post.hidden && 'opacity-60')}>{post.body}</p>
        )}
        {post.hidden && post.hiddenReason && (
          <p className="mt-1 text-xs text-warning">
            Oculto por {post.hiddenByName}: {post.hiddenReason}
          </p>
        )}
      </div>
      {!editing && (
        <div className="flex shrink-0 items-start">
          {isMine && !post.hidden && (
            <>
              <button type="button" className={iconButton} disabled={busy} onClick={(): void => setEditing(true)} aria-label="Editar mi mensaje">
                <MorphIcon icon={Pencil} size={13} />
              </button>
              <button type="button" className={iconButton} disabled={busy} onClick={onDelete} aria-label="Eliminar mi mensaje">
                <MorphIcon icon={Trash2} size={13} />
              </button>
            </>
          )}
          {canModerate && !reply && (
            <button type="button" className={iconButton} disabled={busy} onClick={onPin} aria-label={post.pinned ? 'Desfijar' : 'Fijar arriba'}>
              <MorphIcon icon={post.pinned ? PinOff : Pin} size={13} />
            </button>
          )}
          {canModerate &&
            (post.hidden ? (
              <button type="button" className={iconButton} disabled={busy} onClick={onShow} aria-label="Volver a mostrar">
                <MorphIcon icon={Undo2} size={13} />
              </button>
            ) : (
              !isMine && (
                <button type="button" className={iconButton} disabled={busy} onClick={onHide} aria-label="Ocultar mensaje">
                  <MorphIcon icon={EyeOff} size={13} />
                </button>
              )
            ))}
        </div>
      )}
    </article>
  );
};
