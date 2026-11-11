import type { JSX } from 'react';
import { cn } from '@/lib/utils';
import { formatAverage, levelClass, levelLabels, levels, roundGrade } from '../data/assessment-data';
import type { CardCompetency, ReportCard } from '../types';

const LevelBox = ({ level }: { level?: string }): JSX.Element => (
  <span className={cn('inline-flex h-6 min-w-8 items-center justify-center rounded px-1.5 text-xs font-semibold print:border print:border-current', level ? levelClass[level] : 'text-muted-foreground')}>{level || '—'}</span>
);

const CompetencyRows = ({ items, card }: { items: CardCompetency[]; card: ReportCard }): JSX.Element => (
  <>
    {items.map((c) => (
      <tr key={c.id} className="align-top">
        <td className="py-2 pr-3 text-[13px] leading-5 text-foreground">
          {c.name}
          {c.conclusion && <span className="mt-1 block text-xs text-muted-foreground sm:hidden print:hidden">{c.conclusion}</span>}
        </td>
        {card.terms.map((t) => (
          <td key={t.id} className="px-1 py-2 text-center">
            <LevelBox level={c.levels[t.id]} />
          </td>
        ))}
        <td className="hidden py-2 pl-3 text-xs leading-5 text-pretty text-muted-foreground sm:table-cell print:table-cell">{c.conclusion}</td>
      </tr>
    ))}
  </>
);

const termShort = (name: string): string => name.split(' ')[0];

// The report card ("libreta" / "boleta de notas"): what the family receives, on screen and on paper
export const ReportCardView = ({ card }: { card: ReportCard }): JSX.Element => {
  const literal = card.scale === 'literal';
  const selected = card.terms.find((t) => t.id === card.termId) ?? card.terms[card.terms.length - 1];
  const passing = card.passingGrade;
  return (
    <article data-print-card className="report-card rounded-2xl border border-border bg-background p-6 md:p-8 print:rounded-none print:border-0 print:p-0">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-brand pb-4">
        <div>
          <p className="text-sm font-semibold text-brand">{card.institution}</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">{literal ? 'Informe de progreso del aprendizaje' : 'Boleta de notas'}</h2>
          <p className="text-sm text-muted-foreground">
            {card.periodName}
            {card.terms.length > 0 && selected?.id && ` · ${selected.name}`}
          </p>
        </div>
        {card.provisional && <span className="pill bg-warning/14 text-warning print:border print:border-current">{literal ? 'Periodo en curso: no es definitivo' : 'Notas en curso'}</span>}
      </header>

      <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        <div className="flex gap-2">
          <dt className="text-muted-foreground">Estudiante</dt>
          <dd className="font-semibold text-foreground">{card.student?.name}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-muted-foreground">Código</dt>
          <dd className="text-foreground tabular-nums">
            {card.student?.code}
            {card.student?.document && ` · DNI ${card.student.document}`}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-muted-foreground">Sección</dt>
          <dd className="text-foreground">
            {card.sectionLabel} · {card.levelName}
          </dd>
        </div>
        {card.tutorName && (
          <div className="flex gap-2">
            <dt className="text-muted-foreground">Tutor(a)</dt>
            <dd className="text-foreground">{card.tutorName}</dd>
          </div>
        )}
      </dl>

      {literal ? (
        <div className="mt-6 space-y-5">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th scope="col" className="py-2 pr-3 font-medium">Área y competencias</th>
                {card.terms.map((t) => (
                  <th key={t.id} scope="col" className="w-12 px-1 py-2 text-center font-medium" title={t.name}>
                    {termShort(t.name)}
                  </th>
                ))}
                <th scope="col" className="hidden w-2/5 py-2 pl-3 font-medium sm:table-cell print:table-cell">Conclusión descriptiva{selected?.name ? ` (${selected.name})` : ''}</th>
              </tr>
            </thead>
            {card.subjects.map((s) => (
              <tbody key={s.id} className="border-b border-border break-inside-avoid">
                <tr>
                  <th colSpan={card.terms.length + 2} scope="rowgroup" className="pt-3 pb-1 text-left text-sm font-semibold text-foreground">
                    {s.name}
                    {s.teacherName && <span className="ml-2 text-xs font-normal text-muted-foreground">{s.teacherName}</span>}
                  </th>
                </tr>
                <CompetencyRows items={s.competencies} card={card} />
              </tbody>
            ))}
            {card.transversal.length > 0 && (
              <tbody className="border-b border-border break-inside-avoid">
                <tr>
                  <th colSpan={card.terms.length + 2} scope="rowgroup" className="pt-3 pb-1 text-left text-sm font-semibold text-foreground">
                    Competencias transversales
                  </th>
                </tr>
                <CompetencyRows items={card.transversal} card={card} />
              </tbody>
            )}
          </table>
          <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {levels.map((l) => (
              <span key={l}>
                <span className="font-semibold text-foreground">{l}</span> {levelLabels[l].toLowerCase()}
              </span>
            ))}
          </p>
        </div>
      ) : (
        <table className="mt-6 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th scope="col" className="py-2 pr-3 font-medium">{card.kind === 'institute' ? 'Unidad didáctica' : 'Curso'}</th>
              <th scope="col" className="py-2 pr-3 font-medium">Evaluaciones</th>
              <th scope="col" className="w-24 py-2 text-center font-medium">Promedio</th>
              {passing !== undefined && <th scope="col" className="w-28 py-2 text-center font-medium">Situación</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {card.subjects.map((s) => {
              const avg = s.averages[selected?.id ?? ''];
              const has = avg !== undefined;
              const pass = has && passing !== undefined && roundGrade(avg) >= passing;
              return (
                <tr key={s.id} className="align-top break-inside-avoid">
                  <td className="py-2 pr-3">
                    <span className="block font-medium text-foreground">{s.name}</span>
                    {s.teacherName && <span className="block text-xs text-muted-foreground">{s.teacherName}</span>}
                  </td>
                  <td className="py-2 pr-3 text-xs text-muted-foreground tabular-nums">
                    {s.evaluations.map((e) => `${e.name}: ${e.score ?? '—'}`).join(' · ') || '—'}
                  </td>
                  <td className={cn('py-2 text-center text-base font-semibold tabular-nums', has && passing !== undefined && !pass ? 'text-destructive' : 'text-foreground')}>
                    {has ? (passing !== undefined ? roundGrade(avg) : formatAverage(avg)) : '—'}
                    {has && passing !== undefined && <span className="block text-[11px] font-normal text-muted-foreground">{formatAverage(avg)}</span>}
                  </td>
                  {passing !== undefined && <td className={cn('py-2 text-center text-xs font-medium', !has ? 'text-muted-foreground' : pass ? 'text-success' : 'text-destructive')}>{!has ? 'Sin notas' : pass ? 'Aprobado' : card.provisional ? 'En riesgo' : 'Desaprobado'}</td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <section className="mt-6 grid gap-4 break-inside-avoid sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Asistencia</h3>
          <table className="mt-2 w-full text-xs">
            <thead>
              <tr className="text-muted-foreground">
                <th scope="col" className="py-1 text-left font-medium">{card.terms.length > 1 ? 'Periodo' : ''}</th>
                <th scope="col" className="py-1 text-right font-medium">Tardanzas</th>
                <th scope="col" className="py-1 text-right font-medium">Faltas</th>
                <th scope="col" className="py-1 text-right font-medium">Justificadas</th>
                {literal && card.terms.some((t) => t.conduct !== undefined) && <th scope="col" className="py-1 text-right font-medium">Conducta</th>}
              </tr>
            </thead>
            <tbody>
              {card.terms.map((t) => (
                <tr key={t.id || 'all'} className="border-t border-border">
                  <td className="py-1 text-foreground">{t.name}</td>
                  <td className="py-1 text-right tabular-nums">{t.attendance?.late ?? 0}</td>
                  <td className="py-1 text-right tabular-nums">{t.attendance?.absent ?? 0}</td>
                  <td className="py-1 text-right tabular-nums">{t.attendance?.justified ?? 0}</td>
                  {literal && card.terms.some((x) => x.conduct !== undefined) && <td className="py-1 text-right font-semibold tabular-nums">{t.conduct ?? '—'}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {literal && (
          <div>
            <h3 className="text-sm font-semibold text-foreground">Comentario del tutor(a)</h3>
            <p className="mt-2 text-sm leading-6 text-pretty text-foreground">{card.tutorComment || <span className="text-muted-foreground">Sin comentario en este periodo.</span>}</p>
          </div>
        )}
      </section>

      <footer className="mt-10 hidden grid-cols-2 gap-10 text-center text-xs text-muted-foreground print:grid">
        <div className="border-t border-foreground pt-2">{literal ? 'Tutor(a)' : 'Coordinación académica'}</div>
        <div className="border-t border-foreground pt-2">Dirección</div>
      </footer>
    </article>
  );
};
