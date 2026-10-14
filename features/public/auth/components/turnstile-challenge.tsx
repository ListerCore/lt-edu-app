'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import type { JSX } from 'react';
import { ShieldCheck } from 'lucide-react';
import type { TurnstileChallengeProps } from '../types';

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export const TurnstileChallenge = ({ onTokenChange }: TurnstileChallengeProps): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect((): (() => void) | undefined => {
    if (!loaded || !siteKey || !containerRef.current || !window.turnstile) return undefined;
    widgetRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: 'auto',
      callback: (token: string): void => onTokenChange(token),
      'expired-callback': (): void => onTokenChange(''),
      'error-callback': (): void => {
        onTokenChange('');
        setFailed(true);
      },
    });
    return (): void => {
      if (widgetRef.current) window.turnstile?.remove(widgetRef.current);
      widgetRef.current = null;
    };
  }, [loaded, onTokenChange]);

  return (
    <div className="flex min-h-16 flex-col items-center justify-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-3">
      {siteKey ? (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" onReady={(): void => setLoaded(true)} onError={(): void => setFailed(true)} />
          <div ref={containerRef} />
          {failed && (
            <p role="alert" className="text-center text-[11px] text-destructive">
              No se pudo cargar la verificación. Inténtalo de nuevo.
            </p>
          )}
        </>
      ) : (
        <p className="flex items-center gap-2 text-center text-[11px] text-muted-foreground">
          <ShieldCheck aria-hidden="true" className="size-4 shrink-0 text-secondary" />
          La verificación de seguridad no está configurada.
        </p>
      )}
    </div>
  );
};
