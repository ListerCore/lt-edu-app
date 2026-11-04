'use client';

import type { TurnstileInstance } from '@marsidev/react-turnstile';
import { useCallback, useRef, useState } from 'react';
import type { UseCaptchaResult } from '../types';

// Turnstile ref + single-use token; consume() hands the token over and asks the widget for a fresh one
export const useCaptcha = (onSolved?: () => void): UseCaptchaResult => {
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [token, setToken] = useState<string | null>(null);

  const setCaptchaToken = useCallback(
    (next: string | null): void => {
      setToken(next);
      if (next) onSolved?.();
    },
    [onSolved],
  );

  const consume = useCallback((): string => {
    const current = token ?? '';
    turnstileRef.current?.reset();
    setToken(null);
    return current;
  }, [token]);

  return { turnstileRef, captchaToken: token, setCaptchaToken, consume };
};
