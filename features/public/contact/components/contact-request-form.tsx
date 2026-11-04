'use client';

import Link from 'next/link';
import type { FormEvent, JSX } from 'react';
import { ArrowUpRight, LoaderCircle } from 'lucide';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TurnstileField } from '@/features/auth/components/turnstile-field';
import { relationOptions, topicOptions } from '../data/contact-data';
import { useCreateContactRequest } from '../hooks/use-create-contact-request';
import type { ContactRelation, ContactRequestField, ContactTopic } from '../types';
import { ContactRequestSuccess } from './contact-request-success';

const controlClassName = 'h-11 w-full rounded-lg bg-background';

// Inquiry form for applicants and families; all state and validation live in useCreateContactRequest
export const ContactRequestForm = (): JSX.Element => {
  const { values, errors, isPending, isSubmitted, turnstileRef, setCaptchaToken, setField, submit, reset } = useCreateContactRequest();

  if (isSubmitted) return <ContactRequestSuccess email={values.email} onReset={reset} />;

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    submit();
  };

  // aria wiring shared by every control that can show an error
  const describe = (field: ContactRequestField): { 'aria-invalid': boolean; 'aria-describedby'?: string } => ({ 'aria-invalid': Boolean(errors[field]), 'aria-describedby': errors[field] ? `contact-${field}-error` : undefined });

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Enviar consulta" className="grid grid-cols-1 gap-x-5 gap-y-6 p-6 sm:grid-cols-2 md:p-8">
      <FormField id="contact-fullName" label="Nombre completo" required error={errors.fullName}>
        <Input id="contact-fullName" autoComplete="name" placeholder="Ej. María Quispe Huamán" value={values.fullName} onChange={(event): void => setField('fullName', event.target.value)} className={controlClassName} {...describe('fullName')} />
      </FormField>

      <FormField id="contact-relation" label="Escribo como" required error={errors.relation}>
        <Select items={relationOptions} value={values.relation || null} onValueChange={(value): void => setField('relation', (value ?? '') as ContactRelation | '')}>
          <SelectTrigger id="contact-relation" className={controlClassName} {...describe('relation')}>
            <SelectValue placeholder="Selecciona una opción" />
          </SelectTrigger>
          <SelectContent>
            {relationOptions.map((option): JSX.Element => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField id="contact-email" label="Correo" required error={errors.email}>
        <Input id="contact-email" type="email" autoComplete="email" inputMode="email" placeholder="nombre@correo.com" value={values.email} onChange={(event): void => setField('email', event.target.value)} className={controlClassName} {...describe('email')} />
      </FormField>

      <FormField id="contact-phone" label="Teléfono / WhatsApp" hint="Opcional." error={errors.phone}>
        <Input id="contact-phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+51 9XX XXX XXX" value={values.phone} onChange={(event): void => setField('phone', event.target.value)} className={controlClassName} {...describe('phone')} />
      </FormField>

      <FormField id="contact-topic" label="Motivo" required error={errors.topic}>
        <Select items={topicOptions} value={values.topic || null} onValueChange={(value): void => setField('topic', (value ?? '') as ContactTopic | '')}>
          <SelectTrigger id="contact-topic" className={controlClassName} {...describe('topic')}>
            <SelectValue placeholder="Selecciona el motivo" />
          </SelectTrigger>
          <SelectContent>
            {topicOptions.map((option): JSX.Element => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField id="contact-interest" label="Nivel, ciclo o programa de interés" hint="Opcional.">
        <Input id="contact-interest" placeholder="Ej. 1.° de secundaria, ciclo intensivo" value={values.interest} onChange={(event): void => setField('interest', event.target.value)} className={controlClassName} />
      </FormField>

      <div className="sm:col-span-2">
        <FormField id="contact-message" label="Tu consulta" required error={errors.message}>
          <Textarea id="contact-message" rows={4} maxLength={2000} placeholder="Ej. ¿Qué documentos necesito para la matrícula y hasta cuándo hay vacantes?" value={values.message} onChange={(event): void => setField('message', event.target.value)} className="min-h-28 rounded-lg bg-background" {...describe('message')} />
        </FormField>
      </div>

      <div className="sm:col-span-2">
        <label className="flex cursor-pointer items-start gap-3 rounded-lg bg-surface p-4 text-xs leading-relaxed text-muted-foreground">
          <Checkbox className="mt-0.5" checked={values.consent} onCheckedChange={(next): void => setField('consent', next)} {...describe('consent')} />
          <span>
            Autorizo el tratamiento de mis datos personales para responder esta consulta, conforme a la Ley N.° 29733 y a la{' '}
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
          {isPending ? 'Enviando…' : 'Enviar consulta'}
          <MorphIcon icon={isPending ? LoaderCircle : ArrowUpRight} size={16} className={isPending ? 'animate-spin' : ''} />
        </button>
      </div>
    </form>
  );
};
