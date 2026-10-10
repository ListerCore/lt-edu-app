import type { JSX } from 'react';
import { Briefcase, Check, HeartHandshake, Loader2, UserCheck } from 'lucide-react';
import type { EnrollmentFormProps } from '../types';

export const EnrollmentForm = ({ formData, isSaving, updateField, onSubmit }: EnrollmentFormProps): JSX.Element => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="rounded-2xl border border-[#22334F] bg-[#132036]/80 p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider pb-3 border-b border-[#22334F]/60">
          <UserCheck className="h-4 w-4" />
          <span>1. Datos Personales y Validación de Identidad</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Tipo de Documento *</label>
            <select value={formData.docType} onChange={(e) => updateField('docType', e.target.value as 'DNI')} className="w-full rounded-xl border border-[#22334F] bg-[#0B1528] px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none">
              <option value="DNI">DNI (Documento Nacional)</option>
              <option value="CARNET_EXTRANJERIA">Carné de Extranjería</option>
              <option value="PASAPORTE">Pasaporte</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">N° de Documento *</label>
            <input type="text" required value={formData.docNumber} onChange={(e) => updateField('docNumber', e.target.value)} placeholder="Ej. 74839201" className="w-full rounded-xl border border-[#22334F] bg-[#0B1528] px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Fecha de Nacimiento *</label>
            <input type="date" required value={formData.birthDate} onChange={(e) => updateField('birthDate', e.target.value)} className="w-full rounded-xl border border-[#22334F] bg-[#0B1528] px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Apellido Paterno *</label>
            <input type="text" required value={formData.paternalSurname} onChange={(e) => updateField('paternalSurname', e.target.value)} placeholder="Ej. Quispe" className="w-full rounded-xl border border-[#22334F] bg-[#0B1528] px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Apellido Materno *</label>
            <input type="text" required value={formData.maternalSurname} onChange={(e) => updateField('maternalSurname', e.target.value)} placeholder="Ej. Mamani" className="w-full rounded-xl border border-[#22334F] bg-[#0B1528] px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Nombres *</label>
            <input type="text" required value={formData.firstNames} onChange={(e) => updateField('firstNames', e.target.value)} placeholder="Ej. Juan Carlos" className="w-full rounded-xl border border-[#22334F] bg-[#0B1528] px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Género *</label>
            <select value={formData.gender} onChange={(e) => updateField('gender', e.target.value as 'MASCULINO')} className="w-full rounded-xl border border-[#22334F] bg-[#0B1528] px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none">
              <option value="MASCULINO">Masculino</option>
              <option value="FEMENINO">Femenino</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Teléfono / WhatsApp *</label>
            <input type="text" required value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="Ej. 987654321" className="w-full rounded-xl border border-[#22334F] bg-[#0B1528] px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Correo Electrónico</label>
            <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} placeholder="Ej. estudiante@gmail.com" className="w-full rounded-xl border border-[#22334F] bg-[#0B1528] px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#22334F] bg-[#132036]/80 p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider pb-3 border-b border-[#22334F]/60">
          <HeartHandshake className="h-4 w-4" />
          <span>2. Ciclo Formativo, Inclusión y Modalidad EBA</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Ciclo y Grado EBA *</label>
            <select value={formData.cycleLevel} onChange={(e) => updateField('cycleLevel', e.target.value as 'AVANZADO_1')} className="w-full rounded-xl border border-[#22334F] bg-[#0B1528] px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none">
              <option value="INICIAL">Ciclo Inicial (Alfabetización / 1°-2°)</option>
              <option value="INTERMEDIO">Ciclo Intermedio (1°-3° Primaria EBA)</option>
              <option value="AVANZADO_1">Ciclo Avanzado - 1° Grado (1° Secundaria)</option>
              <option value="AVANZADO_2">Ciclo Avanzado - 2° Grado (2° Secundaria)</option>
              <option value="AVANZADO_3">Ciclo Avanzado - 3° Grado (3° Secundaria)</option>
              <option value="AVANZADO_4">Ciclo Avanzado - 4° Grado (4° y 5° Secundaria)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Modalidad de Atención *</label>
            <select value={formData.modality} onChange={(e) => updateField('modality', e.target.value as 'SEMIPRESENCIAL')} className="w-full rounded-xl border border-[#22334F] bg-[#0B1528] px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none">
              <option value="SEMIPRESENCIAL">Semipresencial (Fines de semana / Noche)</option>
              <option value="PRESENCIAL">Presencial Regular</option>
              <option value="A_DISTANCIA">A Distancia (Virtual Asincrónico)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#22334F] bg-[#132036]/80 p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider pb-3 border-b border-[#22334F]/60">
          <Briefcase className="h-4 w-4" />
          <span>3. Situación Ocupacional y Turno de Compatibilidad</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Ocupación / Oficio Actual</label>
            <input type="text" value={formData.occupation} onChange={(e) => updateField('occupation', e.target.value)} placeholder="Ej. Auxiliar de Almacén, Independiente" className="w-full rounded-xl border border-[#22334F] bg-[#0B1528] px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase mb-1">Turno Solicitado *</label>
            <select value={formData.availableShift} onChange={(e) => updateField('availableShift', e.target.value as 'NOCHE')} className="w-full rounded-xl border border-[#22334F] bg-[#0B1528] px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none">
              <option value="NOCHE">Turno Noche (18:00 - 22:00 hrs)</option>
              <option value="TARDE">Turno Tarde (14:00 - 18:00 hrs)</option>
              <option value="MANANA">Turno Mañana (08:00 - 12:30 hrs)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 via-emerald-500 to-teal-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Validando en SIAGIE...</span>
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              <span>Guardar y Validar Matrícula Oficial</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
