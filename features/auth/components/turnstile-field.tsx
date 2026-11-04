'use client';

import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import type { JSX, RefObject } from 'react';
import { sileo } from 'sileo';
import { useTheme } from '@/components/providers/theme';

// Cloudflare's always-passing test key keeps development usable without a real site key; production requires one.
// NEXT_PUBLIC_* is inlined at build time: the Docker build receives it as a build arg
const TURNSTILE_TEST_SITE_KEY = '1x00000000000000000000AA';
const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || (process.env.NODE_ENV === 'production' ? '' : TURNSTILE_TEST_SITE_KEY);

interface TurnstileFieldProps {
  turnstileRef: RefObject<TurnstileInstance | null>;
  error?: string;
  onToken: (token: string | null) => void;
}

// Turnstile widget following the site theme; the token is verified by joseph-api and is single use
export const TurnstileField = ({ turnstileRef, error, onToken }: TurnstileFieldProps): JSX.Element => {
  const { resolvedTheme } = useTheme();

  return (
    <div className="flex flex-col gap-2">
      {siteKey ? (
        <Turnstile
          ref={turnstileRef}
          siteKey={siteKey}
          options={{ theme: resolvedTheme, language: 'es', size: 'flexible' }}
          onSuccess={onToken}
          onExpire={(): void => onToken(null)}
          onError={(): void => {
            onToken(null);
            sileo.error({ title: 'Verificación no disponible', description: 'No pudimos cargar la verificación de seguridad. Recarga la página e inténtalo de nuevo.' });
          }}
        />
      ) : (
        <p className="rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">Falta configurar NEXT_PUBLIC_TURNSTILE_SITE_KEY.</p>
      )}
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
};
