import type { PlannerData, ScheduleEntry, Section, Staff } from '../types';

// Words left out of a course's initials ("Ciencia y Tecnología" → CT, "Educación para el Trabajo" → EPT)
const minor = new Set(['y', 'e', 'de', 'del', 'la', 'las', 'el', 'los', 'en', 'para', 'como', 'a', 'con']);

// Soft fills that print well in colour and stay legible in greyscale, in a fixed order by course name
const fills = ['#fde2cf', '#d6e6fb', '#d3f0e1', '#fbefc8', '#f6d8e6', '#e2dcf7', '#d9eef3', '#efe3d3', '#e5f0cf', '#f3d9d3', '#dfe3e8', '#f0e6f6', '#fff3b8', '#d8f3ec'];

// Short code of one name: initials of its significant words, or the first three letters of a single word
const initialsOf = (name: string): string => {
  const words = name
    .replace(/[,.()]/g, ' ')
    .split(/\s+/)
    .filter((w) => w && !minor.has(w.toLowerCase()));
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words.map((w) => w[0]?.toUpperCase() ?? '').join('');
};

// Gives every name a unique short code; a repeated code takes the next letters of its last word ("CS", "CSO")
const uniqueCodes = (names: string[], codeOf: (n: string) => string): Map<string, string> => {
  const out = new Map<string, string>();
  const used = new Set<string>();
  for (const n of names) {
    let code = codeOf(n);
    const base = code;
    for (let i = 2; used.has(code); i++) code = `${base}${i}`;
    used.add(code);
    out.set(n, code);
  }
  return out;
};

export interface ExportLegend {
  // Course name → short code and fill
  courses: Map<string, { code: string; fill: string }>;
  // Teacher id → short code ("RQH") and display name ("Rosa Quispe Huamán")
  teachers: Map<string, { code: string; name: string; short: string }>;
}

// Codes and colours for the whole period, so a course looks the same on every page
export const buildLegend = (data: PlannerData): ExportLegend => {
  const courseNames = [...new Set([...data.assignments.map((a) => a.subjectName), ...data.entries.map((e) => e.subjectName)])].sort((a, b) => a.localeCompare(b, 'es'));
  const codes = uniqueCodes(courseNames, initialsOf);
  const courses = new Map(courseNames.map((n, i) => [n, { code: codes.get(n) ?? n, fill: fills[i % fills.length] }]));
  const byId = new Map<string, Staff>(data.teachers.map((t) => [t.id, t]));
  const ids = [...new Set(data.entries.map((e) => e.staffId).filter(Boolean))];
  const names = ids.map((id) => {
    const t = byId.get(id);
    return t ? `${t.givenNames} ${t.surnames}` : (data.entries.find((e) => e.staffId === id)?.staffName ?? '');
  });
  const tcodes = uniqueCodes(
    names.slice().sort((a, b) => a.localeCompare(b, 'es')),
    (n) =>
      n
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => w[0]?.toUpperCase())
        .join('')
        .slice(0, 3),
  );
  const teachers = new Map(
    ids.map((id, i) => {
      const t = byId.get(id);
      const name = names[i];
      // "R. Quispe": first initial and first surname, short enough for a cell
      const short = t ? `${t.givenNames.charAt(0)}. ${t.surnames.split(/\s+/)[0]}` : name;
      return [id, { code: tcodes.get(name) ?? '', name, short }];
    }),
  );
  return { courses, teachers };
};

// "4.° A" for a section, with its level when asked
export const sectionName = (s: Section, withLevel = false): string => `${s.gradeShort ? `${s.gradeShort} ` : ''}${s.name}${withLevel ? ` · ${s.levelName}` : ''}`;

// Grades of the period in the order of their sections (level, then grade)
export const gradesOf = (sections: Section[]): Array<{ id: string; name: string; levelName: string; sections: Section[] }> => {
  const out = new Map<string, { id: string; name: string; levelName: string; sections: Section[] }>();
  for (const s of sections) {
    const key = s.gradeId || `section:${s.id}`;
    const g = out.get(key) ?? { id: key, name: s.gradeName || s.name, levelName: s.levelName, sections: [] };
    g.sections.push(s);
    out.set(key, g);
  }
  return [...out.values()];
};

// Every class of the period, one row each, for a spreadsheet
export const scheduleCsvRows = (data: PlannerData, days: Record<string, string>): Array<Array<string | number>> => {
  const bySection = new Map(data.sections.map((s) => [s.id, s]));
  return data.entries
    .slice()
    .sort((a, b) => a.sectionLabel.localeCompare(b.sectionLabel, 'es') || a.weekday - b.weekday || a.startsAt.localeCompare(b.startsAt))
    .map((e: ScheduleEntry) => {
      const s = bySection.get(e.sectionId);
      return [s?.levelName ?? '', s?.gradeName ?? '', s?.name ?? e.sectionLabel, days[String(e.weekday)] ?? String(e.weekday), e.startsAt, e.endsAt, e.subjectName, e.staffName, e.room || s?.room || ''];
    });
};

export const scheduleCsvColumns = ['Nivel', 'Grado', 'Sección', 'Día', 'Inicio', 'Fin', 'Curso', 'Docente', 'Aula'];
