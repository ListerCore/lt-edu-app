'use client';

import { useState, type JSX } from 'react';
import { LoaderCircle } from 'lucide';
import { sileo } from 'sileo';
import { MorphIcon } from '@/components/ui/morph-icon';
import { GoogleIcon } from './google-icon';

// "Continuar con Google": the server prepares the sign-in (state + PKCE) and the browser goes to Google's consent
// screen; Google comes back to /api/auth/google/callback
export const GoogleButton = (): JSX.Element => {
  const [isPending, setPending] = useState(false);

  const start = async (): Promise<void> => {
    setPending(true);
    try {
      const response = await fetch('/api/auth/google/start', { method: 'POST' });
      const body = (await response.json().catch(() => null)) as { url?: string; error?: { message?: string } } | null;
      if (response.ok && body?.url) {
        window.location.assign(body.url);
        return;
      }
      sileo.error({ title: 'No pudimos abrir Google', description: body?.error?.message ?? 'Inténtalo de nuevo en unos minutos o usa tu correo.' });
    } catch {
      sileo.error({ title: 'No pudimos abrir Google', description: 'Revisa tu conexión e inténtalo de nuevo.' });
    }
    setPending(false);
  };

  return (
    <button type="button" onClick={(): void => void start()} disabled={isPending} className="inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-full border border-border bg-background text-sm font-semibold text-foreground transition-colors hover:border-brand hover:bg-surface disabled:opacity-70">
      {isPending ? <MorphIcon icon={LoaderCircle} size={18} className="animate-spin" /> : <GoogleIcon className="size-4.5" />}
      {isPending ? 'Abriendo Google…' : 'Continuar con Google'}
    </button>
  );
};
