'use client';

import { useSearchParams } from 'next/navigation';
import type { JSX } from 'react';
import { CircleX } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { authErrorMessages } from '../data/auth-data';

// Explains why a redirect brought the visitor back (?error=...); reads the query, so it sits under Suspense
export const AuthErrorNotice = (): JSX.Element | null => {
  const code = useSearchParams().get('error');
  const message = code ? authErrorMessages[code] : undefined;
  if (!message) return null;
  return (
    <p role="alert" className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/8 px-3 py-2.5 text-sm text-destructive">
      <MorphIcon icon={CircleX} size={16} className="mt-0.5 shrink-0" />
      {message}
    </p>
  );
};
