'use client';

import type { JSX } from 'react';
import { CalendarDays, FileBadge, Pencil } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { ConfirmDelete } from '@/features/protected/academic/components/academic-ui';
import { attentionModeLabels, formatDay } from '@/features/protected/academic/data/academic-data';
import { AttachmentsButton } from '@/features/protected/attachments/components/attachments-button';
import { authorizationKindLabels } from '../data/settings-data';
import type { AuthorizationListProps } from '../types';

// One block of authorizations (in force or history): what each one authorizes, the resolution and its PDF
export const AuthorizationList = ({ title, authorizations, canManage, empty, deletingId, onEdit, onDelete }: AuthorizationListProps): JSX.Element => (
  <section aria-label={title}>
    <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
    {authorizations.length === 0 ? (
      <p className="mt-3 rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">{empty}</p>
    ) : (
      <ul className="mt-3 grid gap-3 md:grid-cols-2">
        {authorizations.map((a) => (
          <li key={a.id} className="flex flex-col rounded-xl border border-border bg-background p-4">
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand" aria-hidden="true">
                <MorphIcon icon={FileBadge} size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-brand">
                  {authorizationKindLabels[a.kind] ?? a.kind}
                  {a.kind === 'attention_mode' && ` · ${attentionModeLabels[a.attentionMode] ?? a.attentionMode} · ${a.levelName || 'Todos los ciclos'}`}
                </p>
                <p className="mt-0.5 text-sm font-semibold break-words text-foreground">{a.resolution}</p>
                {a.issuedBy && <p className="text-xs text-muted-foreground">{a.issuedBy}</p>}
              </div>
            </div>
            <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MorphIcon icon={CalendarDays} size={12} />
                {formatDay(a.issuedOn)}
                {a.expiresOn && ` – vence ${formatDay(a.expiresOn)}`}
              </span>
              {a.fileNumber && <span>Expediente {a.fileNumber}</span>}
            </p>
            {a.notes && <p className="mt-2 text-xs leading-5 text-muted-foreground">{a.notes}</p>}
            <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
              <AttachmentsButton
                ownerKind="authorization"
                ownerId={a.id}
                title={`Archivos de ${a.resolution}`}
                description="La resolución firmada y sus anexos."
                categories={['resolution', 'annex', 'other']}
                readOnly={!canManage}
                label={a.files > 0 ? `${a.files} ${a.files === 1 ? 'archivo' : 'archivos'}` : 'Adjuntar PDF'}
              />
              {canManage && (
                <div className="flex items-center">
                  <button type="button" onClick={(): void => onEdit(a)} aria-label={`Editar ${a.resolution}`} className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                    <MorphIcon icon={Pencil} size={15} />
                  </button>
                  <ConfirmDelete
                    compact
                    title={`¿Eliminar ${a.resolution}?`}
                    description="Deja de figurar en la institución. No se puede deshacer."
                    disabled={a.files > 0}
                    disabledReason="Primero elimina sus archivos adjuntos."
                    isPending={deletingId === a.id}
                    onConfirm={(): void => onDelete(a.id)}
                  />
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    )}
  </section>
);
