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
export const conceptLabels: Record<string, string> = { enrollment: 'Matrícula', tuition: 'Pensión', other: 'Otro concepto' };

// "2026-03" → "mar" for the monthly bars
const monthFmt = new Intl.DateTimeFormat('es-PE', { month: 'short', timeZone: 'UTC' });
export const monthLabel = (ym: string): string => monthFmt.format(new Date(`${ym}-01T00:00:00Z`)).replace('.', '');
