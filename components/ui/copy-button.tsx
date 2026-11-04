'use client';

import { Check, Copy } from 'lucide';
import { useEffect, useState, type JSX } from 'react';
import { sileo } from 'sileo';
import { cn } from '@/lib/utils';
import { MorphIcon } from './morph-icon';

interface CopyButtonProps {
  value: string;
  // What is being copied, for the toast and the accessible name ("URI de redirección")
  label: string;
  className?: string;
}

// Copies a value to the clipboard; the icon morphs to a check while the toast confirms it
export const CopyButton = ({ value, label, className }: CopyButtonProps): JSX.Element => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  const onCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      sileo.success({ title: 'Copiado', description: `${label} quedó en el portapapeles.` });
    } catch {
      sileo.error({ title: 'No se pudo copiar', description: 'Tu navegador bloqueó el portapapeles. Selecciona el texto y cópialo a mano.' });
    }
  };

  return (
    <button type="button" onClick={(): void => void onCopy()} aria-label={`Copiar ${label}`} title={`Copiar ${label}`} className={cn('flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-brand', copied && 'text-success hover:text-success', className)}>
      <MorphIcon icon={copied ? Check : Copy} size={14} />
    </button>
  );
};
