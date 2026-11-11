import type { JSX } from 'react';
import { revealDelay } from '@/lib/reveal';
import { institutionVocabulary } from '../data/landing-data';

// Instituciones: the same panel names levels, periods and courses the way each kind of institution does
export const LandingInstitutions = (): JSX.Element => (
  <section id="institutions" aria-labelledby="institutions-title" className="scroll-mt-16 border-t border-border bg-surface">
    <div className="mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-32">
      <div className="max-w-2xl">
        <h2 id="institutions-title" data-reveal className="text-[clamp(2.1rem,4.2vw,3.25rem)] leading-tight font-semibold tracking-[-0.03em] text-balance text-foreground">
          Habla el idioma de tu institución
        </h2>
        <p data-reveal style={revealDelay(90)} className="mt-4 text-lg leading-8 text-muted-foreground">
          Un CEBA no tiene bimestres y un instituto no tiene grados. El panel usa los nombres y la estructura propios de cada modalidad.
        </p>
      </div>

      {/* Phones: one block per institution; wider screens compare them side by side in a table */}
      <ul data-reveal style={revealDelay(160)} className="mt-12 divide-y divide-border rounded-2xl border border-border bg-background md:hidden">
        {institutionVocabulary.map(({ type, name, levels, periods, courses }): JSX.Element => (
          <li key={type} className="p-5">
            <p className="flex items-center gap-3">
              <span className="inline-flex h-7 min-w-14 items-center justify-center rounded-md bg-brand-solid px-2 text-xs font-semibold text-white">{type}</span>
              <span className="font-medium text-foreground">{name}</span>
            </p>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
              <dt className="text-muted-foreground">Organiza en</dt>
              <dd className="text-foreground">{levels}</dd>
              <dt className="text-muted-foreground">Periodos</dt>
              <dd className="text-foreground">{periods}</dd>
              <dt className="text-muted-foreground">Evalúa por</dt>
              <dd className="text-foreground">{courses}</dd>
            </dl>
          </li>
        ))}
      </ul>

      <div data-reveal style={revealDelay(160)} className="mt-14 hidden overflow-x-auto rounded-2xl border border-border bg-background md:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Cómo nombra el panel la estructura académica en cada tipo de institución</caption>
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th scope="col" className="px-6 py-4 font-medium">Institución</th>
              <th scope="col" className="px-6 py-4 font-medium">Organiza a sus estudiantes en</th>
              <th scope="col" className="px-6 py-4 font-medium">Periodos</th>
              <th scope="col" className="px-6 py-4 font-medium">Evalúa por</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {institutionVocabulary.map(({ type, name, levels, periods, courses }): JSX.Element => (
              <tr key={type}>
                <th scope="row" className="px-6 py-5 font-normal">
                  <span className="flex items-center gap-3">
                    <span className="inline-flex h-7 min-w-14 items-center justify-center rounded-md bg-brand-solid px-2 text-xs font-semibold text-white">{type}</span>
                    <span className="font-medium text-foreground">{name}</span>
                  </span>
                </th>
                <td className="px-6 py-5 text-muted-foreground">{levels}</td>
                <td className="px-6 py-5 text-foreground">{periods}</td>
                <td className="px-6 py-5 text-muted-foreground">{courses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);
