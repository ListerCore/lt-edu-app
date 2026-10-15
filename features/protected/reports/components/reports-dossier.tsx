'use client';

import type { JSX } from 'react';
import { BadgeCheck, Download, FileCheck2, GraduationCap, ShieldCheck, Users } from 'lucide-react';

const dossierItems = [
  { tag: 'SIAGIE v5.0', title: 'Padrón consolidado de matrícula', detail: 'Nómina oficial con 850 matrículas, códigos modulares y formularios FUM digitalizados.', status: 'Transmitido · 12/08/2026', action: 'Descargar padrón oficial', tone: 'bg-secondary/10 text-secondary', kind: 'csv' },
  { tag: 'Oficial DREA', title: 'Acta consolidada de evaluación EBA', detail: 'Matriz cualitativa por áreas y conclusiones descriptivas de los ciclos Avanzado e Intermedio.', status: '10 secciones certificadas', action: 'Generar actas firmadas', tone: 'bg-primary/10 text-primary', kind: 'pdf' },
  { tag: 'Fiscalización', title: 'Padrón de estudiantes trabajadores', detail: 'Registro de jornadas, declaraciones juradas y soporte tutorial asincrónico.', status: '612 fichas validadas', action: 'Descargar padrón laboral', tone: 'bg-accent text-primary', kind: 'csv' },
  { tag: 'Graduación', title: 'Eficiencia terminal 2026-II', detail: 'Egresados de 4° Avanzado con logros de aprendizaje para continuidad educativa.', status: '206 aptos promoción 2026', action: 'Emitir dossier terminal', tone: 'bg-secondary/10 text-secondary', kind: 'pdf' },
];

const ReportsDossier = ({ onExport }: { onExport: (title: string, kind: string) => void }): JSX.Element => (
  <section aria-labelledby="reports-dossier-heading" className="min-w-0 overflow-hidden rounded-lg border border-border bg-card">
    <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border bg-muted/40 p-4 sm:p-5">
      <div className="flex min-w-0 items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
          <FileCheck2 aria-hidden="true" className="size-4" />
        </span>
        <div className="min-w-0">
          <h2 id="reports-dossier-heading" className="font-heading text-sm font-bold text-foreground">
            Dossier de fiscalización MINEDU / UGEL Huamanga
          </h2>
          <p className="mt-1 text-[9px] leading-4 text-muted-foreground">Documentos institucionales de referencia para revisión y auditoría.</p>
        </div>
      </div>
      <span className="rounded bg-accent px-2 py-1 text-[8px] font-semibold text-primary">Resolución DREA N.° 0451-2026</span>
    </header>
    <div className="grid min-w-0 gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4 sm:p-5">
      {dossierItems.map(({ tag, title, detail, status, action, tone, kind }, index) => {
        const Icon = index === 0 ? ShieldCheck : index === 1 ? FileCheck2 : index === 2 ? Users : GraduationCap;
        return (
          <article key={title} className="flex min-w-0 flex-col rounded-md border border-border p-3">
            <div className="flex items-start justify-between gap-2">
              <span className={`grid size-8 shrink-0 place-items-center rounded-md ${tone}`}>
                <Icon aria-hidden="true" className="size-4" />
              </span>
              <span className={`rounded px-1.5 py-1 text-[7px] font-bold uppercase ${tone}`}>{tag}</span>
            </div>
            <h3 className="mt-3 text-[10px] font-bold text-foreground">{title}</h3>
            <p className="mt-1 flex-1 text-[9px] leading-4 text-muted-foreground">{detail}</p>
            <p className="mt-3 flex items-center gap-1.5 border-t border-border pt-2 text-[8px] font-medium text-secondary">
              <BadgeCheck aria-hidden="true" className="size-3" />
              {status}
            </p>
            <button type="button" onClick={(): void => onExport(title, kind)} className="mt-2 inline-flex min-h-8 items-center justify-center gap-1.5 rounded-md bg-muted px-2 text-[8px] font-semibold text-foreground hover:bg-accent">
              <Download aria-hidden="true" className="size-3" />
              {action}
            </button>
          </article>
        );
      })}
    </div>
  </section>
);

export { ReportsDossier };
