'use client';

import { useState, useTransition, type JSX } from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SelectField } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { useToday } from '@/features/protected/academic/hooks/use-today';
import { addCheckAction } from '../actions/add-check';
import { saveDeviceAction } from '../actions/save-device';
import { saveItemAction } from '../actions/save-item';
import { saveReportAction } from '../actions/save-report';
import { saveRoomAction } from '../actions/save-room';
import { checkKindLabels, deviceKindLabels, deviceStatusLabels, linkKindLabels, purposeLabels, reportTitles } from '../data/compliance-data';
import type { Check, Device, Item, Report, Room } from '../types';

const options = (labels: Record<string, string>): Array<{ value: string; label: string }> => Object.entries(labels).map(([value, label]) => ({ value, label }));
const numberOrUndefined = (v: string): number | undefined => (v.trim() === '' || Number.isNaN(Number(v)) ? undefined : Number(v));

interface DialogProps<T> {
  slug: string;
  value?: T;
  onClose: () => void;
  onSaved: () => void;
}

// An environment of the virtual tutors: name, place, area, workstations, furniture and power supply
export const RoomDialog = ({ slug, value, onClose, onSaved }: DialogProps<Room>): JSX.Element => {
  const [v, setV] = useState<Room>(value ?? { id: '', name: '', location: '', workstations: 0, furniture: '', powerSupply: '', notes: '', devices: 0, files: 0 });
  const [area, setArea] = useState(value?.areaM2 !== undefined ? String(value.areaM2) : '');
  const [isPending, start] = useTransition();
  const set = (patch: Partial<Room>): void => setV((x) => ({ ...x, ...patch }));
  const invalid = v.name.trim().length < 2;
  const submit = (): void =>
    start(async () => {
      const r = await runAcademicAction(saveRoomAction(slug, { ...v, areaM2: numberOrUndefined(area) }));
      if (r.ok) onSaved();
    });
  return (
    <FormDialog title={value ? 'Editar ambiente' : 'Nuevo ambiente'} description="El espacio físico donde trabajan los tutores virtuales (apartado III del informe de equipos)." submitLabel="Guardar" isPending={isPending} disabled={invalid} onSubmit={submit} onClose={onClose} wide>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="room-name" label="Denominación" required>
          <Input id="room-name" maxLength={120} placeholder="Sala de tutoría virtual" value={v.name} onChange={(e): void => set({ name: e.target.value })} />
        </FormField>
        <FormField id="room-location" label="Nivel y ubicación">
          <Input id="room-location" maxLength={200} placeholder="Segundo piso, ambiente 201" value={v.location} onChange={(e): void => set({ location: e.target.value })} />
        </FormField>
        <FormField id="room-area" label="Área (m²)">
          <Input id="room-area" type="number" min={0} step={0.1} value={area} onChange={(e): void => setArea(e.target.value)} />
        </FormField>
        <FormField id="room-ws" label="Puestos de trabajo">
          <Input id="room-ws" type="number" min={0} max={500} value={v.workstations} onChange={(e): void => set({ workstations: Number(e.target.value) })} />
        </FormField>
      </div>
      <FormField id="room-furniture" label="Mobiliario">
        <Textarea id="room-furniture" rows={2} maxLength={500} value={v.furniture} onChange={(e): void => set({ furniture: e.target.value })} />
      </FormField>
      <FormField id="room-power" label="Suministro eléctrico">
        <Input id="room-power" maxLength={300} value={v.powerSupply} onChange={(e): void => set({ powerSupply: e.target.value })} />
      </FormField>
    </FormDialog>
  );
};

// A device of the inventory: code, kind, brand, model, specs, place, purpose and state
export const DeviceDialog = ({ slug, value, rooms, onClose, onSaved }: DialogProps<Device> & { rooms: Room[] }): JSX.Element => {
  const [v, setV] = useState<Device>(
    value ?? { id: '', code: '', kind: 'desktop', brand: '', model: '', specs: '', roomId: rooms[0]?.id ?? '', roomName: '', purpose: 'virtual_tutoring', staffId: '', staffName: '', assignedTo: '', status: 'operational', notes: '', files: 0, lastAccess: '' },
  );
  const [isPending, start] = useTransition();
  const set = (patch: Partial<Device>): void => setV((x) => ({ ...x, ...patch }));
  const invalid = v.code.trim().length < 2;
  const submit = (): void =>
    start(async () => {
      const r = await runAcademicAction(saveDeviceAction(slug, v));
      if (r.ok) onSaved();
    });
  return (
    <FormDialog title={value ? `Editar ${value.code}` : 'Nuevo equipo'} description="Se lista en el inventario del informe (apartado IV) con su destino y estado." submitLabel="Guardar" isPending={isPending} disabled={invalid} onSubmit={submit} onClose={onClose} wide>
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField id="device-code" label="Código" required hint="PC-01, LAP-01…">
          <Input id="device-code" maxLength={20} value={v.code} onChange={(e): void => set({ code: e.target.value.toUpperCase() })} />
        </FormField>
        <FormField id="device-kind" label="Tipo">
          <SelectField id="device-kind" value={v.kind} options={options(deviceKindLabels)} onChange={(kind): void => set({ kind })} />
        </FormField>
        <FormField id="device-status" label="Estado">
          <SelectField id="device-status" value={v.status} options={options(deviceStatusLabels)} onChange={(status): void => set({ status })} />
        </FormField>
        <FormField id="device-brand" label="Marca">
          <Input id="device-brand" maxLength={80} value={v.brand} onChange={(e): void => set({ brand: e.target.value })} />
        </FormField>
        <FormField id="device-model" label="Modelo">
          <Input id="device-model" maxLength={120} value={v.model} onChange={(e): void => set({ model: e.target.value })} />
        </FormField>
        <FormField id="device-room" label="Ubicación">
          <SelectField id="device-room" value={v.roomId} options={[{ value: '', label: 'Sin ambiente' }, ...rooms.map((r) => ({ value: r.id, label: r.name }))]} onChange={(roomId): void => set({ roomId })} />
        </FormField>
      </div>
      <FormField id="device-specs" label="Características" hint="Procesador, memoria, almacenamiento, cámara y audio.">
        <Input id="device-specs" maxLength={300} value={v.specs} onChange={(e): void => set({ specs: e.target.value })} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="device-purpose" label="Destino">
          <SelectField id="device-purpose" value={v.purpose} options={options(purposeLabels)} onChange={(purpose): void => set({ purpose })} />
        </FormField>
        <FormField id="device-user" label="Usuario o responsable" hint={v.staffName ? `Responsable registrado: ${v.staffName}` : undefined}>
          <Input id="device-user" maxLength={160} placeholder="Tutores de 3.° y 4.°" value={v.assignedTo} onChange={(e): void => set({ assignedTo: e.target.value })} />
        </FormField>
      </div>
    </FormDialog>
  );
};

// A connectivity test (room or device) or an access test from a device, with the profile used (never a password)
export const CheckDialog = ({ slug, rooms, devices, onClose, onSaved }: { slug: string; rooms: Room[]; devices: Device[]; onClose: () => void; onSaved: () => void }): JSX.Element => {
  const today = useToday();
  const [v, setV] = useState<Check>({ id: '', kind: 'connectivity', roomId: rooms[0]?.id ?? '', roomName: '', deviceId: '', deviceCode: '', checkedOn: today, provider: '', linkKind: 'fiber', profile: '', passed: true, result: '', checkedByName: '', files: 0 });
  const [speeds, setSpeeds] = useState({ down: '', up: '', latency: '' });
  const [isPending, start] = useTransition();
  const set = (patch: Partial<Check>): void => setV((x) => ({ ...x, ...patch }));
  const access = v.kind === 'platform_access';
  const invalid = access ? !v.deviceId || !v.profile.trim() : (!v.roomId && !v.deviceId) || !v.provider.trim();
  const submit = (): void =>
    start(async () => {
      const r = await runAcademicAction(
        addCheckAction(slug, { ...v, roomId: access ? '' : v.roomId, linkKind: access ? '' : v.linkKind, downloadMbps: access ? undefined : numberOrUndefined(speeds.down), uploadMbps: access ? undefined : numberOrUndefined(speeds.up), latencyMs: access ? undefined : numberOrUndefined(speeds.latency) }),
      );
      if (r.ok) onSaved();
    });
  return (
    <FormDialog title="Registrar prueba" description="Adjunta después la captura del resultado. Las capturas no deben mostrar contraseñas ni datos personales." submitLabel="Registrar" isPending={isPending} disabled={invalid} onSubmit={submit} onClose={onClose} wide>
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField id="check-kind" label="Prueba">
          <SelectField id="check-kind" value={v.kind} options={options(checkKindLabels)} onChange={(kind): void => set({ kind })} />
        </FormField>
        <FormField id="check-on" label="Fecha">
          <Input id="check-on" type="date" max={today} value={v.checkedOn} onChange={(e): void => set({ checkedOn: e.target.value })} />
        </FormField>
        <FormField id="check-passed" label="Resultado">
          <SelectField id="check-passed" value={v.passed ? 'yes' : 'no'} options={[{ value: 'yes', label: 'Conforme' }, { value: 'no', label: 'Con observaciones' }]} onChange={(x): void => set({ passed: x === 'yes' })} />
        </FormField>
      </div>
      {access ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="check-device" label="Equipo" required>
            <SelectField id="check-device" value={v.deviceId} options={[{ value: '', label: 'Elige el equipo' }, ...devices.map((d) => ({ value: d.id, label: `${d.code} · ${deviceKindLabels[d.kind]}` }))]} onChange={(deviceId): void => set({ deviceId })} />
          </FormField>
          <FormField id="check-profile" label="Perfil usado" required hint="tutor virtual, administrador…">
            <Input id="check-profile" maxLength={60} value={v.profile} onChange={(e): void => set({ profile: e.target.value })} />
          </FormField>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField id="check-room" label="Ambiente">
              <SelectField id="check-room" value={v.roomId} options={[{ value: '', label: 'Ninguno' }, ...rooms.map((r) => ({ value: r.id, label: r.name }))]} onChange={(roomId): void => set({ roomId })} />
            </FormField>
            <FormField id="check-provider" label="Proveedor" required>
              <Input id="check-provider" maxLength={120} placeholder="Movistar Fibra" value={v.provider} onChange={(e): void => set({ provider: e.target.value })} />
            </FormField>
            <FormField id="check-link" label="Enlace">
              <SelectField id="check-link" value={v.linkKind} options={options(linkKindLabels)} onChange={(linkKind): void => set({ linkKind })} />
            </FormField>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField id="check-down" label="Bajada (Mbps)">
              <Input id="check-down" type="number" min={0} step={0.1} value={speeds.down} onChange={(e): void => setSpeeds((s) => ({ ...s, down: e.target.value }))} />
            </FormField>
            <FormField id="check-up" label="Subida (Mbps)">
              <Input id="check-up" type="number" min={0} step={0.1} value={speeds.up} onChange={(e): void => setSpeeds((s) => ({ ...s, up: e.target.value }))} />
            </FormField>
            <FormField id="check-latency" label="Latencia (ms)">
              <Input id="check-latency" type="number" min={0} value={speeds.latency} onChange={(e): void => setSpeeds((s) => ({ ...s, latency: e.target.value }))} />
            </FormField>
          </div>
        </>
      )}
      <FormField id="check-result" label="Detalle del resultado">
        <Input id="check-result" maxLength={500} value={v.result} onChange={(e): void => set({ result: e.target.value })} />
      </FormField>
    </FormDialog>
  );
};

// The data of a report: number, file, place, evaluation date and what the technical lead concludes
export const ReportDialog = ({ slug, value, onClose, onSaved }: DialogProps<Report> & { value: Report }): JSX.Element => {
  const today = useToday();
  const [v, setV] = useState<Report>(value);
  const [isPending, start] = useTransition();
  const set = (patch: Partial<Report>): void => setV((x) => ({ ...x, ...patch }));
  const submit = (): void =>
    start(async () => {
      const r = await runAcademicAction(saveReportAction(slug, v));
      if (r.ok) onSaved();
    });
  return (
    <FormDialog title={`Datos del informe · ${reportTitles[v.kind]?.title}`} description={reportTitles[v.kind]?.norm} submitLabel="Guardar" isPending={isPending} onSubmit={submit} onClose={onClose} wide>
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField id="report-number" label="N.° de informe">
          <Input id="report-number" maxLength={30} placeholder="001-2026" value={v.number} onChange={(e): void => set({ number: e.target.value })} />
        </FormField>
        <FormField id="report-file" label="Expediente">
          <Input id="report-file" maxLength={40} value={v.fileNumber} onChange={(e): void => set({ fileNumber: e.target.value })} />
        </FormField>
        <FormField id="report-date" label="Fecha de evaluación">
          <Input id="report-date" type="date" max={today} value={v.evaluatedOn} onChange={(e): void => set({ evaluatedOn: e.target.value })} />
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
        <FormField id="report-city" label="Ciudad">
          <Input id="report-city" maxLength={60} value={v.city} onChange={(e): void => set({ city: e.target.value })} />
        </FormField>
        <FormField id="report-location" label="Ubicación del local">
          <Input id="report-location" maxLength={300} value={v.location} onChange={(e): void => set({ location: e.target.value })} />
        </FormField>
      </div>
      {v.kind === 'platform' && (
        <FormField id="report-result" label="Resultado general de la verificación">
          <Textarea id="report-result" rows={2} maxLength={1500} value={v.generalResult} onChange={(e): void => set({ generalResult: e.target.value })} />
        </FormField>
      )}
      <FormField id="report-limits" label="Limitaciones o componentes pendientes">
        <Textarea id="report-limits" rows={2} maxLength={1500} value={v.limitations} onChange={(e): void => set({ limitations: e.target.value })} />
      </FormField>
      <FormField id="report-conclusion" label="Conclusión del responsable técnico" hint="Completa la última conclusión del informe.">
        <Textarea id="report-conclusion" rows={3} maxLength={1500} value={v.conclusion} onChange={(e): void => set({ conclusion: e.target.value })} />
      </FormField>
    </FormDialog>
  );
};

// Where an element lives in the panel and its evidence reference in the file (annex and folio)
export const ItemDialog = ({ slug, value, onClose, onSaved }: DialogProps<Item> & { value: Item }): JSX.Element => {
  const [v, setV] = useState({ id: value.id, module: value.module, route: value.route, annex: value.annex, folio: value.folio, notes: value.notes });
  const [isPending, start] = useTransition();
  const set = (patch: Partial<typeof v>): void => setV((x) => ({ ...x, ...patch }));
  const submit = (): void =>
    start(async () => {
      const r = await runAcademicAction(saveItemAction(slug, v));
      if (r.ok) onSaved();
    });
  return (
    <FormDialog title={value.element} description="El módulo y la ruta salen en la matriz del informe; el anexo y el folio, en la columna de evidencia." submitLabel="Guardar" isPending={isPending} onSubmit={submit} onClose={onClose}>
      <FormField id="item-module" label="Módulo">
        <Input id="item-module" maxLength={200} value={v.module} onChange={(e): void => set({ module: e.target.value })} />
      </FormField>
      <FormField id="item-route" label="Ruta en el panel">
        <Input id="item-route" maxLength={200} value={v.route} onChange={(e): void => set({ route: e.target.value })} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="item-annex" label="Anexo N.°">
          <Input id="item-annex" maxLength={10} placeholder="03" value={v.annex} onChange={(e): void => set({ annex: e.target.value })} />
        </FormField>
        <FormField id="item-folio" label="Folio">
          <Input id="item-folio" maxLength={10} placeholder="12" value={v.folio} onChange={(e): void => set({ folio: e.target.value })} />
        </FormField>
      </div>
      <FormField id="item-notes" label="Nota interna">
        <Input id="item-notes" maxLength={500} value={v.notes} onChange={(e): void => set({ notes: e.target.value })} />
      </FormField>
    </FormDialog>
  );
};
