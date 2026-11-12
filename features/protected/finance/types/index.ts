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

// Texts of the payments module that change with the management type (data/finance-data.ts paymentsCopy)
export interface PaymentsCopy {
  title: string;
  familyDescription: string;
  staffDescription: string;
  noRole: string;
  planDescription: string;
  planNamePlaceholder: string;
  itemPlaceholder: string;
  // Concept and name of the item "Agregar cuota" adds (n: how many items the plan already has)
  newItem: { concept: string; name: (n: number) => string };
  discountTitle: string;
  discountDescription: string;
  discountPlaceholder: string;
}

// The payments module for the institution's management type: its texts and the concepts plans may use
export interface UsePaymentsCopyResult {
  isPublic: boolean;
  copy: PaymentsCopy;
  conceptOptions: (current: string) => Array<{ value: string; label: string; disabled: boolean }>;
}

export interface PlanItemDraft {
  id: string;
  concept: string;
  name: string;
  amount: string;
  dueOn: string;
}
