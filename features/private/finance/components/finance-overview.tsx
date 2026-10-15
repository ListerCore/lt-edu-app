import type { JSX } from 'react';
import { BadgeCheck, Banknote, CircleAlert, Gift, QrCode } from 'lucide-react';

const financeMetrics = [
  { label: 'Recaudación del mes · octubre', value: 'S/ 114,750', detail: '+4.8% · 88.2% de la meta', icon: Banknote, tone: 'text-primary bg-accent', bar: 'w-[88.2%] bg-secondary' },
  { label: 'Pensiones al día', value: '750 est.', detail: '88.2% del padrón activo', icon: BadgeCheck, tone: 'text-secondary bg-secondary/10', bar: 'w-[88.2%] bg-secondary' },
  { label: 'Mora y pendientes', value: '100 est.', detail: 'S/ 15,250 por cobrar · 18 en riesgo >60 d', icon: CircleAlert, tone: 'text-destructive bg-destructive/10', bar: 'w-[11.8%] bg-destructive' },
  { label: 'Cobranza Yape / Plin', value: '68%', detail: '578 transacciones inmediatas', icon: QrCode, tone: 'text-primary bg-accent', bar: 'w-[68%] bg-primary' },
  { label: 'Becas EBA · Ayacucho', value: '42 benef.', detail: 'S/ 4,800 subvencionados', icon: Gift, tone: 'text-chart-3 bg-chart-3/10', bar: 'w-[42%] bg-chart-3' },
];

const FinanceOverview = (): JSX.Element => (
  <section aria-label="Indicadores financieros" className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
    {financeMetrics.map(({ label, value, detail, icon: Icon, tone, bar }) => (
      <article key={label} className="min-w-0 rounded-lg border border-border bg-card p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[8px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="mt-3 wrap-break-word font-heading text-xl font-bold leading-tight tracking-tight text-foreground">{value}</p>
          </div>
          <span className={`grid size-8 shrink-0 place-items-center rounded-md ${tone}`}>
            <Icon aria-hidden="true" className="size-4" />
          </span>
        </div>
        <p className="mt-2 min-h-7 text-[9px] leading-4 text-muted-foreground">{detail}</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className={`h-full rounded-full ${bar}`} />
        </div>
      </article>
    ))}
  </section>
);

export { FinanceOverview };
