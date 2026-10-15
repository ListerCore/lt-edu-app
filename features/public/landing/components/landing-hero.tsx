import type { JSX } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpenCheck, CalendarClock, Check, CheckCircle2, ClipboardCheck, Clock3, HeartHandshake, Laptop, MonitorPlay, Play, Sparkles, UsersRound, Video } from 'lucide-react';

const HeroSection = (): JSX.Element => (
  <section className="grid min-h-[calc(100svh-5rem)] grid-rows-[1fr_auto] items-center gap-8 py-8 sm:py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-x-14 lg:gap-y-8 lg:py-10" aria-labelledby="hero-title">
    <div>
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-secondary">
        <Sparkles className="size-3.5" aria-hidden="true" /> Educación Básica Alternativa · Ayacucho
      </div>
      <h1 id="hero-title" className="max-w-2xl font-heading text-4xl font-bold leading-[1.08] tracking-[-0.045em] text-foreground sm:text-5xl lg:text-[3.5rem]">
        Termina tu educación básica, <span className="text-secondary">100% virtual y a tu ritmo</span>
      </h1>
      <p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">Retoma tus estudios con el acompañamiento de docentes, acceso a tu aula virtual y la flexibilidad que necesitas para seguir avanzando.</p>
      <div className="mt-7 flex flex-wrap gap-3">
        <Link href="#admissions" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/85">
          Quiero matricularme <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
        <Link href="#virtual-learning" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-background px-5 text-xs font-semibold text-foreground transition-colors hover:bg-muted">
          <Play aria-hidden="true" className="size-4" /> Conoce el aula virtual
        </Link>
      </div>
      <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[10px] font-medium text-muted-foreground sm:text-[11px]">
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 className="size-3.5 text-secondary" /> Estudia desde donde estés
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 className="size-3.5 text-secondary" /> Acompañamiento personalizado
        </span>
      </div>
    </div>

    <div className="relative mx-auto w-full max-w-127.5">
      <div className="absolute -inset-5 rounded-4xl bg-primary/5 blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-xl shadow-primary/10 sm:p-4">
        <div className="flex items-center justify-between rounded-xl bg-primary px-4 py-3 text-primary-foreground">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="" width={30} height={30} className="size-7 rounded-md bg-white object-contain p-0.5" />
            <div>
              <p className="text-[10px] font-bold">Aula Virtual</p>
              <p className="text-[9px] text-primary-foreground/70">CEBA Joseph Lister</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-[8px] font-bold text-secondary-foreground">
            <span className="size-1.5 rounded-full bg-white" /> EN LÍNEA
          </span>
        </div>
        <div className="grid gap-3 p-2 pt-4 sm:grid-cols-[1.1fr_0.9fr]">
          <div className="relative flex min-h-48 flex-col justify-between overflow-hidden rounded-xl bg-linear-gradient-to-br from-primary to-primary/80 p-4 text-white sm:min-h-56">
            <div className="absolute -right-10 -top-10 size-40 rounded-full border border-white/10" />
            <div className="absolute -right-3 -top-3 size-28 rounded-full border border-white/10" />
            <div className="relative flex items-center gap-2 text-[9px] font-semibold text-white/75">
              <Video className="size-3.5" /> CLASE EN VIVO
            </div>
            <div className="relative">
              <p className="text-[9px] font-medium text-white/70">Sesión de aprendizaje</p>
              <h2 className="mt-1 text-lg font-bold leading-tight">
                Emprendimiento
                <br />y Matemática
              </h2>
              <div className="mt-4 flex items-center gap-2 text-[9px] text-white/80">
                <span className="grid size-6 place-items-center rounded-full bg-white/15">
                  <UsersRound className="size-3" />
                </span>{' '}
                Aprende junto a tu comunidad
              </div>
            </div>
          </div>
          <div className="grid gap-3">
            <div className="rounded-xl border border-border bg-background p-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-semibold text-muted-foreground">Tu progreso</span>
                <span className="text-[9px] font-bold text-secondary">EN MARCHA</span>
              </div>
              <p className="mt-3 text-xl font-bold tracking-tight text-foreground">75%</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-3/4 rounded-full bg-secondary" />
              </div>
              <p className="mt-2 text-[9px] text-muted-foreground">Ciclo Avanzado · 2.° grado</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-3">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-lg bg-secondary/10 text-secondary">
                  <CalendarClock className="size-3.5" />
                </span>
                <span className="text-[9px] font-semibold text-foreground">Próxima actividad</span>
              </div>
              <p className="mt-2 text-[10px] font-medium text-muted-foreground">Revisa tus materiales de aprendizaje</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 border-t border-border px-2 pt-3">
          {[
            ['Tu aula', MonitorPlay],
            ['Materiales', BookOpenCheck],
            ['Evaluaciones', ClipboardCheck],
          ].map(([label, Icon]) => {
            const ItemIcon = Icon as typeof MonitorPlay;
            return (
              <div key={label as string} className="flex items-center justify-center gap-1.5 rounded-lg bg-background py-2 text-[8px] font-medium text-muted-foreground">
                <ItemIcon className="size-3 text-secondary" />
                {label as string}
              </div>
            );
          })}
        </div>
      </div>
      <div className="absolute -bottom-5 -left-4 hidden items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2.5 shadow-lg sm:flex">
        <span className="grid size-8 place-items-center rounded-full bg-secondary/10 text-secondary">
          <Check className="size-4" />
        </span>
        <div>
          <p className="text-[10px] font-bold text-foreground">Avanza paso a paso</p>
          <p className="text-[9px] text-muted-foreground">Tu esfuerzo cuenta</p>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-4 sm:p-5 lg:col-span-2" aria-label="Ventajas de estudiar con nosotros">
      {[
        { value: '100%', label: 'Acompañamiento educativo', icon: HeartHandshake },
        { value: '24/7', label: 'Acceso al aula virtual', icon: Laptop },
        { value: 'Flexible', label: 'Organiza tus horarios', icon: Clock3 },
        { value: 'Contigo', label: 'Orientación durante el proceso', icon: UsersRound },
      ].map(({ value, label, icon: Icon }) => (
        <div key={label} className="flex items-center gap-2.5 px-1 py-2 sm:justify-center">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary/10 text-secondary">
            <Icon className="size-4" />
          </span>
          <div>
            <p className="text-sm font-bold tracking-tight text-foreground">{value}</p>
            <p className="mt-0.5 text-[9px] leading-4 text-muted-foreground sm:text-[10px]">{label}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export { HeroSection };
