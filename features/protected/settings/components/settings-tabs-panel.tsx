'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Building2, CircleHelp, Download, Fingerprint, ShieldCheck } from 'lucide-react';
import { SettingsAccounts } from './settings-accounts';
import { SettingsAudit } from './settings-audit';
import { AccessPolicies, RolePermissionMatrix } from './settings-governance';
import { SettingsIntegrations } from './settings-integrations';
import { SettingsOverview } from './settings-overview';

const tabs = [
  { id: 'accounts', label: 'Usuarios y credenciales', icon: Fingerprint },
  { id: 'rbac', label: 'Matriz de roles y permisos', icon: ShieldCheck },
  { id: 'security', label: 'Seguridad y políticas de acceso', icon: ShieldCheck },
  { id: 'institution', label: 'Configuración general CEBA', icon: Building2 },
  { id: 'audit', label: 'Auditoría', icon: Download },
] as const;

type SettingsTab = (typeof tabs)[number]['id'];

const isSettingsTab = (value: string | null): value is SettingsTab => tabs.some(({ id }) => id === value);

const tabNotes: Partial<Record<SettingsTab, { title: string; intro: string; items: { heading: string; detail: string }[] }>> = {
  security: {
    title: 'Notas de seguridad',
    intro: 'Guía rápida para revisar las políticas de acceso institucional.',
    items: [
      { heading: 'Vigencia de contraseña', detail: 'El periodo recomendado es de 90 días. Avisa al personal antes de que venza su clave.' },
      { heading: 'Bloqueo de acceso', detail: 'Cinco intentos fallidos bloquean temporalmente la dirección de origen.' },
      { heading: 'Autenticación 2FA', detail: 'Mantén el segundo factor activo para cuentas directivas y administrativas.' },
      { heading: 'Aplicación', detail: 'Los cambios se aplican a los siguientes inicios de sesión.' },
    ],
  },
  institution: {
    title: 'Notas institucionales',
    intro: 'Datos que identifican al CEBA y conectan sus servicios externos.',
    items: [
      { heading: 'Códigos modulares', detail: 'Verifica que cada código corresponda al ciclo y nivel autorizado por DREA.' },
      { heading: 'Credenciales API', detail: 'Los valores sensibles aparecen ocultos. Revísalos solo durante una rotación o diagnóstico.' },
      { heading: 'Entorno', detail: 'Confirma el ambiente antes de probar conexiones para evitar operar contra producción.' },
      { heading: 'Guardado', detail: 'Guarda los cambios institucionales después de revisar los campos modificados.' },
    ],
  },
  audit: {
    title: 'Notas de auditoría',
    intro: 'La bitácora ayuda a reconstruir accesos y operaciones administrativas.',
    items: [
      { heading: 'Trazabilidad', detail: 'Cada evento registra la acción, la cuenta responsable y su marca de tiempo.' },
      { heading: 'Revisión', detail: 'Compara accesos y cambios con las actividades programadas del periodo.' },
      { heading: 'Exportación', detail: 'Descarga los registros cuando necesites compartirlos para una revisión institucional.' },
      { heading: 'Atención', detail: 'Verifica cualquier acceso inusual con la persona responsable antes de modificar permisos.' },
    ],
  },
};

const SettingsNotes = ({ tab }: { tab: SettingsTab }): JSX.Element | null => {
  const notes = tabNotes[tab];
  if (!notes) return null;

  return (
    <aside aria-labelledby="settings-notes-heading" className="min-w-0 rounded-lg border border-border bg-card p-4 sm:p-5 xl:sticky xl:top-24 xl:self-start">
      <div className="flex items-center gap-2">
        <CircleHelp aria-hidden="true" className="size-4 shrink-0 text-primary" />
        <h2 id="settings-notes-heading" className="font-heading text-xs font-bold text-foreground">
          {notes.title}
        </h2>
      </div>
      <p className="mt-2 text-[9px] leading-4 text-muted-foreground">{notes.intro}</p>
      <div className="mt-4 space-y-4">
        {notes.items.map(({ heading, detail }) => (
          <div key={heading} className="border-l-2 border-primary/40 pl-3">
            <h3 className="text-[9px] font-semibold text-foreground">{heading}</h3>
            <p className="mt-1 text-[9px] leading-4 text-muted-foreground">{detail}</p>
          </div>
        ))}
      </div>
    </aside>
  );
};

const SettingsTabsPanel = (): JSX.Element => {
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get('tab');
  const activeTab: SettingsTab = isSettingsTab(requestedTab) ? requestedTab : 'accounts';

  return (
    <>
      <nav aria-label="Áreas de configuración" role="tablist" className="flex gap-1 overflow-x-auto rounded-lg border border-border bg-card p-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <Link key={id} id={`settings-tab-${id}`} href={`/dashboard/settings?tab=${id}`} role="tab" aria-selected={activeTab === id} aria-controls="settings-tabpanel" className={`inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-md px-3 text-[9px] font-semibold transition-colors sm:text-[10px] ${activeTab === id ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
            <Icon aria-hidden="true" className="size-3.5" />
            {label}
          </Link>
        ))}
      </nav>

      <div id="settings-tabpanel" role="tabpanel" aria-labelledby={`settings-tab-${activeTab}`} className={`min-w-0 ${tabNotes[activeTab] ? 'grid gap-4 xl:grid-cols-[minmax(0,1fr)_17rem] xl:items-start' : ''}`}>
        <div className="min-w-0">
          {activeTab === 'accounts' && (
            <div className="flex min-w-0 flex-col gap-4">
              <SettingsOverview />
              <SettingsAccounts />
            </div>
          )}
          {activeTab === 'rbac' && <RolePermissionMatrix />}
          {activeTab === 'security' && <AccessPolicies />}
          {activeTab === 'institution' && <SettingsIntegrations />}
          {activeTab === 'audit' && <SettingsAudit />}
        </div>
        <SettingsNotes tab={activeTab} />
      </div>
    </>
  );
};

export { SettingsTabsPanel };
