import Image from 'next/image';
import Link from 'next/link';
import type { JSX } from 'react';
import { ArrowDown, ArrowRight, Award, BookOpenCheck, CalendarClock, Check, CheckCircle2, ClipboardCheck, Clock3, GraduationCap, HeartHandshake, Laptop, LockKeyhole, MapPin, MessageCircle, MonitorPlay, NotebookPen, Phone, Play, ShieldCheck, Sparkles, UserRoundCheck, UsersRound, Video, WalletCards } from 'lucide-react';

const programs = [
  {
    cycle: 'Ciclo Inicial',
    grades: '1.° y 2.° grado',
    description: 'Fortalece tus aprendizajes y avanza con una base sólida para continuar tus estudios.',
    duration: '2 grados',
    icon: BookOpenCheck,
    color: 'text-primary',
  },
  {
    cycle: 'Ciclo Intermedio',
    grades: '1.° y 2.° grado',
    description: 'Desarrolla competencias para seguir creciendo en tu vida personal, familiar y laboral.',
    duration: '2 grados',
    icon: NotebookPen,
    color: 'text-secondary',
  },
  {
    cycle: 'Ciclo Avanzado',
    grades: '1.° al 4.° grado',
    description: 'Completa la secundaria y obtén tu certificado oficial para abrir nuevas oportunidades.',
    duration: '4 grados',
    icon: GraduationCap,
    color: 'text-primary',
  },
];

const benefits = [
  { title: 'Aula virtual 24/7', description: 'Estudia y consulta tus materiales cuando tengas tiempo, desde cualquier dispositivo.', icon: Laptop },
  { title: 'Acompañamiento cercano', description: 'Docentes y tutores te orientan durante cada etapa de tu aprendizaje.', icon: UserRoundCheck },
  { title: 'Horarios flexibles', description: 'Organiza tus clases alrededor de tu trabajo, familia y actividades.', icon: CalendarClock },
  { title: 'Avance visible', description: 'Revisa tus actividades, evaluaciones y progreso desde tu espacio virtual.', icon: ClipboardCheck },
  { title: 'Entorno seguro', description: 'Accede a una plataforma privada pensada para acompañar tu experiencia educativa.', icon: LockKeyhole },
  { title: 'Certificación oficial', description: 'Culmina tus estudios de acuerdo con el programa de Educación Básica Alternativa.', icon: Award },
];

const enrollmentSteps = [
  { title: 'Preinscríbete', description: 'Déjanos tus datos para iniciar la orientación de matrícula.', icon: NotebookPen },
  { title: 'Conversemos', description: 'Un asesor te ayudará a identificar el ciclo que te corresponde.', icon: MessageCircle },
  { title: 'Completa tus documentos', description: 'Recibe orientación para presentar la documentación necesaria.', icon: ClipboardCheck },
  { title: 'Empieza tus clases', description: 'Activa tu acceso al aula virtual y organiza tu horario.', icon: Play },
];

const LandingPage = (): JSX.Element => (
  <div className="pb-16">
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

      <div className="relative mx-auto w-full max-w-[510px]">
        <div className="absolute -inset-5 rounded-[2rem] bg-primary/5 blur-2xl" />
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

    <section id="about-us" className="scroll-mt-24 py-16 sm:py-20" aria-labelledby="about-title">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-secondary">Nuestra institución</p>
        <h2 id="about-title" className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Pioneros en educación flexible en Ayacucho
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-xs leading-6 text-muted-foreground sm:text-sm">En CEBA Privado Virtual Joseph Lister creemos que siempre es posible continuar. Te acompañamos a desarrollar tus competencias y alcanzar tus metas educativas.</p>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {[
          { title: 'Nuestra misión', text: 'Brindar una educación básica alternativa accesible, cercana y de calidad, que permita a jóvenes y adultos construir nuevas oportunidades.', icon: ShieldCheck },
          { title: 'Nuestra visión', text: 'Ser una comunidad educativa que inspira a las personas a aprender, avanzar y transformar su futuro con confianza.', icon: Sparkles },
        ].map(({ title, text, icon: Icon }) => (
          <article key={title} className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <span className="grid size-10 place-items-center rounded-xl bg-secondary/10 text-secondary">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-4 text-sm font-bold text-foreground">{title}</h3>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{text}</p>
          </article>
        ))}
      </div>
      <div className="mt-4 flex flex-col gap-4 rounded-2xl bg-primary p-5 text-primary-foreground sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10">
            <ShieldCheck className="size-5" />
          </span>
          <div>
            <p className="text-xs font-bold">Tu educación merece confianza</p>
            <p className="mt-1 text-[10px] leading-4 text-primary-foreground/75">Conoce los requisitos y recibe orientación sobre tu proceso de matrícula.</p>
          </div>
        </div>
        <Link href="#admissions" className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-secondary px-3 text-[10px] font-semibold text-secondary-foreground transition-colors hover:bg-secondary/85">
          Hablar con admisión <ArrowRight aria-hidden="true" className="size-3.5" />
        </Link>
      </div>
    </section>

    <section id="programs" className="scroll-mt-24 rounded-2xl bg-muted/60 px-4 py-14 sm:px-7 sm:py-16" aria-labelledby="programs-title">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-secondary">Tu ruta educativa</p>
        <h2 id="programs-title" className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Ciclos y grados formativos
        </h2>
        <p className="mt-3 text-xs leading-5 text-muted-foreground sm:text-sm">Conoce las etapas de Educación Básica Alternativa y encuentra el punto de partida adecuado para ti.</p>
      </div>
      <div className="mt-8 grid gap-3 lg:grid-cols-3">
        {programs.map(({ cycle, grades, description, duration, icon: Icon, color }, index) => (
          <article key={cycle} className={`flex flex-col rounded-xl border bg-card p-4 sm:p-5 ${index === 2 ? 'border-secondary/40 shadow-sm' : 'border-border'}`}>
            <div className="flex items-start justify-between gap-3">
              <span className={`grid size-10 place-items-center rounded-xl bg-muted ${color}`}>
                <Icon className="size-5" />
              </span>
              {index === 2 && <span className="rounded-full bg-secondary/10 px-2.5 py-1 text-[9px] font-bold text-secondary">Culmina secundaria</span>}
            </div>
            <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{grades}</p>
            <h3 className="mt-1 text-base font-bold text-foreground">{cycle}</h3>
            <p className="mt-2 min-h-10 text-[11px] leading-5 text-muted-foreground">{description}</p>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[10px]">
              <span className="text-muted-foreground">Duración referencial</span>
              <span className="font-semibold text-foreground">{duration}</span>
            </div>
            <Link href="#admissions" className="mt-3 inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-muted text-[10px] font-semibold text-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground">
              Consultar requisitos <ArrowRight className="size-3.5" />
            </Link>
          </article>
        ))}
      </div>
      <p className="mt-4 text-center text-[9px] leading-4 text-muted-foreground">La ubicación en el ciclo se confirma revisando tus estudios anteriores con el equipo de admisión.</p>
    </section>

    <section id="virtual-learning" className="scroll-mt-24 py-16 sm:py-20" aria-labelledby="benefits-title">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-secondary">Aprende a tu manera</p>
        <h2 id="benefits-title" className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Una experiencia que se adapta a ti
        </h2>
        <p className="mt-3 text-xs leading-5 text-muted-foreground sm:text-sm">Herramientas y acompañamiento para que mantengas el ritmo y avances con confianza.</p>
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map(({ title, description, icon: Icon }, index) => (
          <article key={title} className="rounded-xl border border-border bg-card p-4">
            <span className={`grid size-9 place-items-center rounded-lg ${index % 2 ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
              <Icon className="size-4" />
            </span>
            <h3 className="mt-3 text-xs font-bold text-foreground">{title}</h3>
            <p className="mt-1.5 text-[10px] leading-5 text-muted-foreground">{description}</p>
          </article>
        ))}
      </div>
      <div className="mt-5 grid items-center gap-5 rounded-2xl border border-border bg-card p-4 sm:p-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl bg-primary p-4 text-primary-foreground sm:p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-lg bg-white/10">
                <MonitorPlay className="size-4" />
              </span>
              <div>
                <p className="text-[10px] font-bold">SIGE-JL · Aula Virtual</p>
                <p className="text-[9px] text-primary-foreground/70">Tu espacio de aprendizaje</p>
              </div>
            </div>
            <span className="rounded-full bg-secondary px-2 py-1 text-[8px] font-bold">CAMPUS VIRTUAL</span>
          </div>
          <div className="mt-4 rounded-lg bg-white/10 p-3">
            <div className="flex items-center justify-between text-[9px]">
              <span className="font-semibold">Mi progreso de aprendizaje</span>
              <span className="text-primary-foreground/70">Este periodo</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                ['Actividades', '12'],
                ['Evaluaciones', '08'],
                ['Avance', '75%'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-white/10 p-2">
                  <p className="text-[8px] text-primary-foreground/70">{label}</p>
                  <p className="mt-1 text-sm font-bold">{value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[9px] text-primary-foreground/80">
            <CheckCircle2 className="size-3.5 text-secondary" /> Clases, recursos y seguimiento en un solo lugar
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-secondary">Conoce SIGE-JL</p>
          <h3 className="mt-2 text-lg font-bold tracking-tight text-foreground">Tu aprendizaje, siempre a mano</h3>
          <div className="mt-4 space-y-3">
            {[
              { title: 'Clases y materiales', text: 'Consulta tus recursos desde el aula virtual.', icon: Video },
              { title: 'Acompañamiento pedagógico', text: 'Comunícate con tu equipo docente cuando lo necesites.', icon: HeartHandshake },
              { title: 'Seguimiento de avances', text: 'Mantente al día con tus actividades y evaluaciones.', icon: ClipboardCheck },
            ].map(({ title, text, icon: Icon }) => (
              <div key={title} className="flex gap-2.5">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-secondary">
                  <Icon className="size-4" />
                </span>
                <div>
                  <p className="text-[10px] font-semibold text-foreground">{title}</p>
                  <p className="mt-0.5 text-[9px] leading-4 text-muted-foreground">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section id="admissions" className="scroll-mt-24 rounded-2xl bg-muted/60 px-4 py-14 sm:px-7 sm:py-16" aria-labelledby="admissions-title">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-secondary">Proceso simple</p>
        <h2 id="admissions-title" className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          ¿Cómo empiezo?
        </h2>
        <p className="mt-3 text-xs leading-5 text-muted-foreground sm:text-sm">Da el primer paso y recibe orientación personalizada para continuar tus estudios.</p>
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {enrollmentSteps.map(({ title, description, icon: Icon }, index) => (
          <article key={title} className="relative rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="grid size-9 place-items-center rounded-lg bg-secondary/10 text-secondary">
                <Icon className="size-4" />
              </span>
              <span className="text-xs font-bold text-muted-foreground/60">0{index + 1}</span>
            </div>
            <h3 className="mt-3 text-xs font-bold text-foreground">{title}</h3>
            <p className="mt-1.5 text-[10px] leading-5 text-muted-foreground">{description}</p>
          </article>
        ))}
      </div>
      <div className="mt-5 grid gap-4 rounded-2xl border border-border bg-card p-4 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <HeartHandshake className="size-5" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-foreground">Estamos aquí para orientarte</h3>
            <p className="mt-1 max-w-xl text-[10px] leading-5 text-muted-foreground">Cuéntanos sobre tus estudios anteriores y resolveremos tus dudas para que sepas cómo continuar.</p>
          </div>
        </div>
        <a className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-primary px-4 text-[10px] font-semibold text-primary-foreground transition-colors hover:bg-primary/85" href="https://wa.me/51966845120?text=Hola%2C%20deseo%20informaci%C3%B3n%20sobre%20la%20matr%C3%ADcula%20en%20el%20CEBA%20Joseph%20Lister" target="_blank" rel="noreferrer">
          <Image src="/icons/whatsapp-icon.svg" alt="" width={14} height={14} className="size-3.5" /> Solicitar orientación <ArrowRight aria-hidden="true" className="size-3.5" />
        </a>
      </div>
    </section>

    <section className="py-16 sm:py-20" aria-labelledby="testimonials-title">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-secondary">Historias que inspiran</p>
        <h2 id="testimonials-title" className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Cada meta empieza con una decisión
        </h2>
        <p className="mt-3 text-xs leading-5 text-muted-foreground sm:text-sm">Retomar tus estudios puede abrir nuevas posibilidades para ti y tu familia.</p>
      </div>
      <div className="mt-8 grid gap-3 md:grid-cols-3">
        {[
          { name: 'Tu historia', role: 'Un nuevo comienzo', text: 'Cada persona avanza a su propio ritmo. Con orientación y constancia, puedes dar el siguiente paso hacia tus metas.' },
          { name: 'Tu esfuerzo', role: 'Un logro que cuenta', text: 'Estudiar mientras atiendes otras responsabilidades requiere dedicación. Reconoce cada avance que consigues.' },
          { name: 'Tu futuro', role: 'Más oportunidades', text: 'Completar tu educación básica puede ayudarte a continuar aprendiendo y explorar nuevos caminos.' },
        ].map(({ name, role, text }) => (
          <article key={name} className="rounded-xl border border-border bg-card p-4 sm:p-5">
            <div className="flex gap-1 text-secondary" aria-label="Testimonio destacado">
              {Array.from({ length: 5 }, (_, index) => (
                <Sparkles key={index} className="size-3" />
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-5 text-muted-foreground">“{text}”</p>
            <div className="mt-4 flex items-center gap-2.5 border-t border-border pt-3">
              <span className="grid size-8 place-items-center rounded-full bg-secondary/10 text-secondary">
                <GraduationCap className="size-4" />
              </span>
              <div>
                <p className="text-[10px] font-bold text-foreground">{name}</p>
                <p className="text-[9px] text-muted-foreground">{role}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>

    <section className="py-12 sm:py-16" aria-labelledby="contact-title">
      <div className="rounded-2xl bg-primary px-5 py-10 text-center text-primary-foreground sm:px-10 sm:py-12">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em]">
          <Sparkles className="size-3.5 text-secondary" /> Da el primer paso
        </span>
        <h2 id="contact-title" className="mx-auto mt-4 max-w-2xl font-heading text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
          Tu futuro empieza hoy. Nunca es tarde para seguir aprendiendo.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-xs leading-5 text-primary-foreground/75">Conversa con nuestro equipo y recibe orientación para retomar tu educación básica.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2.5">
          <Link className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-secondary px-4 text-[10px] font-semibold text-secondary-foreground transition-colors hover:bg-secondary/85" href="/contact">
            <MessageCircle aria-hidden="true" className="size-4" /> Hablar con admisión
          </Link>
          <a className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-white/30 bg-transparent px-4 text-[10px] font-semibold text-white transition-colors hover:bg-white/10" href="tel:+51966845120">
            <Phone aria-hidden="true" className="size-4" /> Llamar al equipo
          </a>
        </div>
        <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[9px] text-primary-foreground/70">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3" /> Huamanga, Ayacucho
          </span>
          <span className="inline-flex items-center gap-1">
            <WalletCards className="size-3" /> Orientación de matrícula
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-center gap-2 text-[9px] text-muted-foreground">
        <ArrowDown className="size-3" /> También puedes revisar los enlaces institucionales al pie de página
      </div>
    </section>

    <a href="https://wa.me/51966845120?text=Hola%2C%20deseo%20informaci%C3%B3n%20sobre%20el%20CEBA%20Joseph%20Lister" target="_blank" rel="noreferrer" className="fixed bottom-5 right-4 z-40 inline-flex h-11 items-center gap-2 rounded-full bg-secondary px-4 text-[10px] font-bold text-secondary-foreground shadow-lg shadow-secondary/20 transition-transform hover:scale-[1.03] sm:bottom-7 sm:right-7">
      <Image src="/icons/whatsapp-icon.svg" alt="" width={16} height={16} className="size-4" />
      <span className="hidden sm:inline">Asesoría por WhatsApp</span>
    </a>
  </div>
);

export { LandingPage };
