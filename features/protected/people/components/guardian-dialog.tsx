'use client';

import { useState, useTransition, type JSX } from 'react';
import { Search } from 'lucide';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Switch } from '@/components/ui/switch';
import { controlClassName, SelectField } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { items } from '@/features/protected/academic/data/academic-data';
import { useAcademicForm } from '@/features/protected/academic/hooks/use-academic-form';
import { findGuardianAction, saveGuardianAction } from '../actions/people-actions';
import { documentTypeLabels, relationshipLabels } from '../data/people-data';
import type { Guardian, GuardianFormValues, StudentDetail } from '../types';

interface GuardianDialogProps {
  slug: string;
  studentId: string;
  guardian: Guardian | null;
  isFirst: boolean;
  onClose: () => void;
  onSaved: (detail: StudentDetail) => void;
}

const toValues = (g: Guardian | null, isFirst: boolean): GuardianFormValues => ({
  documentType: g?.documentType ?? 'dni',
  documentNumber: g?.documentNumber ?? '',
  givenNames: g?.givenNames ?? '',
  surnames: g?.surnames ?? '',
  email: g?.email ?? '',
  phone: g?.phone ?? '',
  occupation: g?.occupation ?? '',
  relationship: g?.relationship || 'mother',
  isPrimary: g?.isPrimary ?? isFirst,
  canPickUp: g?.canPickUp ?? true,
  livesWith: g?.livesWith ?? true,
});

// Add or edit a guardian. Typing a document already registered (a sibling's guardian) reuses that person
export const GuardianDialog = ({ slug, studentId, guardian, isFirst, onClose, onSaved }: GuardianDialogProps): JSX.Element => {
  const [existing, setExisting] = useState<Guardian | null>(null);
  const [lookup, setLookup] = useState<'idle' | 'found' | 'new'>('idle');
  const [isSearching, startSearch] = useTransition();
  const { values, errors, isPending, setField, submit } = useAcademicForm<GuardianFormValues, StudentDetail>({
    initial: toValues(guardian, isFirst),
    validate: (v): Record<string, string> => {
      if (existing) return {};
      const fields: Record<string, string> = {};
      if (v.givenNames.trim().length < 2) fields.givenNames = 'Escribe los nombres.';
      if (v.surnames.trim().length < 2) fields.surnames = 'Escribe los apellidos.';
      if (v.documentType === 'dni' && !/^\d{8}$/.test(v.documentNumber)) fields.documentNumber = 'El DNI tiene 8 dígitos.';
      return fields;
    },
    save: (v) => saveGuardianAction(slug, studentId, guardian?.id ?? null, existing?.id ?? '', v),
    onSaved: (detail) => {
      onSaved(detail);
      onClose();
    },
  });

  const search = (): void =>
    startSearch(async (): Promise<void> => {
      const r = await findGuardianAction(slug, values.documentType, values.documentNumber);
      if (r.ok) {
        setExisting(r.data);
        setLookup('found');
        for (const [k, v] of Object.entries({ givenNames: r.data.givenNames, surnames: r.data.surnames, email: r.data.email, phone: r.data.phone, occupation: r.data.occupation })) setField(k as keyof GuardianFormValues, v as never);
      } else {
        setExisting(null);
        setLookup('new');
      }
    });

  const locked = Boolean(existing);
  return (
    <FormDialog title={guardian ? 'Editar apoderado' : 'Agregar apoderado'} description={guardian && guardian.studentCount > 1 ? `También es apoderado de ${guardian.studentCount - 1} estudiante(s) más: sus datos cambian para todos.` : undefined} submitLabel={guardian ? 'Guardar cambios' : existing ? 'Vincular' : 'Agregar'} isPending={isPending} onSubmit={submit} onClose={onClose} wide>
      <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <FormField id="gu-doctype" label="Documento" required>
          <SelectField id="gu-doctype" value={values.documentType} disabled={Boolean(guardian) || locked} options={items(documentTypeLabels)} onChange={(v): void => setField('documentType', v)} />
        </FormField>
        <FormField id="gu-docnumber" label="Número" required error={errors.documentNumber} hint={lookup === 'new' ? 'No está registrado: completa sus datos.' : lookup === 'found' ? 'Ya está registrado (por un hermano): se vinculará.' : undefined}>
          <div className="flex gap-2">
            <Input placeholder="Ej.: 41234567"
              id="gu-docnumber"
              value={values.documentNumber}
              maxLength={20}
              disabled={locked}
              onChange={(e): void => {
                setField('documentNumber', values.documentType === 'dni' ? e.target.value.replace(/\D/g, '').slice(0, 8) : e.target.value);
                setLookup('idle');
              }}
              aria-invalid={Boolean(errors.documentNumber)}
              className={controlClassName}
            />
            {!guardian && (
              <button type="button" className="btn-alt shrink-0" disabled={isSearching || values.documentNumber.length < 4 || locked} onClick={search}>
                <MorphIcon icon={Search} size={15} />
                Buscar
              </button>
            )}
          </div>
        </FormField>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="gu-given" label="Nombres" required error={errors.givenNames}>
          <Input placeholder="Ej.: Rosa Elena" id="gu-given" value={values.givenNames} maxLength={80} disabled={locked} onChange={(e): void => setField('givenNames', e.target.value)} aria-invalid={Boolean(errors.givenNames)} className={controlClassName} />
        </FormField>
        <FormField id="gu-surnames" label="Apellidos" required error={errors.surnames}>
          <Input placeholder="Ej.: Quispe Huamán" id="gu-surnames" value={values.surnames} maxLength={120} disabled={locked} onChange={(e): void => setField('surnames', e.target.value)} aria-invalid={Boolean(errors.surnames)} className={controlClassName} />
        </FormField>
        <FormField id="gu-phone" label="Celular" error={errors.phone}>
          <Input placeholder="Ej.: 987 654 321" id="gu-phone" type="tel" value={values.phone} maxLength={20} disabled={locked} onChange={(e): void => setField('phone', e.target.value)} className={controlClassName} />
        </FormField>
        <FormField id="gu-email" label="Correo" error={errors.email} hint="Con él puede ingresar al panel.">
          <Input placeholder="nombre@correo.com" id="gu-email" type="email" value={values.email} maxLength={254} disabled={locked} onChange={(e): void => setField('email', e.target.value)} className={controlClassName} />
        </FormField>
        <FormField id="gu-occupation" label="Ocupación" error={errors.occupation}>
          <Input placeholder="Ej.: Comerciante" id="gu-occupation" value={values.occupation} maxLength={80} disabled={locked} onChange={(e): void => setField('occupation', e.target.value)} className={controlClassName} />
        </FormField>
        <FormField id="gu-relationship" label="Parentesco" required error={errors.relationship}>
          <SelectField id="gu-relationship" value={values.relationship} options={items(relationshipLabels)} onChange={(v): void => setField('relationship', v)} />
        </FormField>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {(
          [
            ['isPrimary', 'Contacto principal', 'Recibe los avisos y figura en el carnet.'],
            ['canPickUp', 'Puede recogerlo', 'A la salida.'],
            ['livesWith', 'Vive con el estudiante', ''],
          ] as const
        ).map(([key, label, hint]) => (
          <label key={key} className="flex items-start justify-between gap-3 rounded-lg border border-border px-3 py-2.5">
            <span>
              <span className="block text-sm font-medium text-foreground">{label}</span>
              {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
            </span>
            <Switch checked={values[key]} onCheckedChange={(next): void => setField(key, next)} />
          </label>
        ))}
      </div>
    </FormDialog>
  );
};
