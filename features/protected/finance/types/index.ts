import type { Account, Charge, FeeItem, FeePlan, GetCashResponse, GetSummaryResponse, Payment, Statement } from '@/lib/api/grpc/gen/joseph/finance/v1/finance';

export type { Account, Charge, FeeItem, FeePlan, GetCashResponse as Cash, GetSummaryResponse as Summary, Payment, Statement };

export interface PaymentValues {
  amount: string;
  method: string;
  reference: string;
  paidOn: string;
  payer: string;
  notes: string;
}

export interface PlanItemDraft {
  id: string;
  concept: string;
  name: string;
  amount: string;
  dueOn: string;
}
