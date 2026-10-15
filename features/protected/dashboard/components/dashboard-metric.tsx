import type { JSX } from 'react';
import { Users } from 'lucide-react';

const Metric = ({ label, value, detail, icon: Icon, accent, footer }: { label: string; value: string; detail: string; icon: typeof Users; accent: string; footer?: string }): JSX.Element => (
  <article className="flex min-w-0 flex-col rounded-lg border border-border bg-card p-4">
    <div className="flex items-start justify-between gap-2">
      <p className="text-[9px] font-semibold uppercase leading-4 tracking-wide text-muted-foreground">{label}</p>
      <span className={`grid size-8 shrink-0 place-items-center rounded-md ${accent}`}>
        <Icon aria-hidden="true" className="size-4" />
      </span>
    </div>
    <p className="mt-4 font-heading text-[25px] font-bold leading-none tracking-tight text-foreground">{value}</p>
    <p className="mt-2 text-[9px] leading-4 text-muted-foreground">{detail}</p>
    {footer && <p className="mt-3 border-t border-border pt-2 text-[8px] text-muted-foreground">{footer}</p>}
  </article>
);

export { Metric };
