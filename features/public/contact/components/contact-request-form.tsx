'use client';

import Link from 'next/link';
import type { FormEvent, JSX } from 'react';
import { ArrowUpRight, LoaderCircle } from 'lucide';
import { FormField } from '@/components/layout/form-field';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TurnstileField } from '@/features/auth/components/turnstile-field';
import { siteConfig } from '@/lib/site';
import { institutionTypeOptions, moduleOptions, studentRangeOptions } from '../data/contact-data';
import { useCreateContactRequest } from '../hooks/use-create-contact-request';
import type { ContactRequestField, InstitutionTypeCode, StudentRange } from '../types';
import { ContactRequestSuccess } from './contact-request-success';

const controlClassName = 'h-11 w-full rounded-lg bg-background';

// "Solicitar implementación" form; all state and validation live in useCreateContactRequest
export const ContactRequestForm = (): JSX.Element => {
  const { values, errors, isPending, isSubmitted, turnstileRef, setCaptchaToken, setField, toggleModule, submit, reset } = useCreateContactRequest();

  if (isSubmitted) return <ContactRequestSuccess email={values.email} onReset={reset} />;

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    submit();
  };

  // aria wiring shared by every control that can show an error
  const describe = (field: ContactRequestField): { 'aria-invalid': boolean; 'aria-describedby'?: string } => ({ 'aria-invalid': Boolean(errors[field]), 'aria-describedby': errors[field] ? `contact-${field}-error` : undefined });

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Solicitar implementación" className="grid grid-cols-1 gap-x-5 gap-y-6 p-6 sm:grid-cols-2 md:p-8">
      <FormField id="contact-fullName" label="Nombre completo" required error={errors.fullName}>
        <Input id="contact-fullName" autoComplete="name" placeholder="Ej. María Quispe Huamán" value={values.fullName} onChange={(event): void => setField('fullName', event.target.value)} className={controlClassName} {...describe('fullName')} />
      </FormField>

      <FormField id="contact-position" label="Cargo" hint="Opcional.">
        <Input id="contact-position" autoComplete="organization-title" placeholder="Ej. Director, coordinador académico" value={values.position} onChange={(event): void => setField('position', event.target.value)} className={controlClassName} />
      </FormField>

      <div className="sm:col-span-2">
        <FormField id="contact-institution" label="Institución" required error={errors.institution}>
          <Input id="contact-institution" autoComplete="organization" placeholder="Nombre de tu colegio, CEBA, academia o instituto" value={values.institution} onChange={(event): void => setField('institution', event.target.value)} className={controlClassName} {...describe('institution')} />
        </FormField>
      </div>

      <FormField id="contact-institutionType" label="Tipo de institución" required error={errors.institutionType}>
        <Select items={institutionTypeOptions} value={values.institutionType || null} onValueChange={(value): void => setField('institutionType', (value ?? '') as InstitutionTypeCode | '')}>
          <SelectTrigger id="contact-institutionType" className={controlClassName} {...describe('institutionType')}>
            <SelectValue placeholder="Selecciona el tipo" />
          </SelectTrigger>
          <SelectContent>
            {institutionTypeOptions.map((option): JSX.Element => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField id="contact-students" label="Número de estudiantes" hint="Opcional. Nos ayuda a dimensionar la propuesta.">
        <Select items={studentRangeOptions} value={values.students || null} onValueChange={(value): void => setField('students', (value ?? '') as StudentRange | '')}>
          <SelectTrigger id="contact-students" className={controlClassName}>
            <SelectValue placeholder="Selecciona un rango" />
          </SelectTrigger>
          <SelectContent>
            {studentRangeOptions.map((option): JSX.Element => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField id="contact-email" label="Correo" required error={errors.email}>
        <Input id="contact-email" type="email" autoComplete="email" inputMode="email" placeholder="nombre@institucion.edu.pe" value={values.email} onChange={(event): void => setField('email', event.target.value)} className={controlClassName} {...describe('email')} />
      </FormField>

      <FormField id="contact-phone" label="Teléfono / WhatsApp" hint="Opcional." error={errors.phone}>
        <Input id="contact-phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+51 9XX XXX XXX" value={values.phone} onChange={(event): void => setField('phone', event.target.value)} className={controlClassName} {...describe('phone')} />
      </FormField>

      <fieldset className="sm:col-span-2">
        <legend className="mb-3 text-sm font-medium text-foreground">
          Módulos de interés <span className="font-normal text-muted-foreground">· opcional, puedes marcar varios</span>
        </legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {moduleOptions.map((option): JSX.Element => {
            const checked = values.modules.includes(option.value);
            return (
              <label key={option.value} className={`flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors ${checked ? 'border-brand bg-brand-soft text-foreground' : 'border-border text-muted-foreground hover:border-brand'}`}>
                <Checkbox checked={checked} onCheckedChange={(next): void => toggleModule(option.value, next)} />
                {option.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="sm:col-span-2">
        <FormField id="contact-message" label="Cuéntanos qué necesitas" required error={errors.message}>
          <Textarea id="contact-message" rows={4} maxLength={2000} placeholder="Ej. Somos un CEBA con 3 sedes y llevamos la asistencia y las notas en Excel." value={values.message} onChange={(event): void => setField('message', event.target.value)} className="min-h-28 rounded-lg bg-background" {...describe('message')} />
        </FormField>
      </div>

      <div className="sm:col-span-2">
        <label className="flex cursor-pointer items-start gap-3 rounded-lg bg-surface p-4 text-xs leading-relaxed text-muted-foreground">
          <Checkbox className="mt-0.5" checked={values.consent} onCheckedChange={(next): void => setField('consent', next)} {...describe('consent')} />
          <span>
            Autorizo a {siteConfig.name} a tratar mis datos personales para responder esta consulta, conforme a la Ley N.° 29733 y a la{' '}
            <Link href="/legal/privacy" className="font-medium text-brand underline decoration-dotted underline-offset-4 hover:text-brand-solid-hover">
              Política de privacidad
            </Link>
            . <span className="text-brand">*</span>
          </span>
        </label>
        {errors.consent && (
          <p id="contact-consent-error" role="alert" className="mt-2 text-xs text-destructive">
            {errors.consent}
          </p>
        )}
      </div>

      <div className="sm:col-span-2">
        <TurnstileField turnstileRef={turnstileRef} error={errors.captcha} onToken={setCaptchaToken} />
      </div>

      <div className="flex flex-col-reverse items-start gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          <span className="text-brand">*</span> Campos obligatorios
        </p>
        <button type="submit" disabled={isPending} className="btn-brand w-full sm:w-auto">
          {isPending ? 'Enviando…' : 'Enviar mensaje'}
          <MorphIcon icon={isPending ? LoaderCircle : ArrowUpRight} size={16} className={isPending ? 'animate-spin' : ''} />
        </button>
      </div>
    </form>
  );
};
