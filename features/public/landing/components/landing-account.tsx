import Link from 'next/link';
import type { JSX } from 'react';
import { Check, LogIn } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { revealDelay } from '@/lib/reveal';
import { accountAudiences } from '../data/landing-data';

// What each person finds in their account, in three columns split by rules instead of cards
export const LandingAccount = (): JSX.Element => (
  <section aria-labelledby="account-title" className="border-t border-border">
    <div className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
      <div data-reveal className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-xl">
          <h2 id="account-title" className="text-[clamp(1.9rem,3.6vw,2.75rem)] leading-tight font-semibold tracking-[-0.025em] text-balance text-foreground">
            El día a día, en tu cuenta
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">Cada persona ve lo que le corresponde con el correo que registró en secretaría.</p>
        </div>
        <Link href="/auth/signin" className="btn-alt h-11 px-6">
          <MorphIcon icon={LogIn} size={16} />
          Ingresar
        </Link>
      </div>

      <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-border">
        {accountAudiences.map(({ title, items }, index): JSX.Element => (
          <div key={title} data-reveal style={revealDelay(120 + index * 120)} className="md:px-8 md:first:pl-0 md:last:pr-0">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <ul className="mt-5 space-y-3">
              {items.map((item): JSX.Element => (
                <li key={item} className="flex items-start gap-3 text-base leading-6 text-muted-foreground">
                  <MorphIcon icon={Check} size={16} strokeWidth={2.5} className="mt-1 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);
