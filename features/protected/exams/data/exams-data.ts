export const difficultyLabels: Record<string, string> = { easy: 'Fácil', medium: 'Media', hard: 'Difícil' };
export const difficultyClass: Record<string, string> = { easy: 'bg-success/12 text-success', medium: 'bg-warning/14 text-warning', hard: 'bg-destructive/12 text-destructive' };
export const letters = ['A', 'B', 'C', 'D', 'E'] as const;

export const formatScore = (v?: number): string => (v === undefined ? '—' : v.toLocaleString('es-PE', { minimumFractionDigits: 3, maximumFractionDigits: 3 }));
export const short = (v?: number): string => (v === undefined ? '—' : v.toLocaleString('es-PE', { maximumFractionDigits: 1 }));
