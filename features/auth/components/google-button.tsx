'use client';

import type { JSX } from 'react';
import { sileo } from 'sileo';
import { GoogleIcon } from './google-icon';

// Google sign-in placeholder: OAuth is not wired yet, so it only explains that
export const GoogleButton = (): JSX.Element => (
  <button type="button" onClick={(): void => void sileo.info({ title: 'Ingreso con Google', description: 'Disponible cuando se conecte con joseph-api. Por ahora usa tu correo.' })} className="inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-full border border-border bg-background text-sm font-semibold text-foreground transition-colors hover:border-brand hover:bg-surface">
    <GoogleIcon className="size-4.5" />
    Continuar con Google
  </button>
);
