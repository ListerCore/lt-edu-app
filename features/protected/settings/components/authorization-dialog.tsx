'use client';

import type { JSX } from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SelectField, controlClassName } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { attentionModeLabels, items } from '@/features/protected/academic/data/academic-data';
import { authorizationKindHints, authorizationKindLabels } from '../data/settings-data';
import { useSaveAuthorization } from '../hooks/use-save-authorization';
import type { AuthorizationDialogProps } from '../types';

// Record or edit one resolution that authorizes the institution. Forms of attention per cycle only exist in a CEBA
export const AuthorizationDialog = ({ authorization, levels, isEba, onClose, onSaved }: AuthorizationDialogProps): JSX.Element => {
  const { values, errors, isPending, setField, submit } = useSaveAuthorization({
    authorization,
    onSaved: (): void => {
      onSaved();
      onClose();
    },
  });
  const kinds = isEba ? Object.keys(authorizationKindLabels) : Object.keys(authorizationKindLabels).filter((k) => k !== 'attention_mode');
  const level = levels.find((l) => l.id === values.levelId);
  // A cycle offers only some forms; "every cycle" offers all three
  const modes = level ? level.attentionModes : Object.keys(attentionModeLabels);
  const cycleOptions = [{ value: '', label: 'Todos los ciclos' }, ...levels.map((l) => ({ value: l.id, label: l.name }))];

  return (
    <FormDialog
      title={authorization ? 'Editar autorización' : 'Registrar autorización'}
      description="La resolución tal como la emitió la DRE o la UGEL. El PDF se adjunta después de guardarla."
      submitLabel={authorization ? 'Guardar cambios' : 'Registrar'}
      isPending={isPending}
      onSubmit={submit}
      onClose={onClose}
      wide
    >
      <FormField id="auth-kind" label="Tipo" required error={errors.kind} hint={authorizationKindHints[values.kind]}>
        <SelectField id="auth-kind" value={values.kind} options={items(authorizationKindLabels, kinds)} onChange={(v): void => setField('kind', v)} invalid={Boolean(errors.kind)} />
      </FormField>
      {values.kind === 'attention_mode' && (
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="auth-level" label="Ciclo" error={errors.levelId}>
            <SelectField
              id="auth-level"
              value={values.levelId}
              options={cycleOptions}
              onChange={(v): void => {
                setField('levelId', v);
                const next = levels.find((l) => l.id === v);
                if (next && !next.attentionModes.includes(values.attentionMode)) setField('attentionMode', '');
              }}
              invalid={Boolean(errors.levelId)}
            />
          </FormField>
          <FormField id="auth-mode" label="Forma de atención" required error={errors.attentionMode}>
            <SelectField id="auth-mode" value={values.attentionMode} options={items(attentionModeLabels, modes)} onChange={(v): void => setField('attentionMode', v)} invalid={Boolean(errors.attentionMode)} placeholder="Elige la forma" />
          </FormField>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="auth-resolution" label="Resolución" required error={errors.resolution}>
          <Input id="auth-resolution" placeholder="Ej.: RD N.° 01230-2026-DREA" value={values.resolution} maxLength={120} onChange={(e): void => setField('resolution', e.target.value)} aria-invalid={Boolean(errors.resolution)} className={controlClassName} />
        </FormField>
        <FormField id="auth-issued-by" label="Emitida por" error={errors.issuedBy}>
          <Input id="auth-issued-by" placeholder="Ej.: DRE Ayacucho" value={values.issuedBy} maxLength={160} onChange={(e): void => setField('issuedBy', e.target.value)} aria-invalid={Boolean(errors.issuedBy)} className={controlClassName} />
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField id="auth-issued-on" label="Fecha" required error={errors.issuedOn}>
          <Input id="auth-issued-on" type="date" value={values.issuedOn} onChange={(e): void => setField('issuedOn', e.target.value)} aria-invalid={Boolean(errors.issuedOn)} className={controlClassName} />
        </FormField>
        <FormField id="auth-expires-on" label="Vence" error={errors.expiresOn} hint="Solo si tiene plazo.">
          <Input id="auth-expires-on" type="date" value={values.expiresOn} min={values.issuedOn || undefined} onChange={(e): void => setField('expiresOn', e.target.value)} aria-invalid={Boolean(errors.expiresOn)} className={controlClassName} />
        </FormField>
        <FormField id="auth-file-number" label="Expediente" error={errors.fileNumber}>
          <Input id="auth-file-number" placeholder="Ej.: 2026-0013636" value={values.fileNumber} maxLength={40} onChange={(e): void => setField('fileNumber', e.target.value)} aria-invalid={Boolean(errors.fileNumber)} className={controlClassName} />
        </FormField>
      </div>
      <FormField id="auth-notes" label="Notas" error={errors.notes}>
        <Textarea id="auth-notes" rows={3} value={values.notes} maxLength={500} onChange={(e): void => setField('notes', e.target.value)} aria-invalid={Boolean(errors.notes)} />
      </FormField>
    </FormDialog>
  );
};
