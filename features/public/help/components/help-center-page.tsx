'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { JSX } from 'react';
import { ArrowRight, Bell, BookOpenCheck, Check, ChevronRight, CircleHelp, Clock3, Download, FileText, GraduationCap, House, Mail, Megaphone, Play, Search, ShieldCheck, Sparkles, UsersRound, Video, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useHelpCenter } from '../hooks/use-help-center';
import type { HelpCenterTab, HelpTopic } from '../types';

const tabs: Array<{ id: HelpCenterTab; label: string }> = [
  { id: 'all', label: 'Todo' },
  { id: 'announcements', label: 'Anuncios' },
  { id: 'videos', label: 'Videos tutoriales' },
  { id: 'guides', label: 'Guías PDF' },
];

const topics: HelpTopic[] = ['Todos los videos', 'Primeros pasos', 'Aula virtual', 'Tareas y evaluaciones', 'Asistencia', 'Libreta de notas', 'Pagos y pensiones', 'Seguridad'];
const searchSuggestions = ['Iniciar sesión', 'Entregar tareas', 'Exámenes en línea', 'Descargar certificados', 'Horarios de clase', 'Recuperar contraseña'];
const onboardingSteps = [
  { title: 'Activa tu cuenta institucional', description: 'Revisa tu correo y sigue las instrucciones para crear tu contraseña.', icon: Mail, timing: 'Primer ingreso' },
  { title: 'Ingresa al Aula Virtual SIGE-JL', description: 'Accede desde tu computadora o celular y completa tu perfil.', icon: Wifi, timing: 'Luego' },
  { title: 'Revisa cursos y horarios', description: 'Ubica tus cursos, docentes, materiales y fechas de actividades.', icon: BookOpenCheck, timing: 'Cada semana' },
  { title: 'Entrega tu primera actividad', description: 'Participa en las actividades y confirma que tus archivos se enviaron.', icon: Check, timing: 'A tu ritmo' },
];

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

      <section className="overflow-hidden rounded-2xl border border-primary/10 bg-[linear-gradient(110deg,color-mix(in_oklab,var(--primary)_11%,var(--card)),var(--card)_50%,color-mix(in_oklab,var(--secondary)_14%,var(--card)))] p-5 sm:p-8 lg:p-10" aria-labelledby="help-center-title">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-md border border-border/70 bg-background/70 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-primary">
            <BookOpenCheck aria-hidden="true" className="size-3.5" /> Base de conocimiento y aprendizaje digital
          </div>
          <h1 id="help-center-title" className="mt-4 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
            Centro de Tutoriales y Novedades
          </h1>
          <p className="mt-2 max-w-2xl text-xs leading-5 text-muted-foreground sm:text-sm">Encuentra guías para usar el aula virtual, videos paso a paso y comunicados de la institución.</p>
        </div>

        <div className="mt-6 max-w-4xl">
          <div className="flex flex-col gap-2 rounded-xl border border-border/80 bg-background p-2 shadow-sm sm:flex-row">
            <label htmlFor="help-search" className="sr-only">
              Buscar tutoriales, guías o anuncios
            </label>
            <div className="relative flex-1">
              <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="help-search" value={query} onChange={(event: React.ChangeEvent<HTMLInputElement>): void => updateQuery(event.currentTarget.value)} placeholder="¿Qué necesitas aprender? Busca una tarea, calificación o pago" className="h-11 border-0 bg-transparent pl-9 text-xs shadow-none focus-visible:ring-0" />
            </div>
            <Button type="button" onClick={(): void => selectTab('all')} className="h-10 gap-2 rounded-lg px-5 text-xs font-semibold">
              <Search aria-hidden="true" className="size-3.5" /> Buscar
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[9px]">
            <span className="mr-1 font-semibold text-muted-foreground">Búsquedas frecuentes:</span>
            {searchSuggestions.map((suggestion): JSX.Element => (
              <button
                key={suggestion}
                type="button"
                onClick={(): void => {
                  updateQuery(suggestion);
                  selectTab('all');
                }}
                className="rounded-md border border-border bg-background/70 px-2 py-1 text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </section>

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

      {activeTab === 'all' && (
        <section className="space-y-4" aria-labelledby="onboarding-title">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-secondary">
              <GraduationCap aria-hidden="true" className="size-3.5" /> Ruta de inicio
            </p>
            <h2 id="onboarding-title" className="mt-1 font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl">
              Primeros pasos en el aula virtual
            </h2>
            <p className="mt-1 text-[10px] leading-5 text-muted-foreground">Sigue esta ruta para familiarizarte con el campus virtual durante tu primera semana.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {onboardingSteps.map(({ title, description, icon: Icon, timing }, index): JSX.Element => (
              <Card key={title} className="py-0">
                <CardContent className="flex h-full flex-col p-4">
                  <div className="flex items-center justify-between">
                    <span className={`grid size-9 place-items-center rounded-full text-xs font-bold ${index === onboardingSteps.length - 1 ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'}`}>{index + 1}</span>
                    <span className="text-[9px] font-semibold text-muted-foreground">{timing}</span>
                  </div>
                  <span className="mt-4 grid size-8 place-items-center rounded-lg bg-secondary/10 text-secondary">
                    <Icon aria-hidden="true" className="size-4" />
                  </span>
                  <h3 className="mt-3 font-heading text-xs font-bold leading-5 text-foreground">{title}</h3>
                  <p className="mt-1.5 flex-1 text-[9px] leading-4 text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section className="relative overflow-hidden rounded-2xl border border-secondary/15 bg-[linear-gradient(110deg,color-mix(in_oklab,var(--primary)_9%,var(--card)),color-mix(in_oklab,var(--secondary)_11%,var(--card)))] p-5 sm:p-7 lg:flex lg:items-center lg:justify-between lg:gap-8" aria-labelledby="help-support-title">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary/10 px-2.5 py-1.5 text-[9px] font-semibold text-secondary">
            <CircleHelp aria-hidden="true" className="size-3.5" /> Mesa de ayuda integral
          </span>
          <h2 id="help-support-title" className="mt-3 font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl">
            ¿Aún necesitas ayuda con la plataforma?
          </h2>
          <p className="mt-2 text-[10px] leading-5 text-muted-foreground sm:text-xs">El equipo institucional puede orientarte con el acceso al aula virtual, los recursos de estudio y tus consultas académicas.</p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[9px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 aria-hidden="true" className="size-3.5 text-secondary" /> Atención por los canales institucionales
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck aria-hidden="true" className="size-3.5 text-secondary" /> Atención segura y personalizada
            </span>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row lg:mt-0 lg:shrink-0 lg:flex-col">
          <a href="https://wa.me/51966845120?text=Hola%2C%20necesito%20ayuda%20con%20el%20aula%20virtual%20de%20CEBA%20Joseph%20Lister" target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-secondary px-4 text-[10px] font-semibold text-secondary-foreground transition-opacity hover:opacity-90">
            <Image src="/icons/whatsapp-icon.svg" alt="" width={16} height={16} className="size-4" /> Escribir por WhatsApp a soporte
          </a>
          <Link href="/contact" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background/80 px-4 text-[10px] font-semibold text-foreground transition-colors hover:bg-accent">
            <Mail aria-hidden="true" className="size-3.5 text-primary" /> Ir al formulario de contacto
          </Link>
        </div>
      </section>
    </div>
  );
};

const EmptyResults = (): JSX.Element => (
  <div className="rounded-xl border border-dashed border-border bg-card/60 px-5 py-10 text-center">
    <Search aria-hidden="true" className="mx-auto size-5 text-muted-foreground" />
    <p className="mt-3 text-xs font-semibold text-foreground">No encontramos resultados</p>
    <p className="mt-1 text-[10px] text-muted-foreground">Prueba con otra palabra o elige un tema diferente.</p>
  </div>
);

export { HelpCenterPage };
