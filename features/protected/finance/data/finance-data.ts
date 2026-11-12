import type { Management } from '@/features/protected/dashboard/types';
import type { PaymentsCopy } from '../types';

// Céntimos → "S/ 1,234.50" (es-PE grouping)
export const soles = (cents?: number): string => {
  const v = (cents ?? 0) / 100;
  return `S/ ${v.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// "420,50" / "420.5" → céntimos (NaN when it is not an amount)
export const toCents = (text: string): number => {
  const clean = text.trim().replace(/\s/g, '').replace(',', '.');
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(clean)) return Number.NaN;
  return Math.round(Number(clean) * 100);
};

// Spanish names of the payment methods and fee concepts
export const methodLabels: Record<string, string> = { cash: 'Efectivo', transfer: 'Transferencia', yape: 'Yape', plin: 'Plin', card: 'Tarjeta', deposit: 'Depósito' };
export const conceptLabels: Record<string, string> = { enrollment: 'Matrícula', tuition: 'Pensión', apafa: 'Cuota APAFA', other: 'Otro concepto' };

// Concepts a plan item may take: public institutions charge no tuition (they get the APAFA fee instead) and the
// APAFA fee is only offered to public ones. The item's current concept stays listed so an older plan still reads
const conceptsByManagement: Record<Management, string[]> = { private: ['enrollment', 'tuition', 'other'], public: ['enrollment', 'apafa', 'other'] };
export const conceptOptions = (management: Management, current: string): Array<{ value: string; label: string; disabled: boolean }> => {
  const allowed = conceptsByManagement[management];
  const keys = allowed.includes(current) || !(current in conceptLabels) ? allowed : [...allowed, current];
  return keys.map((value) => ({ value, label: conceptLabels[value] ?? value, disabled: !allowed.includes(value) }));
};

// Wording of the payments module per management type ("pensiones" only exist in private institutions)
export const paymentsCopy: Record<Management, PaymentsCopy> = {
  private: {
    title: 'Pensiones y pagos',
    familyDescription: 'Tu cronograma de pagos, lo pagado con sus recibos y lo que está por vencer.',
    staffDescription: 'El cronograma de cada estudiante, los pagos con su recibo, la morosidad y la caja del día. Sin moras: la ley no permite cobrar más que el interés legal ni retener libretas por deuda.',
    noRole: 'Tu rol no administra pensiones ni pagos.',
    planDescription: 'Matrícula, pensiones y otros conceptos con su vencimiento.',
    planNamePlaceholder: 'Pensiones 2027',
    itemPlaceholder: 'Ej.: Pensión de marzo',
    newItem: { concept: 'tuition', name: (n: number): string => `Pensión ${n}` },
    discountTitle: 'Descuento en las pensiones',
    discountDescription: 'Se aplica a las pensiones que aún no tienen pagos.',
    discountPlaceholder: 'Beca, hermanos, convenio…',
  },
  public: {
    title: 'Pagos',
    familyDescription: 'Tu cronograma de pagos (matrícula y cuota de la APAFA), lo pagado con sus recibos y lo que está por vencer.',
    staffDescription: 'La matrícula, la cuota de la APAFA y otros conceptos de cada estudiante, los pagos con su recibo y la caja del día. Una institución pública no cobra pensiones, y ninguna deuda retiene libretas ni la matrícula.',
    noRole: 'Tu rol no administra los pagos.',
    planDescription: 'Matrícula, cuota de la APAFA y otros conceptos con su vencimiento. Una institución pública no cobra pensiones.',
    planNamePlaceholder: 'Pagos 2027',
    itemPlaceholder: 'Ej.: Cuota APAFA 2027',
    newItem: { concept: 'apafa', name: (): string => 'Cuota APAFA' },
    discountTitle: 'Exoneración o descuento',
    discountDescription: 'Se aplica a la matrícula y la cuota de la APAFA que aún no tienen pagos.',
    discountPlaceholder: 'Exoneración acordada por la APAFA, situación económica…',
  },
};

// "2026-03" → "mar" for the monthly bars
const monthFmt = new Intl.DateTimeFormat('es-PE', { month: 'short', timeZone: 'UTC' });
export const monthLabel = (ym: string): string => monthFmt.format(new Date(`${ym}-01T00:00:00Z`)).replace('.', '');
