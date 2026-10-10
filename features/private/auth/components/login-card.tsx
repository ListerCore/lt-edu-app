import type { JSX } from 'react';
import { AlertCircle, CheckCircle2, GraduationCap, Lock, LogIn, User, X } from 'lucide-react';
import type { LoginCardProps, UserRole } from '../types';

export const LoginCard = ({ formData, isLoading, notification, updateField, onSubmit, onClearNotification }: LoginCardProps): JSX.Element => {
  return (
    <div className="w-full max-w-md rounded-2xl border border-[#22334F] bg-[#132036]/90 p-8 backdrop-blur-xl shadow-2xl space-y-6">
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <GraduationCap className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">CEBA &ldquo;Joseph Lister&rdquo;</h1>
        <p className="text-xs text-[#94A3B8]">Sistema de Gestión Académica EBA • UGEL 03</p>
      </div>

      {notification && (
        <div className={`flex items-center justify-between p-3.5 rounded-xl border text-xs ${notification.type === 'success' ? 'border-emerald-500/40 bg-emerald-950/70 text-emerald-300' : 'border-rose-500/40 bg-rose-950/70 text-rose-300'}`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> : <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />}
            <span>{notification.message}</span>
          </div>
          <button type="button" onClick={onClearNotification} className="text-zinc-400 hover:text-white">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-[#94A3B8] mb-1.5">Perfil de Acceso</label>
          <div className="grid grid-cols-3 gap-2">
            {(['DIRECTIVO', 'DOCENTE', 'ESTUDIANTE'] as UserRole[]).map((r) => (
              <button key={r} type="button" onClick={() => updateField('role', r)} className={`py-2 text-[11px] font-bold rounded-xl border transition-all cursor-pointer ${formData.role === r ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-[#0B1528] text-[#94A3B8] border-[#22334F] hover:text-white'}`}>
                {r === 'DIRECTIVO' ? 'Directivo' : r === 'DOCENTE' ? 'Docente' : 'Estudiante'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-[#94A3B8] mb-1.5">N° de Documento (DNI)</label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[#94A3B8]" />
            <input type="text" required value={formData.docNumber} onChange={(e) => updateField('docNumber', e.target.value)} placeholder="Ej. 48392019" className="w-full rounded-xl border border-[#22334F] bg-[#0B1528] pl-10 pr-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-[#94A3B8] mb-1.5">Contraseña</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[#94A3B8]" />
            <input type="password" required value={formData.password} onChange={(e) => updateField('password', e.target.value)} placeholder="••••••••" className="w-full rounded-xl border border-[#22334F] bg-[#0B1528] pl-10 pr-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none" />
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 via-emerald-500 to-teal-600 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/50 transition-all cursor-pointer">
          <LogIn className="h-4 w-4" />
          <span>{isLoading ? 'Ingresando...' : 'Iniciar Sesión Institucional'}</span>
        </button>
      </form>

      <div className="pt-4 border-t border-[#22334F]/60 text-center text-xs text-[#94A3B8]">
        <span>Acceso regulado según normativa de la Educación Básica Alternativa - MINEDU</span>
      </div>
    </div>
  );
};
