'use server';

import { DATE_PATTERN } from '@/features/protected/academic/data/academic-data';
import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { financeRpc } from '@/lib/api/grpc/finance';
import type { Cash, FeePlan, Payment, Statement, Summary } from '../types';

// True when every id is empty or a valid UUID (empty means "use the default")
const optional = (...ids: string[]): boolean => ids.every((id) => id === '' || validIds(id));
// Keeps only ISO dates; anything else goes as empty so the API rejects or defaults it
const day = (v: string): string => (DATE_PATTERN.test(v) ? v : '');

// Period totals, monthly collection and every account
export const getSummaryAction = async (slug: string, periodId: string): Promise<AcademicResult<Summary>> =>
  optional(periodId) ? runRpc(slug, (token) => financeRpc.summary({ institutionSlug: slug, periodId }, { token }), (d) => d) : notFound;

// Fee plans of a period
export const listPlansAction = async (slug: string, periodId: string): Promise<AcademicResult<{ plans: FeePlan[]; canManage: boolean }>> =>
  optional(periodId) ? runRpc(slug, (token) => financeRpc.plans({ institutionSlug: slug, periodId }, { token }), (d) => ({ plans: d.plans, canManage: d.canManage })) : notFound;

// Creates or updates a plan; trims names to the column size
export const savePlanAction = async (slug: string, plan: FeePlan): Promise<AcademicResult<FeePlan>> =>
  optional(plan.id, plan.periodId, plan.levelId)
    ? runRpc(slug, (token) => financeRpc.savePlan({ institutionSlug: slug, plan: { ...plan, name: plan.name.slice(0, 120), items: plan.items.map((i) => ({ ...i, name: i.name.slice(0, 120), dueOn: day(i.dueOn) })) } }, { token }), (d) => d.plan, 'Plan guardado.')
    : notFound;

// Deletes a plan nobody has charges from yet
export const deletePlanAction = async (slug: string, id: string): Promise<AcademicResult<null>> =>
  validIds(id) ? runRpc(slug, (token) => financeRpc.deletePlan({ institutionSlug: slug, id }, { token }), () => null, 'Plan eliminado.') : notFound;

// Gives enrolled students the plan charges they lack; returns how many were created
export const generateAction = async (slug: string, id: string): Promise<AcademicResult<number>> =>
  validIds(id) ? runRpc(slug, (token) => financeRpc.generate({ institutionSlug: slug, id }, { token }), (d) => d.created) : notFound;

// One student's account for treasury
export const getStatementAction = async (slug: string, studentId: string): Promise<AcademicResult<Statement>> =>
  validIds(studentId) ? runRpc(slug, (token) => financeRpc.statement({ institutionSlug: slug, studentId }, { token }), (d) => d.statement) : notFound;

// The signed-in guardian's children accounts
export const getMyStatementsAction = async (slug: string): Promise<AcademicResult<Statement[]>> => runRpc(slug, (token) => financeRpc.mine({ institutionSlug: slug }, { token }), (d) => d.statements);

// Registers a payment and returns it with its receipt number
export const payAction = async (
  slug: string,
  studentId: string,
  v: { amount: number; method: string; reference: string; paidOn: string; payer: string; notes: string; chargeIds: string[] },
): Promise<AcademicResult<Payment>> =>
  validIds(studentId) && optional(...v.chargeIds)
    ? runRpc(
        slug,
        (token) =>
          financeRpc.pay(
            { institutionSlug: slug, studentId, amount: v.amount, method: v.method, reference: v.reference.slice(0, 80), paidOn: day(v.paidOn), payer: v.payer.slice(0, 160), notes: v.notes.slice(0, 300), chargeIds: v.chargeIds },
            { token },
          ),
        (d) => d.payment,
      )
    : notFound;

// Annuls a receipt; its charges become pending again
export const annulPaymentAction = async (slug: string, id: string, reason: string): Promise<AcademicResult<null>> =>
  validIds(id) ? runRpc(slug, (token) => financeRpc.annul({ institutionSlug: slug, id, reason: reason.slice(0, 200) }, { token }), () => null, 'Pago anulado.') : notFound;

// One payment plus the institution name, for the receipt
export const getPaymentAction = async (slug: string, id: string): Promise<AcademicResult<{ payment: Payment; institution: string }>> =>
  validIds(id) ? runRpc(slug, (token) => financeRpc.payment({ institutionSlug: slug, id }, { token }), (d) => (d.payment ? { payment: d.payment, institution: d.institution } : undefined)) : notFound;

// Payments of a date range with totals per method
export const getCashAction = async (slug: string, from: string, to: string, method: string): Promise<AcademicResult<Cash>> =>
  runRpc(slug, (token) => financeRpc.cash({ institutionSlug: slug, from: day(from), to: day(to), method }, { token }), (d) => d);

// Sets a scholarship or discount and re-applies it to pending charges
export const saveDiscountAction = async (slug: string, studentId: string, periodId: string, percent: number, reason: string): Promise<AcademicResult<Statement>> =>
  validIds(studentId, periodId)
    ? runRpc(slug, (token) => financeRpc.saveDiscount({ institutionSlug: slug, discount: { studentId, studentName: '', periodId, percent, tuitionOnly: true, reason: reason.slice(0, 200) } }, { token }), (d) => d.statement, 'Descuento aplicado.')
    : notFound;

// Removes the discount and restores the full amounts
export const deleteDiscountAction = async (slug: string, studentId: string, periodId: string): Promise<AcademicResult<Statement>> =>
  validIds(studentId, periodId) ? runRpc(slug, (token) => financeRpc.deleteDiscount({ institutionSlug: slug, studentId, periodId }, { token }), (d) => d.statement, 'Descuento retirado.') : notFound;

// Voids an unpaid charge with a reason
export const voidChargeAction = async (slug: string, id: string, reason: string): Promise<AcademicResult<Statement>> =>
  validIds(id) ? runRpc(slug, (token) => financeRpc.voidCharge({ institutionSlug: slug, id, reason: reason.slice(0, 200) }, { token }), (d) => d.statement, 'Cuota anulada.') : notFound;

// Adds a one-off charge (concept "other")
export const addChargeAction = async (slug: string, studentId: string, periodId: string, name: string, amount: number, dueOn: string): Promise<AcademicResult<Statement>> =>
  validIds(studentId, periodId) ? runRpc(slug, (token) => financeRpc.addCharge({ institutionSlug: slug, studentId, periodId, name: name.slice(0, 120), amount, dueOn: day(dueOn) }, { token }), (d) => d.statement, 'Cargo agregado.') : notFound;

// Sends the overdue reminder; empty ids means every family that owes
export const remindAction = async (slug: string, periodId: string, studentIds: string[]): Promise<AcademicResult<number>> =>
  validIds(periodId) && optional(...studentIds) ? runRpc(slug, (token) => financeRpc.remind({ institutionSlug: slug, periodId, studentIds }, { token }), (d) => d.sent) : notFound;
