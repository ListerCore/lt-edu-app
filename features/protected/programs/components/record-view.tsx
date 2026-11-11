'use client';

import { useState, useTransition, type JSX } from 'react';
import { Award, Check, Circle, FileText, GraduationCap } from 'lucide';
import { sileo } from 'sileo';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { formatDay } from '@/features/protected/academic/data/academic-data';
import { cn } from '@/lib/utils';
import { issueDegreeAction, issueModularAction, setRequirementAction } from '../actions/programs-actions';
import { hoursText, sourceLabels, standingClass, standingLabels } from '../data/programs-data';
import type { Requirement, StudentRecord } from '../types';

interface Props {
  slug: string;
  record: StudentRecord;
  onChanged: () => void;
  onCertificate: (id: string) => void;
}

const two = (v?: number): string => (v === undefined ? '' : String(v).padStart(2, '0'));

// Expediente: the student's study program by module (units, placement, certificate), the degree requirements and
// the degree. Secretaría issues from here
export const RecordView = ({ slug, record: r, onChanged, onCertificate }: Props): JSX.Element => {
  const [isPending, startTransition] = useTransition();
  const [checking, setChecking] = useState<Requirement | null>(null);
  const pct = r.total ? Math.round((r.approved * 100) / r.total) : 0;

  const run = (work: () => Promise<{ ok: true; data: { id: string; code: string } } | { ok: false; message: string }>): void =>
    startTransition(async () => {
      const res = await work();
      if (!res.ok) sileo.error({ title: 'No se pudo emitir', description: res.message });
      else {
        sileo.success({ title: `${res.data.code} emitido` });
        onChanged();
        onCertificate(res.data.id);
      }
    });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-2xl border border-border bg-background p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div>
          <p className="text-sm text-muted-foreground">
            {r.programName} · {r.student?.status === 'graduated' ? 'Egresado(a)' : `${r.student?.semester} semestre`}
          </p>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{r.student?.name}</h2>
          <p className="text-xs text-muted-foreground tabular-nums">
            {r.student?.code} · DNI {r.student?.document}
          </p>
        </div>
        <div className="min-w-56">
          <p className="text-sm text-foreground tabular-nums">
            <span className="text-2xl font-semibold">{r.approved}</span> de {r.total} créditos
          </p>
          <span className="mt-2 block h-2 overflow-hidden rounded-full bg-secondary" aria-hidden="true">
            <span className="block h-full rounded-full bg-success" style={{ width: `${pct}%` }} />
          </span>
        </div>
      </div>

      {r.modules.map((m, mi) => (
        <section key={m.id} aria-label={m.name} className="overflow-hidden rounded-2xl border border-border bg-background">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface px-5 py-3">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Módulo {mi + 1}</p>
              <h3 className="font-semibold text-foreground">{m.name}</h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground tabular-nums">
                {m.approved}/{m.credits} créditos
              </span>
              {m.certificate ? (
                <button type="button" className="pill bg-success/12 text-success hover:underline" onClick={(): void => onCertificate(m.certificate?.id ?? '')}>
                  <MorphIcon icon={Award} size={12} />
                  {m.certificate.code}
                </button>
              ) : m.complete ? (
                r.canIssue ? (
                  <button type="button" className="btn-brand h-8 px-3 text-xs" disabled={isPending} onClick={(): void => run(() => issueModularAction(slug, r.student?.id ?? '', m.id))}>
                    <MorphIcon icon={Award} size={14} />
                    Emitir certificado modular
                  </button>
                ) : (
                  <span className="pill bg-warning/14 text-warning">Listo para certificar</span>
                )
              ) : (
                <span className="pill bg-secondary text-muted-foreground">En curso</span>
              )}
            </div>
          </header>
          <table className="w-full text-left text-sm">
            <thead className="sr-only">
              <tr>
                <th scope="col">Semestre</th>
                <th scope="col">Unidad</th>
                <th scope="col">Créditos</th>
                <th scope="col">Nota</th>
                <th scope="col">Situación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {m.units.map((u) => (
                <tr key={u.subjectId} className={cn(u.kind === 'efsrt' && 'bg-brand/5')}>
                  <td className="w-12 px-5 py-2 text-xs text-muted-foreground tabular-nums">{u.semester}</td>
                  <td className="px-2 py-2">
                    <span className="block text-foreground">{u.name}</span>
                    {u.kind === 'efsrt' ? (
                      <span className="block text-xs text-muted-foreground">
                        {u.internships.length
                          ? u.internships.map((i) => `${i.company} · ${hoursText(i.loggedHours)} de ${i.requiredHours} h`).join(' / ')
                          : `${u.hours} horas en una empresa o institución`}
                      </span>
                    ) : (
                      u.standing && (
                        <span className="block text-xs text-muted-foreground">
                          {u.standing.periodName} · {sourceLabels[u.standing.source] ?? u.standing.source}
                        </span>
                      )
                    )}
                  </td>
                  <td className="w-16 px-2 py-2 text-right text-xs text-muted-foreground tabular-nums">{u.credits} cr</td>
                  <td className={cn('w-12 px-2 py-2 text-right font-semibold tabular-nums', u.standing?.grade !== undefined && u.standing.grade < r.passingGrade ? 'text-destructive' : 'text-foreground')}>{two(u.standing?.grade)}</td>
                  <td className="w-32 px-5 py-2 text-right">{u.standing ? <span className={cn('pill', standingClass[u.standing.status])}>{standingLabels[u.standing.status]}</span> : <span className="text-xs text-muted-foreground">Pendiente</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}

      <section aria-labelledby="degree-title" className="rounded-2xl border border-border bg-background p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 id="degree-title" className="flex items-center gap-2 font-semibold text-foreground">
              <MorphIcon icon={GraduationCap} size={18} className="text-brand" />
              Titulación
            </h3>
            <p className="text-sm text-muted-foreground">Título de Profesional Técnico en {r.programName}.</p>
          </div>
          {r.degree ? (
            <button type="button" className="pill bg-success/12 text-success hover:underline" onClick={(): void => onCertificate(r.degree?.id ?? '')}>
              <MorphIcon icon={FileText} size={12} />
              Título {r.degree.code} · {formatDay(r.degree.issuedOn)}
            </button>
          ) : (
            r.canIssue && (
              <button type="button" className="btn-brand" disabled={isPending || !r.eligible} title={r.eligible ? undefined : 'Faltan requisitos'} onClick={(): void => run(() => issueDegreeAction(slug, r.student?.id ?? ''))}>
                <MorphIcon icon={GraduationCap} size={16} />
                Emitir título
              </button>
            )
          )}
        </div>
        <ul className="mt-4 space-y-2">
          {r.requirements.map((q) => (
            <li key={q.code} className="flex flex-wrap items-center gap-3 text-sm">
              <MorphIcon icon={q.done ? Check : Circle} size={16} className={q.done ? 'text-success' : 'text-muted-foreground'} />
              <span className={cn('min-w-0 flex-1', q.done ? 'text-foreground' : 'text-muted-foreground')}>
                {q.name}
                {q.note && <span className="block text-xs text-muted-foreground">{q.note}</span>}
                {!q.auto && q.checkedName && <span className="block text-xs text-muted-foreground">Verificó {q.checkedName}{q.checkedAt && `, ${formatDay(q.checkedAt.slice(0, 10))}`}</span>}
              </span>
              {q.auto ? (
                <span className="text-xs text-muted-foreground">Según el expediente</span>
              ) : (
                r.canIssue &&
                !r.degree && (
                  <button type="button" className="btn-alt h-8 px-3 text-xs" onClick={(): void => setChecking(q)}>
                    {q.done ? 'Cambiar' : 'Verificar'}
                  </button>
                )
              )}
            </li>
          ))}
        </ul>
      </section>
      {checking && (
        <RequirementDialog
          requirement={checking}
          isPending={isPending}
          onClose={(): void => setChecking(null)}
          onSave={(done, note): void =>
            startTransition(async () => {
              const res = await setRequirementAction(slug, r.student?.id ?? '', checking.code, done, note);
              if (!res.ok) sileo.error({ title: 'No se pudo guardar', description: res.message });
              else {
                setChecking(null);
                onChanged();
              }
            })
          }
        />
      )}
    </div>
  );
};

const RequirementDialog = ({ requirement, isPending, onClose, onSave }: { requirement: Requirement; isPending: boolean; onClose: () => void; onSave: (done: boolean, note: string) => void }): JSX.Element => {
  const [done, setDone] = useState(!requirement.done);
  const [note, setNote] = useState(requirement.note);
  return (
    <FormDialog title={requirement.name} submitLabel="Guardar" isPending={isPending} onSubmit={(): void => onSave(done, note.trim())} onClose={onClose}>
      <label className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 text-sm">
        <input type="checkbox" checked={done} onChange={(e): void => setDone(e.target.checked)} className="size-4 accent-brand" />
        Cumple el requisito
      </label>
      <FormField id="req-note" label="Sustento" hint="Por ejemplo: constancia del centro de idiomas, acta de sustentación o recibo.">
        <Input placeholder="Ej.: Constancia entregada en secretaría" id="req-note" value={note} maxLength={300} onChange={(e): void => setNote(e.target.value)} />
      </FormField>
    </FormDialog>
  );
};
