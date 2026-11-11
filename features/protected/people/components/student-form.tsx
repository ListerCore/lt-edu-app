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
import { saveStudentAction } from '../actions/people-actions';
import { documentTypeLabels, sexLabels, studentStatusLabels } from '../data/people-data';
import type { Student, StudentFormValues } from '../types';

export const emptyStudent: StudentFormValues = {
  code: '',
  documentType: 'dni',
  documentNumber: '',
  givenNames: '',
  paternalSurname: '',
  maternalSurname: '',
  birthDate: '',
  sex: '',
  email: '',
  phone: '',
  address: '',
  specialNeeds: false,
  notes: '',
  status: 'active',
};

export const studentValues = (s: Student): StudentFormValues => ({
  code: s.code,
  documentType: s.documentType,
  documentNumber: s.documentNumber,
  givenNames: s.givenNames,
  paternalSurname: s.paternalSurname,
  maternalSurname: s.maternalSurname,
  birthDate: s.birthDate,
  sex: s.sex,
  email: s.email,
  phone: s.phone,
  address: s.address,
  specialNeeds: s.specialNeeds,
  notes: s.notes,
  status: s.status,
});

interface StudentFormProps {
  slug: string;
  student: Student | null;
  readOnly?: boolean;
  onSaved: (student: Student) => void;
  onCancel?: () => void;
}

const validate = (v: StudentFormValues): Record<string, string> => {
  const fields: Record<string, string> = {};
  if (v.givenNames.trim().length < 2) fields.givenNames = 'Escribe los nombres.';
  if (v.paternalSurname.trim().length < 2) fields.paternalSurname = 'Escribe el apellido paterno.';
  if (v.documentType === 'dni' && !/^\d{8}$/.test(v.documentNumber.trim())) fields.documentNumber = 'El DNI tiene 8 dígitos.';
  if (v.documentType !== 'dni' && v.documentNumber.trim().length < 4) fields.documentNumber = 'Escribe el número de documento.';
  return fields;
};

// Personal data of a student: identity, contact and status. New students get their code from the API
export const StudentForm = ({ slug, student, readOnly, onSaved, onCancel }: StudentFormProps): JSX.Element => {
  const { values, errors, isPending, setField, submit } = useAcademicForm<StudentFormValues, Student>({
    initial: student ? studentValues(student) : emptyStudent,
    validate,
    save: (v) => saveStudentAction(slug, student?.id ?? null, v),
    onSaved,
  });
  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    submit();
  };
  const field = (id: keyof StudentFormValues) => ({ 'aria-invalid': Boolean(errors[id]), disabled: readOnly || isPending });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      <fieldset className="grid gap-5 md:grid-cols-3">
        <legend className="mb-4 text-base font-semibold text-foreground">Identidad</legend>
        <FormField id="st-given" label="Nombres" required error={errors.givenNames}>
          <Input placeholder="Ej.: María José" id="st-given" value={values.givenNames} maxLength={80} onChange={(e): void => setField('givenNames', e.target.value)} className={controlClassName} {...field('givenNames')} />
        </FormField>
        <FormField id="st-paternal" label="Apellido paterno" required error={errors.paternalSurname}>
          <Input placeholder="Ej.: Quispe" id="st-paternal" value={values.paternalSurname} maxLength={60} onChange={(e): void => setField('paternalSurname', e.target.value)} className={controlClassName} {...field('paternalSurname')} />
        </FormField>
        <FormField id="st-maternal" label="Apellido materno" error={errors.maternalSurname}>
          <Input placeholder="Ej.: Huamán" id="st-maternal" value={values.maternalSurname} maxLength={60} onChange={(e): void => setField('maternalSurname', e.target.value)} className={controlClassName} {...field('maternalSurname')} />
        </FormField>
        <FormField id="st-doctype" label="Documento" required error={errors.documentType}>
          <SelectField id="st-doctype" value={values.documentType} options={items(documentTypeLabels)} onChange={(v): void => setField('documentType', v)} disabled={readOnly} />
        </FormField>
        <FormField id="st-docnumber" label="Número" required error={errors.documentNumber}>
          <Input placeholder="Ej.: 71234567" id="st-docnumber" inputMode={values.documentType === 'dni' ? 'numeric' : 'text'} value={values.documentNumber} maxLength={20} onChange={(e): void => setField('documentNumber', values.documentType === 'dni' ? e.target.value.replace(/\D/g, '').slice(0, 8) : e.target.value)} className={controlClassName} {...field('documentNumber')} />
        </FormField>
        <FormField id="st-code" label="Código de estudiante" error={errors.code} hint={student ? undefined : 'Vacío: se asigna el siguiente del año.'}>
          <Input placeholder="Ej.: 2026-0412" id="st-code" value={values.code} maxLength={20} onChange={(e): void => setField('code', e.target.value)} className={controlClassName} {...field('code')} />
        </FormField>
        <FormField id="st-birth" label="Fecha de nacimiento" error={errors.birthDate}>
          <Input id="st-birth" type="date" value={values.birthDate} onChange={(e): void => setField('birthDate', e.target.value)} className={controlClassName} {...field('birthDate')} />
        </FormField>
        <FormField id="st-sex" label="Sexo" error={errors.sex}>
          <SelectField id="st-sex" value={values.sex} options={[{ value: '', label: 'Sin indicar' }, ...items(sexLabels)]} onChange={(v): void => setField('sex', v)} disabled={readOnly} />
        </FormField>
        <FormField id="st-status" label="Estado" error={errors.status}>
          <SelectField id="st-status" value={values.status} options={items(studentStatusLabels)} onChange={(v): void => setField('status', v)} disabled={readOnly} />
        </FormField>
      </fieldset>

      <fieldset className="grid gap-5 md:grid-cols-3">
        <legend className="mb-4 text-base font-semibold text-foreground">Contacto</legend>
        <FormField id="st-email" label="Correo" error={errors.email} hint="Con él puede ingresar al panel.">
          <Input placeholder="nombre@correo.com" id="st-email" type="email" value={values.email} maxLength={254} onChange={(e): void => setField('email', e.target.value)} className={controlClassName} {...field('email')} />
        </FormField>
        <FormField id="st-phone" label="Celular" error={errors.phone}>
          <Input placeholder="Ej.: 987 654 321" id="st-phone" type="tel" value={values.phone} maxLength={20} onChange={(e): void => setField('phone', e.target.value)} className={controlClassName} {...field('phone')} />
        </FormField>
        <FormField id="st-address" label="Dirección" error={errors.address}>
          <Input placeholder="Ej.: Jr. Lima 123, Ayacucho" id="st-address" value={values.address} maxLength={200} onChange={(e): void => setField('address', e.target.value)} className={controlClassName} {...field('address')} />
        </FormField>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="mb-4 text-base font-semibold text-foreground">Atención</legend>
        <label className="flex max-w-xl items-center justify-between gap-4 rounded-lg border border-border px-4 py-3">
          <span>
            <span className="block text-sm font-medium text-foreground">Necesidades educativas especiales</span>
            <span className="block text-xs text-muted-foreground">Asociadas o no a discapacidad. Las adaptaciones se registran en su plan.</span>
          </span>
          <Switch checked={values.specialNeeds} disabled={readOnly} onCheckedChange={(next): void => setField('specialNeeds', next)} />
        </label>
        <FormField id="st-notes" label="Observaciones" error={errors.notes}>
          <Textarea placeholder="Alergias, cuidados o lo que el colegio deba saber" id="st-notes" rows={3} maxLength={1000} value={values.notes} disabled={readOnly} onChange={(e): void => setField('notes', e.target.value)} className="max-w-3xl rounded-lg bg-background" />
        </FormField>
      </fieldset>

      {!readOnly && (
        <div className="flex flex-wrap gap-3">
          <button type="submit" className="btn-brand" disabled={isPending}>
            {isPending && <MorphIcon icon={LoaderCircle} size={16} className="animate-spin" />}
            {student ? 'Guardar cambios' : 'Registrar estudiante'}
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
