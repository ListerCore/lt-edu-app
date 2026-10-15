'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { JSX } from 'react';
import { ArrowRight, Bell, ChevronRight, Clock3, Download, FileText, House, Megaphone, Play, ShieldCheck, Sparkles, UsersRound, Video } from 'lucide-react';
import { EmptyResults, HelpOnboardingSection, HelpSupportSection } from './help-static-sections';
import { HelpHero } from './help-hero';
import { Card, CardContent } from '@/components/ui/card';
import { useHelpCenter } from '../hooks/use-help-center';
import type { HelpCenterTab, HelpTopic } from '../types';

const tabs: Array<{ id: HelpCenterTab; label: string }> = [
  { id: 'all', label: 'Todo' },
  { id: 'announcements', label: 'Anuncios' },
  { id: 'videos', label: 'Videos tutoriales' },
  { id: 'guides', label: 'Guías PDF' },
];

const topics: HelpTopic[] = ['Todos los videos', 'Primeros pasos', 'Aula virtual', 'Tareas y evaluaciones', 'Asistencia', 'Libreta de notas', 'Pagos y pensiones', 'Seguridad'];
const HelpCenterPage = (): JSX.Element => {
  const { query, activeTab, activeTopic, announcements, tutorials, guides, counts, updateQuery, selectTab, selectTopic } = useHelpCenter();
  const showAnnouncements = activeTab === 'all' || activeTab === 'announcements';
  const showVideos = activeTab === 'all' || activeTab === 'videos';
  const showGuides = activeTab === 'all' || activeTab === 'guides';
  const featuredAnnouncement = announcements.find((announcement) => announcement.featured);
  const otherAnnouncements = announcements.filter((announcement) => !announcement.featured);
  const [featuredTutorial, ...otherTutorials] = tutorials;

  return (
    <div className="space-y-10 pb-12 sm:space-y-14 sm:pb-16">
      <div className="flex items-center gap-1.5 pt-5 text-[10px] text-muted-foreground">
        <Link href="/" className="inline-flex items-center gap-1 transition-colors hover:text-primary">
          <House aria-hidden="true" className="size-3" /> Inicio
        </Link>
        <ChevronRight aria-hidden="true" className="size-3" />
        <span className="font-medium text-foreground">Tutoriales y novedades</span>
      </div>

      <HelpHero query={query} updateQuery={updateQuery} selectTab={selectTab} />

      <div className="flex flex-col gap-3 border-b border-border pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filtrar centro de ayuda">
          {tabs.map(({ id, label }): JSX.Element => (
            <button key={id} type="button" role="tab" aria-selected={activeTab === id} onClick={(): void => selectTab(id)} className={`inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-[10px] font-semibold transition-colors ${activeTab === id ? 'bg-primary text-primary-foreground' : 'bg-muted/70 text-muted-foreground hover:bg-accent hover:text-foreground'}`}>
              {label}
              <span className={activeTab === id ? 'text-primary-foreground/75' : 'text-muted-foreground/75'}>{counts[id]}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <ShieldCheck aria-hidden="true" className="size-3.5 text-secondary" /> Recursos para estudiantes y familias
        </div>
      </div>

      {showAnnouncements && (
        <section id="announcements" className="scroll-mt-24 space-y-4" aria-labelledby="announcements-title">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-primary">
                <Megaphone aria-hidden="true" className="size-3.5" /> Información institucional
              </p>
              <h2 id="announcements-title" className="mt-1 font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl">
                Anuncios y novedades
              </h2>
              <p className="mt-1 text-[10px] text-muted-foreground">Comunicados, recomendaciones y actualizaciones para la comunidad educativa.</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-2.5 py-1 text-[9px] font-semibold text-secondary">
              <span className="size-1.5 rounded-full bg-secondary" /> {announcements.length} comunicados
            </span>
          </div>
          {featuredAnnouncement && (
            <Card className="overflow-hidden border-l-[3px] border-l-secondary py-0">
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-[9px]">
                      <span className="rounded-md bg-secondary/10 px-2 py-1 font-semibold text-secondary">{featuredAnnouncement.label}</span>
                      <span className="text-muted-foreground">{featuredAnnouncement.category}</span>
                    </div>
                    <h3 className="mt-2 font-heading text-sm font-bold text-foreground sm:text-base">{featuredAnnouncement.title}</h3>
                    <p className="mt-1 text-[10px] leading-5 text-muted-foreground">{featuredAnnouncement.summary}</p>
                    <details className="group mt-2 text-[10px] text-muted-foreground">
                      <summary className="inline-flex cursor-pointer list-none items-center gap-1 font-semibold text-primary [&::-webkit-details-marker]:hidden">
                        Leer comunicado completo <ArrowRight aria-hidden="true" className="size-3 transition-transform group-open:rotate-90" />
                      </summary>
                      <p className="mt-2 max-w-3xl rounded-lg bg-muted/60 p-3 leading-5">{featuredAnnouncement.detail}</p>
                    </details>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 rounded-lg bg-muted/70 px-3 py-2 text-[9px] text-muted-foreground">
                    <Bell aria-hidden="true" className="size-3.5 text-secondary" /> Aviso de plataforma
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          <div className="grid gap-3 md:grid-cols-3">
            {otherAnnouncements.map((announcement): JSX.Element => (
              <Card key={announcement.id} className="h-full py-0 transition-colors hover:border-primary/25">
                <CardContent className="flex h-full flex-col p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md bg-muted px-2 py-1 text-[9px] font-semibold text-muted-foreground">{announcement.label}</span>
                    <span className="text-[9px] text-muted-foreground">{announcement.category}</span>
                  </div>
                  <h3 className="mt-3 font-heading text-xs font-bold leading-5 text-foreground">{announcement.title}</h3>
                  <p className="mt-1.5 flex-1 text-[10px] leading-5 text-muted-foreground">{announcement.summary}</p>
                  <details className="group mt-3 border-t border-border pt-3 text-[10px] text-primary">
                    <summary className="inline-flex cursor-pointer list-none items-center gap-1 font-semibold [&::-webkit-details-marker]:hidden">
                      Conocer más <ChevronRight aria-hidden="true" className="size-3 transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="mt-2 leading-5 text-muted-foreground">{announcement.detail}</p>
                  </details>
                </CardContent>
              </Card>
            ))}
          </div>
          {announcements.length === 0 && <EmptyResults />}
        </section>
      )}

      {showVideos && (
        <section id="tutorials" className="scroll-mt-24 space-y-4" aria-labelledby="tutorials-title">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-primary">
                <Video aria-hidden="true" className="size-3.5" /> Aprende paso a paso
              </p>
              <h2 id="tutorials-title" className="mt-1 font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl">
                Videos tutoriales
              </h2>
              <p className="mt-1 text-[10px] text-muted-foreground">Recorridos breves para aprender a usar las herramientas del aula.</p>
            </div>
            <a href="https://www.youtube.com/results?search_query=CEBA+Joseph+Lister+tutoriales" target="_blank" rel="noreferrer" className="inline-flex h-8 items-center gap-2 self-start rounded-md bg-red-600 px-3 text-[9px] font-semibold text-white transition-colors hover:bg-red-700 sm:self-auto">
              <Image src="/icons/youtube.svg" alt="" width={14} height={14} className="size-3.5" /> Canal de videos <ArrowRight aria-hidden="true" className="size-3" />
            </a>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label="Filtrar videos por tema">
            {topics.map((topic): JSX.Element => (
              <button key={topic} type="button" role="tab" aria-selected={activeTopic === topic} onClick={(): void => selectTopic(topic)} className={`shrink-0 rounded-full px-3 py-1.5 text-[9px] font-medium transition-colors ${activeTopic === topic ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
                {topic}
              </button>
            ))}
          </div>
          {featuredTutorial && (
            <Card className="overflow-hidden py-0">
              <CardContent className="grid gap-0 p-0 lg:grid-cols-[1.1fr_0.9fr]">
                <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${featuredTutorial.title} CEBA Joseph Lister`)}`} target="_blank" rel="noreferrer" aria-label={`Buscar en YouTube: ${featuredTutorial.title}`} className="group relative block aspect-video overflow-hidden bg-muted lg:aspect-auto lg:min-h-72">
                  <Image src={featuredTutorial.image} alt={featuredTutorial.imageAlt} fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" priority />
                  <span className="absolute inset-0 grid place-items-center bg-foreground/10 transition-colors group-hover:bg-foreground/20">
                    <span className="grid size-12 place-items-center rounded-full bg-red-600 text-white shadow-lg">
                      <Play aria-hidden="true" className="ml-0.5 size-5 fill-current" />
                    </span>
                  </span>
                  <span className="absolute bottom-3 left-3 rounded bg-black/75 px-2 py-1 text-[9px] font-semibold text-white">VIDEO RECOMENDADO</span>
                  <span className="absolute bottom-3 right-3 rounded bg-black/75 px-2 py-1 font-mono text-[9px] text-white">{featuredTutorial.duration}</span>
                </a>
                <div className="flex flex-col justify-center p-5 sm:p-6">
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-secondary/10 px-2.5 py-1 text-[9px] font-semibold text-secondary">
                    <Sparkles aria-hidden="true" className="size-3" /> Recomendado para nuevos ingresos
                  </span>
                  <h3 className="mt-3 font-heading text-base font-bold leading-6 text-foreground sm:text-lg">{featuredTutorial.title}</h3>
                  <p className="mt-2 text-[10px] leading-5 text-muted-foreground">{featuredTutorial.summary}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[9px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <UsersRound aria-hidden="true" className="size-3.5" /> {featuredTutorial.views} visualizaciones
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock3 aria-hidden="true" className="size-3.5" /> {featuredTutorial.duration}
                    </span>
                    <span>{featuredTutorial.category}</span>
                  </div>
                  <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${featuredTutorial.title} CEBA Joseph Lister`)}`} target="_blank" rel="noreferrer" className="mt-5 inline-flex h-9 w-fit items-center gap-2 rounded-md bg-primary px-3 text-[10px] font-semibold text-primary-foreground hover:opacity-90">
                    <Play aria-hidden="true" className="size-3.5 fill-current" /> Buscar video <ArrowRight aria-hidden="true" className="size-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          )}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {otherTutorials.map((tutorial): JSX.Element => (
              <Card key={tutorial.id} className="overflow-hidden py-0 transition-colors hover:border-primary/25">
                <CardContent className="flex h-full flex-col p-0">
                  <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${tutorial.title} CEBA Joseph Lister`)}`} target="_blank" rel="noreferrer" aria-label={`Buscar en YouTube: ${tutorial.title}`} className="group relative block aspect-video overflow-hidden bg-muted">
                    <Image src={tutorial.image} alt={tutorial.imageAlt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                    <span className="absolute inset-0 grid place-items-center bg-foreground/10 transition-colors group-hover:bg-foreground/20">
                      <span className="grid size-9 place-items-center rounded-full bg-red-600 text-white">
                        <Play aria-hidden="true" className="ml-0.5 size-4 fill-current" />
                      </span>
                    </span>
                    <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-1 font-mono text-[8px] text-white">{tutorial.duration}</span>
                  </a>
                  <div className="flex flex-1 flex-col p-3.5">
                    <span className="w-fit rounded bg-primary/10 px-2 py-1 text-[8px] font-semibold text-primary">{tutorial.category}</span>
                    <h3 className="mt-2 font-heading text-xs font-bold leading-5 text-foreground">{tutorial.title}</h3>
                    <p className="mt-1 flex-1 text-[9px] leading-4 text-muted-foreground">{tutorial.summary}</p>
                    <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5 text-[8px] text-muted-foreground">
                      <span>{tutorial.views} visualizaciones</span>
                      <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${tutorial.title} CEBA Joseph Lister`)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
                        Ver video <ArrowRight aria-hidden="true" className="size-3" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {tutorials.length === 0 && <EmptyResults />}
        </section>
      )}

      {showGuides && (
        <section id="manuals" className="scroll-mt-24 space-y-4" aria-labelledby="guides-title">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-primary">
                <FileText aria-hidden="true" className="size-3.5" /> Consulta sin conexión
              </p>
              <h2 id="guides-title" className="mt-1 font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl">
                Manuales y guías oficiales
              </h2>
              <p className="mt-1 text-[10px] text-muted-foreground">Material de referencia para estudiantes y familias.</p>
            </div>
            <label className="flex items-center gap-2 text-[9px] text-muted-foreground">
              Ordenar por
              <span className="rounded-md border border-border bg-card px-2.5 py-1.5 font-medium text-foreground">Más consultados</span>
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {guides.map((guide): JSX.Element => (
              <Card key={guide.id} className="h-full border-border/80 py-0 transition-colors hover:border-primary/25">
                <CardContent className="flex h-full flex-col p-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="grid size-9 place-items-center rounded-lg bg-red-500/10 text-red-600">
                      <Image src="/icons/pdf.svg" alt="" width={20} height={20} className="size-5" />
                    </span>
                    <span className="rounded-md bg-muted px-2 py-1 text-[8px] font-semibold text-muted-foreground">{guide.label}</span>
                  </div>
                  <h3 className="mt-3 font-heading text-xs font-bold leading-5 text-foreground">{guide.title}</h3>
                  <p className="mt-1.5 flex-1 text-[9px] leading-4 text-muted-foreground">{guide.summary}</p>
                  <div className="mt-3 flex items-center gap-2 border-t border-border pt-2.5 text-[8px] text-muted-foreground">
                    <span>{guide.pages} páginas</span>
                    <span aria-hidden="true">·</span>
                    <span>{guide.size}</span>
                    <span aria-hidden="true">·</span>
                    <span>PDF</span>
                  </div>
                  <a href={`mailto:informes@cebajosephlister.edu.pe?subject=${encodeURIComponent(`Solicitud de guía: ${guide.title}`)}`} className="mt-3 inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-primary px-3 text-[9px] font-semibold text-primary-foreground transition-opacity hover:opacity-90">
                    <Download aria-hidden="true" className="size-3.5" /> Solicitar guía
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
          {guides.length === 0 && <EmptyResults />}
        </section>
      )}

      {activeTab === 'all' && <HelpOnboardingSection />}

      <HelpSupportSection />
    </div>
  );
};

export { HelpCenterPage };
