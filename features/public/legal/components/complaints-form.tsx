'use client';

import Link from 'next/link';
import type { FormEvent, JSX } from 'react';
import { ArrowUpRight, CircleCheck, LoaderCircle, RotateCcw } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/layout/form-field';
import { TurnstileField } from '@/features/auth/components/turnstile-field';
import { useCreateComplaint } from '../hooks/use-create-complaint';
import type { ComplaintField, ComplaintKind, DocumentType } from '../types';

const documentOptions: Array<{ value: DocumentType; label: string }> = [
  { value: 'DNI', label: 'DNI' },
  { value: 'CE', label: 'Carné de extranjería' },
  { value: 'PASAPORTE', label: 'Pasaporte' },
  { value: 'RUC', label: 'RUC' },
];

const kindOptions: Array<{ value: ComplaintKind; label: string; description: string }> = [
  { value: 'RECLAMO', label: 'Reclamo', description: 'Disconformidad con el servicio contratado.' },
  { value: 'QUEJA', label: 'Queja', description: 'Disconformidad con la atención recibida, no relacionada con el servicio.' },
];

// Example format per document type, so the hint matches the expected length
const documentPlaceholders: Record<DocumentType, string> = {
  DNI: '8 dígitos',
  CE: 'Ej. 001234567',
  PASAPORTE: 'Ej. 123456789',
  RUC: '11 dígitos',
};

const controlClassName = 'h-11 w-full rounded-lg bg-background';

// Numbered block heading inside the complaint sheet
const SheetHeading = ({ index, title }: { index: string; title: string }): JSX.Element => (
  <h2 className="flex items-center gap-3 border-b border-border pb-3 text-lg font-semibold text-foreground sm:col-span-2">
    <span className="flex size-7 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-brand tabular-nums">{index}</span>
    {title}
  </h2>
);

// Virtual Libro de Reclamaciones sheet; state and submission live in useCreateComplaint
export const ComplaintsForm = (): JSX.Element => {
  const { values, errors, isPending, submittedCode, turnstileRef, setCaptchaToken, setField, submit, reset } = useCreateComplaint();

  if (submittedCode) {
    return (
      <div role="status" className="flex flex-col items-start gap-6 p-6 md:p-10">
        <span className="flex size-14 items-center justify-center rounded-full bg-success/12 text-success">
          <MorphIcon icon={CircleCheck} size={24} />
        </span>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Hoja de reclamación N.°</p>
          <p className="mt-1 font-mono text-2xl font-semibold tracking-tight text-foreground">{submittedCode}</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Enviaremos una copia a <span className="font-medium text-foreground">{values.email}</span>. Responderemos en un plazo máximo de 15 días hábiles.
          </p>
        </div>
        <button type="button" onClick={reset} className="btn-alt">
          <MorphIcon icon={RotateCcw} size={16} />
          Registrar otra hoja
        </button>
      </div>
    );
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    submit();
  };

  const describe = (field: ComplaintField): { 'aria-invalid': boolean; 'aria-describedby'?: string } => ({ 'aria-invalid': Boolean(errors[field]), 'aria-describedby': errors[field] ? `complaint-${field}-error` : undefined });

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Hoja de reclamación" className="grid grid-cols-1 gap-x-5 gap-y-6 p-6 sm:grid-cols-2 md:p-8">
      <SheetHeading index="01" title="Identificación del consumidor" />

      <div className="sm:col-span-2">
        <FormField id="complaint-fullName" label="Nombres y apellidos" required error={errors.fullName}>
          <Input id="complaint-fullName" autoComplete="name" placeholder="Ej. Juan Carlos Mendoza Quispe" value={values.fullName} onChange={(event): void => setField('fullName', event.target.value)} className={controlClassName} {...describe('fullName')} />
        </FormField>
      </div>

      <FormField id="complaint-documentType" label="Tipo de documento" required>
        <Select items={documentOptions} value={values.documentType} onValueChange={(value): void => setField('documentType', (value ?? 'DNI') as DocumentType)}>
          <SelectTrigger id="complaint-documentType" className={controlClassName}>
            <SelectValue placeholder="Selecciona el tipo de documento" />
          </SelectTrigger>
          <SelectContent>
            {documentOptions.map((option): JSX.Element => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField id="complaint-documentNumber" label="Número de documento" required error={errors.documentNumber}>
        <Input id="complaint-documentNumber" placeholder={documentPlaceholders[values.documentType]} inputMode={values.documentType === 'DNI' || values.documentType === 'RUC' ? 'numeric' : 'text'} value={values.documentNumber} onChange={(event): void => setField('documentNumber', event.target.value)} className={controlClassName} {...describe('documentNumber')} />
      </FormField>

      <div className="sm:col-span-2">
        <FormField id="complaint-address" label="Domicilio" required error={errors.address}>
          <Input id="complaint-address" autoComplete="street-address" placeholder="Dirección, distrito, provincia y departamento" value={values.address} onChange={(event): void => setField('address', event.target.value)} className={controlClassName} {...describe('address')} />
        </FormField>
      </div>

      <FormField id="complaint-phone" label="Teléfono" required error={errors.phone}>
        <Input id="complaint-phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+51 9XX XXX XXX" value={values.phone} onChange={(event): void => setField('phone', event.target.value)} className={controlClassName} {...describe('phone')} />
      </FormField>

      <FormField id="complaint-email" label="Correo" required error={errors.email}>
        <Input id="complaint-email" type="email" autoComplete="email" inputMode="email" placeholder="nombre@correo.com" value={values.email} onChange={(event): void => setField('email', event.target.value)} className={controlClassName} {...describe('email')} />
      </FormField>

      <label className="flex cursor-pointer items-center gap-3 text-sm text-muted-foreground sm:col-span-2">
        <Checkbox checked={values.isMinor} onCheckedChange={(next): void => setField('isMinor', next)} />
        Soy menor de edad
      </label>

      {values.isMinor && (
        <div className="sm:col-span-2">
          <FormField id="complaint-guardianName" label="Padre, madre o apoderado" required error={errors.guardianName}>
            <Input id="complaint-guardianName" placeholder="Nombres y apellidos del padre, madre o apoderado" value={values.guardianName} onChange={(event): void => setField('guardianName', event.target.value)} className={controlClassName} {...describe('guardianName')} />
          </FormField>
        </div>
      )}

      <SheetHeading index="02" title="Identificación del bien contratado" />

      <FormField id="complaint-serviceDescription" label="Servicio" required error={errors.serviceDescription}>
        <Input id="complaint-serviceDescription" placeholder="Ej. Licencia anual de la plataforma" value={values.serviceDescription} onChange={(event): void => setField('serviceDescription', event.target.value)} className={controlClassName} {...describe('serviceDescription')} />
      </FormField>

      <FormField id="complaint-amount" label="Monto reclamado (S/)" hint="Opcional." error={errors.amount}>
        <Input id="complaint-amount" inputMode="decimal" placeholder="0.00" value={values.amount} onChange={(event): void => setField('amount', event.target.value)} className={controlClassName} {...describe('amount')} />
      </FormField>

      <SheetHeading index="03" title="Detalle de la reclamación" />

      <fieldset className="sm:col-span-2">
        <legend className="mb-3 text-sm font-medium text-foreground">
          Tipo <span className="text-brand">*</span>
        </legend>
        <div role="radiogroup" className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {kindOptions.map((option): JSX.Element => {
            const active = values.kind === option.value;
            return (
              <button key={option.value} type="button" role="radio" aria-checked={active} onClick={(): void => setField('kind', option.value)} className={`flex flex-col items-start gap-1 rounded-lg border p-4 text-left transition-colors ${active ? 'border-brand bg-brand-soft' : 'border-border hover:border-brand'}`}>
                <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <span className={`size-2.5 rounded-full border ${active ? 'border-brand bg-brand' : 'border-muted-foreground'}`} aria-hidden="true" />
                  {option.label}
                </span>
                <span className="text-xs text-muted-foreground">{option.description}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="sm:col-span-2">
        <FormField id="complaint-detail" label="Detalle" required error={errors.detail} hint={`${values.detail.length} / 1500`}>
          <Textarea id="complaint-detail" rows={5} maxLength={1500} placeholder="Describe qué ocurrió, cuándo y cómo te afectó." value={values.detail} onChange={(event): void => setField('detail', event.target.value)} className="min-h-32 rounded-lg bg-background" {...describe('detail')} />
        </FormField>
      </div>

      <div className="sm:col-span-2">
        <FormField id="complaint-request" label="Pedido" required error={errors.request}>
          <Textarea id="complaint-request" rows={3} maxLength={800} placeholder="¿Qué solución esperas?" value={values.request} onChange={(event): void => setField('request', event.target.value)} className="min-h-24 rounded-lg bg-background" {...describe('request')} />
        </FormField>
      </div>

      <div className="sm:col-span-2">
        <label className="flex cursor-pointer items-start gap-3 rounded-lg bg-surface p-4 text-xs leading-relaxed text-muted-foreground">
          <Checkbox className="mt-0.5" checked={values.consent} onCheckedChange={(next): void => setField('consent', next)} {...describe('consent')} />
          <span>
            Declaro que la información es verdadera y autorizo su tratamiento para atender esta hoja, conforme a la{' '}
            <Link href="/legal/privacy" className="font-medium text-brand underline decoration-dotted underline-offset-4 hover:text-brand-solid-hover">
              Política de privacidad
            </Link>
            . <span className="text-brand">*</span>
          </span>
        </label>
        {errors.consent && (
          <p id="complaint-consent-error" role="alert" className="mt-2 text-xs text-destructive">
            {errors.consent}
          </p>
        )}
      </div>

      <div className="sm:col-span-2">
        <TurnstileField turnstileRef={turnstileRef} error={errors.captcha} onToken={setCaptchaToken} />
      </div>

      <div className="flex justify-end sm:col-span-2">
        <button type="submit" disabled={isPending} className="btn-brand w-full sm:w-auto">
          <MorphIcon icon={isPending ? LoaderCircle : ArrowUpRight} size={16} className={isPending ? 'animate-spin' : ''} />
          {isPending ? 'Registrando…' : 'Registrar hoja'}
        </button>
      </div>
    </form>
  );
};
