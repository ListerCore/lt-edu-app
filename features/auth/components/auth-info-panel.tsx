import type { JSX } from 'react';
import { Mail, MapPin, Phone, Wifi } from 'lucide-react';

const AuthInfoPanel = (): JSX.Element => (
  <aside className="flex min-w-0 flex-col bg-primary px-5 py-6 text-primary-foreground sm:px-8 sm:py-8 lg:px-10 xl:px-12">
    <div className="flex flex-wrap items-center gap-2 text-[8px] font-semibold">
      <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">RVM N.° 125-2020-MINEDU</span>
      <span className="text-primary-foreground/65">RD N.° 0451-DREA</span>
    </div>
    <h2 className="mt-5 max-w-lg font-heading text-xl font-bold leading-tight sm:text-2xl">Educación Básica Alternativa Virtual con Excelencia</h2>
    <p className="mt-3 max-w-xl text-xs leading-6 text-primary-foreground/75">El CEBA Privado Virtual “Joseph Lister” brinda continuidad formativa flexible, inclusiva e innovadora a jóvenes y adultos trabajadores de Ayacucho y de todo el territorio nacional.</p>
    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      <article className="rounded-lg border border-primary-foreground/10 bg-primary-foreground/5 p-3">
        <p className="text-[9px] text-primary-foreground/65">Ciclos atendidos</p>
        <p className="mt-1 text-sm font-bold">Inicial · Intermedio · Avanzado</p>
      </article>
      <article className="rounded-lg border border-primary-foreground/10 bg-primary-foreground/5 p-3">
        <p className="text-[9px] text-primary-foreground/65">Modalidad autorizada</p>
        <p className="mt-1 text-sm font-bold text-secondary">A distancia / Virtual</p>
      </article>
    </div>
    <div className="mt-4 flex items-start gap-3 rounded-lg bg-primary-foreground/10 p-3">
      <span className="mt-0.5 size-2 shrink-0 animate-pulse rounded-full bg-secondary" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap justify-between gap-2">
          <p className="text-[10px] font-bold">Servidores y SIAGIE conectados</p>
          <span className="text-[9px] font-bold text-secondary">100% operativo</span>
        </div>
        <p className="mt-1 text-[9px] leading-4 text-primary-foreground/70">Sincronización en tiempo real con SIAGIE y repositorio curricular digital del MINEDU.</p>
      </div>
    </div>
    <div className="mt-6 flex-1 border-t border-primary-foreground/15 pt-4">
      <h3 className="flex items-center gap-2 text-[10px] font-bold">
        <Wifi aria-hidden="true" className="size-4 text-secondary" />
        Mesa de Ayuda Virtual Ayacucho
      </h3>
      <div className="mt-3 space-y-2">
        <a href="https://wa.me/51966842190" className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-primary-foreground/5 px-3 py-2.5 text-[9px] hover:bg-primary-foreground/10">
          <span className="flex items-center gap-2">
            <Phone aria-hidden="true" className="size-3.5 text-secondary" />
            WhatsApp de soporte académico
          </span>
          <b>+51 966 842 190</b>
        </a>
        <a href="mailto:soporte@cebajosephlister.edu.pe" className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-primary-foreground/5 px-3 py-2.5 text-[9px] hover:bg-primary-foreground/10">
          <span className="flex items-center gap-2">
            <Mail aria-hidden="true" className="size-3.5 text-secondary" />
            Correo institucional
          </span>
          <b className="break-all">soporte@cebajosephlister.edu.pe</b>
        </a>
        <a href="tel:066314589" className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-primary-foreground/5 px-3 py-2.5 text-[9px] hover:bg-primary-foreground/10">
          <span className="flex items-center gap-2">
            <MapPin aria-hidden="true" className="size-3.5 text-secondary" />
            Central telefónica · sede central
          </span>
          <b>(066) 31-4589</b>
        </a>
      </div>
    </div>
    <p className="border-t border-primary-foreground/15 pt-3 text-center text-[8px] leading-4 text-primary-foreground/60">Portal EBA Joseph Lister · Ayacucho – Huamanga · Resolución DREA vigente</p>
  </aside>
);

export { AuthInfoPanel };
