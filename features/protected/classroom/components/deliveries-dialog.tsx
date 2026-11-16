'use client';

import type { JSX } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useDeliveries } from '../hooks/use-deliveries';
import type { DeliveriesDialogProps } from '../types';

// Itinerant form: who received the printed unit and who returned it, one row per student of an itinerant section
export const DeliveriesDialog = ({ unit, onClose }: DeliveriesDialogProps): JSX.Element => {
  const d = useDeliveries(unit.id);
  const rows = d.data ?? [];
  return (
    <Dialog open onOpenChange={(open): void => (open ? undefined : onClose())}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Entregas · {unit.title}</DialogTitle>
          <DialogDescription>
            Estudiantes de las secciones itinerantes. Cada fecha se guarda al cambiarla.{' '}
            {rows.length > 0 && `${d.delivered} de ${rows.length} recibieron el material y ${d.returned} lo devolvieron.`}
          </DialogDescription>
        </DialogHeader>
        {d.error ? (
          <p className="text-sm text-destructive">{d.error}</p>
        ) : d.isLoading ? (
          <p className="text-sm text-muted-foreground">Cargando…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay estudiantes en secciones itinerantes de este grado.</p>
        ) : (
          <div className="max-h-[55vh] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-background text-left text-xs text-muted-foreground">
                <tr>
                  <th className="py-2 font-medium">Estudiante</th>
                  <th className="py-2 font-medium">Entregado</th>
                  <th className="py-2 font-medium">Devuelto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r) => (
                  <tr key={r.studentId} aria-busy={d.savingId === r.studentId}>
                    <td className="py-2 pr-3">
                      <p className="font-medium text-foreground">{r.studentName}</p>
                      <p className="text-xs text-muted-foreground">{r.studentCode}</p>
                    </td>
                    <td className="py-2 pr-2">
                      <Input type="date" aria-label={`Entregado a ${r.studentName}`} value={r.deliveredOn} disabled={d.savingId === r.studentId} onChange={(e): void => d.save(r.studentId, e.target.value, r.returnedOn)} className="h-9 w-40" />
                    </td>
                    <td className="py-2">
                      <Input type="date" aria-label={`Devuelto por ${r.studentName}`} value={r.returnedOn} min={r.deliveredOn || undefined} disabled={!r.deliveredOn || d.savingId === r.studentId} onChange={(e): void => d.save(r.studentId, r.deliveredOn, e.target.value)} className="h-9 w-40" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
