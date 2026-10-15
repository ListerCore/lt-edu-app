'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import { BadgeCheck, CalendarDays, CheckCircle2, Download, FileCheck2, Handshake, Heart, LockKeyhole, MessageCircle, Phone, Plus, Save, UserRound, Video } from 'lucide-react';
import { interventionHistory, type WellbeingStudent } from '../data/wellbeing-data';

type ProfileTab = 'interventions' | 'wellbeing' | 'agreements';

const WellbeingStudentProfile = ({ student, onAction }: { student: WellbeingStudent; onAction: (message: string) => void }): JSX.Element => {
  const [tab, setTab] = useState<ProfileTab>('interventions');
  const [notes, setNotes] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [type, setType] = useState('Soporte socioemocional y motivacional');
  const [channel, setChannel] = useState('Llamada telefónica directa');
  const [confidentiality, setConfidentiality] = useState('Estándar · equipo docente');
  const [notifyWellbeing, setNotifyWellbeing] = useState(true);
  const [notifyStudent, setNotifyStudent] = useState(true);
  const [saved, setSaved] = useState(false);

  const saveIntervention = (): void => {
    if (!note.trim()) return;
    setNotes((current) => [`${type} · ${note.trim()}`, ...current]);
    setNote('');
    setSaved(true);
    setTab('interventions');
  };

  return (
    <section id="student-profile" aria-labelledby="student-profile-heading" className="min-w-0 overflow-hidden rounded-lg border border-border bg-card">
      <header className="flex min-w-0 flex-col gap-4 bg-accent/40 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-primary/10 font-heading text-sm font-bold text-primary">{student.initials}</span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="student-profile-heading" className="font-heading text-sm font-bold text-foreground sm:text-base">
                {student.name}
              </h2>
              <span className={`rounded-full px-2 py-1 text-[8px] font-bold ${student.risk === 'Crítico' ? 'bg-destructive/10 text-destructive' : student.risk === 'Moderado' ? 'bg-chart-3/10 text-chart-3' : 'bg-secondary/10 text-secondary'}`}>Riesgo {student.risk} · seguimiento</span>
            </div>
            <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[8px] text-muted-foreground">
              <span>
                DNI: <strong className="text-foreground">{student.dni}</strong>
              </span>
              <span>{student.age} años</span>
              <span>{student.grade}</span>
            </p>
            <p className="mt-1 flex items-center gap-1 text-[8px] text-muted-foreground">
              <UserRound aria-hidden="true" className="size-3" />
              {student.occupation} · {student.contact}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={(): void => onAction(`Llamada lista para ${student.name}.`)} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-card px-2.5 text-[8px] font-semibold text-foreground hover:bg-muted">
            <Phone aria-hidden="true" className="size-3" />
            Llamar
          </button>
          <button type="button" onClick={(): void => onAction(`WhatsApp de tutoría preparado para ${student.name}.`)} className="inline-flex h-8 items-center gap-1.5 rounded-md bg-secondary px-2.5 text-[8px] font-semibold text-secondary-foreground hover:opacity-90">
            <MessageCircle aria-hidden="true" className="size-3" />
            WhatsApp EBA
          </button>
          <a href="#new-intervention" className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-2.5 text-[8px] font-semibold text-primary-foreground hover:opacity-90">
            <Plus aria-hidden="true" className="size-3" />
            Nueva nota
          </a>
        </div>
      </header>
      <div role="tablist" aria-label="Detalle de acompañamiento" className="flex min-w-0 gap-1 overflow-x-auto border-b border-border p-2">
        {[
          { id: 'interventions', label: 'Intervenciones y citas', icon: CalendarDays },
          { id: 'wellbeing', label: 'Bienestar socioemocional', icon: Heart },
          { id: 'agreements', label: 'Acuerdos y plan EBA', icon: Handshake },
        ].map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} aria-controls="student-profile-tabpanel" onClick={(): void => setTab(id as ProfileTab)} className={`inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-md px-3 text-[8px] font-semibold transition-colors sm:text-[9px] ${tab === id ? 'bg-muted text-primary' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'}`}>
            <Icon aria-hidden="true" className="size-3.5" />
            {label}
            {id === 'interventions' && <span className="rounded bg-accent px-1 py-0.5 text-[7px] text-primary">{interventionHistory.length + notes.length}</span>}
          </button>
        ))}
      </div>
      <div id="student-profile-tabpanel" role="tabpanel" className="min-w-0 p-4 sm:p-5">
        {tab === 'interventions' && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-heading text-xs font-bold text-foreground">Cronología de acciones de tutoría</h3>
                <p className="mt-1 text-[8px] text-muted-foreground">Registro de contactos, sesiones y acuerdos adoptados.</p>
              </div>
              <button type="button" onClick={(): void => window.print()} className="inline-flex items-center gap-1 text-[8px] font-semibold text-primary hover:underline">
                <Download aria-hidden="true" className="size-3" />
                Descargar informe
              </button>
            </div>
            <div className="mt-4 space-y-3 border-l border-border pl-4">
              {[...notes.map((title) => ({ title, date: 'Hoy · recién guardada', detail: 'Nueva intervención de tutoría registrada en esta sesión.', channel, status: 'Guardada' })), ...interventionHistory].map(({ title, date, detail, channel: entryChannel, status }) => (
                <article key={`${title}-${date}`} className="relative rounded-md bg-muted/40 p-3 before:absolute before:left-[-1.32rem] before:top-4 before:size-2 before:rounded-full before:bg-primary">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="text-[9px] font-semibold text-foreground">{title}</h4>
                      <p className="mt-1 text-[8px] text-muted-foreground">Tutor: Lic. Carlos Mendoza V. · {entryChannel}</p>
                    </div>
                    <time className="shrink-0 rounded bg-background px-2 py-1 text-[7px] text-muted-foreground">{date}</time>
                  </div>
                  <p className="mt-2 text-[8px] leading-4 text-muted-foreground">{detail}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-[7px] font-semibold text-secondary">
                    <BadgeCheck aria-hidden="true" className="size-3" />
                    {status}
                  </span>
                </article>
              ))}
            </div>
          </div>
        )}
        {tab === 'wellbeing' && (
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-heading text-xs font-bold text-foreground">Dimensión socioemocional y red de apoyo</h3>
                <p className="mt-1 text-[8px] text-muted-foreground">Información confidencial para el equipo de tutoría y bienestar.</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded bg-destructive/10 px-2 py-1 text-[7px] font-bold text-destructive">
                <LockKeyhole aria-hidden="true" className="size-3" />
                Confidencialidad {confidentiality.startsWith('Crítico') ? 'crítica' : 'restringida'}
              </span>
            </div>
            <div className="mt-4 grid min-w-0 gap-3 md:grid-cols-2">
              {[
                { title: 'Motivación y proyección personal', detail: student.motivation, icon: Heart },
                { title: 'Red familiar y cuidados', detail: student.family, icon: UserRound },
                { title: 'Estilo de aprendizaje', detail: student.learningStyle, icon: Video },
                { title: 'Adaptaciones sugeridas', detail: student.adaptation, icon: FileCheck2 },
              ].map(({ title, detail, icon: Icon }) => (
                <article key={title} className="min-w-0 rounded-md border border-border p-3">
                  <div className="flex items-center gap-2">
                    <Icon aria-hidden="true" className="size-3.5 text-primary" />
                    <h4 className="text-[9px] font-semibold text-foreground">{title}</h4>
                  </div>
                  <p className="mt-2 text-[8px] leading-4 text-muted-foreground">{detail}</p>
                </article>
              ))}
            </div>
            <p className="mt-3 flex items-start gap-2 rounded-md bg-accent/50 p-3 text-[8px] leading-4 text-muted-foreground">
              <LockKeyhole aria-hidden="true" className="mt-0.5 size-3 shrink-0 text-primary" />
              La información socioemocional debe tratarse con acceso limitado al personal autorizado.
            </p>
          </div>
        )}
        {tab === 'agreements' && (
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-heading text-xs font-bold text-foreground">Plan de flexibilización y permanencia EBA 2026-II</h3>
                <p className="mt-1 text-[8px] text-muted-foreground">Compromisos mutuos entre estudiante, tutor y docentes.</p>
              </div>
              <span className="rounded bg-secondary/10 px-2 py-1 text-[7px] font-bold text-secondary">Plan activo · hasta noviembre</span>
            </div>
            <div className="mt-4 space-y-2">
              {student.supportPlan.map((agreement, index) => (
                <article key={agreement} className="flex min-w-0 items-start gap-3 rounded-md bg-muted/40 p-3">
                  <span className={`grid size-6 shrink-0 place-items-center rounded text-[8px] font-bold ${index === 0 ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground'}`}>{index + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-semibold text-foreground">Compromiso {index + 1}</p>
                    <p className="mt-1 text-[8px] leading-4 text-muted-foreground">{agreement}</p>
                  </div>
                  <span className={`shrink-0 rounded px-1.5 py-1 text-[7px] font-semibold ${index === 0 ? 'bg-chart-3/10 text-chart-3' : 'bg-secondary/10 text-secondary'}`}>{index === 0 ? 'En curso' : 'Activo'}</span>
                </article>
              ))}
            </div>
            <button type="button" onClick={(): void => onAction(`Plan de acompañamiento de ${student.name} preparado para actualizar.`)} className="mt-3 inline-flex items-center gap-1 text-[8px] font-semibold text-primary hover:underline">
              <Plus aria-hidden="true" className="size-3" />
              Agregar acuerdo
            </button>
          </div>
        )}
      </div>
      <section id="new-intervention" aria-labelledby="new-intervention-heading" className="mx-3 mb-3 rounded-md bg-muted/40 p-4 sm:mx-5 sm:mb-5 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 id="new-intervention-heading" className="font-heading text-xs font-bold text-foreground">
              Registrar intervención o nota de seguimiento
            </h3>
            <p className="mt-1 text-[8px] text-muted-foreground">Se asociará a la ficha de {student.name}.</p>
          </div>
          <span className="text-[7px] text-muted-foreground">Guardado de demostración · expediente MINEDU</span>
        </div>
        <div className="mt-3 grid min-w-0 gap-3 sm:grid-cols-3">
          <label className="min-w-0 text-[8px] font-semibold text-muted-foreground">
            Tipología
            <select value={type} onChange={(event): void => setType(event.target.value)} className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-2 text-[9px] text-foreground">
              <option>Soporte socioemocional y motivacional</option>
              <option>Interferencia laboral y flexibilidad</option>
              <option>Nivelación académica / rezago</option>
              <option>Salud personal / familiar</option>
              <option>Conectividad y brecha digital</option>
            </select>
          </label>
          <label className="min-w-0 text-[8px] font-semibold text-muted-foreground">
            Medio / canal
            <select value={channel} onChange={(event): void => setChannel(event.target.value)} className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-2 text-[9px] text-foreground">
              <option>Llamada telefónica directa</option>
              <option>Google Meet / sesión síncrona</option>
              <option>WhatsApp institucional</option>
              <option>Visita presencial en sede</option>
              <option>Entrevista con familiar</option>
            </select>
          </label>
          <label className="min-w-0 text-[8px] font-semibold text-muted-foreground">
            Confidencialidad
            <select value={confidentiality} onChange={(event): void => setConfidentiality(event.target.value)} className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-2 text-[9px] text-foreground">
              <option>Estándar · equipo docente</option>
              <option>Restringido · tutoría y psicopedagogía</option>
              <option>Crítico · dirección y tutor general</option>
            </select>
          </label>
        </div>
        <label className="mt-3 block text-[8px] font-semibold text-muted-foreground">
          Detalle del acompañamiento y acuerdos
          <textarea
            value={note}
            onChange={(event): void => {
              setNote(event.target.value);
              setSaved(false);
            }}
            rows={3}
            placeholder="Describe el motivo, la respuesta del estudiante, los acuerdos y las fechas comprometidas…"
            className="mt-1.5 w-full resize-y rounded-md border border-border bg-background p-3 text-[9px] font-normal leading-4 text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
          />
        </label>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <label className="inline-flex items-center gap-2 text-[8px] text-muted-foreground">
              <input type="checkbox" checked={notifyWellbeing} onChange={(event): void => setNotifyWellbeing(event.target.checked)} className="size-3.5 accent-primary" />
              Notificar a psicología / bienestar
            </label>
            <label className="inline-flex items-center gap-2 text-[8px] text-muted-foreground">
              <input type="checkbox" checked={notifyStudent} onChange={(event): void => setNotifyStudent(event.target.checked)} className="size-3.5 accent-primary" />
              Enviar recordatorio al estudiante
            </label>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(): void => {
                setNote('');
                setSaved(false);
              }}
              className="h-8 rounded-md border border-border bg-background px-3 text-[8px] font-semibold text-muted-foreground hover:bg-muted"
            >
              Limpiar
            </button>
            <button type="button" onClick={saveIntervention} disabled={!note.trim()} className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-[8px] font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">
              <Save aria-hidden="true" className="size-3" />
              {saved ? 'Intervención guardada' : 'Guardar y notificar'}
            </button>
          </div>
        </div>
        {saved && (
          <p role="status" className="mt-2 flex items-center gap-1.5 text-[8px] font-semibold text-secondary">
            <CheckCircle2 aria-hidden="true" className="size-3" />
            Nota guardada en esta sesión. Notificación {notifyWellbeing || notifyStudent ? 'preparada' : 'desactivada'}.
          </p>
        )}
      </section>
    </section>
  );
};

export { WellbeingStudentProfile };
