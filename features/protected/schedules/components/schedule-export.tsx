'use client';

import { useMemo, useState, type JSX, type ReactNode } from 'react';
import { Download, Printer } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { SelectField } from '@/features/protected/academic/components/academic-ui';
import { shiftLabels, weekdayLabels, weekdayShort } from '@/features/protected/academic/data/academic-data';
import { downloadCsv } from '@/features/protected/reports/data/reports-data';
import { cn } from '@/lib/utils';
import { buildLegend, gradesOf, scheduleCsvColumns, scheduleCsvRows, sectionName, type ExportLegend } from '../data/schedule-export';
import type { PlannerData, ScheduleEntry, Section, TimeBlock } from '../types';
import { blocksFor, EmptyNote } from './week-grid';

type Mode = 'section' | 'grade' | 'teacher' | 'general';

const modes: Array<[Mode, string]> = [
  ['section', 'Por sección'],
  ['grade', 'Por grado'],
  ['teacher', 'Por docente'],
  ['general', 'General'],
];

// Hairline cell of the printed timetables
const cell = 'border border-black/70 px-[0.35em] py-[0.2em] align-middle';
const head = cn(cell, 'bg-[#e9e9e9] text-center font-bold');

// "11 de noviembre de 2026"
const today = (): string => new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

// Publicar: the timetables ready to print or save as PDF (by section, by grade, by teacher or the general one of the
// institution), each with its legend of course codes, teachers and hours, plus every class as a spreadsheet
export const ScheduleExport = ({ data }: { data: PlannerData }): JSX.Element => {
  const [mode, setMode] = useState<Mode>('section');
  const [target, setTarget] = useState('');
  const legend = useMemo(() => buildLegend(data), [data]);
  const days = data.context.settings?.weekDays ?? [1, 2, 3, 4, 5];
  // Only sections with classes placed are published (inicial plans, for one, carry no hours)
  const sections = useMemo(() => data.sections.filter((s) => data.entries.some((e) => e.sectionId === s.id)), [data]);
  const grades = useMemo(() => gradesOf(sections), [sections]);
  const teachers = useMemo(() => [...legend.teachers.entries()].sort((a, b) => a[1].name.localeCompare(b[1].name, 'es')), [legend]);
  const options =
    mode === 'section'
      ? sections.map((s) => ({ value: s.id, label: sectionName(s, true) }))
      : mode === 'grade'
        ? grades.map((g) => ({ value: g.id, label: `${g.name} · ${g.levelName}` }))
        : mode === 'teacher'
          ? teachers.map(([id, t]) => ({ value: id, label: t.name }))
          : [];
  const all = mode === 'section' ? 'Todas las secciones' : mode === 'grade' ? 'Todos los grados' : 'Todos los docentes';
  const year = data.period.name;
  const shared = { data, legend, days, year };

  if (data.entries.length === 0) return <EmptyNote>Todavía no hay clases ubicadas en este periodo.</EmptyNote>;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3 print:hidden">
        <div role="radiogroup" aria-label="Qué publicar" className="inline-flex rounded-lg bg-secondary p-0.5">
          {modes.map(([k, label]) => (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={mode === k}
              onClick={(): void => {
                setMode(k);
                setTarget('');
              }}
              className={cn('h-8 rounded-md px-3 text-sm font-medium', mode === k ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}
            >
              {label}
            </button>
          ))}
        </div>
        {mode !== 'general' && (
          <div className="w-72">
            <SelectField id="export-target" value={target} options={[{ value: '', label: all }, ...options]} onChange={setTarget} />
          </div>
        )}
        <div className="ml-auto flex gap-2">
          <button type="button" className="btn-alt" onClick={(): void => downloadCsv(`horarios-${data.period.name}`, scheduleCsvColumns, scheduleCsvRows(data, weekdayLabels))}>
            <MorphIcon icon={Download} size={16} />
            Excel (CSV)
          </button>
          <button type="button" className="btn-brand" onClick={(): void => window.print()}>
            <MorphIcon icon={Printer} size={16} />
            Imprimir o guardar PDF
          </button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground print:hidden">Vista previa de lo que se imprime: una hoja A4 horizontal por {mode === 'general' ? 'día y turno, más la leyenda' : mode === 'grade' ? 'grado' : mode === 'teacher' ? 'docente' : 'sección'}.</p>

      <div data-print-schedule className="font-document space-y-6 print:space-y-0">
        {/* Timetables print on A4 landscape; the rule only exists while this preview is on screen */}
        <style>{'@page { size: A4 landscape; margin: 8mm; }'}</style>
        {mode === 'section' && sections.filter((s) => !target || s.id === target).map((s) => <SectionSheet key={s.id} section={s} {...shared} />)}
        {mode === 'grade' && grades.filter((g) => !target || g.id === target).map((g) => <GradeSheet key={g.id} name={`${g.name} · ${g.levelName}`} sections={g.sections} {...shared} />)}
        {mode === 'teacher' && teachers.filter(([id]) => !target || id === target).map(([id]) => <TeacherSheet key={id} staffId={id} {...shared} />)}
        {mode === 'general' && <GeneralSheets {...shared} />}
      </div>
    </div>
  );
};

interface SheetProps {
  data: PlannerData;
  legend: ExportLegend;
  days: number[];
  year: string;
}

// One printed page: white paper with the institution, the title and what the page is about
const Paper = ({ title, subtitle, institution, children }: { title: string; subtitle: string; institution: string; children: ReactNode }): JSX.Element => (
  <section className="flex break-after-page flex-col gap-[0.8em] rounded-lg bg-white p-[1.6em] text-[15px] leading-tight text-black shadow-sm ring-1 ring-black/10 last:break-after-auto print:rounded-none print:p-0 print:text-[10pt] print:shadow-none print:ring-0">
    <header className="flex items-end justify-between gap-4 border-b-2 border-black pb-[0.4em]">
      <div>
        <p className="text-[0.9em] tracking-wide uppercase">{institution}</p>
        <h2 className="text-[1.9em] leading-none font-bold tracking-wide">{title}</h2>
      </div>
      <p className="text-right text-[1.15em] font-bold">{subtitle}</p>
    </header>
    {children}
    <p className="mt-auto text-right text-[0.8em]">Publicado el {today()} · joseph</p>
  </section>
);

// Course fill and code of an entry
const look = (legend: ExportLegend, e: ScheduleEntry): { code: string; fill: string } => legend.courses.get(e.subjectName) ?? { code: e.subjectName, fill: '#ffffff' };

// The week of one section or teacher: class hours down, days across; each class shows its code and a detail line
const WeekTable = ({ days, blocks, entries, legend, detail, compact }: { days: number[]; blocks: TimeBlock[]; entries: ScheduleEntry[]; legend: ExportLegend; detail: (e: ScheduleEntry) => string; compact?: boolean }): JSX.Element => {
  const at = new Map<string, ScheduleEntry>();
  for (const e of entries) at.set(`${e.weekday}|${e.startsAt}`, e);
  return (
    <table className="w-full table-fixed border-collapse text-center">
      <thead>
        <tr>
          <th scope="col" className={cn(head, compact ? 'w-[4.2em]' : 'w-[5.5em]')}>
            Hora
          </th>
          {days.map((d) => (
            <th key={d} scope="col" className={head}>
              {(compact ? weekdayShort : weekdayLabels)[String(d)].toUpperCase()}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {blocks.map((b) =>
          b.kind === 'break' ? (
            <tr key={b.id}>
              <th scope="row" className={cn(cell, 'text-[0.8em] font-normal')}>
                {b.startsAt}
              </th>
              <td colSpan={days.length} className={cn(cell, 'bg-[#f3f3f3] text-[0.85em] tracking-[0.5em]')}>
                RECREO
              </td>
            </tr>
          ) : (
            <tr key={b.id}>
              <th scope="row" className={cn(cell, 'text-[0.85em] font-normal whitespace-nowrap')}>
                {b.startsAt}
                <span className="block">{b.endsAt}</span>
              </th>
              {days.map((d) => {
                const e = at.get(`${d}|${b.startsAt}`);
                const l = e ? look(legend, e) : null;
                return (
                  <td key={d} className={cn(cell, compact ? 'h-[2.5em]' : 'h-[3.1em]')} style={l ? { background: l.fill } : undefined}>
                    {e && l && (
                      <>
                        <span className={cn('block font-bold', compact ? 'text-[1.05em]' : 'text-[1.35em]')}>{l.code}</span>
                        <span className="block truncate text-[0.8em]">{detail(e)}</span>
                      </>
                    )}
                  </td>
                );
              })}
            </tr>
          ),
        )}
      </tbody>
    </table>
  );
};

// A colour chip for the legends
const Swatch = ({ fill }: { fill: string }): JSX.Element => <span className="inline-block size-[0.9em] shrink-0 rounded-[2px] border border-black/40 align-middle" style={{ background: fill }} />;

// Legend rows of the courses in a set of classes: code, course, who teaches it and the weekly hours
const CourseLegend = ({ entries, legend, who, whoLabel = 'Docente' }: { entries: ScheduleEntry[]; legend: ExportLegend; who: (list: ScheduleEntry[]) => string; whoLabel?: string }): JSX.Element => {
  const byCourse = new Map<string, ScheduleEntry[]>();
  for (const e of entries) byCourse.set(e.subjectName, [...(byCourse.get(e.subjectName) ?? []), e]);
  const rows = [...byCourse.entries()].sort((a, b) => (legend.courses.get(a[0])?.code ?? '').localeCompare(legend.courses.get(b[0])?.code ?? ''));
  return (
    <table className="w-full border-collapse text-left">
      <caption className="pb-[0.3em] text-left font-bold">LEYENDA</caption>
      <thead>
        <tr>
          <th scope="col" className={cn(head, 'w-[5em]')}>
            Sigla
          </th>
          <th scope="col" className={head}>
            Curso
          </th>
          <th scope="col" className={head}>
            {whoLabel}
          </th>
          <th scope="col" className={cn(head, 'w-[5em]')}>
            Horas
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([name, list]) => {
          const l = legend.courses.get(name);
          return (
            <tr key={name}>
              <td className={cn(cell, 'font-bold whitespace-nowrap')}>
                <Swatch fill={l?.fill ?? '#fff'} /> {l?.code}
              </td>
              <td className={cell}>{name}</td>
              <td className={cell}>{who(list)}</td>
              <td className={cn(cell, 'text-center')}>{list.length}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

// Names of the teachers of a list of classes, without repeats
const teachersOf = (legend: ExportLegend, list: ScheduleEntry[]): string => [...new Set(list.map((e) => legend.teachers.get(e.staffId)?.name ?? e.staffName).filter(Boolean))].join(', ') || 'Sin asignar';

// Por sección: the section's week with the teacher under each course, and its legend
const SectionSheet = ({ section, data, legend, days, year }: SheetProps & { section: Section }): JSX.Element => {
  const entries = data.entries.filter((e) => e.sectionId === section.id);
  return (
    <Paper title={`HORARIO DE CLASES ${year.toUpperCase()}`} subtitle={`${section.gradeName || section.name} ${section.gradeName ? `«${section.name}»` : ''} · ${section.levelName}`} institution={data.context.institutionName}>
      <p className="text-[0.95em]">
        Turno {shiftLabels[section.shift]?.toLowerCase()} · Tutor(a): {section.tutorName || 'por asignar'}
        {section.room && ` · Aula: ${section.room}`} · {entries.length} horas semanales
      </p>
      <div className="grid grid-cols-[1.55fr_1fr] items-start gap-[1.2em]">
        <WeekTable days={days} blocks={blocksFor(data.blocks, [section.shift])} entries={entries} legend={legend} detail={(e): string => legend.teachers.get(e.staffId)?.short ?? ''} />
        <CourseLegend entries={entries} legend={legend} who={(list): string => teachersOf(legend, list)} />
      </div>
    </Paper>
  );
};

// Por grado: every section of the grade side by side (compact), and one legend with the teacher of each section
const GradeSheet = ({ name, sections, data, legend, days, year }: SheetProps & { name: string; sections: Section[] }): JSX.Element => {
  const entries = data.entries.filter((e) => sections.some((s) => s.id === e.sectionId));
  const label = new Map(sections.map((s) => [s.id, s.name]));
  return (
    <Paper title={`HORARIO DE CLASES ${year.toUpperCase()}`} subtitle={name} institution={data.context.institutionName}>
      <div className={cn('grid items-start gap-[1em]', sections.length === 1 ? 'grid-cols-[1.55fr_1fr]' : sections.length === 2 ? 'grid-cols-2' : 'grid-cols-3')}>
        {sections.map((s) => (
          <div key={s.id}>
            <p className="mb-[0.3em] font-bold">
              Sección {s.name} · {shiftLabels[s.shift]?.toLowerCase()} · tutor(a): {s.tutorName || 'por asignar'}
            </p>
            <WeekTable compact={sections.length > 1} days={days} blocks={blocksFor(data.blocks, [s.shift])} entries={entries.filter((e) => e.sectionId === s.id)} legend={legend} detail={(e): string => legend.teachers.get(e.staffId)?.short ?? ''} />
          </div>
        ))}
        {sections.length === 1 && <CourseLegend entries={entries} legend={legend} who={(list): string => teachersOf(legend, list)} />}
      </div>
      {sections.length > 1 && (
        <CourseLegend
          entries={entries}
          legend={legend}
          who={(list): string => {
            // One name when the same teacher has the course in every section; otherwise section by section
            const per = sections.map((s) => [label.get(s.id) ?? '', teachersOf(legend, list.filter((e) => e.sectionId === s.id))] as const).filter(([, t]) => t !== 'Sin asignar');
            return new Set(per.map(([, t]) => t)).size === 1 ? (per[0]?.[1] ?? '') : per.map(([n, t]) => `${n}: ${t}`).join(' · ');
          }}
        />
      )}
    </Paper>
  );
};

// Por docente: the teacher's week across shifts with the section of each class, the courses they teach and the total
const TeacherSheet = ({ staffId, data, legend, days, year }: SheetProps & { staffId: string }): JSX.Element => {
  const entries = data.entries.filter((e) => e.staffId === staffId);
  const teacher = legend.teachers.get(staffId);
  const bySection = new Map(data.sections.map((s) => [s.id, s]));
  const shifts = [...new Set(entries.map((e) => e.shift))];
  return (
    <Paper title={`HORARIO DEL DOCENTE ${year.toUpperCase()}`} subtitle={teacher?.name ?? ''} institution={data.context.institutionName}>
      <p className="text-[0.95em]">
        {entries.length} horas semanales · {new Set(entries.map((e) => e.sectionId)).size} secciones
      </p>
      <div className="grid grid-cols-[1.55fr_1fr] items-start gap-[1.2em]">
        <WeekTable
          days={days}
          blocks={blocksFor(data.blocks, shifts)}
          entries={entries}
          legend={legend}
          detail={(e): string => {
            const s = bySection.get(e.sectionId);
            return s ? sectionName(s, true) : e.sectionLabel;
          }}
        />
        <CourseLegend
          entries={entries}
          legend={legend}
          whoLabel="Secciones"
          who={(list): string =>
            // In the order of the period's sections (level, grade, name), not the order of the week
            data.sections
              .filter((s) => list.some((e) => e.sectionId === s.id))
              .map((s) => sectionName(s))
              .join(', ')
          }
        />
      </div>
    </Paper>
  );
};

// General: for each shift and day, every section in rows and the class hours across, with course and teacher codes;
// a last page carries the full legend of courses and teachers
const GeneralSheets = ({ data, legend, days, year }: SheetProps): JSX.Element => {
  const shifts = [...new Set(data.sections.map((s) => s.shift))];
  const at = new Map<string, ScheduleEntry>();
  for (const e of data.entries) at.set(`${e.sectionId}|${e.weekday}|${e.startsAt}`, e);
  const teacherRows = [...legend.teachers.values()].sort((a, b) => a.code.localeCompare(b.code));
  return (
    <>
      {shifts.flatMap((shift) => {
        const sections = data.sections.filter((s) => s.shift === shift && data.entries.some((e) => e.sectionId === s.id));
        const blocks = blocksFor(data.blocks, [shift]).filter((b) => b.kind !== 'break');
        if (sections.length === 0) return [];
        return days.map((d) => (
          <Paper key={`${shift}-${d}`} title={`HORARIO GENERAL ${year.toUpperCase()}`} subtitle={`${weekdayLabels[String(d)].toUpperCase()} · TURNO ${shiftLabels[shift]?.toUpperCase()}`} institution={data.context.institutionName}>
            <table className="w-full table-fixed border-collapse text-center">
              <thead>
                <tr>
                  <th scope="col" className={cn(head, 'w-[9em]')}>
                    Sección
                  </th>
                  {blocks.map((b) => (
                    <th key={b.id} scope="col" className={cn(head, 'text-[0.85em] font-normal')}>
                      <span className="font-bold">{b.startsAt}</span>
                      <span className="block">{b.endsAt}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sections.map((s) => (
                  <tr key={s.id}>
                    <th scope="row" className={cn(cell, 'text-left whitespace-nowrap')}>
                      {sectionName(s)} <span className="text-[0.8em] font-normal">{s.levelName}</span>
                    </th>
                    {blocks.map((b) => {
                      const e = at.get(`${s.id}|${d}|${b.startsAt}`);
                      const l = e ? look(legend, e) : null;
                      return (
                        <td key={b.id} className={cn(cell, 'h-[2.1em]')} style={l ? { background: l.fill } : undefined}>
                          {e && l && (
                            <>
                              <span className="font-bold">{l.code}</span> <span className="text-[0.8em]">{legend.teachers.get(e.staffId)?.code}</span>
                            </>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="flex flex-wrap gap-x-[1em] gap-y-[0.2em] text-[0.85em]">
              {[...legend.courses.entries()].map(([name, l]) => (
                <span key={name} className="whitespace-nowrap">
                  <Swatch fill={l.fill} /> <b>{l.code}</b> {name}
                </span>
              ))}
            </p>
          </Paper>
        ));
      })}
      <Paper title={`HORARIO GENERAL ${year.toUpperCase()}`} subtitle="LEYENDA" institution={data.context.institutionName}>
        <div className="grid grid-cols-2 items-start gap-[1.5em]">
          <table className="w-full border-collapse text-left">
            <caption className="pb-[0.3em] text-left font-bold">CURSOS</caption>
            <tbody>
              {[...legend.courses.entries()].map(([name, l]) => (
                <tr key={name}>
                  <td className={cn(cell, 'w-[5em] font-bold whitespace-nowrap')}>
                    <Swatch fill={l.fill} /> {l.code}
                  </td>
                  <td className={cell}>{name}</td>
                  <td className={cn(cell, 'w-[6em] text-center')}>{data.entries.filter((e) => e.subjectName === name).length} h</td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className="w-full border-collapse text-left">
            <caption className="pb-[0.3em] text-left font-bold">DOCENTES</caption>
            <tbody>
              {teacherRows.map((t) => (
                <tr key={t.code}>
                  <td className={cn(cell, 'w-[4em] font-bold')}>{t.code}</td>
                  <td className={cell}>{t.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Paper>
    </>
  );
};
