import type { JSX } from 'react';
import { formatDateTime } from '../data/account-data';
import type { UsedRecoveryCodesProps } from '../types';

// How many recovery codes are left, and the ones already spent (a used code no longer opens anything)
export const UsedRecoveryCodes = ({ status }: UsedRecoveryCodesProps): JSX.Element => {
  const { total, remaining, used } = status.recovery;
  const low = remaining <= 2;
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-muted-foreground">Códigos de respaldo</span>
        <span className={low ? 'pill bg-destructive/10 text-destructive' : 'pill bg-success/12 text-success'}>
          Quedan {remaining} de {total}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface" role="progressbar" aria-label="Códigos de respaldo disponibles" aria-valuemin={0} aria-valuemax={total} aria-valuenow={remaining}>
        <div className={low ? 'h-full bg-destructive' : 'h-full bg-success'} style={{ width: `${total > 0 ? (remaining / total) * 100 : 0}%` }} />
      </div>
      {low && <p className="text-xs text-destructive">Te quedan pocos códigos. Genera nuevos para no quedarte sin acceso si pierdes tu teléfono.</p>}
      <div>
        <h4 className="text-xs font-medium text-muted-foreground">Códigos ya utilizados</h4>
        {used.length === 0 ? (
          <p className="mt-1 text-sm text-muted-foreground">Todavía no usaste ninguno.</p>
        ) : (
          <ul className="mt-2 divide-y divide-border rounded-xl border border-border">
            {used.map(({ code, usedAt }): JSX.Element => (
              <li key={code} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 px-3 py-2 text-sm">
                <span className="font-mono tracking-wider text-muted-foreground line-through">{code}</span>
                <span className="text-xs text-muted-foreground">Usado el {formatDateTime(usedAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
