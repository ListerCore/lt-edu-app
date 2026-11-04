'use client';

import type { FormEvent, JSX } from 'react';
import { LoaderCircle, Mail, Pencil } from 'lucide';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { useUpdateAccountContact } from '../hooks/use-update-account-contact';
import type { AccountContact, AccountContactCardProps } from '../types';

const fields: Array<{ key: keyof AccountContact; label: string; type: string; autoComplete: string }> = [
  { key: 'email', label: 'Correo', type: 'email', autoComplete: 'email' },
  { key: 'phone', label: 'Teléfono / WhatsApp', type: 'tel', autoComplete: 'tel' },
  { key: 'address', label: 'Dirección', type: 'text', autoComplete: 'street-address' },
];

// Contact data the person keeps up to date: read view with "Editar", inline form while editing
export const AccountContactCard = ({ contact, onSaved }: AccountContactCardProps): JSX.Element => {
  const { values, errors, isEditing, isPending, setField, startEditing, cancel, submit } = useUpdateAccountContact(contact, onSaved);

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    submit();
  };

  return (
    <section aria-labelledby="account-contact" className="rounded-2xl border border-border bg-background p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 id="account-contact" className="flex items-center gap-2.5 text-base font-semibold text-foreground">
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand-soft text-brand">
            <MorphIcon icon={Mail} size={16} />
          </span>
          Contacto
        </h2>
        {!isEditing && (
          <button type="button" onClick={startEditing} className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-brand">
            <MorphIcon icon={Pencil} size={14} />
            Editar
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={onSubmit} noValidate className="mt-5 grid gap-4 sm:grid-cols-2">
          {fields.map(({ key, label, type, autoComplete }): JSX.Element => (
            <div key={key} className={key === 'address' ? 'sm:col-span-2' : undefined}>
              <FormField id={`contact-${key}`} label={label} error={errors[key]}>
                <Input id={`contact-${key}`} type={type} autoComplete={autoComplete} value={values[key]} onChange={(event): void => setField(key, event.target.value)} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `contact-${key}-error` : undefined} className="h-10 rounded-lg bg-background" />
              </FormField>
            </div>
          ))}
          <div className="flex justify-end gap-2 sm:col-span-2">
            <button type="button" onClick={cancel} disabled={isPending} className="btn-alt">
              Cancelar
            </button>
            <button type="submit" disabled={isPending} className="btn-brand">
              {isPending && <MorphIcon icon={LoaderCircle} size={16} className="animate-spin" />}
              {isPending ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      ) : (
        <dl className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2">
          {fields.map(({ key, label }): JSX.Element => (
            <div key={key} className={key === 'address' ? 'sm:col-span-2' : undefined}>
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className={key === 'phone' ? 'mt-0.5 font-mono text-sm text-foreground' : 'mt-0.5 text-sm text-foreground'}>{contact[key]}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
};
