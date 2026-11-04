import Link from 'next/link';
import type { JSX } from 'react';
import { FileCheck2, Send } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { revealDelay } from '@/lib/reveal';
import { siteConfig } from '@/lib/site';
import { landingContent } from '../data/landing-data';

const { admission } = landingContent[siteConfig.institutionType];

// Admisión (full-height section of its navbar item): requirements and the call to action on one side, the numbered steps (a real sequence) on the other
export const LandingAdmissions = (): JSX.Element => (
  <section id="admissions" aria-labelledby="admissions-title" className="flex min-h-[calc(100svh-4rem)] scroll-mt-16 items-center bg-surface">
    <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-6 py-24 md:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
      <div>
        <h2 id="admissions-title" data-reveal="left" className="text-[clamp(2.25rem,4.5vw,3.5rem)] leading-tight font-semibold tracking-[-0.03em] text-balance text-foreground">
          Admisión
        </h2>
        <p data-reveal="left" style={revealDelay(90)} className="mt-4 max-w-md text-lg leading-8 text-muted-foreground">
          {admission.intro}
        </p>

        <h3 data-reveal="left" style={revealDelay(160)} className="mt-10 flex items-center gap-2 text-sm font-semibold text-foreground">
          <MorphIcon icon={FileCheck2} size={16} className="text-brand" />
          Requisitos
        </h3>
        <ul data-reveal="left" style={revealDelay(220)} className="mt-4 space-y-2.5 border-l-2 border-brand/30 pl-5">
          {admission.requirements.map((requirement): JSX.Element => (
            <li key={requirement} className="text-base leading-7 text-muted-foreground">
              {requirement}
            </li>
          ))}
        </ul>

        <Link href="/contact" data-reveal="left" style={revealDelay(280)} className="btn-brand mt-10 h-11 px-6">
          <MorphIcon icon={Send} size={16} />
          Solicitar información
        </Link>
      </div>

      <ol className="relative">
        {admission.steps.map(({ title, description }, index): JSX.Element => (
          <li key={title} data-reveal="right" style={revealDelay(200 + index * 160)} className="relative flex gap-5 pb-10 last:pb-0">
            {index < admission.steps.length - 1 && <span aria-hidden="true" data-reveal="line-y" style={revealDelay(400 + index * 160)} className="absolute top-11 bottom-1 left-[1.375rem] w-px bg-brand/40" />}
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-brand bg-background text-base font-semibold text-brand tabular-nums">{index + 1}</span>
            <div className="pt-2">
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-1 max-w-md text-base leading-7 text-muted-foreground">{description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </section>
);
