import type { PlannerData, Section } from '../types';

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

// Teachers with classes placed in the period, by name
export const teachersOf = (data: PlannerData): Array<{ id: string; name: string }> => {
  const byId = new Map(data.teachers.map((t) => [t.id, `${t.givenNames} ${t.surnames}`]));
  const out = new Map<string, string>();
  for (const e of data.entries) if (e.staffId && !out.has(e.staffId)) out.set(e.staffId, byId.get(e.staffId) ?? e.staffName);
  return [...out.entries()].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name, 'es'));
};
