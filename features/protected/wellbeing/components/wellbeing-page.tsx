'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { CalendarDays, CheckCircle2, ChevronRight, ClipboardPlus, MessageCircle, ShieldCheck, UserRound, Users } from 'lucide-react';
import { WellbeingAlerts } from './wellbeing-alerts';
import { WellbeingOverview } from './wellbeing-overview';
import { WellbeingStudentList } from './wellbeing-student-list';
import { WellbeingStudentProfile } from './wellbeing-student-profile';
import { wellbeingStudents, type WellbeingStudent } from '../data/wellbeing-data';

const WellbeingPage = (): JSX.Element => {
  const [selectedId, setSelectedId] = useState('silvia');
  const [notice, setNotice] = useState('');
  const [quickNoteStudent, setQuickNoteStudent] = useState<WellbeingStudent | null>(null);
  const [quickNote, setQuickNote] = useState('');
  const selectedStudent = wellbeingStudents.find(({ id }) => id === selectedId) ?? wellbeingStudents[0];

  const selectStudent = (student: WellbeingStudent): void => {
    setSelectedId(student.id);
    window.setTimeout(() => document.getElementById('student-profile')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };

  return (
    <main className="mx-auto flex w-full max-w-[1600px] min-w-0 flex-col gap-4 px-4 py-5 sm:gap-5 sm:px-6 sm:py-6 lg:px-8">
      <div className="flex flex-wrap items-center gap-2 text-[9px] text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">
          CEBA Joseph Lister
        </Link>
        <ChevronRight aria-hidden="true" className="size-3" />
        <span>Tutoría y acompañamiento</span>
        <ChevronRight aria-hidden="true" className="size-3" />
        <span className="font-semibold text-foreground">Panel del tutor EBA</span>
      </div>
      <section className="flex min-w-0 flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-primary/10 px-2 py-1 text-[8px] font-bold text-primary">RVM N.° 125-2020-MINEDU</span>
            <span className="inline-flex items-center gap-1 rounded bg-secondary/10 px-2 py-1 text-[8px] font-semibold text-secondary">
              <ShieldCheck aria-hidden="true" className="size-3" />
              Seguimiento confidencial
            </span>
          </div>
          <h1 className="mt-3 max-w-4xl font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">Tutoría integral y acompañamiento EBA</h1>
          <p className="mt-2 max-w-3xl text-[10px] leading-5 text-muted-foreground">Monitoreo de permanencia, bienestar socioemocional y prevención del riesgo de deserción, con acompañamiento adaptado a estudiantes trabajadores.</p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[8px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <UserRound aria-hidden="true" className="size-3 text-primary" />
              Tutor responsable: <strong className="text-foreground">Lic. Carlos Mendoza V.</strong>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays aria-hidden="true" className="size-3 text-primary" />
              Periodo lectivo: <strong className="text-foreground">2026-II</strong>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users aria-hidden="true" className="size-3 text-primary" />
              42 estudiantes asignados
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={(): void => setNotice('Formulario para programar cita abierto en modo demostración.')} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-[9px] font-semibold text-foreground hover:bg-muted">
            <CalendarDays aria-hidden="true" className="size-3.5 text-primary" />
            Programar cita
          </button>
          <button type="button" onClick={(): void => setNotice('Se preparó una comunicación para el grupo tutorial. El envío requiere conectar WhatsApp institucional.')} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-secondary px-3 text-[9px] font-semibold text-secondary-foreground hover:opacity-90">
            <MessageCircle aria-hidden="true" className="size-3.5" />
            WhatsApp masivo
          </button>
          <a href="#student-profile" onClick={(): void => document.getElementById('new-intervention')?.scrollIntoView({ behavior: 'smooth', block: 'center' })} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-[9px] font-semibold text-primary-foreground hover:opacity-90">
            <ClipboardPlus aria-hidden="true" className="size-3.5" />
            Registrar ficha / intervención
          </a>
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
      <WellbeingOverview />
      <WellbeingAlerts
        onAction={setNotice}
        onSelect={(id): void => {
          const student = wellbeingStudents.find((entry) => entry.id === id);
          if (student) selectStudent(student);
        }}
      />
      <WellbeingStudentList
        selectedId={selectedId}
        onSelect={selectStudent}
        onAction={setNotice}
        onQuickNote={(student): void => {
          setQuickNoteStudent(student);
          setQuickNote('');
        }}
      />
      <WellbeingStudentProfile key={selectedStudent.id} student={selectedStudent} onAction={setNotice} />
      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-[9px] text-muted-foreground">
        <span>CEBA Privado Virtual Joseph Lister · Tutoría y bienestar EBA</span>
        <span>Periodo 2026-II · Información de referencia</span>
      </footer>
      {quickNoteStudent && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 p-4 backdrop-blur-sm">
          <section role="dialog" aria-modal="true" aria-labelledby="quick-note-heading" className="w-full max-w-md rounded-lg border border-border bg-card p-5 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="quick-note-heading" className="font-heading text-sm font-bold text-foreground">
                  Nota rápida de tutoría
                </h2>
                <p className="mt-1 text-[9px] text-muted-foreground">
                  Estudiante: <strong className="text-foreground">{quickNoteStudent.name}</strong>
                </p>
              </div>
              <button type="button" onClick={(): void => setQuickNoteStudent(null)} aria-label="Cerrar" className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-muted">
                ×
              </button>
            </div>
            <textarea autoFocus value={quickNote} onChange={(event): void => setQuickNote(event.target.value)} rows={4} placeholder="Registra un apunte breve sobre el seguimiento o el próximo contacto…" className="mt-4 w-full resize-y rounded-md border border-border bg-background p-3 text-[10px] leading-5 text-foreground outline-none placeholder:text-muted-foreground focus:border-ring" />
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={(): void => setQuickNoteStudent(null)} className="h-9 rounded-md border border-border px-3 text-[9px] font-semibold text-foreground hover:bg-muted">
                Cancelar
              </button>
              <button
                type="button"
                disabled={!quickNote.trim()}
                onClick={(): void => {
                  setNotice(`Nota rápida agregada a la ficha de ${quickNoteStudent.name} en esta sesión.`);
                  setQuickNoteStudent(null);
                }}
                className="h-9 rounded-md bg-primary px-3 text-[9px] font-semibold text-primary-foreground disabled:opacity-50"
              >
                Guardar nota
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

export { WellbeingPage };
