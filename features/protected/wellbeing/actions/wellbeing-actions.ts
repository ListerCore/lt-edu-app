'use server';

import { DATE_PATTERN } from '@/features/protected/academic/data/academic-data';
import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { wellbeingRpc } from '@/lib/api/grpc/wellbeing';
import type {
  Alerts,
  CaseDetail,
  Commitment,
  DisciplineBoard,
  Incident,
  IndividualPlan,
  Interview,
  Measure,
  MeasureContext,
  PlansBoard,
  PsychBoard,
  PsychCase,
  PsychSession,
  StudentFile,
  StudentList,
  TherapyLog,
  TherapySession,
  TutoringBoard,
} from '../types';

// True when every id is empty or a valid UUID (empty means "new" or "any")
const optional = (...ids: string[]): boolean => ids.every((id) => id === '' || validIds(id));
// Keeps only ISO dates; anything else goes as empty so the API rejects or ignores it
const day = (v: string): string => (DATE_PATTERN.test(v) ? v : '');
// Trims free text to the column size before it travels
const cut = (v: string, n: number): string => v.trim().slice(0, n);

// ---------- students, file and alerts ----------

// Students the person may see, with their open matters
export const listStudentsAction = async (slug: string, query = '', specialNeeds = false): Promise<AcademicResult<StudentList>> =>
  runRpc(slug, (token) => wellbeingRpc.students({ institutionSlug: slug, query: query.slice(0, 80), specialNeeds }, { token }), (d) => d);

// Everything wellbeing knows of one student that the person may read
export const getStudentFileAction = async (slug: string, studentId: string): Promise<AcademicResult<StudentFile>> =>
  validIds(studentId) ? runRpc(slug, (token) => wellbeingRpc.file({ institutionSlug: slug, studentId }, { token }), (d) => d) : notFound;

// What needs attention for the person (absences, conduct, faults, commitments, referrals, POIs)
export const getAlertsAction = async (slug: string): Promise<AcademicResult<Alerts>> => runRpc(slug, (token) => wellbeingRpc.alerts({ institutionSlug: slug }, { token }), (d) => d);

// ---------- tutoring ----------

// The tutor's board: their students, commitments due and recent interviews
export const getTutoringAction = async (slug: string): Promise<AcademicResult<TutoringBoard>> => runRpc(slug, (token) => wellbeingRpc.tutoring({ institutionSlug: slug }, { token }), (d) => d);

// Records or corrects an interview
export const saveInterviewAction = async (slug: string, x: Interview): Promise<AcademicResult<Interview>> =>
  optional(x.id) && validIds(x.studentId)
    ? runRpc(
        slug,
        (token) =>
          wellbeingRpc.saveInterview(
            { institutionSlug: slug, interview: { ...x, heldOn: day(x.heldOn), topic: cut(x.topic, 160), notes: cut(x.notes, 4000), agreements: cut(x.agreements, 2000) } },
            { token },
          ),
        (d) => d.interview,
        'Entrevista guardada.',
      )
    : notFound;

// Removes an interview (its author or dirección)
export const deleteInterviewAction = async (slug: string, id: string): Promise<AcademicResult<null>> =>
  validIds(id) ? runRpc(slug, (token) => wellbeingRpc.deleteInterview({ institutionSlug: slug, id }, { token }), () => null, 'Entrevista eliminada.') : notFound;

// Records or corrects a commitment
export const saveCommitmentAction = async (slug: string, c: Commitment): Promise<AcademicResult<Commitment>> =>
  optional(c.id, c.interviewId) && validIds(c.studentId)
    ? runRpc(slug, (token) => wellbeingRpc.saveCommitment({ institutionSlug: slug, commitment: { ...c, dueOn: day(c.dueOn), description: cut(c.description, 500) } }, { token }), (d) => d.commitment, 'Compromiso guardado.')
    : notFound;

// Marks a commitment met, unmet or pending again
export const checkCommitmentAction = async (slug: string, id: string, status: string): Promise<AcademicResult<null>> =>
  validIds(id) ? runRpc(slug, (token) => wellbeingRpc.checkCommitment({ institutionSlug: slug, id, status }, { token }), () => null) : notFound;

// Removes a commitment
export const deleteCommitmentAction = async (slug: string, id: string): Promise<AcademicResult<null>> =>
  validIds(id) ? runRpc(slug, (token) => wellbeingRpc.deleteCommitment({ institutionSlug: slug, id }, { token }), () => null, 'Compromiso eliminado.') : notFound;

// ---------- psychology ----------

// Refers a student to psychology (opens a case)
export const referAction = async (slug: string, studentId: string, reason: string, priority: string): Promise<AcademicResult<PsychCase>> =>
  validIds(studentId)
    ? runRpc(slug, (token) => wellbeingRpc.refer({ institutionSlug: slug, studentId, reason: cut(reason, 2000), priority }, { token }), (d) => d.case, 'Derivación enviada a psicología.')
    : notFound;

// Psychologists: the cases; others: counts and their own referrals
export const getPsychologyAction = async (slug: string, status = ''): Promise<AcademicResult<PsychBoard>> =>
  runRpc(slug, (token) => wellbeingRpc.psychology({ institutionSlug: slug, status }, { token }), (d) => d);

// One case with its sessions (psychologists only)
export const getCaseAction = async (slug: string, id: string): Promise<AcademicResult<CaseDetail>> =>
  validIds(id) ? runRpc(slug, (token) => wellbeingRpc.getCase({ institutionSlug: slug, id }, { token }), (d) => d) : notFound;

// Changes status, priority, reason or the note shared with whoever referred
export const updateCaseAction = async (slug: string, c: { id: string; status: string; priority: string; reason: string; sharedNote: string }): Promise<AcademicResult<PsychCase>> =>
  validIds(c.id)
    ? runRpc(slug, (token) => wellbeingRpc.updateCase({ institutionSlug: slug, ...c, reason: cut(c.reason, 2000), sharedNote: cut(c.sharedNote, 1000) }, { token }), (d) => d.case, 'Caso actualizado.')
    : notFound;

// Logs a session of a case
export const addSessionAction = async (slug: string, s: PsychSession): Promise<AcademicResult<PsychSession>> =>
  validIds(s.caseId)
    ? runRpc(slug, (token) => wellbeingRpc.addSession({ institutionSlug: slug, session: { ...s, heldOn: day(s.heldOn), notes: cut(s.notes, 4000), nextSteps: cut(s.nextSteps, 1000) } }, { token }), (d) => d.session, 'Sesión registrada.')
    : notFound;

// Removes a session entered by mistake
export const deleteSessionAction = async (slug: string, caseId: string, id: string): Promise<AcademicResult<null>> =>
  validIds(caseId, id) ? runRpc(slug, (token) => wellbeingRpc.deleteSession({ institutionSlug: slug, caseId, id }, { token }), () => null, 'Sesión eliminada.') : notFound;

// ---------- discipline ----------

// The register of faults and measures, filtered
export const getDisciplineAction = async (slug: string, f: { from: string; to: string; severity: string; status: string }): Promise<AcademicResult<DisciplineBoard>> =>
  runRpc(slug, (token) => wellbeingRpc.discipline({ institutionSlug: slug, from: day(f.from), to: day(f.to), severity: f.severity, status: f.status }, { token }), (d) => d);

// Reports or corrects a fault (severity comes from the catalog)
export const saveIncidentAction = async (slug: string, x: Incident): Promise<AcademicResult<Incident>> =>
  optional(x.id) && validIds(x.studentId)
    ? runRpc(
        slug,
        (token) =>
          wellbeingRpc.saveIncident(
            { institutionSlug: slug, incident: { ...x, occurredOn: day(x.occurredOn), familyNotifiedOn: day(x.familyNotifiedOn), description: cut(x.description, 2000), measures: [] } },
            { token },
          ),
        (d) => d.incident,
        'Falta registrada.',
      )
    : notFound;

// Removes a fault reported by mistake
export const deleteIncidentAction = async (slug: string, id: string): Promise<AcademicResult<null>> =>
  validIds(id) ? runRpc(slug, (token) => wellbeingRpc.deleteIncident({ institutionSlug: slug, id }, { token }), () => null, 'Falta eliminada.') : notFound;

// Closes or reopens a fault
export const setIncidentStatusAction = async (slug: string, id: string, status: string): Promise<AcademicResult<null>> =>
  validIds(id) ? runRpc(slug, (token) => wellbeingRpc.setIncidentStatus({ institutionSlug: slug, id, status }, { token }), () => null) : notFound;

// The student's record the measure form shows (faults, suspensions, conduct)
export const getMeasureContextAction = async (slug: string, studentId: string, incidentId: string): Promise<AcademicResult<MeasureContext>> =>
  validIds(studentId) && optional(incidentId) ? runRpc(slug, (token) => wellbeingRpc.measureContext({ institutionSlug: slug, studentId, incidentId }, { token }), (d) => d) : notFound;

// Applies a measure (the API checks who decides and the ground)
export const addMeasureAction = async (slug: string, m: Measure): Promise<AcademicResult<Measure>> =>
  optional(m.incidentId, m.studentId)
    ? runRpc(
        slug,
        (token) => wellbeingRpc.addMeasure({ institutionSlug: slug, measure: { ...m, startsOn: day(m.startsOn), notifiedOn: day(m.notifiedOn), detail: cut(m.detail, 2000) } }, { token }),
        (d) => d.measure,
        'Medida registrada.',
      )
    : notFound;

// Records when the family was told (it starts the reconsideration term)
export const notifyMeasureAction = async (slug: string, id: string, notifiedOn: string): Promise<AcademicResult<null>> =>
  validIds(id) ? runRpc(slug, (token) => wellbeingRpc.notifyMeasure({ institutionSlug: slug, id, notifiedOn: day(notifiedOn) }, { token }), () => null, 'Comunicación registrada.') : notFound;

// The family asks for reconsideration within three school days
export const requestReconsiderationAction = async (slug: string, id: string, reason: string): Promise<AcademicResult<null>> =>
  validIds(id) ? runRpc(slug, (token) => wellbeingRpc.requestReconsideration({ institutionSlug: slug, id, reason: cut(reason, 2000) }, { token }), () => null, 'Pedido de reconsideración enviado.') : notFound;

// Dirección upholds or revokes a measure under reconsideration
export const resolveReconsiderationAction = async (slug: string, id: string, outcome: string, resolution: string): Promise<AcademicResult<null>> =>
  validIds(id) ? runRpc(slug, (token) => wellbeingRpc.resolveReconsideration({ institutionSlug: slug, id, outcome, resolution: cut(resolution, 2000) }, { token }), () => null, 'Reconsideración resuelta.') : notFound;

// Removes a measure entered by mistake
export const deleteMeasureAction = async (slug: string, id: string): Promise<AcademicResult<null>> =>
  validIds(id) ? runRpc(slug, (token) => wellbeingRpc.deleteMeasure({ institutionSlug: slug, id }, { token }), () => null, 'Medida eliminada.') : notFound;

// ---------- special education ----------

// POIs of a period (coordinación also gets students and specialists)
export const listPlansAction = async (slug: string, periodId = ''): Promise<AcademicResult<PlansBoard>> =>
  optional(periodId) ? runRpc(slug, (token) => wellbeingRpc.plans({ institutionSlug: slug, periodId }, { token }), (d) => d) : notFound;

// One POI plus the institution name, for printing
export const getPlanAction = async (slug: string, id: string): Promise<AcademicResult<{ plan: IndividualPlan; institution: string }>> =>
  validIds(id) ? runRpc(slug, (token) => wellbeingRpc.plan({ institutionSlug: slug, id }, { token }), (d) => (d.plan ? { plan: d.plan, institution: d.institution } : undefined)) : notFound;

// Opens or writes a POI
export const savePlanAction = async (slug: string, p: IndividualPlan): Promise<AcademicResult<IndividualPlan>> =>
  optional(p.id, p.studentId, p.periodId, p.specialistId) ? runRpc(slug, (token) => wellbeingRpc.savePlan({ institutionSlug: slug, plan: p }, { token }), (d) => d.plan, 'Plan guardado.') : notFound;

// Approves or reopens a POI
export const setPlanStatusAction = async (slug: string, id: string, status: string): Promise<AcademicResult<IndividualPlan>> =>
  validIds(id) ? runRpc(slug, (token) => wellbeingRpc.setPlanStatus({ institutionSlug: slug, id, status }, { token }), (d) => d.plan, status === 'approved' ? 'Plan aprobado.' : 'Plan reabierto.') : notFound;

// Deletes a draft POI
export const deletePlanAction = async (slug: string, id: string): Promise<AcademicResult<null>> =>
  validIds(id) ? runRpc(slug, (token) => wellbeingRpc.deletePlan({ institutionSlug: slug, id }, { token }), () => null, 'Plan eliminado.') : notFound;

// Therapy sessions in a range, optionally of one student
export const listTherapiesAction = async (slug: string, f: { from: string; to: string; studentId: string }): Promise<AcademicResult<TherapyLog>> =>
  optional(f.studentId) ? runRpc(slug, (token) => wellbeingRpc.therapies({ institutionSlug: slug, from: day(f.from), to: day(f.to), studentId: f.studentId }, { token }), (d) => d) : notFound;

// Logs or corrects a therapy session
export const saveTherapyAction = async (slug: string, t: TherapySession): Promise<AcademicResult<TherapySession>> =>
  optional(t.id) && validIds(t.studentId)
    ? runRpc(
        slug,
        (token) => wellbeingRpc.saveTherapy({ institutionSlug: slug, session: { ...t, heldOn: day(t.heldOn), goal: cut(t.goal, 500), notes: cut(t.notes, 2000), homeTasks: cut(t.homeTasks, 1000) } }, { token }),
        (d) => d.session,
        'Sesión registrada.',
      )
    : notFound;

// Removes a therapy session
export const deleteTherapyAction = async (slug: string, id: string): Promise<AcademicResult<null>> =>
  validIds(id) ? runRpc(slug, (token) => wellbeingRpc.deleteTherapy({ institutionSlug: slug, id }, { token }), () => null, 'Sesión eliminada.') : notFound;
