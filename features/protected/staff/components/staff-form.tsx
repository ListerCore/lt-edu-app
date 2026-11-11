'use client';

import type { FormEvent, JSX } from 'react';
import { LoaderCircle } from 'lucide';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { controlClassName, SelectField } from '@/features/protected/academic/components/academic-ui';
import { items } from '@/features/protected/academic/data/academic-data';
import { useAcademicForm } from '@/features/protected/academic/hooks/use-academic-form';
import { documentTypeLabels } from '@/features/protected/people/data/people-data';
import { saveStaffAction } from '../actions/staff-actions';
import { staffStatusLabels } from '../data/staff-data';
import type { Staff, StaffFormValues } from '../types';

const toValues = (s: Staff | null): StaffFormValues => ({
  code: s?.code ?? '',
  documentType: s?.documentType ?? 'dni',
  documentNumber: s?.documentNumber ?? '',
  givenNames: s?.givenNames ?? '',
  surnames: s?.surnames ?? '',
  email: s?.email ?? '',
  phone: s?.phone ?? '',
  position: s?.position ?? 'Docente',
  isTeacher: s?.isTeacher ?? true,
  specialty: s?.specialty ?? '',
  maxWeeklyHours: s?.maxWeeklyHours !== undefined ? String(s.maxWeeklyHours) : '30',
  hiredOn: s?.hiredOn ?? '',
  status: s?.status ?? 'active',
  notes: s?.notes ?? '',
});

interface StaffFormProps {
  slug: string;
  staff: Staff | null;
  readOnly?: boolean;
  onSaved: (staff: Staff) => void;
  onCancel?: () => void;
}

// Record of someone of the staff: identity, contact, job and, for teachers, specialty and weekly hours
export const StaffForm = ({ slug, staff, readOnly, onSaved, onCancel }: StaffFormProps): JSX.Element => {
  const { values, errors, isPending, setField, submit } = useAcademicForm<StaffFormValues, Staff>({
    initial: toValues(staff),
    validate: (v): Record<string, string> => {
      const fields: Record<string, string> = {};
      if (v.givenNames.trim().length < 2) fields.givenNames = 'Escribe los nombres.';
      if (v.surnames.trim().length < 2) fields.surnames = 'Escribe los apellidos.';
      if (v.position.trim().length < 2) fields.position = 'Escribe el cargo.';
      if (v.documentType === 'dni' && !/^\d{8}$/.test(v.documentNumber)) fields.documentNumber = 'El DNI tiene 8 dígitos.';
      return fields;
    },
    save: (v) => saveStaffAction(slug, staff?.id ?? null, v),
    onSaved,
  });
  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    submit();
  };
  const dis = readOnly || isPending;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      <fieldset className="grid gap-5 md:grid-cols-3">
        <legend className="mb-4 text-base font-semibold text-foreground">Datos personales</legend>
        <FormField id="sf-given" label="Nombres" required error={errors.givenNames}>
          <Input id="sf-given" value={values.givenNames} maxLength={80} disabled={dis} onChange={(e): void => setField('givenNames', e.target.value)} aria-invalid={Boolean(errors.givenNames)} className={controlClassName} />
        </FormField>
        <FormField id="sf-surnames" label="Apellidos" required error={errors.surnames}>
          <Input id="sf-surnames" value={values.surnames} maxLength={120} disabled={dis} onChange={(e): void => setField('surnames', e.target.value)} aria-invalid={Boolean(errors.surnames)} className={controlClassName} />
        </FormField>
        <FormField id="sf-code" label="Código" error={errors.code} hint={staff ? undefined : 'Vacío: P-0101, P-0102…'}>
          <Input id="sf-code" value={values.code} maxLength={20} disabled={dis} onChange={(e): void => setField('code', e.target.value)} className={controlClassName} />
        </FormField>
        <FormField id="sf-doctype" label="Documento" required>
          <SelectField id="sf-doctype" value={values.documentType} disabled={dis} options={items(documentTypeLabels)} onChange={(v): void => setField('documentType', v)} />
        </FormField>
        <FormField id="sf-docnumber" label="Número" required error={errors.documentNumber}>
          <Input id="sf-docnumber" value={values.documentNumber} maxLength={20} disabled={dis} onChange={(e): void => setField('documentNumber', values.documentType === 'dni' ? e.target.value.replace(/\D/g, '').slice(0, 8) : e.target.value)} aria-invalid={Boolean(errors.documentNumber)} className={controlClassName} />
        </FormField>
        <FormField id="sf-hired" label="Fecha de ingreso" error={errors.hiredOn}>
          <Input id="sf-hired" type="date" value={values.hiredOn} disabled={dis} onChange={(e): void => setField('hiredOn', e.target.value)} className={controlClassName} />
        </FormField>
        <FormField id="sf-email" label="Correo" error={errors.email} hint="Con él recibe su rol en el panel.">
          <Input id="sf-email" type="email" value={values.email} maxLength={254} disabled={dis} onChange={(e): void => setField('email', e.target.value)} className={controlClassName} />
        </FormField>
        <FormField id="sf-phone" label="Celular" error={errors.phone}>
          <Input id="sf-phone" type="tel" value={values.phone} maxLength={20} disabled={dis} onChange={(e): void => setField('phone', e.target.value)} className={controlClassName} />
        </FormField>
        <FormField id="sf-status" label="Estado">
          <SelectField id="sf-status" value={values.status} disabled={dis} options={items(staffStatusLabels)} onChange={(v): void => setField('status', v)} />
        </FormField>
      </fieldset>

      <fieldset className="grid gap-5 md:grid-cols-3">
        <legend className="mb-4 text-base font-semibold text-foreground">Cargo</legend>
        <FormField id="sf-position" label="Cargo" required error={errors.position} hint="Como lo nombra la institución.">
          <Input id="sf-position" value={values.position} maxLength={80} disabled={dis} onChange={(e): void => setField('position', e.target.value)} aria-invalid={Boolean(errors.position)} className={controlClassName} />
        </FormField>
        <label className="flex items-center justify-between gap-4 self-end rounded-lg border border-border px-4 py-2.5 md:col-span-2">
          <span>
            <span className="block text-sm font-medium text-foreground">Dicta clases</span>
            <span className="block text-xs text-muted-foreground">Podrá recibir cursos y secciones en la carga docente.</span>
          </span>
          <Switch checked={values.isTeacher} disabled={dis} onCheckedChange={(next): void => setField('isTeacher', next)} />
        </label>
        {values.isTeacher && (
          <>
            <FormField id="sf-specialty" label="Especialidad" error={errors.specialty}>
              <Input id="sf-specialty" value={values.specialty} maxLength={120} disabled={dis} onChange={(e): void => setField('specialty', e.target.value)} className={controlClassName} />
            </FormField>
            <FormField id="sf-hours" label="Horas semanales contratadas" error={errors.maxWeeklyHours} hint="La carga que pase de aquí se marca.">
              <Input id="sf-hours" inputMode="numeric" value={values.maxWeeklyHours} disabled={dis} onChange={(e): void => setField('maxWeeklyHours', e.target.value.replace(/\D/g, '').slice(0, 2))} className={controlClassName} />
            </FormField>
          </>
        )}
      </fieldset>

      <FormField id="sf-notes" label="Observaciones" error={errors.notes}>
        <Textarea id="sf-notes" rows={3} maxLength={1000} value={values.notes} disabled={dis} onChange={(e): void => setField('notes', e.target.value)} className="max-w-3xl rounded-lg bg-background" />
      </FormField>

      {!readOnly && (
        <div className="flex flex-wrap gap-3">
          <button type="submit" className="btn-brand" disabled={isPending}>
            {isPending && <MorphIcon icon={LoaderCircle} size={16} className="animate-spin" />}
            {staff ? 'Guardar cambios' : 'Registrar'}
          </button>
          {onCancel && (
            <button type="button" className="btn-alt" onClick={onCancel} disabled={isPending}>
              Cancelar
            </button>
          )}
        </div>
      )}
    </form>
  );
};
