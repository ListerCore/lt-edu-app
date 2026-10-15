import type { JSX, ReactNode } from 'react';

const Badge = ({ children, tone = 'blue' }: { children: ReactNode; tone?: 'blue' | 'green' | 'amber' | 'red' }): JSX.Element => <span className={`inline-flex w-fit rounded-full px-2 py-1 text-[8px] font-semibold ${tone === 'green' ? 'bg-secondary/10 text-secondary' : tone === 'amber' ? 'bg-chart-3/10 text-chart-3' : tone === 'red' ? 'bg-destructive/10 text-destructive' : 'bg-accent text-primary'}`}>{children}</span>;

const Tabs = ({ items, selected, onSelect }: { items: string[]; selected: string; onSelect: (value: string) => void }): JSX.Element => (
  <div role="tablist" className="flex flex-wrap gap-2 rounded-md bg-accent/50 p-2">
    {items.map((item) => (
      <button key={item} type="button" role="tab" aria-selected={selected === item} onClick={(): void => onSelect(item)} className={`rounded-md px-3 py-2 text-[9px] font-semibold ${selected === item ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:bg-card/70'}`}>
        {item}
      </button>
    ))}
  </div>
);

const ExtraPanel = ({ title, children }: { title: string; children: ReactNode }): JSX.Element => (
  <section className="min-w-0 overflow-hidden rounded-lg border border-border bg-card">
    <header className="border-b border-border px-4 py-3">
      <h2 className="text-xs font-bold text-foreground">{title}</h2>
    </header>
    <div className="p-4">{children}</div>
  </section>
);

export { Badge, ExtraPanel, Tabs };
