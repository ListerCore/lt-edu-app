'use client';

import type { JSX } from 'react';
import { MonitorCheck } from 'lucide';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { SelectField, controlClassName } from '@/features/protected/academic/components/academic-ui';
import { items } from '@/features/protected/academic/data/academic-data';
import { AttachmentsPanel } from '@/features/protected/attachments/components/attachments-panel';
import { hostingKindLabels } from '../data/settings-data';
import { useSavePlatformSheet } from '../hooks/use-save-platform-sheet';
import type { PlatformSheetCardProps, PlatformSheetValues } from '../types';

// Plain text fields of the sheet, in the order of the report (sections III and IV of informe 6.2.1)
const identity: Array<{ key: keyof PlatformSheetValues; label: string; placeholder: string; max: number }> = [
  { key: 'platformName', label: 'Nombre de la plataforma', placeholder: 'Ej.: ListerCore Edu · Aula virtual', max: 120 },
  { key: 'url', label: 'Dirección (URL)', placeholder: 'https://', max: 300 },
  { key: 'technology', label: 'Implementación tecnológica', placeholder: 'Ej.: aplicación web con base de datos PostgreSQL', max: 200 },
  { key: 'administrator', label: 'Administración técnica a cargo de', placeholder: 'Persona o empresa', max: 160 },
];
const hosting: Array<{ key: keyof PlatformSheetValues; label: string; placeholder: string; max: number }> = [
  { key: 'provider', label: 'Proveedor o responsable', placeholder: 'Empresa del hosting o del servidor', max: 160 },
  { key: 'instance', label: 'Servicio, instancia o servidor', placeholder: 'Nombre o identificador', max: 160 },
  { key: 'contractReference', label: 'Contrato, panel o instancia que lo acredita', placeholder: 'Ej.: contrato N.° 2026-014', max: 160 },
  { key: 'serviceStatus', label: 'Estado del servicio', placeholder: 'Ej.: Activo', max: 160 },
];
const lead: Array<{ key: keyof PlatformSheetValues; label: string; placeholder: string; max: number }> = [
  { key: 'technicalLead', label: 'Nombres y apellidos', placeholder: 'Ej.: Ana Quispe Rojas', max: 160 },
  { key: 'technicalLeadSpecialty', label: 'Especialidad', placeholder: 'Ej.: Ingeniería de Sistemas', max: 160 },
  { key: 'technicalLeadCip', label: 'CIP (si corresponde)', placeholder: 'Solo números', max: 20 },
];

// Technical sheet of the e-learning platform the CEBA presents to the DRE (RSG N.° 613-2014-MINEDU, 6.2.1):
// identification, hosting and the Responsable técnico, plus the hosting evidence as attachments
export const PlatformSheetCard = ({ institutionId, platform, canEdit, onSaved }: PlatformSheetCardProps): JSX.Element => {
  const { values, errors, isPending, setField, submit } = useSavePlatformSheet({ platform, onSaved });
  const field = ({ key, label, placeholder, max }: (typeof identity)[number]): JSX.Element => (
    <FormField key={key} id={`platform-${key}`} label={label} error={errors[key]}>
      <Input
        id={`platform-${key}`}
        value={values[key]}
        placeholder={placeholder}
        maxLength={max}
        disabled={!canEdit}
        inputMode={key === 'technicalLeadCip' ? 'numeric' : key === 'url' ? 'url' : undefined}
        onChange={(e): void => setField(key, e.target.value)}
        aria-invalid={Boolean(errors[key])}
        className={controlClassName}
      />
    </FormField>
  );

  return (
    <section aria-labelledby="platform-title" className="rounded-2xl border border-border bg-background p-5 md:p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand" aria-hidden="true">
            <MorphIcon icon={MonitorCheck} size={16} />
          </span>
          <div>
            <h2 id="platform-title" className="text-base font-semibold text-foreground">
              Ficha de la plataforma e-learning
            </h2>
            <p className="mt-0.5 max-w-2xl text-sm leading-6 text-muted-foreground">Lo que pide el informe técnico de la DRE (RSG N.° 613-2014-MINEDU, numeral 6.2.1): identificación, alojamiento y responsable técnico.</p>
          </div>
        </div>
        {platform.updatedByName && <p className="text-xs text-muted-foreground">Última edición: {platform.updatedByName}</p>}
      </header>

      <form
        className="mt-6 space-y-6"
        onSubmit={(e): void => {
          e.preventDefault();
          submit();
        }}
      >
        <fieldset className="grid gap-4 sm:grid-cols-2" disabled={!canEdit}>
          <legend className="mb-2 text-sm font-semibold text-foreground">Identificación</legend>
          {identity.map(field)}
          <div className="sm:col-span-2">{field({ key: 'accessProfiles', label: 'Perfiles de acceso habilitados', placeholder: 'Ej.: director, docente, tutor virtual, estudiante', max: 300 })}</div>
        </fieldset>

        <fieldset className="grid gap-4 sm:grid-cols-2" disabled={!canEdit}>
          <legend className="mb-2 text-sm font-semibold text-foreground">Alojamiento</legend>
          <FormField id="platform-hosting-kind" label="Modalidad" required error={errors.hostingKind}>
            <SelectField id="platform-hosting-kind" value={values.hostingKind} options={items(hostingKindLabels)} disabled={!canEdit} onChange={(v): void => setField('hostingKind', v)} invalid={Boolean(errors.hostingKind)} />
          </FormField>
          {values.hostingKind === 'other' ? field({ key: 'hostingOther', label: 'Describe el alojamiento', placeholder: 'Ej.: servidor de la UGEL', max: 120 }) : <div className="hidden sm:block" />}
          {hosting.map(field)}
          <FormField id="platform-valid-until" label="Vigencia del servicio" error={errors.validUntil}>
            <Input id="platform-valid-until" type="date" value={values.validUntil} disabled={!canEdit} onChange={(e): void => setField('validUntil', e.target.value)} aria-invalid={Boolean(errors.validUntil)} className={controlClassName} />
          </FormField>
        </fieldset>

        <fieldset className="grid gap-4 sm:grid-cols-3" disabled={!canEdit}>
          <legend className="mb-2 text-sm font-semibold text-foreground">Responsable técnico</legend>
          {lead.map(field)}
        </fieldset>

        {canEdit && (
          <div className="flex justify-end">
            <button type="submit" className="btn-brand" disabled={isPending}>
              {isPending ? 'Guardando…' : 'Guardar ficha'}
            </button>
          </div>
        )}
      </form>

      <AttachmentsPanel
        ownerKind="platform_sheet"
        ownerId={institutionId}
        className="mt-6"
        title="Sustento del alojamiento"
        description="Contrato, captura del panel del servicio y pruebas de acceso. Oculta contraseñas y datos personales antes de subirlas."
        categories={['contract', 'screenshot', 'certificate', 'report', 'other']}
        readOnly={!canEdit}
      />
    </section>
  );
};
