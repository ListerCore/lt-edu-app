export const situationLabels: Record<string, string> = { PRO: 'Promovido', PER: 'Permanece', RR: 'Recuperación', PEN: 'Pendiente' };
export const situationClass: Record<string, string> = {
  PRO: 'bg-success/12 text-success',
  PER: 'bg-destructive/12 text-destructive',
  RR: 'bg-warning/14 text-warning',
  PEN: 'bg-secondary text-muted-foreground',
};
export const situationBar: Record<string, string> = { PRO: 'bg-success', RR: 'bg-warning', PER: 'bg-destructive', PEN: 'bg-muted-foreground/30' };

export const unitLabels: Record<string, string> = { approved: 'Aprobado', recovery: 'Recuperación', failed: 'Desaprobado', barred: 'Inhabilitado' };
export const unitClass: Record<string, string> = {
  approved: 'bg-success/12 text-success',
  recovery: 'bg-warning/14 text-warning',
  failed: 'bg-destructive/12 text-destructive',
  barred: 'bg-destructive/12 text-destructive',
};

export const recordKindLabels: Record<string, string> = { final: 'Acta de evaluación final', complementary: 'Acta de recuperación', unit: 'Acta de unidad didáctica' };

// Saves the CSV the API built (base64) with its name
export const downloadBase64 = (fileName: string, base64: string, type = 'text/csv;charset=utf-8'): void => {
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const url = URL.createObjectURL(new Blob([bytes], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
