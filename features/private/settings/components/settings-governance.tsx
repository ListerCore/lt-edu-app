'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import { Check, CircleHelp, LockKeyhole, Save, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { criticalPermissions, permissionRoles } from '../data/settings-data';

const RolePermissionMatrix = (): JSX.Element => (
  <section id="rbac" aria-labelledby="rbac-heading" className="min-w-0 scroll-mt-32 overflow-hidden rounded-lg border border-border bg-card p-4 sm:p-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <ShieldCheck aria-hidden="true" className="size-4 text-primary" />
          <h2 id="rbac-heading" className="font-heading text-xs font-bold text-foreground sm:text-sm">
            Matriz de permisos por rol (RBAC)
          </h2>
        </div>
        <p className="mt-1 text-[9px] leading-4 text-muted-foreground">Controla el acceso a operaciones críticas de acuerdo con las funciones institucionales.</p>
      </div>
      <button type="button" className="inline-flex h-8 items-center gap-1.5 rounded-md bg-accent px-2.5 text-[9px] font-semibold text-accent-foreground hover:bg-accent/80">
        <SlidersHorizontal aria-hidden="true" className="size-3.5" /> Configurar roles
      </button>
    </div>
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-160 border-collapse text-left">
        <thead>
          <tr className="bg-muted/60 text-[8px] font-bold uppercase tracking-wide text-muted-foreground">
            <th scope="col" className="px-2.5 py-2.5">
              Operación crítica
            </th>
            {permissionRoles.map((role) => (
              <th scope="col" key={role} className="px-2 py-2.5 text-center">
                {role}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {criticalPermissions.map(({ action, access }) => (
            <tr key={action} className="hover:bg-muted/20">
              <th scope="row" className="max-w-48 px-2.5 py-3 text-[9px] font-medium leading-4 text-foreground">
                {action}
              </th>
              {access.map((permitted, index) => (
                <td key={`${action}-${permissionRoles[index]}`} className="px-2 py-3 text-center">
                  {permitted ? (
                    <span className="inline-flex size-4 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                      <Check aria-label="Permitido" className="size-3" />
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground/60">—</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="mt-4 flex items-start gap-2 rounded-md bg-accent/60 p-3 text-[9px] leading-4 text-muted-foreground">
      <CircleHelp aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-primary" />
      <p>Los privilegios de Promotor y Dirección General están protegidos con cifrado en reposo AES-256 en registros de nómina.</p>
    </div>
  </section>
);

const PolicySwitch = ({ label, detail, enabled, onChange }: { label: string; detail: string; enabled: boolean; onChange: (enabled: boolean) => void }): JSX.Element => {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md bg-muted/60 p-3">
      <div className="min-w-0">
        <p className="text-[9px] font-semibold text-foreground">{label}</p>
        <p className="mt-0.5 text-[8px] leading-4 text-muted-foreground">{detail}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className={`hidden text-[8px] font-semibold sm:inline ${enabled ? 'text-secondary' : 'text-muted-foreground'}`}>{enabled ? 'Activada' : 'Desactivada'}</span>
        <Switch checked={enabled} onCheckedChange={onChange} aria-label={`${label}: ${enabled ? 'desactivar' : 'activar'}`} />
      </div>
    </div>
  );
};

const AccessPolicies = (): JSX.Element => {
  const [policies, setPolicies] = useState({ passwordExpiry: true, timeRestriction: true, bruteForce: false });
  const [saved, setSaved] = useState(false);
  const togglePolicy = (policy: keyof typeof policies, enabled: boolean): void => {
    setPolicies((current) => ({ ...current, [policy]: enabled }));
    setSaved(false);
  };

  return (
    <section id="access-policies" aria-labelledby="policies-heading" className="min-w-0 scroll-mt-32 flex flex-col rounded-lg border border-border bg-card p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <LockKeyhole aria-hidden="true" className="size-4 text-primary" />
        <h2 id="policies-heading" className="font-heading text-xs font-bold text-foreground sm:text-sm">
          Políticas de acceso
        </h2>
      </div>
      <p className="mt-1 text-[9px] leading-4 text-muted-foreground">Parámetros de credenciales para el personal académico y directivo.</p>
      <div className="mt-4 flex-1 space-y-2.5">
        <PolicySwitch label="Expiración periódica de clave" detail="Obligatorio cada 90 días naturales" enabled={policies.passwordExpiry} onChange={(enabled): void => togglePolicy('passwordExpiry', enabled)} />
        <div className="flex items-center justify-between gap-3 rounded-md bg-muted/60 p-3">
          <div>
            <p className="text-[9px] font-semibold text-foreground">Longitud mínima</p>
            <p className="mt-0.5 text-[8px] text-muted-foreground">Mayúsculas, números y símbolos</p>
          </div>
          <span className="rounded bg-accent px-2 py-1 text-[8px] font-bold text-accent-foreground">10 caracteres</span>
        </div>
        <PolicySwitch label="Restricción horaria (Caja y Docencia)" detail="Bloquea ingresos de 11:30 p. m. a 05:30 a. m." enabled={policies.timeRestriction} onChange={(enabled): void => togglePolicy('timeRestriction', enabled)} />
        <PolicySwitch label="Bloqueo automático brute-force" detail="Tras 5 fallos consecutivos, bloqueo por IP 60 min" enabled={policies.bruteForce} onChange={(enabled): void => togglePolicy('bruteForce', enabled)} />
        <div className="flex items-center justify-between gap-3 rounded-md border border-destructive/20 bg-destructive/5 p-3">
          <div>
            <p className="text-[9px] font-semibold text-foreground">Intentos antes del bloqueo</p>
            <p className="mt-0.5 text-[8px] text-muted-foreground">Límite consecutivo por dirección IP</p>
          </div>
          <span className="rounded bg-destructive/10 px-2 py-1 text-[8px] font-bold text-destructive">5 fallos</span>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
        <span role="status" className="text-[8px] text-muted-foreground">
          {saved ? 'Cambios guardados' : 'Los cambios están pendientes de guardar'}
        </span>
        <button type="button" onClick={(): void => setSaved(true)} className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-2.5 text-[9px] font-semibold text-primary-foreground hover:opacity-90">
          <Save aria-hidden="true" className="size-3.5" />
          {saved ? 'Políticas guardadas' : 'Guardar políticas'}
        </button>
      </div>
    </section>
  );
};

const SettingsGovernance = (): JSX.Element => (
  <div className="grid items-stretch gap-4 xl:grid-cols-[1.15fr_0.85fr]">
    <RolePermissionMatrix />
    <AccessPolicies />
  </div>
);

export { AccessPolicies, RolePermissionMatrix, SettingsGovernance };
