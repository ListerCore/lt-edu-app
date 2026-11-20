'use client';

import type { JSX } from 'react';
import { ExternalLink, MonitorPlay, Video } from 'lucide';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { cn } from '@/lib/utils';
import { NEW_MEET_URL } from '../data/meetings-data';
import type { LiveProvider, ProviderPickerProps } from '../types';

const options: { value: LiveProvider; title: string; hint: string; icon: typeof Video }[] = [
  { value: 'platform', title: 'En la plataforma', hint: 'La videollamada se abre aquí mismo, sin otra cuenta ni app.', icon: MonitorPlay },
  { value: 'meet', title: 'Google Meet', hint: 'Pega el enlace de una reunión de Google Meet (u otro servicio).', icon: Video },
];

// Where a live session happens: the call inside ListerCore Edu or an external Google Meet link
export const ProviderPicker = ({ id, provider, link, platformAvailable, onProvider, onLink, linkError, linkOptional }: ProviderPickerProps): JSX.Element => (
  <fieldset className="grid gap-3">
    <legend className="mb-1 text-sm font-medium text-foreground">¿Dónde será la videollamada?</legend>
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((o) => {
        const disabled = o.value === 'platform' && !platformAvailable;
        const checked = provider === o.value;
        return (
          <label key={o.value} className={cn('flex cursor-pointer gap-3 rounded-xl border p-3 text-sm transition-colors', checked ? 'border-brand bg-brand/10' : 'border-border hover:bg-surface', disabled && 'cursor-not-allowed opacity-60 hover:bg-transparent')}>
            <input type="radio" name={`${id}-provider`} value={o.value} checked={checked} disabled={disabled} onChange={(): void => onProvider(o.value)} className="mt-0.5 size-4 accent-brand" />
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2 font-medium text-foreground">
                <MorphIcon icon={o.icon} size={16} />
                {o.title}
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{disabled ? 'Aún no está configurada en este servidor. Usa Google Meet.' : o.hint}</span>
            </span>
          </label>
        );
      })}
    </div>
    {provider === 'meet' && (
      <FormField id={`${id}-link`} label="Enlace de Google Meet" required={!linkOptional} error={linkError || undefined} hint={linkOptional ? 'Puedes agregarlo después.' : undefined}>
        <div className="grid gap-2">
          <Input id={`${id}-link`} type="url" placeholder="https://meet.google.com/abc-defg-hij" maxLength={500} value={link} onChange={(e): void => onLink(e.target.value)} />
          <a href={NEW_MEET_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 justify-self-start text-xs font-medium text-brand hover:underline">
            <MorphIcon icon={ExternalLink} size={14} />
            Crear reunión en Google Meet
          </a>
        </div>
      </FormField>
    )}
  </fieldset>
);
