'use client';

import type { JSX } from 'react';
import { useMemo, useState } from 'react';
import { Ellipsis, FileDown, KeyRound, MonitorCog, Plus, Search, ShieldCheck, SlidersHorizontal, UserRoundCog } from 'lucide-react';
import { institutionalAccounts } from '../data/settings-data';

const SettingsAccounts = (): JSX.Element => {
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('Todos los roles');
  const [status, setStatus] = useState('Todos');
  const [twoFactor, setTwoFactor] = useState('Estado 2FA');
  const filteredAccounts = useMemo(
    () =>
      institutionalAccounts.filter((account) => {
        const matchesQuery = `${account.name} ${account.identity} ${account.email} ${account.role}`.toLowerCase().includes(query.toLowerCase());
        return matchesQuery && (role === 'Todos los roles' || account.role === role) && (status === 'Todos' || account.status === status) && (twoFactor === 'Estado 2FA' || account.twoFactor === twoFactor);
      }),
    [query, role, status, twoFactor],
  );

  return (
    <section id="accounts" className="scroll-mt-32 overflow-hidden rounded-lg border border-border bg-card" aria-labelledby="accounts-heading">
      <div className="flex flex-col gap-4 border-b border-border px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 id="accounts-heading" className="font-heading text-sm font-bold text-foreground sm:text-base">
            Padrón de cuentas y accesos
          </h2>
          <p className="mt-1 text-[10px] text-muted-foreground">Control granular de credenciales de acceso institucional al ecosistema virtual Joseph Lister.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-[10px] font-semibold text-foreground transition-colors hover:bg-muted">
            <KeyRound aria-hidden="true" className="size-3.5" /> Forzar cambio de clave
          </button>
          <button type="button" className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-[10px] font-semibold text-foreground transition-colors hover:bg-muted">
            <FileDown aria-hidden="true" className="size-3.5" /> Descargar CSV
          </button>
          <button type="button" className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-[10px] font-semibold text-primary-foreground transition-opacity hover:opacity-90">
            <Plus aria-hidden="true" className="size-3.5" /> Nuevo usuario
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-b border-border bg-muted/30 p-3 sm:flex-row sm:flex-wrap sm:items-center sm:p-4">
        <label className="relative min-w-0 flex-1 basis-56">
          <Search aria-hidden="true" className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input value={query} onChange={(event): void => setQuery(event.target.value)} placeholder="Buscar por DNI, apellidos, nombres o correo" className="h-9 w-full rounded-md border border-border bg-card pl-9 pr-3 text-[10px] text-foreground outline-none placeholder:text-muted-foreground focus:border-ring" />
        </label>
        <select aria-label="Filtrar por rol" value={role} onChange={(event): void => setRole(event.target.value)} className="h-9 min-w-0 max-w-full rounded-md border border-border bg-card px-2.5 text-[10px] text-foreground">
          <option>Todos los roles</option>
          {Array.from(new Set(institutionalAccounts.map((account) => account.role))).map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select aria-label="Filtrar por estado" value={status} onChange={(event): void => setStatus(event.target.value)} className="h-9 min-w-0 max-w-full rounded-md border border-border bg-card px-2.5 text-[10px] text-foreground">
          <option>Todos</option>
          <option>Activo</option>
          <option>Pendiente</option>
        </select>
        <select aria-label="Filtrar por 2FA" value={twoFactor} onChange={(event): void => setTwoFactor(event.target.value)} className="h-9 min-w-0 max-w-full rounded-md border border-border bg-card px-2.5 text-[10px] text-foreground">
          <option>Estado 2FA</option>
          <option>Activo</option>
          <option>Opcional</option>
        </select>
        <button
          type="button"
          aria-label="Limpiar filtros"
          onClick={(): void => {
            setQuery('');
            setRole('Todos los roles');
            setStatus('Todos');
            setTwoFactor('Estado 2FA');
          }}
          className="flex h-9 items-center justify-center gap-1.5 rounded-md border border-border bg-card px-2.5 text-[10px] font-semibold text-muted-foreground hover:text-foreground"
        >
          <SlidersHorizontal aria-hidden="true" className="size-3.5" />
          <span className="sm:hidden">Limpiar filtros</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-225 border-collapse text-left">
          <thead className="bg-muted/60 text-[8px] font-bold uppercase tracking-wide text-muted-foreground">
            <tr>
              {['Colaborador / estudiante', 'Rol institucional', 'Correo institucional', 'Último acceso / IP', 'Seguridad 2FA', 'Estado', 'Acciones'].map((heading) => (
                <th key={heading} scope="col" className="px-3 py-3 first:pl-4 sm:px-4">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredAccounts.map((account) => (
              <tr key={account.email} className="transition-colors hover:bg-muted/30">
                <td className="px-3 py-3 first:pl-4 sm:px-4">
                  <div className="flex items-center gap-2.5">
                    <span className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${account.tone}`}>{account.initials}</span>
                    <span className="min-w-0">
                      <span className="block max-w-48 truncate text-[9px] font-semibold text-foreground">{account.name}</span>
                      <span className="mt-0.5 block max-w-48 truncate text-[8px] text-muted-foreground">{account.identity}</span>
                    </span>
                  </div>
                </td>
                <td className="px-3 py-3 sm:px-4">
                  <span className="inline-flex rounded-full bg-accent px-2 py-1 text-[8px] font-semibold text-accent-foreground">{account.role}</span>
                </td>
                <td className="max-w-48 break-all px-3 py-3 text-[9px] text-muted-foreground sm:px-4">{account.email}</td>
                <td className="px-3 py-3 sm:px-4">
                  <span className="block text-[9px] font-medium text-foreground">{account.lastAccess}</span>
                  <span className="mt-0.5 block max-w-32 truncate font-mono text-[8px] text-muted-foreground">{account.location}</span>
                </td>
                <td className="px-3 py-3 sm:px-4">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[8px] font-semibold ${account.twoFactor === 'Activo' ? 'bg-secondary/10 text-secondary' : 'bg-muted text-muted-foreground'}`}>
                    <ShieldCheck aria-hidden="true" className="size-3" />
                    {account.twoFactor}
                  </span>
                </td>
                <td className="px-3 py-3 sm:px-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-1 text-[8px] font-semibold text-secondary">
                    <span className="size-1.5 rounded-full bg-secondary" />
                    {account.status}
                  </span>
                </td>
                <td className="px-3 py-3 sm:px-4">
                  <div className="flex items-center gap-1">
                    <button type="button" aria-label={`Administrar ${account.name}`} className="grid size-7 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-foreground">
                      <UserRoundCog aria-hidden="true" className="size-3.5" />
                    </button>
                    <button type="button" aria-label={`Credenciales de ${account.name}`} className="grid size-7 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-foreground">
                      <KeyRound aria-hidden="true" className="size-3.5" />
                    </button>
                    <button type="button" aria-label={`Sesiones de ${account.name}`} className="grid size-7 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-foreground">
                      <MonitorCog aria-hidden="true" className="size-3.5" />
                    </button>
                    <button type="button" aria-label={`Más acciones para ${account.name}`} className="grid size-7 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-foreground">
                      <Ellipsis aria-hidden="true" className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredAccounts.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-xs text-muted-foreground">
                  No hay cuentas que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-2 border-t border-border px-4 py-3 text-[9px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>Mostrando {filteredAccounts.length} de 932 registros institucionales</span>
        <div className="flex items-center gap-1">
          <span className="mr-2">Página 1 de 156</span>
          <button type="button" aria-current="page" className="size-7 rounded bg-primary text-[9px] font-bold text-primary-foreground">
            1
          </button>
          <button type="button" className="size-7 rounded hover:bg-muted">
            2
          </button>
          <button type="button" className="size-7 rounded hover:bg-muted">
            3
          </button>
          <span className="px-1">…</span>
          <button type="button" className="size-7 rounded hover:bg-muted">
            156
          </button>
        </div>
      </div>
    </section>
  );
};

export { SettingsAccounts };
