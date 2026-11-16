'use client';

import { useTransition, type JSX } from 'react';
import { Pencil, Plus } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { ConfirmDelete } from '@/features/protected/academic/components/academic-ui';
import { formatDay } from '@/features/protected/academic/data/academic-data';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { AttachmentsButton } from '@/features/protected/attachments/components/attachments-button';
import type { AcademicResult } from '@/features/protected/academic/types';
import { cn } from '@/lib/utils';
import { deleteCheckAction } from '../actions/delete-check';
import { deleteDeviceAction } from '../actions/delete-device';
import { deleteRoomAction } from '../actions/delete-room';
import { checkKindLabels, deviceCategories, deviceKindLabels, deviceStatusLabels, evidenceCategories, linkKindLabels, purposeLabels, roomCategories } from '../data/compliance-data';
import type { ComplianceBoard, Device, Room } from '../types';

interface Props {
  slug: string;
  board: ComplianceBoard;
  onRoom: (r?: Room) => void;
  onDevice: (d?: Device) => void;
  onCheck: () => void;
  onChange: () => void;
}

const iconButton = 'inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground';

// The environment, the inventory and the tests of the virtual tutors' equipment (6.3.2 c)
export const EquipmentTab = ({ slug, board, onRoom, onDevice, onCheck, onChange }: Props): JSX.Element => {
  const [isPending, start] = useTransition();
  const remove = (work: () => Promise<AcademicResult<true>>): void =>
    start(async () => {
      const r = await runAcademicAction(work());
      if (r.ok) onChange();
    });
  return (
    <div className="space-y-8">
      <section aria-labelledby="eq-rooms" className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 id="eq-rooms" className="text-lg font-semibold text-foreground">
            Ambientes
          </h2>
          {board.canWrite && (
            <button type="button" className="btn-alt" onClick={(): void => onRoom()}>
              <MorphIcon icon={Plus} size={16} />
              Ambiente
            </button>
          )}
        </div>
        {board.rooms.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border px-6 py-8 text-center text-sm text-muted-foreground">Registra el ambiente donde trabajan los tutores virtuales.</p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {board.rooms.map((r) => (
              <li key={r.id} className="rounded-2xl border border-border bg-background p-4 text-sm">
                <div className="flex items-start justify-between gap-2">
                  <span>
                    <span className="block font-semibold text-foreground">{r.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {r.location}
                      {r.areaM2 !== undefined && ` · ${r.areaM2} m²`} · {r.workstations} puestos · {r.devices} equipos
                    </span>
                  </span>
                  <span className="flex items-center">
                    <AttachmentsButton ownerKind="equipment_room" ownerId={r.id} title={`Fotos y plano · ${r.name}`} description="Registro fotográfico y plano o croquis (Anexo 01 del informe de equipos)." categories={roomCategories} iconOnly label="Fotos y plano" />
                    {board.canWrite && (
                      <>
                        <button type="button" className={iconButton} onClick={(): void => onRoom(r)} aria-label={`Editar ${r.name}`}>
                          <MorphIcon icon={Pencil} size={15} />
                        </button>
                        <ConfirmDelete compact title={`¿Eliminar ${r.name}?`} description="Sus equipos quedan sin ubicación y sus pruebas de conectividad se eliminan." isPending={isPending} onConfirm={(): void => remove(() => deleteRoomAction(slug, r.id))} />
                      </>
                    )}
                  </span>
                </div>
                {(r.furniture || r.powerSupply) && <p className="mt-2 text-muted-foreground">{[r.furniture, r.powerSupply].filter(Boolean).join(' · ')}</p>}
                <p className="mt-2 text-xs text-muted-foreground">{r.files === 0 ? 'Sin fotos ni plano' : `${r.files} ${r.files === 1 ? 'archivo' : 'archivos'}`}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="eq-devices" className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 id="eq-devices" className="text-lg font-semibold text-foreground">
            Inventario ({board.devices.length})
          </h2>
          {board.canWrite && (
            <button type="button" className="btn-alt" onClick={(): void => onDevice()}>
              <MorphIcon icon={Plus} size={16} />
              Equipo
            </button>
          )}
        </div>
        <div className="overflow-x-auto rounded-2xl border border-border bg-background">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th scope="col" className="px-3 py-2.5 font-medium">Código</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Equipo</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Ubicación</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Destino / usuario</th>
                <th scope="col" className="px-3 py-2.5 font-medium">Estado</th>
                <th scope="col" className="px-3 py-2.5 font-medium">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {board.devices.map((d) => (
                <tr key={d.id}>
                  <td className="px-3 py-2.5 font-medium whitespace-nowrap text-foreground tabular-nums">{d.code}</td>
                  <td className="px-3 py-2.5">
                    <span className="block text-foreground">
                      {deviceKindLabels[d.kind]} {[d.brand, d.model].filter(Boolean).join(' ')}
                    </span>
                    <span className="block text-xs text-muted-foreground">{d.specs}</span>
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">{d.roomName || '—'}</td>
                  <td className="px-3 py-2.5">
                    <span className="block text-foreground">{purposeLabels[d.purpose]}</span>
                    <span className="block text-xs text-muted-foreground">{[d.staffName, d.assignedTo].filter(Boolean).join(' · ')}</span>
                    {d.lastAccess && <span className="block text-xs text-success">Acceso probado el {formatDay(d.lastAccess.slice(0, 10))}</span>}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={cn('pill', d.status === 'operational' ? 'bg-success/12 text-success' : 'bg-warning/12 text-warning')}>{deviceStatusLabels[d.status]}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="flex justify-end">
                      <AttachmentsButton ownerKind="equipment_device" ownerId={d.id} title={`Fotos · ${d.code}`} description="Fotografía del equipo y su etiqueta (Anexo 03 del informe de equipos)." categories={deviceCategories} iconOnly label="Fotos" />
                      {board.canWrite && (
                        <>
                          <button type="button" className={iconButton} onClick={(): void => onDevice(d)} aria-label={`Editar ${d.code}`}>
                            <MorphIcon icon={Pencil} size={15} />
                          </button>
                          <ConfirmDelete compact title={`¿Eliminar ${d.code}?`} description="Se eliminan también sus pruebas." isPending={isPending} onConfirm={(): void => remove(() => deleteDeviceAction(slug, d.id))} />
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="eq-checks" className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 id="eq-checks" className="text-lg font-semibold text-foreground">
            Pruebas de conectividad y acceso
          </h2>
          {board.canWrite && (
            <button type="button" className="btn-alt" disabled={board.rooms.length === 0 && board.devices.length === 0} onClick={onCheck}>
              <MorphIcon icon={Plus} size={16} />
              Registrar prueba
            </button>
          )}
        </div>
        {board.checks.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border px-6 py-8 text-center text-sm text-muted-foreground">Sin pruebas registradas.</p>
        ) : (
          <ul className="divide-y divide-border rounded-2xl border border-border bg-background">
            {board.checks.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-sm">
                <span className="w-24 text-muted-foreground tabular-nums">{formatDay(c.checkedOn)}</span>
                <span className="min-w-0 flex-1 basis-64">
                  <span className="block font-medium text-foreground">
                    {checkKindLabels[c.kind]} · {[c.roomName, c.deviceCode].filter(Boolean).join(' / ')}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {c.kind === 'connectivity'
                      ? [c.provider, linkKindLabels[c.linkKind], c.downloadMbps !== undefined && `${c.downloadMbps} Mbps de bajada`, c.uploadMbps !== undefined && `${c.uploadMbps} Mbps de subida`, c.latencyMs !== undefined && `${c.latencyMs} ms`]
                          .filter(Boolean)
                          .join(' · ')
                      : `Perfil: ${c.profile}`}
                    {c.result && ` · ${c.result}`}
                  </span>
                </span>
                <span className={cn('pill', c.passed ? 'bg-success/12 text-success' : 'bg-warning/12 text-warning')}>{c.passed ? 'Conforme' : 'Con observaciones'}</span>
                <span className="flex">
                  <AttachmentsButton ownerKind="equipment_check" ownerId={c.id} title="Captura de la prueba" description="Sale en el Anexo 04 del informe de equipos. Sin contraseñas ni datos personales." categories={evidenceCategories} iconOnly label={c.files ? `${c.files} capturas` : 'Captura'} />
                  {board.canWrite && <ConfirmDelete compact title="¿Eliminar la prueba?" description="Se elimina con sus capturas." isPending={isPending} onConfirm={(): void => remove(() => deleteCheckAction(slug, c.id))} />}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
