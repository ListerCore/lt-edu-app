'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import { Bot, Building2, CheckCircle2, Eye, EyeOff, Save, ServerCog, ShieldCheck, TestTube2, X } from 'lucide-react';

const SecureValue = ({ label, value, status }: { label: string; value: string; status: string }): JSX.Element => {
  const [visible, setVisible] = useState(false);

  return (
    <label className="block min-w-0">
      <span className="flex items-center justify-between gap-2 text-[8px] font-semibold text-muted-foreground">
        <span>{label}</span>
        <span className="rounded bg-secondary/10 px-1.5 py-0.5 text-[7px] font-bold text-secondary">{status}</span>
      </span>
      <span className="mt-1.5 flex min-w-0 items-center rounded-md border border-border bg-background">
        <input aria-label={label} readOnly value={visible ? value : '••••••••••••••••••••'} className="h-8 min-w-0 flex-1 bg-transparent px-2.5 font-mono text-[9px] text-foreground outline-none" />
        <button type="button" aria-label={visible ? `Ocultar ${label}` : `Mostrar ${label}`} onClick={(): void => setVisible((show) => !show)} className="grid size-8 shrink-0 place-items-center text-muted-foreground hover:text-foreground">
          {visible ? <EyeOff aria-hidden="true" className="size-3.5" /> : <Eye aria-hidden="true" className="size-3.5" />}
        </button>
      </span>
    </label>
  );
};

const SettingsIntegrations = (): JSX.Element => {
  const [message, setMessage] = useState('');
  const [saved, setSaved] = useState(false);

  return (
    <section id="institution-settings" aria-labelledby="integrations-heading" className="min-w-0 scroll-mt-32 overflow-hidden rounded-lg border border-border bg-card p-4 sm:p-5 lg:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Building2 aria-hidden="true" className="size-4 text-primary" />
            <h2 id="integrations-heading" className="font-heading text-xs font-bold text-foreground sm:text-sm">
              Parámetros institucionales e integraciones API
            </h2>
          </div>
          <p className="mt-1 text-[9px] leading-4 text-muted-foreground">Identidad reglamentaria del CEBA Joseph Lister en DREA y llaves de conexión a servicios gubernamentales.</p>
        </div>
        <button type="button" onClick={(): void => setMessage('Conexiones verificadas correctamente.')} className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-md bg-secondary px-3 text-[9px] font-semibold text-secondary-foreground hover:opacity-90">
          <TestTube2 aria-hidden="true" className="size-3.5" /> Probar conexiones API
        </button>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <article className="rounded-lg border border-border bg-muted/35 p-3.5">
          <h3 className="flex items-center gap-2 text-[10px] font-bold text-foreground">
            <Building2 aria-hidden="true" className="size-3.5 text-primary" /> Registro MINEDU y DREA
          </h3>
          <div className="mt-3 space-y-3">
            <label className="block">
              <span className="text-[8px] font-semibold text-muted-foreground">Código modular EBA (Secundaria)</span>
              <input defaultValue="1674920" className="mt-1 h-8 w-full rounded-md border border-border bg-background px-2.5 text-[9px] text-foreground outline-none focus:border-ring" />
            </label>
            <label className="block">
              <span className="text-[8px] font-semibold text-muted-foreground">Código modular EBA (Inicial / Intermedio)</span>
              <input defaultValue="1674938" className="mt-1 h-8 w-full rounded-md border border-border bg-background px-2.5 text-[9px] text-foreground outline-none focus:border-ring" />
            </label>
            <label className="block">
              <span className="text-[8px] font-semibold text-muted-foreground">Resolución Directoral (RDR / DREA)</span>
              <input defaultValue="RDR N.° 01482-2018-GRA/DREA" className="mt-1 h-8 w-full rounded-md border border-border bg-background px-2.5 text-[9px] text-foreground outline-none focus:border-ring" />
            </label>
            <label className="block">
              <span className="text-[8px] font-semibold text-muted-foreground">Promotor general registrado</span>
              <input defaultValue="Lic. Fernando Prado Medina" className="mt-1 h-8 w-full rounded-md border border-border bg-background px-2.5 text-[9px] text-foreground outline-none focus:border-ring" />
            </label>
          </div>
        </article>

        <article className="rounded-lg border border-border bg-muted/35 p-3.5">
          <h3 className="flex items-center gap-2 text-[10px] font-bold text-foreground">
            <ServerCog aria-hidden="true" className="size-3.5 text-primary" /> Servicios gubernamentales
          </h3>
          <div className="mt-3 space-y-3">
            <SecureValue label="API Bridge SIAGIE 3.0 (MINEDU)" value="sk_sigejlsiagie_2026_9f38a6" status="CONECTADO" />
            <SecureValue label="OSE SUNAT / Facturación electrónica" value="ose_josephlister_2026_a410" status="ACTIVO" />
          </div>
          <div className="mt-3 space-y-1 text-[8px] leading-4 text-muted-foreground">
            <p>
              RUC institucional: <span className="font-mono text-foreground">20603182901</span> (Joseph Lister EBA S.A.C.)
            </p>
            <p>
              Ambiente actual: <span className="font-semibold text-secondary">Producción homologada</span>
            </p>
          </div>
        </article>

        <article className="rounded-lg border border-border bg-muted/35 p-3.5">
          <h3 className="flex items-center gap-2 text-[10px] font-bold text-foreground">
            <Bot aria-hidden="true" className="size-3.5 text-primary" /> Comunicaciones e IA EBA
          </h3>
          <div className="mt-3 space-y-3">
            <SecureValue label="Meta WhatsApp Cloud API (Alertas)" value="EAAJLsigejlMetaCloudToken2026" status="VINCULADO" />
            <SecureValue label="Motor predictivo IA de deserción" value="sigejl_dropout_model_prod_2026" status="EN LÍNEA" />
          </div>
          <p className="mt-3 flex items-center justify-between gap-2 text-[8px] text-muted-foreground">
            <span>
              Tokens consumidos mes: <strong className="text-foreground">14,290 / 100k</strong>
            </span>
            <button type="button" className="rounded bg-accent px-2 py-1 font-semibold text-accent-foreground">
              Ver cuotas
            </button>
          </p>
        </article>
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-lg border border-border bg-muted/50 p-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <div className="flex items-start gap-2.5">
          <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-secondary" />
          <p className="max-w-3xl text-[9px] leading-4 text-muted-foreground">Garantía de certificación y cumplimiento normativo. SIGE-JL cumple los lineamientos de la R.V.M. N.° 330-2021-MINEDU para centros EBA privados en modalidad a distancia.</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={(): void => {
              setMessage('');
              setSaved(false);
            }}
            className="inline-flex h-8 items-center justify-center gap-1 rounded-md border border-border bg-card px-3 text-[9px] font-semibold text-foreground hover:bg-muted"
          >
            <X aria-hidden="true" className="size-3" /> Descartar
          </button>
          <button type="button" onClick={(): void => setSaved(true)} className="inline-flex h-8 items-center justify-center gap-1 rounded-md bg-primary px-3 text-[9px] font-semibold text-primary-foreground hover:opacity-90">
            <Save aria-hidden="true" className="size-3" />
            {saved ? 'Configuración guardada' : 'Guardar todo'}
          </button>
        </div>
      </div>
      {(message || saved) && (
        <p role="status" className="mt-3 flex items-center gap-1.5 text-[9px] font-semibold text-secondary">
          <CheckCircle2 aria-hidden="true" className="size-3.5" />
          {saved ? 'Cambios institucionales guardados.' : message}
        </p>
      )}
    </section>
  );
};

export { SettingsIntegrations };
