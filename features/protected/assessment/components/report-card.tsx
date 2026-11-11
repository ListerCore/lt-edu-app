import Image from 'next/image';
import type { JSX } from 'react';
import { cn } from '@/lib/utils';
import { formatAverage, roundGrade } from '../data/assessment-data';
import type { ReportCard } from '../types';
import { OfficialCard } from './official-card';

// The report card ("libreta" / "boleta de notas"): what the family receives, on screen and on paper. Educación
// Básica uses the official SIAGIE layout; institutes and academies keep a grades table under the same official header.
// logo: the institution's logo when the card itself does not carry it (a printed section sends it once)
export const ReportCardView = ({ card, logo }: { card: ReportCard; logo?: string }): JSX.Element => {
  const mark = card.logo || logo || '';
  if (card.scale === 'literal') return <OfficialCard card={card} logo={mark} />;
  const selected = card.terms.find((t) => t.id === card.termId) ?? card.terms[card.terms.length - 1];
  const passing = card.passingGrade;
  return (
    <article data-print-card className="report-card rounded-2xl border border-border bg-background p-6 md:p-8 print:rounded-none print:border-0 print:p-0">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-brand pb-4">
        <Image src="/escudo-peru.svg" alt="Escudo nacional del Perú" width={56} height={64} unoptimized className="h-16 w-auto shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-brand">{card.institution}</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">Boleta de notas</h2>
          <p className="text-sm text-muted-foreground">
            {card.periodName}
            {card.terms.length > 0 && selected?.id && ` · ${selected.name}`}
          </p>
        </div>
        {card.provisional && <span className="pill bg-warning/14 text-warning print:border print:border-current">Notas en curso</span>}
        {/* eslint-disable-next-line @next/next/no-img-element -- the institution's logo is a data URL stored with its settings */}
        {mark && <img src={mark} alt={`Logo de ${card.institution}`} className="h-16 w-16 shrink-0 object-contain" />}
      </header>
      {(card.dre || card.ugel || card.modularCode) && <p className="mt-2 text-xs text-muted-foreground">{[card.dre, card.ugel, card.modularCode && `Código modular ${card.modularCode}`].filter(Boolean).join(' · ')}</p>}

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

      <table className="mt-6 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs text-muted-foreground">
            <th scope="col" className="py-2 pr-3 font-medium">
              {card.kind === 'institute' ? 'Unidad didáctica' : 'Curso'}
            </th>
            <th scope="col" className="py-2 pr-3 font-medium">
              Evaluaciones
            </th>
            <th scope="col" className="w-24 py-2 text-center font-medium">
              Promedio
            </th>
            {passing !== undefined && (
              <th scope="col" className="w-28 py-2 text-center font-medium">
                Situación
              </th>
            )}
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
                <td className="py-2 pr-3 text-xs text-muted-foreground tabular-nums">{s.evaluations.map((e) => `${e.name}: ${e.score ?? '—'}`).join(' · ') || '—'}</td>
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

      <section className="mt-6 grid gap-4 break-inside-avoid sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Asistencia</h3>
          <table className="mt-2 w-full text-xs">
            <thead>
              <tr className="text-muted-foreground">
                <th scope="col" className="py-1 text-left font-medium">
                  {card.terms.length > 1 ? 'Periodo' : ''}
                </th>
                <th scope="col" className="py-1 text-right font-medium">
                  Tardanzas
                </th>
                <th scope="col" className="py-1 text-right font-medium">
                  Faltas
                </th>
                <th scope="col" className="py-1 text-right font-medium">
                  Justificadas
                </th>
              </tr>
            </thead>
            <tbody>
              {card.terms.map((t) => (
                <tr key={t.id || 'all'} className="border-t border-border">
                  <td className="py-1 text-foreground">{t.name}</td>
                  <td className="py-1 text-right tabular-nums">{t.attendance?.late ?? 0}</td>
                  <td className="py-1 text-right tabular-nums">{t.attendance?.absent ?? 0}</td>
                  <td className="py-1 text-right tabular-nums">{t.attendance?.justified ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="mt-10 hidden grid-cols-2 gap-10 text-center text-xs text-muted-foreground print:grid">
        <div className="border-t border-foreground pt-2">Coordinación académica</div>
        <div className="border-t border-foreground pt-2">Dirección</div>
      </footer>
    </article>
  );
};
