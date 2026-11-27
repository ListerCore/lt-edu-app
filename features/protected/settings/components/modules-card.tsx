'use client';

import type { JSX } from 'react';
import { Switch } from '@/components/ui/switch';
import { LoadError } from '@/features/protected/academic/components/academic-ui';
import { useGetModules } from '../hooks/use-get-modules';
import { useSetModule } from '../hooks/use-set-module';

// Configuración › Institución › Módulos: dirección turns the optional modules on and off. A module that is off
// leaves the menu of every role and lt-edu-api refuses its calls, from the next request on
export const ModulesCard = (): JSX.Element | null => {
  const modules = useGetModules();
  const { setModule, savingKey } = useSetModule(modules.reload);
  if (modules.error) return <LoadError message={modules.error} onRetry={modules.reload} />;
  if (!modules.data) return null;
  const { canManage } = modules.data;

  return (
    <section aria-labelledby="modules-title" className="space-y-4">
      <header>
        <h2 id="modules-title" className="text-lg font-semibold text-foreground">
          Módulos
        </h2>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{canManage ? 'Apaga los módulos que tu institución no usa: desaparecen del menú de todos y la plataforma deja de atenderlos. Puedes volver a encenderlos cuando quieras.' : 'Los módulos opcionales de tu institución. Solo dirección los activa o desactiva.'}</p>
      </header>
      <ul className="grid gap-2 sm:grid-cols-2">
        {modules.data.modules.map((m) => (
          <li key={m.key}>
            <label className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5 text-sm">
              <span className="font-medium text-foreground">{m.name}</span>
              <Switch checked={m.enabled} disabled={!canManage || savingKey === m.key} aria-label={`${m.enabled ? 'Desactivar' : 'Activar'} ${m.name}`} onCheckedChange={(next): void => setModule(m.key, next)} />
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
};
