'use client';

import { useState, type JSX, type ReactNode } from 'react';
import { Plus, ArrowDownToLine, Users } from 'lucide-react';

const Section = ({ title, subtitle, children, className = '' }: { title: string; subtitle?: string; children: ReactNode; className?: string }): JSX.Element => (
  <section className={`min-w-0 rounded-lg border border-border bg-card ${className}`}>
    <header className="border-b border-border px-4 py-3.5 sm:px-5">
      <h2 className="font-heading text-sm font-bold text-foreground">{title}</h2>
      {subtitle && <p className="mt-1 text-[11px] text-muted-foreground">{subtitle}</p>}
    </header>
    {children}
  </section>
);

const Metric = ({ label, value, detail, icon: Icon, tone = 'primary' }: { label: string; value: string; detail: string; icon: typeof Users; tone?: 'primary' | 'green' | 'amber' | 'red' }): JSX.Element => (
  <article className="min-w-0 rounded-lg border border-border bg-card p-4">
    <div className="flex items-start justify-between gap-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <span className={`grid size-8 shrink-0 place-items-center rounded-md ${tone === 'green' ? 'bg-secondary/10 text-secondary' : tone === 'amber' ? 'bg-chart-3/10 text-chart-3' : tone === 'red' ? 'bg-destructive/10 text-destructive' : 'bg-accent text-primary'}`}>
        <Icon aria-hidden="true" className="size-4" />
      </span>
    </div>
    <p className="mt-3 font-heading text-2xl font-bold leading-none text-foreground">{value}</p>
    <p className="mt-2 text-[10px] text-muted-foreground">{detail}</p>
  </article>
);

const Badge = ({ children, tone = 'blue' }: { children: ReactNode; tone?: 'blue' | 'green' | 'amber' | 'red' }): JSX.Element => <span className={`inline-flex w-fit items-center rounded-full px-2 py-1 text-[9px] font-semibold ${tone === 'green' ? 'bg-secondary/10 text-secondary' : tone === 'amber' ? 'bg-chart-3/10 text-chart-3' : tone === 'red' ? 'bg-destructive/10 text-destructive' : 'bg-accent text-primary'}`}>{children}</span>;

const Action = ({ children, primary = false, onClick }: { children: ReactNode; primary?: boolean; onClick: () => void }): JSX.Element => (
  <button type="button" onClick={onClick} className={`inline-flex h-9 items-center justify-center gap-2 rounded-md px-3 text-[10px] font-semibold transition-colors ${primary ? 'bg-primary text-primary-foreground hover:opacity-90' : 'border border-border bg-card text-foreground hover:bg-muted'}`}>
    {children}
  </button>
);

const useWorkspaceNotice = (): { notify: (value: string) => void; notice: string } => {
  const [notice, setNotice] = useState('');
  const notify = (text: string): void => {
    setNotice(`${text} · demostración`);
    window.setTimeout(() => setNotice(''), 3000);
  };
  return { notify, notice };
};

const WorkspaceShell = ({ eyebrow, title, description, actions, onAction, notice, children }: { eyebrow: string; title: string; description: string; actions: string[]; onAction: (value: string) => void; notice: string; children: ReactNode }): JSX.Element => (
  <main className="min-w-0 flex-1">
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 px-4 py-5 sm:gap-5 sm:px-6 sm:py-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[9px] font-bold tracking-[0.14em] text-primary">{eyebrow}</p>
          <h1 className="mt-1.5 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
          <p className="mt-1.5 max-w-3xl text-xs leading-5 text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {actions.map((action, index) => (
            <Action key={action} primary={index === actions.length - 1} onClick={(): void => onAction(action)}>
              {index === actions.length - 1 ? <Plus className="size-3.5" /> : <ArrowDownToLine className="size-3.5" />}
              {action}
            </Action>
          ))}
        </div>
      </div>
      {children}
      <footer className="flex flex-col gap-1 border-t border-border pt-4 text-[9px] text-muted-foreground sm:flex-row sm:justify-between">
        <span>CEBA Privado Virtual Joseph Lister · Ayacucho</span>
        <span>Periodo lectivo 2026-II · Información de demostración</span>
      </footer>
    </div>
    {notice && (
      <div role="status" className="fixed bottom-4 right-4 z-50 rounded-md border border-border bg-card px-4 py-3 text-xs font-medium text-foreground shadow-lg">
        {notice}
      </div>
    )}
  </main>
);

export { Action, Badge, Metric, Section, useWorkspaceNotice, WorkspaceShell };
