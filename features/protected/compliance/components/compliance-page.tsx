'use client';

import { useState, type JSX } from 'react';
import { AcademicPage, LoadError, PageSkeleton } from '@/features/protected/academic/components/academic-ui';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { cn } from '@/lib/utils';
import { useComplianceBoard } from '../hooks/use-compliance-board';
import type { Device, Item, Report, Room } from '../types';
import { CheckDialog, DeviceDialog, ItemDialog, ReportDialog, RoomDialog } from './compliance-dialogs';
import { EquipmentTab } from './equipment-tab';
import { ReportsTab } from './reports-tab';
import { UptimeTab } from './uptime-tab';

type Tab = 'reports' | 'equipment' | 'uptime';
type Dialog = { kind: 'room'; value?: Room } | { kind: 'device'; value?: Device } | { kind: 'check' } | { kind: 'report'; value: Report } | { kind: 'item'; value: Item } | null;

// Cumplimiento DRE (EBA, phase E8): the technical reports of the platform (6.2.1 and Anexo 2) and of the virtual
// tutors' equipment (6.3.2 c) with their evidence, the equipment itself and the availability of the platform
export const CompliancePage = (): JSX.Element => {
  const slug = useInstitutionSlug();
  const { data, error, reload } = useComplianceBoard(slug);
  const [tab, setTab] = useState<Tab>('reports');
  const [dialog, setDialog] = useState<Dialog>(null);
  const done = (): void => {
    setDialog(null);
    reload();
  };
  const tabs: Array<[Tab, string]> = [
    ['reports', 'Informes técnicos'],
    ['equipment', 'Equipos'],
    ['uptime', 'Disponibilidad'],
  ];
  return (
    <AcademicPage
      wide
      titleId="compliance-title"
      title="Cumplimiento DRE"
      description="Los dos informes técnicos que pide la RSG N.° 613-2014-MINEDU, con su evidencia: la plataforma e-learning y sus secciones del Anexo 2, y el ambiente y los equipos de los tutores virtuales. El responsable técnico verifica cada fila."
      context={null}
    >
      {error ? (
        <LoadError message={error} onRetry={reload} />
      ) : !data ? (
        <PageSkeleton />
      ) : (
        <div className="space-y-6">
          <div role="tablist" aria-label="Cumplimiento" className="flex gap-1 overflow-x-auto border-b border-border">
            {tabs.map(([key, label]) => (
              <button key={key} type="button" role="tab" aria-selected={tab === key} onClick={(): void => setTab(key)} className={cn('-mb-px border-b-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors', tab === key ? 'border-brand text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground')}>
                {label}
              </button>
            ))}
          </div>
          {tab === 'reports' && <ReportsTab slug={slug} board={data} onEditReport={(value): void => setDialog({ kind: 'report', value })} onEditItem={(value): void => setDialog({ kind: 'item', value })} onChange={reload} />}
          {tab === 'equipment' && (
            <EquipmentTab slug={slug} board={data} onRoom={(value): void => setDialog({ kind: 'room', value })} onDevice={(value): void => setDialog({ kind: 'device', value })} onCheck={(): void => setDialog({ kind: 'check' })} onChange={reload} />
          )}
          {tab === 'uptime' && <UptimeTab slug={slug} board={data} onChange={reload} />}
        </div>
      )}
      {dialog?.kind === 'room' && <RoomDialog slug={slug} value={dialog.value} onClose={(): void => setDialog(null)} onSaved={done} />}
      {dialog?.kind === 'device' && data && <DeviceDialog slug={slug} value={dialog.value} rooms={data.rooms} onClose={(): void => setDialog(null)} onSaved={done} />}
      {dialog?.kind === 'check' && data && <CheckDialog slug={slug} rooms={data.rooms} devices={data.devices} onClose={(): void => setDialog(null)} onSaved={done} />}
      {dialog?.kind === 'report' && <ReportDialog slug={slug} value={dialog.value} onClose={(): void => setDialog(null)} onSaved={done} />}
      {dialog?.kind === 'item' && <ItemDialog slug={slug} value={dialog.value} onClose={(): void => setDialog(null)} onSaved={done} />}
    </AcademicPage>
  );
};
