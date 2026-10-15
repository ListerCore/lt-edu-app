import type { JSX } from 'react';
import { Cloud, Database, HardDrive, Network, ShieldCheck } from 'lucide-react';

const destinations = [
  { title: 'AWS S3 Glacier Instant', description: 'Copia primaria cloud · us-east-1 / Lima Edge', status: 'Online', icon: Cloud },
  { title: 'NAS local CEBA Ayacucho', description: 'Sede central · RAID 1 cifrado FIPS', status: 'Sincronizado', icon: HardDrive },
  { title: 'Google Workspace Vault', description: 'Tercera copia · josephlister.edu.pe', status: 'Espejo', icon: Database },
];

const BackupTopology = (): JSX.Element => (
  <section aria-labelledby="backup-topology-heading" className="min-w-0 rounded-lg border border-border bg-card p-4 sm:p-5">
    <div className="flex items-center gap-2">
      <Network aria-hidden="true" className="size-4 text-primary" />
      <h2 id="backup-topology-heading" className="font-heading text-sm font-bold text-foreground">
        Topología 3-2-1
      </h2>
    </div>
    <p className="mt-2 text-[10px] leading-4 text-muted-foreground">Copias redundantes para contingencias eléctricas o de conectividad en Ayacucho.</p>
    <div className="mt-4 space-y-2">
      {destinations.map(({ title, description, status, icon: Icon }) => (
        <article key={title} className="flex min-w-0 items-center gap-3 rounded-md bg-muted/50 p-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-md bg-card text-primary">
            <Icon aria-hidden="true" className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="wrap-break-word text-[9px] font-bold text-foreground">{title}</h3>
            <p className="mt-0.5 wrap-break-word text-[8px] leading-4 text-muted-foreground">{description}</p>
          </div>
          <span className="shrink-0 rounded bg-secondary/10 px-1.5 py-1 text-[7px] font-bold uppercase text-secondary">{status}</span>
        </article>
      ))}
    </div>
    <div className="mt-3 rounded-md border border-border p-3">
      <div className="flex items-center gap-2 text-[9px] font-semibold text-muted-foreground">
        <ShieldCheck aria-hidden="true" className="size-3.5 text-secondary" /> Cifrado AES-256 en tránsito y reposo
      </div>
      <p className="mt-2 flex items-center justify-between gap-2 text-[9px] text-muted-foreground">
        <span>Enlace dedicado Huamanga</span>
        <span className="text-right font-semibold text-foreground">100 Mbps simétrico</span>
      </p>
    </div>
  </section>
);

export { BackupTopology };
