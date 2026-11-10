'use client';

import { useState, type JSX } from 'react';
import { Check, Copy, FileDown } from 'lucide';
import { sileo } from 'sileo';
import { MorphIcon } from '@/components/ui/morph-icon';
import { recoveryCodesFileName, recoveryCodesText } from '../data/account-data';
import type { RecoveryCodesSheetProps } from '../types';

// The recovery codes, shown once: copy them all or download them as .txt before leaving
export const RecoveryCodesSheet = ({ codes, email, issuedAt }: RecoveryCodesSheetProps): JSX.Element => {
  const [copied, setCopied] = useState(false);
  const text = recoveryCodesText(codes, email, issuedAt);

  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
      sileo.success({ title: 'Códigos copiados', description: 'Pégalos en un lugar seguro, como tu gestor de contraseñas.' });
    } catch {
      sileo.error({ title: 'No se pudo copiar', description: 'Tu navegador bloqueó el portapapeles. Descárgalos como archivo.' });
    }
  };

  const download = (): void => {
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = recoveryCodesFileName(issuedAt);
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <ol aria-label="Códigos de respaldo" className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-surface p-4 font-mono text-sm">
        {codes.map((code, index): JSX.Element => (
          <li key={code} className="flex items-center gap-2 text-foreground">
            <span className="w-5 text-right text-xs text-muted-foreground tabular-nums">{index + 1}.</span>
            <span className="tracking-wider select-all">{code}</span>
          </li>
        ))}
      </ol>
      <div className="grid gap-2 sm:grid-cols-2">
        <button type="button" onClick={(): void => void copy()} className="btn-alt">
          <MorphIcon icon={copied ? Check : Copy} size={16} />
          {copied ? 'Copiados' : 'Copiar códigos'}
        </button>
        <button type="button" onClick={download} className="btn-alt">
          <MorphIcon icon={FileDown} size={16} />
          Descargar .txt
        </button>
      </div>
    </div>
  );
};
