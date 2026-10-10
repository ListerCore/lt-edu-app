'use client';

import type { JSX } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useEnrollment } from '../hooks/use-enrollment';
import { EnrollmentForm } from './enrollment-form';
import { EnrollmentHeader } from './enrollment-header';
import { EnrollmentSummary } from './enrollment-summary';

export const EnrollmentBody = (): JSX.Element => {
  const { formData, isSaving, notification, lastRecord, updateField, handleSubmit, clearNotification, resetForm } = useEnrollment();

  return (
    <main className="min-h-screen bg-[#070E1D] text-[#DCE2F7] antialiased py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {notification && (
          <div className={`flex items-center justify-between gap-3 rounded-xl border p-4 shadow-lg transition-all ${notification.type === 'success' ? 'border-emerald-500/40 bg-emerald-950/70 text-emerald-300 shadow-emerald-950/40' : 'border-rose-500/40 bg-rose-950/70 text-rose-300 shadow-rose-950/40'}`}>
            <div className="flex items-center gap-3">
              {notification.type === 'success' ? <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" /> : <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />}
              <span className="text-sm font-medium">{notification.message}</span>
            </div>
            <button type="button" onClick={clearNotification} className="rounded-lg p-1 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <EnrollmentHeader title="Ficha Oficial de Matrícula EBA 2026" subtitle="Proceso de inscripción, validación RENIEC y emisión de código de estudiante para jóvenes y adultos." />

        {lastRecord ? <EnrollmentSummary lastRecord={lastRecord} onNewEnrollment={resetForm} /> : <EnrollmentForm formData={formData} isSaving={isSaving} updateField={updateField} onSubmit={handleSubmit} />}
      </div>
    </main>
  );
};
