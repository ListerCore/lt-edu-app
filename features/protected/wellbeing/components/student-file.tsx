'use client';

import { useState, type JSX } from 'react';
import { ArrowLeft, Check, MessageSquarePlus, Plus, ShieldAlert, Stethoscope, X } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { ConfirmDelete, LoadError, PageSkeleton } from '@/features/protected/academic/components/academic-ui';
import { formatDay } from '@/features/protected/academic/data/academic-data';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { isWellbeingEvent } from '@/hooks/use-live';
import { cn } from '@/lib/utils';
import {
  checkCommitmentAction,
  deleteCommitmentAction,
  deleteIncidentAction,
  deleteInterviewAction,
  getStudentFileAction,
  notifyMeasureAction,
  requestReconsiderationAction,
  resolveReconsiderationAction,
  setIncidentStatusAction,
} from '../actions/wellbeing-actions';
import {
  CONDUCT_PASS,
  caseStatusClass,
  caseStatusLabels,
  commitmentStatusClass,
  commitmentStatusLabels,
  groundLabels,
  interviewKindLabels,
  measureKindLabels,
  originLabels,
  outcomeLabels,
  partyLabels,
  planStatusLabels,
  severityClass,
  severityLabels,
  therapyKindLabels,
} from '../data/wellbeing-data';
import type { Incident, IncidentCategory, Measure, StudentFile } from '../types';
import { CommitmentDialog, IncidentDialog, InterviewDialog, MeasureDialog, ReferDialog } from './wellbeing-dialogs';
import { Block, PromptDialog, useAct } from './wellbeing-ui';

type Tab = 'tutoring' | 'discipline' | 'psychology' | 'special';

// A student's wellbeing file: tutoring, discipline and conduct, psychology referrals and, in special education, the
// POI and therapies. What each person sees and may do comes from the API (can* flags)
export const StudentFileView = ({ slug, studentId, onBack, initialTab }: { slug: string; studentId: string; onBack?: () => void; initialTab?: Tab }): JSX.Element => {
  const { data, error, reload } = useAcademicData(`wb-file:${slug}:${studentId}`, () => getStudentFileAction(slug, studentId), isWellbeingEvent);
  const [tab, setTab] = useState<Tab>(initialTab ?? 'tutoring');
  if (error) return <LoadError message={error} onRetry={reload} />;
  if (!data?.student) return <PageSkeleton />;
  const st = data.student;
  const special = data.plans.length > 0 || data.therapies.length > 0 || data.canPlan;
  const tabs: Array<[Tab, string, number]> = [
    ['tutoring', 'Tutoría', data.commitments.filter((c) => c.status === 'pending').length],
    ['discipline', 'Convivencia', data.incidents.filter((x) => x.status === 'open').length],
    ...(data.family ? [] : ([['psychology', 'Psicología', data.cases.filter((c) => c.status !== 'closed').length]] as Array<[Tab, string, number]>)),
    ...(special ? ([['special', 'Atención especializada', 0]] as Array<[Tab, string, number]>) : []),
  ];
  return (
    <div className="space-y-5">
      {onBack && (
        <button type="button" className="btn-alt" onClick={onBack}>
          <MorphIcon icon={ArrowLeft} size={16} />
          Volver
        </button>
      )}
      <header className="rounded-2xl border border-border bg-background px-5 py-4">
        <h2 className="text-xl font-semibold text-foreground">{st.name}</h2>
        <p className="text-sm text-muted-foreground">
          {st.code} · {st.placement}
          {st.specialNeeds && ' · Necesidades educativas especiales'}
        </p>
      </header>
      <div role="tablist" aria-label="Expediente" className="flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map(([k, label, n]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={(): void => setTab(k)} className={cn('-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap', tab === k ? 'border-brand text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground')}>
            {label}
            {n > 0 && <span className="rounded-full bg-brand/12 px-1.5 text-xs text-brand tabular-nums">{n}</span>}
          </button>
        ))}
      </div>
      {tab === 'tutoring' && <TutoringTab slug={slug} f={data} onChanged={reload} />}
      {tab === 'discipline' && <DisciplineTab slug={slug} f={data} onChanged={reload} />}
      {tab === 'psychology' && <PsychologyTab slug={slug} f={data} onChanged={reload} />}
      {tab === 'special' && <SpecialTab f={data} />}
    </div>
  );
};

interface TabProps {
  slug: string;
  f: StudentFile;
  onChanged: () => void;
}

// Interviews and commitments; families read the agreements and their commitments
const TutoringTab = ({ slug, f, onChanged }: TabProps): JSX.Element => {
  const [isPending, act] = useAct();
  const [dialog, setDialog] = useState<'interview' | 'commitment' | null>(null);
  const studentId = f.student?.id ?? '';
  return (
    <div className="space-y-6">
      <Block
        title="Compromisos"
        empty="Sin compromisos registrados."
        action={
          f.canTutor && (
            <button type="button" className="btn-alt h-8 px-3 text-xs" onClick={(): void => setDialog('commitment')}>
              <MorphIcon icon={Plus} size={14} />
              Compromiso
            </button>
          )
        }
      >
        {f.commitments.length > 0 && (
          <ul className="divide-y divide-border rounded-xl border border-border bg-background">
            {f.commitments.map((c) => {
              const late = c.status === 'pending' && c.dueOn < f.today;
              return (
                <li key={c.id} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
                  <span className="min-w-0 flex-1">
                    <span className="block text-foreground">{c.description}</span>
                    <span className={cn('block text-xs', late ? 'text-destructive' : 'text-muted-foreground')}>
                      {partyLabels[c.party]} · revisar el {formatDay(c.dueOn)}
                      {late && ' · vencido'}
                    </span>
                  </span>
                  <span className={cn('pill', commitmentStatusClass[c.status])}>{commitmentStatusLabels[c.status]}</span>
                  {f.canTutor && (
                    <span className="flex gap-1">
                      {c.status === 'pending' ? (
                        <>
                          <button type="button" aria-label="Cumplido" title="Cumplido" disabled={isPending} className="inline-flex size-8 items-center justify-center rounded-md text-success hover:bg-success/10" onClick={(): void => act(() => checkCommitmentAction(slug, c.id, 'met'), onChanged)}>
                            <MorphIcon icon={Check} size={16} />
                          </button>
                          <button type="button" aria-label="No cumplido" title="No cumplido" disabled={isPending} className="inline-flex size-8 items-center justify-center rounded-md text-destructive hover:bg-destructive/10" onClick={(): void => act(() => checkCommitmentAction(slug, c.id, 'unmet'), onChanged)}>
                            <MorphIcon icon={X} size={16} />
                          </button>
                        </>
                      ) : (
                        <button type="button" className="text-xs text-muted-foreground hover:text-foreground" disabled={isPending} onClick={(): void => act(() => checkCommitmentAction(slug, c.id, 'pending'), onChanged)}>
                          Deshacer
                        </button>
                      )}
                      <ConfirmDelete compact title="Eliminar el compromiso" description="No se puede deshacer." isPending={isPending} onConfirm={(): void => act(() => deleteCommitmentAction(slug, c.id), onChanged)} />
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Block>
      <Block
        title={f.family ? 'Reuniones con la familia' : 'Entrevistas'}
        empty="Aún no hay entrevistas."
        action={
          f.canTutor && (
            <button type="button" className="btn-alt h-8 px-3 text-xs" onClick={(): void => setDialog('interview')}>
              <MorphIcon icon={MessageSquarePlus} size={14} />
              Entrevista
            </button>
          )
        }
      >
        {f.interviews.length > 0 && (
          <ul className="space-y-3">
            {f.interviews.map((x) => (
              <li key={x.id} className="rounded-xl border border-border bg-background px-4 py-3 text-sm">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-medium text-foreground">{x.topic}</span>
                  <span className="text-xs text-muted-foreground">
                    {interviewKindLabels[x.kind]} · {formatDay(x.heldOn)} · {x.authorName}
                  </span>
                </div>
                {x.notes && <p className="mt-1.5 whitespace-pre-line text-muted-foreground">{x.notes}</p>}
                {x.agreements && (
                  <p className="mt-1.5 whitespace-pre-line text-foreground">
                    <span className="font-medium">Acuerdos: </span>
                    {x.agreements}
                  </p>
                )}
                {f.canTutor && (
                  <div className="mt-2 flex justify-end">
                    <ConfirmDelete compact title="Eliminar la entrevista" description="Solo quien la registró o la dirección pueden eliminarla." isPending={isPending} onConfirm={(): void => act(() => deleteInterviewAction(slug, x.id), onChanged)} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Block>
      {dialog === 'interview' && <InterviewDialog slug={slug} studentId={studentId} onClose={(): void => setDialog(null)} onSaved={(): void => { setDialog(null); onChanged(); }} />}
      {dialog === 'commitment' && <CommitmentDialog slug={slug} studentId={studentId} interviewId={f.interviews[0]?.id ?? ''} onClose={(): void => setDialog(null)} onSaved={(): void => { setDialog(null); onChanged(); }} />}
    </div>
  );
};

// Conduct grades, faults with their measures and the measures of the year without a fault (conditional, expulsion)
const DisciplineTab = ({ slug, f, onChanged }: TabProps): JSX.Element => {
  const [isPending, act] = useAct();
  const [dialog, setDialog] = useState<{ kind: 'incident' } | { kind: 'measure'; incident?: Incident } | null>(null);
  const loose = f.measures.filter((m) => !m.incidentId);
  const close = (): void => setDialog(null);
  const saved = (): void => {
    setDialog(null);
    onChanged();
  };
  const canMeasure = (x: Incident): boolean => f.canDecide || (x.severity === 'minor' && (x.mine || f.canTutor));
  return (
    <div className="space-y-6">
      <Block title="Nota de conducta" empty="Aún no tiene nota de conducta en el periodo.">
        {f.conduct.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {f.conduct.map((c) => (
              <div key={c.termName} title={c.note} className={cn('rounded-xl border px-4 py-2', c.score < CONDUCT_PASS ? 'border-destructive/40 bg-destructive/5' : 'border-border bg-background')}>
                <span className="block text-xs text-muted-foreground">{c.termName}</span>
                <span className={cn('text-lg font-semibold tabular-nums', c.score < CONDUCT_PASS ? 'text-destructive' : 'text-foreground')}>{c.score}</span>
              </div>
            ))}
          </div>
        )}
      </Block>
      {loose.length > 0 && (
        <Block title="Medidas del año">
          <ul className="space-y-2">
            {loose.map((m) => (
              <li key={m.id} className="rounded-xl border border-border bg-background px-4 py-3">
                <MeasureLine slug={slug} m={m} canDecide={f.canDecide} family={f.family} today={f.today} onChanged={onChanged} />
              </li>
            ))}
          </ul>
        </Block>
      )}
      <Block
        title="Faltas"
        empty="Sin faltas registradas."
        action={
          <span className="flex gap-2">
            {f.canDecide && (
              <button type="button" className="btn-alt h-8 px-3 text-xs" onClick={(): void => setDialog({ kind: 'measure' })}>
                Matrícula condicional o expulsión
              </button>
            )}
            {f.canReport && (
              <button type="button" className="btn-alt h-8 px-3 text-xs" onClick={(): void => setDialog({ kind: 'incident' })}>
                <MorphIcon icon={ShieldAlert} size={14} />
                Registrar falta
              </button>
            )}
          </span>
        }
      >
        {f.incidents.length > 0 && (
          <ul className="space-y-3">
            {f.incidents.map((x) => (
              <IncidentCard key={x.id} slug={slug} x={x} catalog={f.catalog} canDecide={f.canDecide} family={f.family} today={f.today} onChanged={onChanged} isPending={isPending}>
                {!f.family && (
                  <div className="flex flex-wrap justify-end gap-2">
                    {canMeasure(x) && (
                      <button type="button" className="btn-alt h-8 px-3 text-xs" onClick={(): void => setDialog({ kind: 'measure', incident: x })}>
                        Aplicar medida
                      </button>
                    )}
                    {(f.canDecide || (x.severity === 'minor' && (x.mine || f.canTutor))) && (
                      <button type="button" className="btn-alt h-8 px-3 text-xs" disabled={isPending} onClick={(): void => act(() => setIncidentStatusAction(slug, x.id, x.status === 'open' ? 'closed' : 'open'), onChanged)}>
                        {x.status === 'open' ? 'Cerrar' : 'Reabrir'}
                      </button>
                    )}
                    {(x.mine || f.canDecide) && <ConfirmDelete compact title="Eliminar la falta" description="Solo si se registró por error." isPending={isPending} onConfirm={(): void => act(() => deleteIncidentAction(slug, x.id), onChanged)} />}
                  </div>
                )}
              </IncidentCard>
            ))}
          </ul>
        )}
      </Block>
      {dialog?.kind === 'incident' && <IncidentDialog slug={slug} student={f.student ?? null} catalog={f.catalog} onClose={close} onSaved={saved} />}
      {dialog?.kind === 'measure' && <MeasureDialog slug={slug} studentId={f.student?.id ?? ''} incident={dialog.incident} canDecide={f.canDecide} onClose={close} onSaved={saved} />}
    </div>
  );
};

// One fault with its measures
export const IncidentCard = ({
  slug,
  x,
  catalog,
  canDecide,
  family,
  today,
  onChanged,
  children,
  showStudent,
  onStudent,
}: {
  slug: string;
  x: Incident;
  catalog: IncidentCategory[];
  canDecide: boolean;
  family: boolean;
  today: string;
  onChanged: () => void;
  isPending?: boolean;
  children?: JSX.Element | false;
  showStudent?: boolean;
  onStudent?: (id: string) => void;
}): JSX.Element => {
  const cat = catalog.find((c) => c.code === x.category);
  return (
    <li className="rounded-xl border border-border bg-background px-4 py-3 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className={cn('pill', severityClass[x.severity])}>{severityLabels[x.severity]}</span>
        <span className="font-medium text-foreground">{cat?.label ?? x.category}</span>
        <span className="ml-auto text-xs text-muted-foreground">
          {formatDay(x.occurredOn)} · {x.status === 'open' ? 'Abierta' : 'Cerrada'}
        </span>
      </div>
      {showStudent && (
        <button type="button" className="mt-1 text-left text-sm font-medium text-brand hover:underline" onClick={(): void => onStudent?.(x.studentId)}>
          {x.studentName} <span className="font-normal text-muted-foreground">· {x.placement}</span>
        </button>
      )}
      <p className="mt-1.5 whitespace-pre-line text-muted-foreground">{x.description}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Registró {x.reportedName || '—'}
        {x.familyNotifiedOn ? ` · comunicada a la familia el ${formatDay(x.familyNotifiedOn)}` : ' · aún no comunicada a la familia'}
        {cat?.violence && ' · SíseVe'}
      </p>
      {x.measures.length > 0 && (
        <ul className="mt-3 space-y-2 border-l-2 border-border pl-3">
          {x.measures.map((m) => (
            <li key={m.id}>
              <MeasureLine slug={slug} m={m} canDecide={canDecide} family={family} today={today} onChanged={onChanged} />
            </li>
          ))}
        </ul>
      )}
      {children && <div className="mt-3">{children}</div>}
    </li>
  );
};

// One measure with its notification and reconsideration (request for families, resolution for dirección)
export const MeasureLine = ({ slug, m, canDecide, family, today, onChanged }: { slug: string; m: Measure; canDecide: boolean; family: boolean; today: string; onChanged: () => void }): JSX.Element => {
  const [isPending, act] = useAct();
  const [dialog, setDialog] = useState<'notify' | 'request' | 'resolve' | null>(null);
  const done = (): void => {
    setDialog(null);
    onChanged();
  };
  const reconsiderable = m.kind !== 'corrective' && m.notifiedOn && !m.reconsiderationOn && m.reconsiderUntil >= today;
  return (
    <div className="space-y-1 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className={cn('font-medium', m.outcome === 'revoked' ? 'text-muted-foreground line-through' : 'text-foreground')}>
          {measureKindLabels[m.kind]}
          {m.kind === 'suspension' && ` de ${m.days} ${m.days === 1 ? 'día' : 'días'}`}
        </span>
        <span className="text-xs text-muted-foreground">
          desde el {formatDay(m.startsOn)} · {m.decidedName}
        </span>
        {m.ground && <span className="text-xs text-muted-foreground">· {groundLabels[m.ground]}</span>}
      </div>
      <p className="whitespace-pre-line text-muted-foreground">{m.detail}</p>
      {m.kind !== 'corrective' && (
        <p className="text-xs text-muted-foreground">
          {m.notifiedOn ? `Comunicada el ${formatDay(m.notifiedOn)}` : 'Aún no comunicada formalmente a la familia'}
          {reconsiderable && ` · reconsideración hasta el ${formatDay(m.reconsiderUntil)}`}
        </p>
      )}
      {m.reconsiderationOn && (
        <div className={cn('rounded-lg px-3 py-2 text-xs', m.resolvedOn ? 'bg-surface text-muted-foreground' : 'bg-warning/12 text-foreground')}>
          <p>
            <span className="font-medium">Reconsideración</span> pedida el {formatDay(m.reconsiderationOn)} por {m.reconsiderationBy}: {m.reconsiderationReason}
          </p>
          {m.resolvedOn ? (
            <p className="mt-1">
              <span className="font-medium">{outcomeLabels[m.outcome]}</span> el {formatDay(m.resolvedOn)}: {m.resolution}
            </p>
          ) : (
            <p className="mt-1">La dirección resuelve hasta el {formatDay(m.resolveUntil)}.</p>
          )}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {canDecide && m.kind !== 'corrective' && !m.notifiedOn && (
          <button type="button" className="text-xs font-medium text-brand" onClick={(): void => setDialog('notify')}>
            Registrar comunicación
          </button>
        )}
        {(family || canDecide) && reconsiderable && (
          <button type="button" className="text-xs font-medium text-brand" onClick={(): void => setDialog('request')}>
            Pedir reconsideración
          </button>
        )}
        {canDecide && m.reconsiderationOn && !m.resolvedOn && (
          <button type="button" className="text-xs font-medium text-brand" onClick={(): void => setDialog('resolve')}>
            Resolver reconsideración
          </button>
        )}
      </div>
      {dialog === 'notify' && (
        <PromptDialog title="Comunicación a la familia" label="Fecha de la comunicación formal" kind="date" initial={today} submitLabel="Registrar" isPending={isPending} onClose={(): void => setDialog(null)} onSubmit={(v): void => act(() => notifyMeasureAction(slug, m.id, v), done)} />
      )}
      {dialog === 'request' && (
        <PromptDialog
          title="Pedir reconsideración"
          description="La dirección (y, cuando corresponda, el Comité de Gestión del Bienestar) resuelve en un máximo de cinco días hábiles."
          label="Por qué se pide"
          submitLabel="Enviar pedido"
          isPending={isPending}
          onClose={(): void => setDialog(null)}
          onSubmit={(v): void => act(() => requestReconsiderationAction(slug, m.id, v), done)}
        />
      )}
      {dialog === 'resolve' && (
        <PromptDialog
          title="Resolver la reconsideración"
          label="Fundamento"
          submitLabel="Resolver"
          options={[
            ['upheld', 'Confirmar la medida'],
            ['revoked', 'Dejarla sin efecto'],
          ]}
          isPending={isPending}
          onClose={(): void => setDialog(null)}
          onSubmit={(v, outcome): void => act(() => resolveReconsiderationAction(slug, m.id, outcome, v), done)}
        />
      )}
    </div>
  );
};

// Psychology: whoever referred sees status and the shared note; psychologists see their cases (detail in Psicología)
const PsychologyTab = ({ slug, f, onChanged }: TabProps): JSX.Element => {
  const [refer, setRefer] = useState(false);
  const active = f.cases.some((c) => c.status !== 'closed');
  return (
    <div className="space-y-4">
      <Block
        title="Psicología"
        empty="No hay derivaciones tuyas para este estudiante. Lo que se trabaja en psicología es confidencial."
        action={
          f.canRefer &&
          !active && (
            <button type="button" className="btn-alt h-8 px-3 text-xs" onClick={(): void => setRefer(true)}>
              <MorphIcon icon={Stethoscope} size={14} />
              Derivar a psicología
            </button>
          )
        }
      >
        {f.cases.length > 0 && (
          <ul className="space-y-2">
            {f.cases.map((c) => (
              <li key={c.id} className="rounded-xl border border-border bg-background px-4 py-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn('pill', caseStatusClass[c.status])}>{caseStatusLabels[c.status]}</span>
                  {c.priority === 'urgent' && <span className="pill bg-destructive/10 text-destructive">Urgente</span>}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {originLabels[c.origin]} · {formatDay(c.openedOn)}
                    {c.psychologistName && ` · ${c.psychologistName}`}
                  </span>
                </div>
                <p className="mt-1.5 text-muted-foreground">{c.reason}</p>
                {c.sharedNote && (
                  <p className="mt-1.5 rounded-lg bg-brand-soft px-3 py-2 text-foreground">
                    <span className="font-medium">Recomendación de psicología: </span>
                    {c.sharedNote}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </Block>
      {refer && (
        <ReferDialog
          slug={slug}
          student={f.student ?? null}
          onClose={(): void => setRefer(false)}
          onSaved={(): void => {
            setRefer(false);
            onChanged();
          }}
        />
      )}
    </div>
  );
};

// Special education: the POI of each period and the latest therapy sessions
const SpecialTab = ({ f }: { f: StudentFile }): JSX.Element => (
  <div className="space-y-6">
    <Block title="Plan de orientación individual" empty="Aún no tiene plan en el periodo.">
      {f.plans.length > 0 && (
        <ul className="space-y-3">
          {f.plans.map((p) => (
            <li key={p.id} className="rounded-xl border border-border bg-background px-4 py-3 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-foreground">{p.periodName}</span>
                <span className={cn('pill', p.status === 'approved' ? 'bg-success/12 text-success' : 'bg-secondary text-muted-foreground')}>{planStatusLabels[p.status]}</span>
                <span className="ml-auto text-xs text-muted-foreground">{p.specialistName || 'Sin especialista asignado'}</span>
              </div>
              {p.needs && <p className="mt-1.5 text-muted-foreground">{p.needs}</p>}
              {p.accessAdaptations && (
                <p className="mt-1.5 text-foreground">
                  <span className="font-medium">Adaptaciones de acceso: </span>
                  {p.accessAdaptations}
                </p>
              )}
              {p.familyCommitments && (
                <p className="mt-1.5 text-foreground">
                  <span className="font-medium">Compromisos de la familia: </span>
                  {p.familyCommitments}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </Block>
    <Block title="Terapias recientes" empty="Sin sesiones de terapia registradas.">
      {f.therapies.length > 0 && (
        <ul className="divide-y divide-border rounded-xl border border-border bg-background">
          {f.therapies.slice(0, 12).map((t) => (
            <li key={t.id} className="px-4 py-2.5 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-foreground">{therapyKindLabels[t.kind]}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDay(t.heldOn)} · {t.minutes} min · {t.therapistName}
                </span>
                {!t.attended && <span className="pill bg-secondary text-muted-foreground">No asistió</span>}
              </div>
              <p className="text-muted-foreground">{t.goal}</p>
              {t.homeTasks && <p className="text-xs text-foreground">Para casa: {t.homeTasks}</p>}
            </li>
          ))}
        </ul>
      )}
    </Block>
  </div>
);
