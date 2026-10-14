'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, type FormEvent, type JSX } from 'react';
import { ArrowRight, BadgeCheck, Building2, CalendarClock, CheckCircle2, ChevronDown, Clock3, GraduationCap, Headphones, Mail, MapPin, MapPinned, MessageCircle, MonitorPlay, Phone, Send, ShieldCheck, WalletCards } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const whatsappHref = 'https://wa.me/51966845120';

const supportChannels = [
  { title: 'Soporte de aula virtual', description: 'Acceso a SIGE-JL, restablecimiento de contraseña y orientación sobre tus recursos de estudio.', icon: MonitorPlay, action: 'Consultar por WhatsApp', message: 'Hola, necesito soporte para el aula virtual SIGE-JL.' },
  { title: 'Admisión y matrícula', description: 'Orientación sobre ciclos, requisitos, evaluación de ubicación y proceso de matrícula.', icon: GraduationCap, action: 'Consultar admisión', message: 'Hola, deseo información sobre admisión y matrícula.' },
  { title: 'Pensiones y trámites', description: 'Consultas sobre pagos, constancias, documentos y atención administrativa.', icon: WalletCards, action: 'Consultar trámites', message: 'Hola, deseo orientación sobre pagos o trámites.' },
];

const contactFaqs = [
  { question: '¿Cómo puedo coordinar una visita a la sede?', answer: 'Escríbenos por WhatsApp o llámanos para coordinar la atención presencial en nuestra sede de Huamanga.' },
  { question: '¿Cuáles son los canales oficiales de atención?', answer: 'Puedes comunicarte a la central (066) 31-4520, al WhatsApp +51 966 845 120 o escribir a informes@cebajosephlister.edu.pe.' },
  { question: '¿Puedo solicitar orientación si vivo fuera de Ayacucho?', answer: 'Sí. Puedes comunicarte con el equipo de admisión por teléfono, correo o WhatsApp para recibir orientación a distancia.' },
];

const ContactPage = (): JSX.Element => {
  const [messageLength, setMessageLength] = useState(0);

  const submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const body = Array.from(values.entries())
      .filter(([key]) => key !== 'privacy')
      .map(([key, value]) => `${key}: ${String(value)}`)
      .join('\n');
    const subject = encodeURIComponent('Consulta desde el sitio web · CEBA Joseph Lister');
    window.location.href = `mailto:informes@cebajosephlister.edu.pe?subject=${subject}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="pb-16">
      <div className="flex items-center gap-2 pt-5 text-[10px] text-muted-foreground"><Link href="/" className="transition-colors hover:text-foreground">Inicio</Link><span>/</span><span className="font-medium text-foreground">Contacto</span></div>

      <section className="flex flex-col justify-between gap-5 py-7 sm:flex-row sm:items-end sm:py-9">
        <div><p className="text-[10px] font-bold uppercase tracking-[0.17em] text-secondary">Estamos para ayudarte</p><h1 className="mt-2 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Contáctanos</h1><p className="mt-2 max-w-xl text-xs leading-5 text-muted-foreground sm:text-sm">Estamos para ayudarte a empezar o continuar tus estudios. Escríbenos, llámanos o visítanos.</p></div>
        <div className="flex flex-wrap gap-2 text-[9px] font-medium"><span className="inline-flex items-center gap-1.5 rounded-full border border-secondary/20 bg-secondary/10 px-2.5 py-1.5 text-secondary"><CheckCircle2 className="size-3" /> Atención virtual</span><span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1.5 text-muted-foreground"><MapPin className="size-3 text-secondary" /> Sede Huamanga</span><span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1.5 text-muted-foreground"><BadgeCheck className="size-3 text-secondary" /> CEBA Joseph Lister</span></div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Canales de contacto">
        <Card className="gap-0 border-border py-0"><CardContent className="flex h-full flex-col p-4"><span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary"><Phone className="size-4" /></span><h2 className="mt-3 text-xs font-bold text-foreground">Teléfono y WhatsApp</h2><a href="tel:+5166314520" className="mt-2 text-[10px] text-muted-foreground hover:text-foreground">(066) 31-4520</a><a href="tel:+51966845120" className="mt-1 text-[10px] text-muted-foreground hover:text-foreground">+51 966 845 120</a><a href={`${whatsappHref}?text=Hola%2C%20deseo%20informaci%C3%B3n%20del%20CEBA`} target="_blank" rel="noreferrer" className="mt-3 inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-secondary px-3 text-[9px] font-semibold text-secondary-foreground hover:bg-secondary/85"><MessageCircle className="size-3.5" /> Escribir por WhatsApp</a></CardContent></Card>
        <Card className="gap-0 border-border py-0"><CardContent className="flex h-full flex-col p-4"><span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary"><Mail className="size-4" /></span><h2 className="mt-3 text-xs font-bold text-foreground">Correo institucional</h2><a href="mailto:informes@cebajosephlister.edu.pe" className="mt-2 break-all text-[10px] text-muted-foreground hover:text-foreground">informes@cebajosephlister.edu.pe</a><a href="mailto:admision@cebalister.edu.pe" className="mt-1 break-all text-[10px] text-muted-foreground hover:text-foreground">admision@cebalister.edu.pe</a><a href="mailto:informes@cebajosephlister.edu.pe" className="mt-3 inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-primary/10 px-3 text-[9px] font-semibold text-primary hover:bg-primary/15"><Send className="size-3.5" /> Enviar correo</a></CardContent></Card>
        <Card className="gap-0 border-border py-0"><CardContent className="flex h-full flex-col p-4"><span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary"><MapPinned className="size-4" /></span><h2 className="mt-3 text-xs font-bold text-foreground">Dirección de sede</h2><p className="mt-2 text-[10px] leading-4 text-muted-foreground">Jr. 28 de Julio N.° 450, Centro Histórico, Huamanga, Ayacucho.</p><a href="https://maps.google.com/?q=Jr.+28+de+Julio+450+Huamanga+Ayacucho" target="_blank" rel="noreferrer" className="mt-3 inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-primary/10 px-3 text-[9px] font-semibold text-primary hover:bg-primary/15"><MapPin className="size-3.5" /> Ver en el mapa</a></CardContent></Card>
        <Card className="gap-0 border-border py-0"><CardContent className="flex h-full flex-col p-4"><span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary"><Clock3 className="size-4" /></span><div className="mt-3 flex items-center justify-between gap-2"><h2 className="text-xs font-bold text-foreground">Horario de oficina</h2><span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-1 text-[8px] font-bold text-secondary"><span className="size-1.5 rounded-full bg-secondary" /> Atención</span></div><p className="mt-2 text-[10px] leading-4 text-muted-foreground">Lunes a viernes: 8:00 a. m. – 6:00 p. m.</p><p className="mt-1 text-[10px] leading-4 text-muted-foreground">Sábados: 9:00 a. m. – 1:00 p. m.</p><span className="mt-3 rounded-md bg-muted px-2.5 py-2 text-center text-[9px] font-medium text-muted-foreground">Campus virtual disponible 24/7</span></CardContent></Card>
      </section>

      <section className="grid items-start gap-4 py-7 lg:grid-cols-[1.15fr_0.85fr]" aria-label="Formulario y ubicación">
        <Card className="gap-0 border-border py-0"><CardContent className="p-4 sm:p-6">
          <div className="mb-5"><h2 className="font-heading text-xl font-bold tracking-tight text-foreground">Envíanos un mensaje</h2><p className="mt-1 text-[10px] leading-5 text-muted-foreground">Completa el formulario y un asesor educativo se comunicará contigo para brindarte información.</p></div>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Label className="flex-col items-stretch gap-1.5 text-[10px] font-semibold text-foreground"><span className="inline-flex items-center gap-1.5"><Image src="/logo.png" alt="" width={14} height={14} className="size-3.5 object-contain" /> Nombres y apellidos *</span><Input name="Nombres y apellidos" autoComplete="name" placeholder="Ej. Carlos Mendoza Ramos" required className="h-10 rounded-md bg-muted/50 text-xs" /></Label>
              <Label className="flex-col items-stretch gap-1.5 text-[10px] font-semibold text-foreground"><span className="inline-flex items-center gap-1.5"><Phone className="size-3.5 text-secondary" /> Celular / WhatsApp *</span><Input name="Celular" type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9+() -]{9,16}" placeholder="966 000 000" required className="h-10 rounded-md bg-muted/50 text-xs" /></Label>
              <Label className="flex-col items-stretch gap-1.5 text-[10px] font-semibold text-foreground"><span className="inline-flex items-center gap-1.5"><Mail className="size-3.5 text-secondary" /> Correo electrónico *</span><Input name="Correo electrónico" type="email" autoComplete="email" placeholder="ejemplo@correo.com" required className="h-10 rounded-md bg-muted/50 text-xs" /></Label>
              <Label className="flex-col items-stretch gap-1.5 text-[10px] font-semibold text-foreground"><span className="inline-flex items-center gap-1.5"><GraduationCap className="size-3.5 text-secondary" /> Ciclo de interés *</span><Select name="Ciclo de interés" required defaultValue="" className="h-10 rounded-md bg-muted/50 text-xs"><option value="" disabled>Selecciona un ciclo</option><option>Ciclo Inicial</option><option>Ciclo Intermedio</option><option>Ciclo Avanzado</option><option>Necesito orientación</option></Select></Label>
              <Label className="flex-col items-stretch gap-1.5 text-[10px] font-semibold text-foreground sm:col-span-2"><span className="inline-flex items-center gap-1.5"><Headphones className="size-3.5 text-secondary" /> Motivo de la consulta *</span><Select name="Motivo de consulta" required defaultValue="Matrícula y requisitos de admisión" className="h-10 rounded-md bg-muted/50 text-xs"><option>Matrícula y requisitos de admisión</option><option>Ciclos y grados</option><option>Modalidad virtual</option><option>Pagos y trámites</option><option>Soporte de aula virtual</option><option>Otro motivo</option></Select></Label>
              <Label className="flex-col items-stretch gap-1.5 text-[10px] font-semibold text-foreground sm:col-span-2"><span className="inline-flex items-center justify-between"><span className="inline-flex items-center gap-1.5"><MessageCircle className="size-3.5 text-secondary" /> Mensaje o consulta *</span><span className="font-normal text-muted-foreground">{messageLength} / 500</span></span><Textarea name="Mensaje" maxLength={500} rows={4} placeholder="Escribe aquí tu consulta para que podamos orientarte." required className="min-h-28 resize-y rounded-md bg-muted/50 text-xs" onChange={(event) => setMessageLength(event.currentTarget.value.length)} /></Label>
            </div>
            <label className="flex items-start gap-2.5 text-[9px] leading-4 text-muted-foreground"><input type="checkbox" name="privacy" required className="mt-0.5 size-3.5 shrink-0 accent-secondary" /><span>He leído y acepto la <Link className="font-semibold text-secondary underline underline-offset-2" href="/legal/privacy">Política de Privacidad</Link> y autorizo el tratamiento de mis datos para recibir orientación institucional.</span></label>
            <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between"><Button type="submit" variant="secondary" className="h-10 rounded-md px-4 text-[10px] font-semibold"><Send className="size-3.5" /> Enviar mensaje</Button><span className="inline-flex items-center gap-1.5 text-[9px] text-muted-foreground"><ShieldCheck className="size-3.5 text-secondary" /> Datos protegidos conforme a la ley</span></div>
            <p className="text-[9px] leading-4 text-muted-foreground">Al enviar, se abrirá tu aplicación de correo con el mensaje preparado para que lo revises y lo envíes.</p>
          </form>
        </CardContent></Card>

        <div className="space-y-4">
          <Card className="gap-0 overflow-hidden border-border py-0">
            <CardContent className="p-4"><div className="flex items-start justify-between gap-2"><div><h2 className="text-sm font-bold text-foreground">Nuestra ubicación</h2><p className="mt-1 text-[9px] text-muted-foreground">Centro Histórico de Huamanga, Ayacucho</p></div><span className="rounded-full bg-primary/10 px-2 py-1 text-[8px] font-semibold text-primary">Presencial y virtual</span></div>
              <a href="https://maps.google.com/?q=Jr.+28+de+Julio+450+Huamanga+Ayacucho" target="_blank" rel="noreferrer" aria-label="Abrir mapa de la sede en Huamanga" className="relative mt-3 block h-52 overflow-hidden rounded-lg border border-border bg-muted sm:h-60">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49%,hsl(var(--border))_50%,transparent_51%),linear-gradient(0deg,transparent_49%,hsl(var(--border))_50%,transparent_51%)] bg-[size:72px_72px] opacity-70" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,rgba(34,197,94,.15),transparent_55%)]" />
                <div className="absolute left-[43%] top-[42%] grid size-9 place-items-center rounded-full rounded-bl-none bg-secondary text-secondary-foreground shadow-lg rotate-[-45deg]"><MapPin className="size-4 rotate-45" /></div>
                <div className="absolute bottom-3 left-3 right-3 rounded-lg border border-border bg-card/95 p-3 shadow-md backdrop-blur"><div className="flex items-center gap-2"><Image src="/logo.png" alt="" width={24} height={24} className="size-6 object-contain" /><div><p className="text-[9px] font-bold text-foreground">CEBA Privado Virtual Joseph Lister</p><p className="mt-0.5 text-[8px] text-muted-foreground">Jr. 28 de Julio N.° 450, Huamanga</p></div></div></div>
              </a>
              <div className="mt-3 rounded-lg border border-secondary/20 bg-secondary/5 p-3"><p className="flex items-start gap-2 text-[9px] leading-4 text-muted-foreground"><CalendarClock className="mt-0.5 size-3.5 shrink-0 text-secondary" /><span><strong className="text-foreground">Atención presencial previa coordinación.</strong> El campus virtual se encuentra disponible para estudiar en línea.</span></p></div>
            </CardContent>
          </Card>
          <Card className="gap-0 border-border py-0"><CardContent className="p-4"><div className="flex items-center gap-2"><Building2 className="size-4 text-secondary" /><h2 className="text-xs font-bold text-foreground">Sede administrativa</h2></div><div className="mt-3 space-y-2 text-[9px] text-muted-foreground"><p className="flex gap-2"><MapPin className="size-3.5 shrink-0 text-secondary" /> Jr. 28 de Julio N.° 450, Huamanga</p><p className="flex gap-2"><Clock3 className="size-3.5 shrink-0 text-secondary" /> Lunes a viernes: 8:00 a. m. – 6:00 p. m.</p><a className="flex items-center gap-2 font-semibold text-secondary hover:underline" href="https://maps.google.com/?q=Jr.+28+de+Julio+450+Huamanga+Ayacucho" target="_blank" rel="noreferrer"><MapPinned className="size-3.5" /> Abrir ubicación en Google Maps <ArrowRight className="size-3" /></a></div></CardContent></Card>
        </div>
      </section>

      <section className="rounded-2xl bg-muted/60 px-4 py-10 sm:px-6 sm:py-12" aria-labelledby="channels-title"><div className="mx-auto max-w-2xl text-center"><p className="text-[9px] font-bold uppercase tracking-[0.16em] text-secondary">Canales directos</p><h2 id="channels-title" className="mt-2 font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">Atención en línea especializada</h2><p className="mt-2 text-[10px] leading-5 text-muted-foreground">Comunícate con el equipo según el tipo de asistencia que necesitas.</p></div><div className="mt-6 grid gap-3 md:grid-cols-3">{supportChannels.map(({ title, description, icon: Icon, action, message }) => <Card key={title} className="gap-0 border-border py-0"><CardContent className="flex h-full flex-col p-4"><span className="grid size-9 place-items-center rounded-lg bg-secondary/10 text-secondary"><Icon className="size-4" /></span><h3 className="mt-3 text-xs font-bold text-foreground">{title}</h3><p className="mt-1.5 flex-1 text-[9px] leading-4 text-muted-foreground">{description}</p><a href={`${whatsappHref}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-8 items-center justify-center gap-1.5 rounded-md bg-card px-3 text-[9px] font-semibold text-secondary transition-colors hover:bg-secondary/10"><MessageCircle className="size-3.5" /> {action} <ArrowRight className="size-3" /></a></CardContent></Card>)}</div></section>

      <section className="py-10" aria-labelledby="contact-faq-title"><div className="mx-auto max-w-2xl"><h2 id="contact-faq-title" className="text-center font-heading text-xl font-bold tracking-tight text-foreground">Dudas sobre contacto y atención</h2><p className="mt-2 text-center text-[10px] text-muted-foreground">Información útil para comunicarte con nuestra institución.</p><div className="mt-5 space-y-2">{contactFaqs.map(({ question, answer }) => <details key={question} className="group rounded-lg border border-border bg-card px-4"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-[10px] font-semibold text-foreground [&::-webkit-details-marker]:hidden">{question}<ChevronDown className="size-3.5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" /></summary><p className="pb-3 pr-5 text-[9px] leading-4 text-muted-foreground">{answer}</p></details>)}</div></div></section>

      <section className="rounded-2xl bg-primary px-5 py-8 text-primary-foreground sm:flex sm:items-center sm:justify-between sm:gap-6 sm:px-8"><div><span className="inline-flex rounded-full bg-white/10 px-2.5 py-1 text-[8px] font-bold uppercase tracking-wide">Matrículas abiertas</span><h2 className="mt-2 font-heading text-xl font-bold tracking-tight">¿Listo para dar el siguiente paso?</h2><p className="mt-1 max-w-xl text-[10px] leading-4 text-primary-foreground/75">Nunca es tarde para culminar tus estudios con horarios que se adaptan a ti.</p></div><div className="mt-4 flex flex-wrap gap-2 sm:mt-0"><Link href="/#admissions" className="inline-flex h-9 items-center gap-1.5 rounded-md bg-secondary px-3 text-[9px] font-semibold text-secondary-foreground hover:bg-secondary/85"><GraduationCap className="size-3.5" /> Ver admisión</Link><a href={`${whatsappHref}?text=Hola%2C%20deseo%20hablar%20con%20un%20asesor`} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-md bg-white/10 px-3 text-[9px] font-semibold text-white hover:bg-white/15"><MessageCircle className="size-3.5" /> Hablar con un asesor</a></div></section>
    </div>
  );
};

export { ContactPage };
