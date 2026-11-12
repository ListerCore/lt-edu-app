'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition, type JSX } from 'react';
import { ArrowLeft, KeyRound, LogOut, MoveRight, Pencil, Phone, Plus, RotateCcw, Star, UserPlus } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AcademicPage, ConfirmDelete, LoadError, PageSkeleton, StatusPill } from '@/features/protected/academic/components/academic-ui';
import { formatDay, lower } from '@/features/protected/academic/data/academic-data';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useToday } from '@/features/protected/academic/hooks/use-today';
import { isPeopleEvent } from '@/hooks/use-live';
import { cn } from '@/lib/utils';
import { deleteEnrollmentAction, deleteStudentAction, endEnrollmentAction, getStudentAction, grantAccessAction, removeGuardianAction } from '../actions/people-actions';
import { accessClass, accessLabels, ageOn, enrollmentKindLabels, enrollmentStatusClass, enrollmentStatusLabels, fullName, placementKindLabels, relationshipLabels, STUDENTS_PATH, studentStatusClass, studentStatusLabels } from '../data/people-data';
import { usePeopleContext } from '../hooks/use-people-context';
import type { Enrollment, Guardian, PeopleContextData, StudentDetail } from '../types';
import { EndDialog, EnrollDialog, MoveDialog } from './enrollment-dialogs';
import { GuardianDialog } from './guardian-dialog';
import { StudentForm } from './student-form';
import { StudentAttendanceTab } from '@/features/protected/attendance/components/student-attendance-tab';
import { AttachmentsButton } from '@/features/protected/attachments/components/attachments-button';
import { AttachmentsPanel } from '@/features/protected/attachments/components/attachments-panel';

type Tab = 'data' | 'family' | 'enrollment' | 'placements' | 'attendance' | 'documents';
type Editing = { kind: 'guardian'; guardian: Guardian | null } | { kind: 'enroll' } | { kind: 'move'; enrollment: Enrollment } | { kind: 'end'; enrollment: Enrollment } | null;

// One student: personal data, family (guardians and panel access), enrollment history, EBA placements, attendance
// and the documents of the student's file
export const StudentDetailPage = ({ id, initialTab }: { id: string; initialTab?: string }): JSX.Element => {
  const router = useRouter();
  const { data: ctx, slug } = usePeopleContext();
  const { data, error, isLoading, reload } = useAcademicData(`student:${slug}:${id}`, () => getStudentAction(slug, id), isPeopleEvent);
  const [tab, setTab] = useState<Tab>((['data', 'family', 'enrollment', 'placements', 'attendance', 'documents'] as Tab[]).includes(initialTab as Tab) ? (initialTab as Tab) : 'data');
  const [editing, setEditing] = useState<Editing>(null);
  const [isPending, startTransition] = useTransition();
  const today = useToday();
  const student = data?.student;
  const canManage = Boolean(data?.canManage);
  const act = (action: () => Promise<unknown>): void =>
    startTransition(async (): Promise<void> => {
      await action();
      reload();
    });

  const tabs: Array<[Tab, string]> = [
    ['data', 'Datos'],
    ['family', `Familia${data ? ` (${data.guardians.length})` : ''}`],
    ['enrollment', 'Matrícula'],
    ...(ctx?.context.usesAttentionModes ? ([['placements', 'Ubicación y convalidación']] as Array<[Tab, string]>) : []),
    ['attendance', 'Asistencia'],
    ['documents', 'Documentos'],
  ];
  const age = student ? ageOn(student.birthDate, today) : null;

  return (
    <AcademicPage
      titleId="student-title"
      title={student ? fullName(student) : isLoading ? 'Cargando…' : 'Estudiante'}
      description={student ? `${student.code} · ${student.documentType.toUpperCase()} ${student.documentNumber}${age !== null ? ` · ${age} años` : ''}` : ''}
      context={ctx ? { ...ctx.context, canManage } : null}
      back={
        <Link href={STUDENTS_PATH} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
          <MorphIcon icon={ArrowLeft} size={15} />
          Estudiantes
        </Link>
      }
      actions={
        student && (
          <ConfirmDelete
            title={`¿Eliminar a ${student.givenNames}?`}
            description="Se elimina la ficha y los apoderados que no tengan otros estudiantes. Solo es posible si nunca fue matriculado; si no, cambia su estado."
            disabled={data.enrollments.length > 0}
            disabledReason="Tiene matrículas: cambia su estado a retirado o inactivo."
            onConfirm={(): void =>
              startTransition(async (): Promise<void> => {
                const r = await runAcademicAction(deleteStudentAction(slug, id));
                if (r.ok) router.push(STUDENTS_PATH);
              })
            }
            isPending={isPending}
          />
        )
      }
    >
      {isLoading ? (
        <PageSkeleton />
      ) : error || !data || !student || !ctx ? (
        <LoadError message={error ?? 'Sin datos.'} onRetry={reload} />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill className={studentStatusClass[student.status]}>{studentStatusLabels[student.status]}</StatusPill>
            <StatusPill className={accessClass[student.access]}>Panel: {lower(accessLabels[student.access])}</StatusPill>
            {student.specialNeeds && <StatusPill className="bg-brand-soft text-brand">NEE</StatusPill>}
            {data.enrollments[0] && (
              <span className="text-sm text-muted-foreground">
                {data.enrollments[0].periodName}: {data.enrollments[0].gradeName && `${data.enrollments[0].gradeName} `}
                {data.enrollments[0].sectionName && `«${data.enrollments[0].sectionName}» `}
                {data.enrollments[0].levelName}
              </span>
            )}
          </div>

          <div role="tablist" aria-label="Secciones de la ficha" className="flex gap-1 overflow-x-auto border-b border-border">
            {tabs.map(([key, label]) => (
              <button key={key} type="button" role="tab" aria-selected={tab === key} onClick={(): void => setTab(key)} className={cn('-mb-px border-b-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors', tab === key ? 'border-brand text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground')}>
                {label}
              </button>
            ))}
          </div>

          {tab === 'data' && <StudentForm key={student.id + student.status + student.email} slug={slug} student={student} readOnly={!canManage} onSaved={reload} />}

          {tab === 'family' && (
            <FamilyTab
              data={data}
              canManage={canManage}
              isPending={isPending}
              onAdd={(): void => setEditing({ kind: 'guardian', guardian: null })}
              onEdit={(g): void => setEditing({ kind: 'guardian', guardian: g })}
              onRemove={(g): void => act(() => runAcademicAction(removeGuardianAction(slug, id, g.id)))}
              onAccess={(guardianId): void => act(() => runAcademicAction(grantAccessAction(slug, id, guardianId)))}
            />
          )}

          {tab === 'enrollment' && (
            <EnrollmentTab
              data={data}
              ctx={ctx}
              canManage={canManage}
              isPending={isPending}
              onEnroll={(): void => setEditing({ kind: 'enroll' })}
              onMove={(e): void => setEditing({ kind: 'move', enrollment: e })}
              onEnd={(e): void => setEditing({ kind: 'end', enrollment: e })}
              onReactivate={(e): void => act(() => runAcademicAction(endEnrollmentAction(slug, e.id, { status: 'active', endedOn: '', destination: '' })))}
              onDelete={(e): void => act(() => runAcademicAction(deleteEnrollmentAction(slug, e.id)))}
            />
          )}

          {tab === 'attendance' && <StudentAttendanceTab slug={slug} studentId={student.id} />}

          {tab === 'documents' && (
            <AttachmentsPanel
              ownerKind="student"
              ownerId={student.id}
              title="Documentos del estudiante"
              description="Lo que acompaña a la ficha en todos los periodos: DNI, partida de nacimiento, certificados de estudios, informes médicos, certificado de discapacidad y carné de vacunación. Lo de cada matrícula va en su expediente, en la pestaña Matrícula."
              categories={['dni', 'birth_certificate', 'study_certificate', 'medical_report', 'disability_certificate', 'vaccination_card', 'photo', 'other']}
            />
          )}

          {tab === 'placements' && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Pruebas de ubicación y convalidaciones de este estudiante. Se registran desde Matrícula › Ubicación y convalidación.</p>
              {data.placements.length === 0 ? (
                <p className="rounded-xl border border-dashed border-border px-6 py-8 text-center text-sm text-muted-foreground">Sin registros.</p>
              ) : (
                <ul className="divide-y divide-border rounded-2xl border border-border bg-background">
                  {data.placements.map((p) => (
                    <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm">
                      <span className="font-medium text-foreground">{placementKindLabels[p.kind]}</span>
                      <span className="text-foreground">
                        {p.levelName} · {p.gradeName}
                      </span>
                      <span className="text-muted-foreground">
                        {formatDay(p.decidedOn)}
                        {p.reference && ` · ${p.reference}`}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {data && editing?.kind === 'guardian' && <GuardianDialog slug={slug} studentId={id} guardian={editing.guardian} isFirst={data.guardians.length === 0} onClose={(): void => setEditing(null)} onSaved={reload} />}
      {ctx && data && editing?.kind === 'enroll' && <EnrollDialog slug={slug} ctx={ctx} student={data.student} onClose={(): void => setEditing(null)} onSaved={reload} />}
      {ctx && editing?.kind === 'move' && <MoveDialog slug={slug} ctx={ctx} enrollment={editing.enrollment} onClose={(): void => setEditing(null)} onSaved={reload} />}
      {editing?.kind === 'end' && <EndDialog slug={slug} enrollment={editing.enrollment} onClose={(): void => setEditing(null)} onSaved={reload} />}
    </AcademicPage>
  );
};

interface FamilyTabProps {
  data: StudentDetail;
  canManage: boolean;
  isPending: boolean;
  onAdd: () => void;
  onEdit: (g: Guardian) => void;
  onRemove: (g: Guardian) => void;
  onAccess: (guardianId: string) => void;
}

const FamilyTab = ({ data, canManage, isPending, onAdd, onEdit, onRemove, onAccess }: FamilyTabProps): JSX.Element => {
  const student = data.student!;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {data.guardians.map((g) => (
          <div key={g.id} className={cn('rounded-2xl border bg-background p-5', g.isPrimary ? 'border-brand/50' : 'border-border')}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 font-semibold text-foreground">
                  {g.givenNames} {g.surnames}
                  {g.isPrimary && (
                    <span className="pill bg-brand-soft text-brand">
                      <MorphIcon icon={Star} size={11} />
                      Principal
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {relationshipLabels[g.relationship]} · {g.documentType.toUpperCase()} {g.documentNumber}
                  {g.occupation && ` · ${g.occupation}`}
                </p>
              </div>
              {canManage && (
                <div className="flex items-center">
                  <button type="button" onClick={(): void => onEdit(g)} className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label={`Editar a ${g.givenNames}`}>
                    <MorphIcon icon={Pencil} size={15} />
                  </button>
                  <ConfirmDelete compact label="Desvincular" title={`¿Desvincular a ${g.givenNames}?`} description={g.studentCount > 1 ? 'Sigue registrado para sus otros estudiantes.' : 'No tiene otros estudiantes: se elimina su registro.'} onConfirm={(): void => onRemove(g)} />
                </div>
              )}
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Celular</dt>
                <dd className="flex items-center gap-1.5 text-foreground">
                  {g.phone ? (
                    <a href={`tel:${g.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-1.5 hover:text-brand">
                      <MorphIcon icon={Phone} size={13} />
                      {g.phone}
                    </a>
                  ) : (
                    '—'
                  )}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-xs text-muted-foreground">Correo</dt>
                <dd className="truncate text-foreground">{g.email || '—'}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Puede recogerlo</dt>
                <dd className="text-foreground">{g.canPickUp ? 'Sí' : 'No'}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Panel</dt>
                <dd className="flex items-center gap-2">
                  <StatusPill className={accessClass[g.access]}>{accessLabels[g.access]}</StatusPill>
                  {canManage && g.access !== 'account' && g.email && (
                    <button type="button" disabled={isPending} onClick={(): void => onAccess(g.id)} className="text-xs font-medium text-brand hover:underline">
                      {g.access === 'invited' ? 'Reenviar' : 'Dar acceso'}
                    </button>
                  )}
                </dd>
              </div>
            </dl>
            {g.studentCount > 1 && <p className="mt-3 text-xs text-muted-foreground">También es apoderado de {g.studentCount - 1} estudiante(s) más.</p>}
          </div>
        ))}
        {canManage && (
          <button type="button" onClick={onAdd} className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border text-sm font-medium text-brand transition-colors hover:border-brand/50 hover:bg-brand-soft/40">
            <MorphIcon icon={UserPlus} size={22} />
            Agregar apoderado
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-surface px-5 py-4 text-sm">
        <span>
          <span className="font-medium text-foreground">Acceso del estudiante al panel: </span>
          <StatusPill className={accessClass[student.access]}>{accessLabels[student.access]}</StatusPill>
          {!student.email && <span className="ml-2 text-muted-foreground">Registra su correo en Datos para darle acceso.</span>}
        </span>
        {canManage && student.email && student.access !== 'account' && (
          <button type="button" className="btn-alt" disabled={isPending} onClick={(): void => onAccess('')}>
            <MorphIcon icon={KeyRound} size={16} />
            {student.access === 'invited' ? 'Reenviar invitación' : 'Dar acceso al panel'}
          </button>
        )}
      </div>
    </div>
  );
};

interface EnrollmentTabProps {
  data: StudentDetail;
  ctx: PeopleContextData;
  canManage: boolean;
  isPending: boolean;
  onEnroll: () => void;
  onMove: (e: Enrollment) => void;
  onEnd: (e: Enrollment) => void;
  onReactivate: (e: Enrollment) => void;
  onDelete: (e: Enrollment) => void;
}

const EnrollmentTab = ({ data, ctx, canManage, isPending, onEnroll, onMove, onEnd, onReactivate, onDelete }: EnrollmentTabProps): JSX.Element => {
  const open = (e: Enrollment): boolean => ctx.periods.find((p) => p.id === e.periodId)?.status !== 'closed';
  const notEnrolledAnywhere = ctx.periods.some((p) => p.status !== 'closed' && !data.enrollments.some((e) => e.periodId === p.id));
  return (
    <div className="space-y-4">
      {canManage && data.student?.status === 'active' && notEnrolledAnywhere && (
        <button type="button" className="btn-brand" onClick={onEnroll}>
          <MorphIcon icon={Plus} size={16} />
          Matricular
        </button>
      )}
      {data.enrollments.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-6 py-8 text-center text-sm text-muted-foreground">Aún no tiene matrículas.</p>
      ) : (
        <ol className="space-y-3">
          {data.enrollments.map((e) => (
            <li key={e.id} className="rounded-2xl border border-border bg-background px-5 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="flex flex-wrap items-center gap-2 font-semibold text-foreground">
                    {e.periodName}
                    <StatusPill className={enrollmentStatusClass[e.status]}>{enrollmentStatusLabels[e.status]}</StatusPill>
                  </p>
                  <p className="mt-0.5 text-sm text-foreground">
                    {e.levelName}
                    {e.gradeName && ` · ${e.gradeName}`}
                    {e.sectionName ? ` · ${ctx.context.vocabulary?.section ?? 'Sección'} ${e.sectionName}` : ` · sin ${lower(ctx.context.vocabulary?.section ?? 'sección')}`}
                    {e.credits > 0 && ` · ${e.unitIds.length} unidades, ${e.credits} créditos`}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {enrollmentKindLabels[e.kind]} · desde el {formatDay(e.enrolledOn)}
                    {e.origin && ` · viene de ${e.origin}`}
                    {e.endedOn && ` · hasta el ${formatDay(e.endedOn)}`}
                    {e.destination && ` · pasa a ${e.destination}`}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <AttachmentsButton
                    ownerKind="enrollment"
                    ownerId={e.id}
                    label="Expediente"
                    title={`Expediente de matrícula · ${e.periodName}`}
                    description="Documentos que se entregaron para esta matrícula: ficha de matrícula, DNI, partida, certificado de estudios o constancia de traslado."
                    categories={['enrollment_form', 'dni', 'birth_certificate', 'study_certificate', 'transfer_certificate', 'medical_report', 'disability_certificate', 'photo', 'other']}
                  />
                {canManage && open(e) && (
                  <>
                    {e.status === 'active' ? (
                      <>
                        <button type="button" className="btn-alt h-9 px-3" onClick={(): void => onMove(e)}>
                          <MorphIcon icon={MoveRight} size={15} />
                          Cambiar
                        </button>
                        <button type="button" className="btn-alt h-9 px-3" onClick={(): void => onEnd(e)}>
                          <MorphIcon icon={LogOut} size={15} />
                          Retiro o traslado
                        </button>
                      </>
                    ) : (
                      e.status !== 'completed' && (
                        <button type="button" className="btn-alt h-9 px-3" disabled={isPending} onClick={(): void => onReactivate(e)}>
                          <MorphIcon icon={RotateCcw} size={15} />
                          Reactivar
                        </button>
                      )
                    )}
                    <ConfirmDelete compact label="Anular" title={`¿Anular la matrícula en ${e.periodName}?`} description="Úsalo solo si se registró por error: la matrícula desaparece del historial." onConfirm={(): void => onDelete(e)} />
                  </>
                )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};
