import type { ImportRow } from '@/lib/api/grpc/gen/joseph/people/v1/people';

// The columns of the spreadsheet, named as the nómina export names them, so an exported nómina loads back
export const importColumns: Array<{ key: keyof Omit<ImportRow, 'line'>; header: string; aliases: string[]; required?: boolean; example: string }> = [
  { key: 'cycle', header: 'Ciclo', aliases: ['ciclo', 'nivel'], required: true, example: 'Ciclo Avanzado' },
  { key: 'grade', header: 'Grado', aliases: ['grado'], required: true, example: '3.°' },
  { key: 'section', header: 'Sección', aliases: ['seccion', 'aula'], required: true, example: 'V' },
  { key: 'documentType', header: 'Tipo de documento', aliases: ['tipo de documento', 'tipo doc', 'tipo'], example: 'DNI' },
  { key: 'documentNumber', header: 'N.° de documento', aliases: ['n de documento', 'nro de documento', 'numero de documento', 'documento', 'dni'], required: true, example: '71234567' },
  { key: 'paternalSurname', header: 'Apellido paterno', aliases: ['apellido paterno'], required: true, example: 'Quispe' },
  { key: 'maternalSurname', header: 'Apellido materno', aliases: ['apellido materno'], example: 'Huamán' },
  { key: 'givenNames', header: 'Nombres', aliases: ['nombres', 'nombre'], required: true, example: 'Rosa Elena' },
  { key: 'sex', header: 'Sexo', aliases: ['sexo'], example: 'M' },
  { key: 'birthDate', header: 'Fecha de nacimiento', aliases: ['fecha de nacimiento', 'nacimiento'], example: '14/03/1995' },
  { key: 'kind', header: 'Situación de matrícula', aliases: ['situacion de matricula', 'situacion', 'tipo de matricula'], example: 'Nuevo' },
  { key: 'origin', header: 'Procedencia', aliases: ['procedencia', 'institucion de origen', 'origen'], example: '' },
  { key: 'email', header: 'Correo', aliases: ['correo', 'email', 'correo electronico'], example: '' },
  { key: 'phone', header: 'Teléfono', aliases: ['telefono', 'celular'], example: '' },
];

const fold = (v: string): string =>
  v
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[.°º]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

// Splits a CSV text (comma or semicolon, quotes, a BOM) into rows of cells
export const parseCsv = (text: string): string[][] => {
  const clean = text.replace(/^﻿/, '');
  const firstLine = clean.slice(0, clean.indexOf('\n') === -1 ? undefined : clean.indexOf('\n'));
  const sep = (firstLine.match(/;/g)?.length ?? 0) > (firstLine.match(/,/g)?.length ?? 0) ? ';' : ',';
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];
    if (quoted) {
      if (c === '"' && clean[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === sep) {
      row.push(cell);
      cell = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && clean[i + 1] === '\n') i++;
      row.push(cell);
      if (row.some((x) => x.trim() !== '')) rows.push(row);
      row = [];
      cell = '';
    } else cell += c;
  }
  row.push(cell);
  if (row.some((x) => x.trim() !== '')) rows.push(row);
  return rows;
};

export interface ParsedSheet {
  rows: ImportRow[];
  // Required columns the header lacks
  missing: string[];
  // Header lines skipped before the real header (titles above the table)
  headerLine: number;
}

// Finds the header (the first line naming the required columns) and maps each row to the API's fields
export const readSheet = (cells: string[][]): ParsedSheet => {
  const headerIndex = cells.findIndex((r) => {
    const names = r.map(fold);
    return importColumns.filter((c) => c.required).every((c) => c.aliases.some((a) => names.includes(a)));
  });
  const header = (headerIndex >= 0 ? cells[headerIndex] : (cells[0] ?? [])).map(fold);
  const position = new Map(importColumns.map((c) => [c.key, header.findIndex((h) => c.aliases.includes(h))]));
  const missing = importColumns.filter((c) => c.required && (position.get(c.key) ?? -1) < 0).map((c) => c.header);
  const start = headerIndex >= 0 ? headerIndex + 1 : 1;
  const rows = cells.slice(start).map((r, i) => {
    const out = { line: start + i + 1 } as ImportRow;
    for (const c of importColumns) {
      const at = position.get(c.key) ?? -1;
      out[c.key] = at >= 0 ? (r[at] ?? '').trim() : '';
    }
    return out;
  });
  return { rows, missing, headerLine: start };
};

// The template to fill, with one example row
export const templateCsv = (): string => {
  const line = (values: string[]): string => values.map((v) => (/[;"\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)).join(';');
  return '﻿' + [line(importColumns.map((c) => c.header)), line(importColumns.map((c) => c.example))].join('\r\n') + '\r\n';
};

export const importStatusLabels: Record<string, string> = { ready: 'Lista', existing: 'Ya registrado', skipped: 'Ya matriculado', enrolled: 'Matriculado', error: 'Error' };
export const importStatusClass: Record<string, string> = {
  ready: 'bg-success/12 text-success',
  existing: 'bg-brand-soft text-brand',
  skipped: 'bg-secondary text-muted-foreground',
  enrolled: 'bg-success/12 text-success',
  error: 'bg-destructive/12 text-destructive',
};
