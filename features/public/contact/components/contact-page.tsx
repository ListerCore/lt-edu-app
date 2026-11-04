import Link from 'next/link';
import type { JSX } from 'react';
import { ArrowUpRight, ChevronRight, MapPin } from 'lucide';
import { OfficeMap } from './office-map';
import { MorphIcon } from '@/components/ui/morph-icon';
import { siteConfig } from '@/lib/site';
import { contactAssurances, contactChannels } from '../data/contact-data';
import { ContactRequestForm } from './contact-request-form';

// /contact: reassurances beside the inquiry form, then direct inboxes beside the campus map
export const ContactPage = (): JSX.Element => (
  <>
    <section aria-labelledby="contact-title">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 pt-10 pb-20 md:px-8 md:pt-14 md:pb-28 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <nav aria-label="Ruta">
            <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="transition-colors hover:text-brand">
                  Inicio
                </Link>
              </li>
              <li aria-current="page" className="flex items-center gap-1.5 font-medium text-foreground">
                <MorphIcon icon={ChevronRight} size={14} />
                Contacto
              </li>
            </ol>
          </nav>

          <h1 id="contact-title" className="mt-6 text-[clamp(2.25rem,4.5vw,3.25rem)] leading-[1.08] font-semibold tracking-tight text-balance text-foreground">
            ¿Tienes una consulta? <span className="text-gradient">Te orientamos.</span>
          </h1>
          <p className="mt-5 max-w-md text-lg leading-8 text-foreground/85">Admisión, matrícula, pensiones, certificados o el acceso a tu cuenta: escríbenos y secretaría te responde.</p>

          <ul className="mt-8 space-y-3">
            {contactAssurances.map(
              ({ icon, title, description }): JSX.Element => (
                <li key={title} className="flex gap-4 rounded-xl border border-border bg-surface p-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-brand-soft text-brand">
                    <MorphIcon icon={icon} size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{title}</p>
                    <p className="mt-0.5 text-sm leading-6 text-muted-foreground">{description}</p>
                  </div>
                </li>
              ),
            )}
          </ul>
        </div>

        <div className="self-start overflow-hidden rounded-2xl border border-border bg-background shadow-[0_24px_64px_-32px_rgb(0_0_0/0.3)] lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface px-6 py-3 md:px-8">
            <span className="font-mono text-xs text-muted-foreground">Formulario · informes</span>
            <span className="pill bg-success/12 text-success">
              <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
              Respuesta en un día hábil
            </span>
          </div>
          <ContactRequestForm />
        </div>
      </div>
    </section>

    <section aria-labelledby="contact-location-title" className="bg-muted">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-20 md:px-8 md:py-28 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col lg:col-span-5">
          <h2 id="contact-location-title" className="text-3xl leading-tight font-bold tracking-tight text-balance text-foreground md:text-[2.5rem] md:leading-[1.15]">
            Escríbenos directo <span className="text-gradient">o visítanos.</span>
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">Cada bandeja llega al equipo que corresponde, así tu mensaje no espera en una cola general.</p>

          <ul className="mt-8 divide-y divide-border rounded-2xl border border-border bg-background">
            {contactChannels.map(
              ({ icon, label, description, email }): JSX.Element => (
                <li key={label}>
                  <a href={`mailto:${email}`} className="group flex items-start gap-4 p-5 transition-colors hover:bg-surface">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-accent text-foreground transition-colors group-hover:bg-brand-soft group-hover:text-brand">
                      <MorphIcon icon={icon} size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-foreground">{label}</span>
                      <span className="block text-xs text-muted-foreground">{description}</span>
                      <span className="mt-1.5 inline-block text-sm text-foreground transition-colors group-hover:text-brand">
                        <span className="link-underline break-all">{email}</span>
                      </span>
                    </span>
                  </a>
                </li>
              ),
            )}
          </ul>

          <a href={siteConfig.office.mapsUrl} target="_blank" rel="noopener noreferrer" className="group mt-6 inline-flex items-center gap-2 self-start text-sm font-medium text-foreground transition-colors hover:text-brand">
            <MorphIcon icon={MapPin} size={16} className="text-brand" />
            <span className="link-underline">{siteConfig.office.city} · Abrir en Google Maps</span>
            <MorphIcon icon={ArrowUpRight} size={14} />
          </a>
        </div>

        <div className="lg:col-span-7">
          <OfficeMap zoom={16} className="h-80 bg-background md:h-112 lg:h-full lg:min-h-112" />
        </div>
      </div>
    </section>
  </>
);
