'use client';

import { useState, type JSX } from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { controlClassName } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { useModeratePost } from '../hooks/use-moderate-post';
import type { HidePostDialogProps } from '../types';

// Hide a post with the reason the students read; the text stays visible to staff and the change goes to the audit
export const HidePostDialog = ({ post, onClose, onHidden }: HidePostDialogProps): JSX.Element => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const { hide, isHiding } = useModeratePost(onHidden);
  const submit = (): void => {
    if (!reason.trim()) {
      setError('Escribe por qué lo ocultas.');
      return;
    }
    void hide(post, reason).then((ok): void => {
      if (ok) onClose();
    });
  };
  return (
    <FormDialog title={`Ocultar el mensaje de ${post.authorName}`} description="Los estudiantes verán que el moderador lo ocultó, sin el texto. Queda registrado en la auditoría." submitLabel="Ocultar" isPending={isHiding} onSubmit={submit} onClose={onClose}>
      <FormField id="hide-reason" label="Motivo" required error={error}>
        <Input id="hide-reason" placeholder="Ej.: lenguaje inapropiado, datos personales" value={reason} maxLength={300} onChange={(e): void => setReason(e.target.value)} aria-invalid={Boolean(error)} className={controlClassName} />
      </FormField>
    </FormDialog>
  );
};
