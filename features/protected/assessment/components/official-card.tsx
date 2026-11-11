import Image from 'next/image';
import type { JSX, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { CardCompetency, CardSubject, ReportCard } from '../types';

// Printed lines that fit on the front under the header (A4 landscape, Agency FB 7.4 pt); the remaining areas go to the back
const FRONT_LINES = 34;
// Characters of a competency that fit on one line of its column
const LINE_CHARS = 58;

// Lines a competency takes on paper, from the length of its name
const linesOf = (c: CardCompetency): number => Math.max(1, Math.ceil(c.name.length / LINE_CHARS));

// What each level means, as printed on the SIAGIE report (Currículo Nacional de la Educación Básica)
const scaleRows: Array<[string, string, string]> = [
  ['AD', 'Logro destacado', 'Cuando el estudiante evidencia un nivel superior a lo esperado respecto a la competencia. Esto quiere decir que demuestra aprendizajes que van más allá del nivel esperado.'],
  ['A', 'Logro esperado', 'Cuando el estudiante evidencia el nivel esperado respecto a la competencia, demostrando manejo satisfactorio en todas las tareas propuestas y en el tiempo programado.'],
  ['B', 'En proceso', 'Cuando el estudiante está próximo o cerca al nivel esperado respecto a la competencia, para lo cual requiere acompañamiento durante un tiempo razonable para lograrlo.'],
  ['C', 'En inicio', 'Cuando el estudiante muestra un progreso mínimo en una competencia de acuerdo al nivel esperado. Evidencia con frecuencia dificultades en el desarrollo de las tareas, por lo que necesita mayor tiempo de acompañamiento e intervención del docente.'],
];

// "martes, 11 de noviembre de 2026"
const longDate = (iso: string): string =>
  /^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Intl.DateTimeFormat('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`)) : iso;

// Hairline cell of the official grid
const cell = 'border border-black px-[0.4em] py-[0.25em] align-middle';
const head = cn(cell, 'bg-[#e8e8e8] text-center font-bold leading-tight');

// One label/value pair of the header grid
const Field = ({ label, value, span }: { label: string; value?: ReactNode; span?: boolean }): JSX.Element => (
  <>
    <td className={cn(cell, 'w-[24%] text-[0.92em]')}>{label}</td>
    <td className={cn(cell, 'font-medium')} colSpan={span ? 3 : 1}>
      {value || ' '}
    </td>
  </>
);

// The header grid of the front: regional office, UGEL, level, modular code, institution, grade, section, student, tutor
const HeaderGrid = ({ card }: { card: ReportCard }): JSX.Element => (
  <table className="w-full border-collapse text-[0.95em]">
    <tbody>
      <tr>
        <Field label="DRE / GRE:" value={card.dre} />
        <Field label="UGEL:" value={card.ugel} />
      </tr>
      <tr>
        <Field label="Nivel:" value={card.levelName.toUpperCase()} />
        <Field label="Código modular:" value={card.modularCode} />
      </tr>
      <tr>
        <Field label="Institución educativa:" value={card.institution} span />
      </tr>
      <tr>
        <Field label="Grado:" value={card.gradeName} />
        <Field label="Sección:" value={card.sectionName} />
      </tr>
      <tr>
        <Field label="Apellidos y nombres del estudiante:" value={card.student?.name} span />
      </tr>
      <tr>
        <Field label="Código del estudiante:" value={card.student?.code} />
        <Field label="DNI:" value={card.student?.document} />
      </tr>
      <tr>
        <Field label="Apellidos y nombres del docente o tutor:" value={card.tutorName} span />
      </tr>
    </tbody>
  </table>
);

// The competencies grid: one block of rows per area, with a level per term, the annual level of each competency,
// the annual level of the area and the final descriptive conclusion
const CompetencyGrid = ({ card, subjects, transversal, termIds }: { card: ReportCard; subjects: CardSubject[]; transversal: CardCompetency[]; termIds: string[] }): JSX.Element => {
  const last = card.terms[card.terms.length - 1]?.id ?? '';
  // Annual columns only once the last term of the period is the one on the card
  const annual = (c: CardCompetency): string => (card.final ? (c.levels[last] ?? '') : '');
  const finalConclusion = (items: CardCompetency[]): string => (card.final ? items.map((c) => c.conclusions[last]).filter(Boolean).join(' ') : '');
  const block = (key: string, name: string, items: CardCompetency[], shadedArea: boolean): JSX.Element => (
    <tbody key={key} className="break-inside-avoid">
      {items.map((c, i) => (
        <tr key={c.id}>
          {i === 0 && (
            <th scope="rowgroup" rowSpan={items.length} className={cn(cell, 'text-center font-bold leading-tight')}>
              {name}
            </th>
          )}
          <td className={cn(cell, 'text-[0.92em] leading-tight')}>{c.name}</td>
          {termIds.map((t, j) => (
            <td key={t || j} className={cn(cell, 'text-center font-bold')}>
              {t ? (c.levels[t] ?? '') : ''}
            </td>
          ))}
          <td className={cn(cell, 'text-center font-bold')}>{annual(c)}</td>
          {i === 0 && (
            <>
              <td rowSpan={items.length} className={cn(cell, 'text-center font-bold', shadedArea && 'bg-[#bdbdbd]')} />
              <td rowSpan={items.length} className={cn(cell, 'align-top text-[0.85em] leading-tight')}>
                {finalConclusion(items)}
              </td>
            </>
          )}
        </tr>
      ))}
    </tbody>
  );
  return (
    <table className="w-full table-fixed border-collapse">
      {/* Fixed widths like the official form: the competency text gets the most room */}
      <colgroup>
        <col className="w-[14%]" />
        <col />
        {termIds.map((_, i) => (
          <col key={i} className="w-[4.5%]" />
        ))}
        <col className="w-[6%]" />
        <col className="w-[6%]" />
        <col className="w-[19%]" />
      </colgroup>
      <thead>
        <tr>
          <th scope="col" rowSpan={2} className={head}>
            ÁREA CURRICULAR
          </th>
          <th scope="col" rowSpan={2} className={head}>
            COMPETENCIAS
          </th>
          <th scope="colgroup" colSpan={termIds.length} className={head}>
            CALIFICATIVO POR PERIODO
          </th>
          <th scope="col" rowSpan={2} className={cn(head, 'text-[0.8em]')}>
            Calif. anual de comp.
          </th>
          <th scope="col" rowSpan={2} className={cn(head, 'text-[0.8em]')}>
            Calif. anual de área
          </th>
          <th scope="col" rowSpan={2} className={cn(head, 'text-[0.9em]')}>
            Conclusión descriptiva de final del periodo lectivo
          </th>
        </tr>
        <tr>
          {termIds.map((_, i) => (
            <th key={i} scope="col" className={head}>
              {i + 1}
            </th>
          ))}
        </tr>
      </thead>
      {subjects.map((s) => block(s.id, s.name, s.competencies, false))}
      {transversal.length > 0 && block('transversal', 'Competencias transversales', transversal, true)}
    </table>
  );
};

// A sheet of the report: white paper with black lines, whatever the app theme
const Sheet = ({ children, label }: { children: ReactNode; label: string }): JSX.Element => (
  <section aria-label={label} className="flex flex-col gap-[1em] rounded-lg bg-white p-[1.4em] text-black shadow-sm ring-1 ring-black/10 print:rounded-none print:p-0 print:shadow-none print:ring-0">
    {children}
  </section>
);

// The report card of Educación Básica in the SIAGIE layout ("Informe de progreso del estudiante"): an A4 landscape
// sheet with the front (header, national coat of arms, institution logo and the first areas) and the back (the rest
// of the areas, transversal competencies, conclusions, attendance, the CNEB scale and the signatures)
export const OfficialCard = ({ card, logo }: { card: ReportCard; logo: string }): JSX.Element => {
  const year = card.periodName.match(/\d{4}/)?.[0] ?? card.periodName;
  const count = Math.max(card.termCount, card.terms.length, 1);
  // A column per term of the period: the shown ones by id, the later ones empty
  const termIds = Array.from({ length: count }, (_, i) => card.terms[i]?.id ?? '');
  const front: CardSubject[] = [];
  const back: CardSubject[] = [];
  // Areas fill the front in order until it is full; an area is never split between both faces
  let lines = 0;
  for (const s of card.subjects) {
    lines += s.competencies.reduce((n, c) => n + linesOf(c), 0);
    (back.length === 0 && (lines <= FRONT_LINES || front.length === 0) ? front : back).push(s);
  }
  const selected = card.terms.find((t) => t.id === card.termId);
  const conclusions = selected
    ? [...card.subjects.flatMap((s) => s.competencies), ...card.transversal].filter((c) => c.conclusions[selected.id]).map((c) => ({ id: c.id, name: c.name, text: c.conclusions[selected.id] ?? '' }))
    : [];
  const conduct = card.terms.some((t) => t.conduct !== undefined);
  const termRows = Array.from({ length: count }, (_, i) => card.terms[i]);

  return (
    <article data-print-card className="report-card siagie grid gap-6 print:grid-cols-2 print:gap-[8mm]">
      {/* The report card prints on A4 landscape; the rule lives here so it only applies while a card is on screen */}
      <style>{'@page { size: A4 landscape; margin: 8mm; }'}</style>
      <Sheet label="Cara frontal">
        <h2 className="text-center text-[1.45em] font-bold tracking-wide">INFORME DE PROGRESO DEL ESTUDIANTE – {year}</h2>
        {card.provisional && <p className="-mt-[0.6em] text-center text-[0.9em] italic">Documento provisional: el periodo de evaluación aún está en curso.</p>}
        <div className="flex items-center gap-[1em]">
          <Image src="/escudo-peru.svg" alt="Escudo nacional del Perú" width={84} height={96} unoptimized className="h-[6.2em] w-auto shrink-0" />
          <div className="min-w-0 flex-1">
            <HeaderGrid card={card} />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element -- the institution's logo is a data URL stored with its settings */}
          {logo ? <img src={logo} alt={`Logo de ${card.institution}`} className="h-[6.2em] w-[5.6em] shrink-0 object-contain" /> : <span className="w-[5.6em] shrink-0" />}
        </div>
        <CompetencyGrid card={card} subjects={front} transversal={back.length === 0 ? card.transversal : []} termIds={termIds} />
      </Sheet>

      <Sheet label="Cara posterior">
        {back.length > 0 && <CompetencyGrid card={card} subjects={back} transversal={card.transversal} termIds={termIds} />}

        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th scope="col" className={cn(head, 'w-[12%]')}>
                Periodo
              </th>
              <th scope="col" className={cn(head, 'w-[34%]')}>
                Competencia
              </th>
              <th scope="col" className={head}>
                Conclusión descriptiva
              </th>
            </tr>
          </thead>
          <tbody>
            {conclusions.length === 0 ? (
              <tr>
                <td className={cn(cell, 'h-[1.6em]')} />
                <td className={cell} />
                <td className={cell} />
              </tr>
            ) : (
              conclusions.map((c, i) => (
                <tr key={c.id}>
                  {i === 0 && (
                    <td rowSpan={conclusions.length} className={cn(cell, 'text-center font-bold')}>
                      {card.terms.findIndex((t) => t.id === card.termId) + 1}
                    </td>
                  )}
                  <td className={cn(cell, 'text-[0.9em] leading-tight')}>{c.name}</td>
                  <td className={cn(cell, 'text-[0.9em] leading-tight')}>{c.text}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th scope="col" className={cn(head, 'w-[12%]')}>
                Periodo
              </th>
              <th scope="col" className={head}>
                Conclusión descriptiva por periodo
              </th>
            </tr>
          </thead>
          <tbody>
            {termRows.map((t, i) => (
              <tr key={i}>
                <td className={cn(cell, 'text-center font-bold')}>{i + 1}</td>
                <td className={cn(cell, 'h-[2.2em] text-[0.9em] leading-tight')}>{t?.comment ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="grid grid-cols-[1.1fr_1fr] items-start gap-[1.5em]">
          <div>
            <p className="mb-[0.5em] text-center font-bold">Resumen de asistencia del estudiante</p>
            <table className="w-full border-collapse text-center">
              <thead>
                <tr>
                  <th scope="col" rowSpan={2} className={head}>
                    Periodo
                  </th>
                  <th scope="colgroup" colSpan={2} className={head}>
                    Inasistencias
                  </th>
                  <th scope="colgroup" colSpan={2} className={head}>
                    Tardanzas
                  </th>
                  {conduct && (
                    <th scope="col" rowSpan={2} className={head}>
                      Conducta
                    </th>
                  )}
                </tr>
                <tr>
                  <th scope="col" className={cn(head, 'text-[0.85em]')}>
                    Justificadas
                  </th>
                  <th scope="col" className={cn(head, 'text-[0.85em]')}>
                    Injustificadas
                  </th>
                  <th scope="col" className={cn(head, 'text-[0.85em]')}>
                    Justificadas
                  </th>
                  <th scope="col" className={cn(head, 'text-[0.85em]')}>
                    Injustificadas
                  </th>
                </tr>
              </thead>
              <tbody>
                {termRows.map((t, i) => (
                  <tr key={i}>
                    <td className={cn(cell, 'font-bold')}>{i + 1}</td>
                    <td className={cell}>{t ? (t.attendance?.justified ?? 0) : ''}</td>
                    <td className={cell}>{t ? (t.attendance?.absent ?? 0) : ''}</td>
                    {/* Approved justifications turn a late arrival into a justified absence, so no late stays justified */}
                    <td className={cell}>{t ? 0 : ''}</td>
                    <td className={cell}>{t ? (t.attendance?.late ?? 0) : ''}</td>
                    {conduct && <td className={cn(cell, 'font-bold')}>{t?.conduct ?? ''}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <p className="mb-[0.5em] text-center font-bold">ESCALA DE CALIFICACIONES DEL CNEB</p>
            <table className="w-full border-collapse border-2 border-black">
              <tbody>
                {scaleRows.map(([code, name, text]) => (
                  <tr key={code}>
                    <th scope="row" className={cn(cell, 'w-[2.4em] text-center text-[1.1em] font-bold')}>
                      {code}
                    </th>
                    <td className={cn(cell, 'text-[0.78em] leading-tight')}>
                      <span className="block font-medium">{name}</span>
                      {text}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-[3em] pt-[2.6em] text-center text-[1.15em]">
          <p className="border-t border-black pt-[0.3em]">Firma y sello del docente o tutor(a)</p>
          <p className="border-t border-black pt-[0.3em]">Firma y sello del director(a)</p>
        </div>
        <p className="text-right text-[0.85em] leading-tight">
          Emitido: {longDate(card.issuedOn)}
          <br />
          Generado con joseph
        </p>
      </Sheet>
    </article>
  );
};
