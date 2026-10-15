'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { Banknote, CalendarDays, CheckCircle2, ChevronRight, Download, FileCheck2, FilePlus2, HandCoins, Landmark, ReceiptText, UsersRound, WalletCards } from 'lucide-react';
import { FinanceAccountPanel } from './finance-account-panel';
import { FinanceCashflow, FinanceCollections, FinanceReceipts, FinanceSchedule } from './finance-admin-panels';
import { FinanceFamilyPortal } from './finance-family-portal';
import { FinanceOverview } from './finance-overview';
import { FinanceStudents } from './finance-students';
import { familyAccounts } from '../data/finance-data';

const financeTabs = [
  { id: 'accounts', label: 'Padrón y estados de cuenta', icon: UsersRound },
  { id: 'schedule', label: 'Cronograma de cuotas', icon: CalendarDays },
  { id: 'receipts', label: 'Pagos y comprobantes SUNAT', icon: ReceiptText },
  { id: 'cashflow', label: 'Reportes económicos', icon: WalletCards },
  { id: 'collections', label: 'Cobranzas y WhatsApp IA', icon: HandCoins },
] as const;

type FinanceTab = (typeof financeTabs)[number]['id'];

const FinancePage = (): JSX.Element => {
  const [perspective, setPerspective] = useState<'admin' | 'family'>('admin');
  const [activeTab, setActiveTab] = useState<FinanceTab>('accounts');
  const [selectedId, setSelectedId] = useState('silvia');
  const [notice, setNotice] = useState('');
  const selectedAccount = familyAccounts.find(({ id }) => id === selectedId) ?? familyAccounts[0];

  const renderAdminTab = (): JSX.Element => {
    if (activeTab === 'schedule') return <FinanceSchedule onAction={setNotice} />;
    if (activeTab === 'receipts') return <FinanceReceipts onAction={setNotice} />;
    if (activeTab === 'cashflow') return <FinanceCashflow />;
    if (activeTab === 'collections') return <FinanceCollections onAction={setNotice} />;
    return (
      <div className="grid min-w-0 gap-4 2xl:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.8fr)]">
        <FinanceStudents selectedId={selectedId} onSelect={(account): void => setSelectedId(account.id)} onAction={setNotice} />
        <FinanceAccountPanel key={selectedId} account={selectedAccount} onMessage={setNotice} />
      </div>
    );
  };

  if (perspective === 'family')
    return (
      <>
        <FinanceFamilyPortal account={selectedAccount} onBack={(): void => setPerspective('admin')} onAction={setNotice} />
        {notice && (
          <div role="status" className="fixed bottom-4 right-4 z-40 max-w-sm rounded-lg border border-border bg-card px-4 py-3 text-[10px] font-medium text-foreground shadow-lg">
            {notice}
            <button type="button" onClick={(): void => setNotice('')} className="ml-3 font-bold text-primary">
              Cerrar
            </button>
          </div>
        )}
      </>
    );

  return (
    <main className="mx-auto flex w-full max-w-[1600px] min-w-0 flex-col gap-4 px-4 py-5 sm:gap-5 sm:px-6 sm:py-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-2 text-[9px] text-muted-foreground">
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/dashboard" className="hover:text-foreground">
            CEBA Joseph Lister
          </Link>
          <ChevronRight aria-hidden="true" className="size-3" />
          <span>Administración y finanzas</span>
          <ChevronRight aria-hidden="true" className="size-3" />
          <span className="font-semibold text-foreground">Gestión económica y pensiones</span>
        </div>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-secondary" />
          Servidor Nubefact en línea <span className="hidden sm:inline">· Última sincronización hoy, 11:42 a. m.</span>
        </span>
      </div>
      <section className="flex min-w-0 flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-1 text-[8px] font-bold text-secondary">
              <CheckCircle2 aria-hidden="true" className="size-3" />
              OSE Nubefact / SUNAT activo
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-[8px] font-semibold text-primary">
              <Landmark aria-hidden="true" className="size-3" />
              Pasarela BCP / BBVA / Yape
            </span>
            <span className="rounded bg-muted px-2 py-1 text-[8px] text-muted-foreground">R.D. N.° 0482-DRE-Ayacucho</span>
          </div>
          <h1 className="mt-3 max-w-4xl font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">Gestión de pensiones, pagos y cuenta EBA</h1>
          <p className="mt-2 max-w-3xl text-[10px] leading-5 text-muted-foreground">Control financiero para jóvenes y adultos trabajadores. Administra cuotas, comprobantes electrónicos, conciliación y acceso familiar desde un mismo espacio.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 rounded-lg bg-muted/50 p-1">
          <button type="button" onClick={(): void => setPerspective('admin')} aria-pressed={perspective === 'admin'} className={`inline-flex min-h-9 items-center gap-1.5 rounded-md px-3 text-[9px] font-semibold transition-colors ${perspective === 'admin' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
            <Banknote aria-hidden="true" className="size-3.5" />
            Tesorería / EBA
          </button>
          <button type="button" onClick={(): void => setPerspective('family')} aria-pressed={false} className="inline-flex min-h-9 items-center gap-1.5 rounded-md px-3 text-[9px] font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <UsersRound aria-hidden="true" className="size-3.5" />
            Portal apoderado <span className="rounded bg-secondary/10 px-1 py-0.5 text-[7px] font-bold text-secondary">NUEVO</span>
          </button>
          <button type="button" onClick={(): void => setNotice('Emisión de boleta preparada. Registra primero un pago conciliado.')} className="inline-flex min-h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-[9px] font-semibold text-primary-foreground hover:opacity-90">
            <FilePlus2 aria-hidden="true" className="size-3.5" />
            Emitir boleta
          </button>
          <button
            type="button"
            onClick={(): void => {
              setActiveTab('receipts');
              setNotice('Abierta la conciliación de pagos y comprobantes.');
            }}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-md bg-accent px-3 text-[9px] font-semibold text-primary hover:bg-accent/80"
          >
            <Landmark aria-hidden="true" className="size-3.5" />
            Conciliación
          </button>
          <button type="button" aria-label="Exportar resumen financiero" onClick={(): void => setNotice('Resumen financiero de octubre preparado para exportación.')} className="grid size-9 place-items-center rounded-md border border-border bg-background text-muted-foreground hover:bg-muted hover:text-primary">
            <Download aria-hidden="true" className="size-3.5" />
          </button>
        </div>
      </section>
      {notice && (
        <div role="status" className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-secondary/20 bg-secondary/10 px-3 py-2 text-[9px] font-medium text-secondary">
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 aria-hidden="true" className="size-3.5" />
            {notice}
          </span>
          <button type="button" onClick={(): void => setNotice('')} className="font-semibold hover:underline">
            Cerrar
          </button>
        </div>
      )}
      <FinanceOverview />
      <section className="min-w-0 overflow-hidden rounded-lg border border-border bg-card">
        <div role="tablist" aria-label="Secciones de gestión económica" className="flex min-w-0 gap-1 overflow-x-auto border-b border-border px-2">
          {financeTabs.map(({ id, label, icon: Icon }) => (
            <button key={id} type="button" role="tab" aria-selected={activeTab === id} aria-controls="finance-tabpanel" onClick={(): void => setActiveTab(id)} className={`inline-flex min-h-11 shrink-0 items-center gap-1.5 border-b-2 px-3 text-[9px] font-semibold transition-colors sm:px-4 sm:text-[10px] ${activeTab === id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
              <Icon aria-hidden="true" className="size-3.5" />
              {label}
              {id === 'accounts' && <span className="rounded-full bg-accent px-1.5 py-0.5 text-[7px] text-primary">850</span>}
            </button>
          ))}
        </div>
        <div id="finance-tabpanel" role="tabpanel" className="min-w-0 p-3 sm:p-4">
          {renderAdminTab()}
        </div>
      </section>
      <section className="flex min-w-0 flex-col gap-3 rounded-lg bg-primary p-4 text-primary-foreground sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary-foreground/10">
            <FileCheck2 aria-hidden="true" className="size-4 text-secondary" />
          </span>
          <div>
            <p className="flex flex-wrap items-center gap-2 text-[10px] font-bold">
              Facturación electrónica SUNAT <span className="rounded bg-secondary px-1.5 py-0.5 text-[8px] text-secondary-foreground">Online 99.9%</span>
            </p>
            <p className="mt-1 text-[8px] leading-4 text-primary-foreground/70">OSE Nubefact activo · Pasarela BCP / BBVA / Yape · R.D. N.° 0482-DRE-Ayacucho.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={(): void => {
            setActiveTab('receipts');
            setNotice('Vista de comprobantes SUNAT abierta.');
          }}
          className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary-foreground/10 px-3 text-[8px] font-semibold hover:bg-primary-foreground/20"
        >
          <ReceiptText aria-hidden="true" className="size-3" />
          Ver comprobantes
        </button>
      </section>
      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-[9px] text-muted-foreground">
        <span>CEBA Privado Virtual Joseph Lister · Tesorería EBA</span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays aria-hidden="true" className="size-3" />
          Periodo 2026-II · Ayacucho
        </span>
      </footer>
    </main>
  );
};

export { FinancePage };
