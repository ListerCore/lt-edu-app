'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import { AlertCircle, Loader2, Sparkles, X } from 'lucide-react';
import type { CreateEventRawData, DashboardCreateModalProps } from '../types';

export const DashboardCreateModal = ({ isOpen, isCreating, onClose, onSubmit }: DashboardCreateModalProps): JSX.Element | null => {
  const [formData, setFormData] = useState<CreateEventRawData>({
    name: '',
    category: 'SIMPOSIO',
    date: '',
    location: '',
    maxCapacity: 50,
    organizer: '',
  });

  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError('El nombre del evento es obligatorio.');
      return;
    }
    if (!formData.location.trim()) {
      setFormError('La ubicación o auditorio es obligatoria.');
      return;
    }
    if (!formData.organizer.trim()) {
      setFormError('El responsable u organizador es obligatorio.');
      return;
    }

    await onSubmit(formData);
    setFormData({
      name: '',
      category: 'SIMPOSIO',
      date: '',
      location: '',
      maxCapacity: 50,
      organizer: '',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-xl rounded-2xl border border-[#2E3545] bg-[#141B2D] p-6 sm:p-8 shadow-2xl shadow-black/80">
        <div className="flex items-center justify-between pb-5 border-b border-[#2E3545]/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Registrar Nuevo Evento</h3>
              <p className="text-xs text-[#908FA0]">Ingresa los datos del evento médico o simposio</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-[#908FA0] hover:text-white hover:bg-[#191F2F] transition-colors cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {formError && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#908FA0] mb-1.5">Nombre del Evento *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej. Simposio Nacional de Cirugía Aséptica"
              className="w-full rounded-xl border border-[#2E3545] bg-[#0C1322] px-4 py-2.5 text-sm text-white placeholder-[#908FA0] focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#908FA0] mb-1.5">Categoría *</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full rounded-xl border border-[#2E3545] bg-[#0C1322] px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer">
                <option value="SIMPOSIO">Simposio</option>
                <option value="CONFERENCIA">Conferencia</option>
                <option value="TALLER">Taller Práctico</option>
                <option value="CIRUGIA_DEMO">Demostración Quirúrgica</option>
                <option value="CAPACITACION">Capacitación</option>
                <option value="SEMINARIO">Seminario</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#908FA0] mb-1.5">Fecha y Hora *</label>
              <input type="datetime-local" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full rounded-xl border border-[#2E3545] bg-[#0C1322] px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#908FA0] mb-1.5">Ubicación / Auditorio *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ej. Auditorio Quirúrgico 4A"
                className="w-full rounded-xl border border-[#2E3545] bg-[#0C1322] px-4 py-2.5 text-sm text-white placeholder-[#908FA0] focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#908FA0] mb-1.5">Aforo / Capacidad Máxima *</label>
              <input type="number" min="1" required value={formData.maxCapacity} onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })} className="w-full rounded-xl border border-[#2E3545] bg-[#0C1322] px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#908FA0] mb-1.5">Responsable / Ponente Principal *</label>
            <input
              type="text"
              required
              value={formData.organizer}
              onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
              placeholder="Ej. Dr. Alexander Fleming"
              className="w-full rounded-xl border border-[#2E3545] bg-[#0C1322] px-4 py-2.5 text-sm text-white placeholder-[#908FA0] focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="mt-8 flex items-center justify-end gap-3 pt-5 border-t border-[#2E3545]/60">
            <button type="button" onClick={onClose} disabled={isCreating} className="rounded-xl border border-[#2E3545] bg-[#0C1322] px-5 py-2.5 text-sm font-medium text-zinc-300 hover:bg-[#191F2F] hover:text-white transition-all cursor-pointer">
              Cancelar
            </button>
            <button type="submit" disabled={isCreating} className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-indigo-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer">
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <span>Guardar Evento</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
