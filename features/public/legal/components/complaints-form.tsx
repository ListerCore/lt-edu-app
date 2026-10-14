'use client';

import { useRef, useState, type JSX, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Check, GraduationCap, LockKeyhole, MessageSquareText, UserRound } from 'lucide-react';

const inputClass = 'mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20';
const labelClass = 'block text-xs font-medium text-foreground';

const ComplaintForm = (): JSX.Element => {
  const [step, setStep] = useState(1);
  const formRef = useRef<HTMLFormElement>(null);

  const move = (next: number): void => {
    const current = formRef.current?.querySelector<HTMLElement>(`[data-step="${step}"]`);
    const required = current?.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('[required]') ?? [];
    for (const field of required) {
      if (!field.reportValidity()) return;
    }
    setStep(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const body = Array.from(values.entries())
      .map(([key, value]) => `${key}: ${String(value)}`)
      .join('\n');
    const subject = encodeURIComponent('Libro de Reclamaciones Virtual');
    window.location.href = `mailto:informes@cebajosephlister.edu.pe?subject=${subject}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form ref={formRef} onSubmit={submit} className="rounded-xl border border-border bg-card">
      <div className="grid grid-cols-3 border-b border-border px-3 py-5 sm:px-6">
        {['Identificación', 'Servicio', 'Reclamo / Queja'].map((label, index) => {
          const number = index + 1;
          const active = number === step;
          const complete = number < step;
          return (
            <div key={label} className="relative flex flex-col items-center gap-2 text-center">
              {index < 2 && <span className="absolute left-1/2 top-4 h-px w-full bg-border" />}
              <span className={`relative z-10 grid size-8 place-items-center rounded-full border text-xs font-bold ${active ? 'border-secondary bg-secondary text-secondary-foreground' : complete ? 'border-secondary bg-secondary/15 text-secondary' : 'border-border bg-background text-muted-foreground'}`}>{complete ? <Check aria-hidden="true" className="size-4" /> : number}</span>
              <span className={`text-[11px] font-semibold sm:text-xs ${active ? 'text-secondary' : 'text-muted-foreground'}`}>{label}</span>
            </div>
          );
        })}
      </div>

      <div data-step="1" hidden={step !== 1} className="space-y-5 p-4 sm:p-6">
        <div>
          <div className="flex items-center justify-between gap-3">
            <h2 className="inline-flex items-center gap-2 font-heading text-lg font-bold">
              <UserRound aria-hidden="true" className="size-5 text-secondary" />
              Identificación del consumidor
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-secondary/30 bg-secondary/10 px-2 py-1 text-[10px] font-semibold text-secondary">
              <LockKeyhole aria-hidden="true" className="size-3" /> Datos protegidos
            </span>
          </div>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">Ingresa los datos de la persona que presenta el reclamo.</p>
        </div>
        <label className={labelClass}>
          Nombres y apellidos completos *<input className={inputClass} name="Nombres y apellidos" autoComplete="name" required />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Tipo de documento *
            <select className={inputClass} name="Tipo de documento" required defaultValue="DNI">
              <option>DNI</option>
              <option>Carné de Extranjería</option>
              <option>Pasaporte</option>
              <option>Otro documento</option>
            </select>
          </label>
          <label className={labelClass}>
            Número de documento *<input className={inputClass} name="Número de documento" required />
          </label>
        </div>
        <label className={labelClass}>
          Domicilio para notificaciones *<input className={inputClass} name="Domicilio" autoComplete="street-address" required />
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className={labelClass}>
            Departamento *<input className={inputClass} name="Departamento" defaultValue="Ayacucho" required />
          </label>
          <label className={labelClass}>
            Provincia *<input className={inputClass} name="Provincia" defaultValue="Huamanga" required />
          </label>
          <label className={labelClass}>
            Distrito *<input className={inputClass} name="Distrito" required />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Teléfono celular / WhatsApp *<input className={inputClass} name="Teléfono" type="tel" autoComplete="tel" required />
          </label>
          <label className={labelClass}>
            Correo electrónico *<input className={inputClass} name="Correo electrónico" type="email" autoComplete="email" required />
          </label>
        </div>
        <label className="flex items-start gap-3 rounded-lg border border-border bg-background p-4 text-xs leading-5 text-muted-foreground">
          <input className="mt-0.5 size-4 accent-secondary" type="checkbox" name="Representante de menor de edad" value="Sí" /> <span>Presento esta solicitud en representación de una persona menor de edad y cuento con autorización para proporcionar sus datos.</span>
        </label>
        <div className="flex justify-end">
          <button type="button" onClick={() => move(2)} className="inline-flex h-11 items-center gap-2 rounded-lg bg-secondary px-5 text-xs font-semibold text-secondary-foreground transition-opacity hover:opacity-90">
            Continuar: servicio contratado <ArrowRight aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>

      <div data-step="2" hidden={step !== 2} className="space-y-5 p-4 sm:p-6">
        <div>
          <h2 className="inline-flex items-center gap-2 font-heading text-lg font-bold">
            <GraduationCap aria-hidden="true" className="size-5 text-secondary" />
            Identificación del servicio educativo
          </h2>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">Indica el servicio relacionado con tu reclamo o queja.</p>
        </div>
        <label className={labelClass}>
          Servicio contratado *
          <select className={inputClass} name="Servicio contratado" required defaultValue="">
            <option value="" disabled>
              Selecciona un servicio
            </option>
            <option>Matrícula</option>
            <option>Servicio educativo</option>
            <option>Plataforma virtual</option>
            <option>Atención y orientación</option>
            <option>Pagos o facturación</option>
            <option>Otro servicio</option>
          </select>
        </label>
        <label className={labelClass}>
          Monto reclamado (si corresponde)
          <input className={inputClass} name="Monto reclamado" inputMode="decimal" placeholder="S/ 0.00" />
        </label>
        <div className="rounded-lg border border-border bg-background p-4 text-xs leading-5 text-muted-foreground">
          Proveedor: <span className="font-semibold text-foreground">CEBA Privado Virtual Joseph Lister</span>
          <br />
          Sede de atención: Jr. 28 de Julio N.° 342, Huamanga, Ayacucho.
        </div>
        <div className="flex justify-between">
          <button type="button" onClick={() => setStep(1)} className="inline-flex h-11 items-center gap-2 rounded-lg border border-border px-4 text-xs font-semibold">
            <ArrowLeft aria-hidden="true" className="size-4" /> Volver
          </button>
          <button type="button" onClick={() => move(3)} className="inline-flex h-11 items-center gap-2 rounded-lg bg-secondary px-5 text-xs font-semibold text-secondary-foreground">
            Continuar: detalle <ArrowRight aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>

      <div data-step="3" hidden={step !== 3} className="space-y-5 p-4 sm:p-6">
        <div>
          <h2 className="inline-flex items-center gap-2 font-heading text-lg font-bold">
            <MessageSquareText aria-hidden="true" className="size-5 text-secondary" />
            Detalle de la reclamación
          </h2>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">Describe lo ocurrido y la solución que solicitas.</p>
        </div>
        <label className={labelClass}>
          Tipo de comunicación *
          <select className={inputClass} name="Tipo de comunicación" required defaultValue="Reclamo">
            <option>Reclamo</option>
            <option>Queja</option>
          </select>
        </label>
        <label className={labelClass}>
          Detalle de los hechos *<textarea className={`${inputClass} h-32 py-3`} name="Detalle" required minLength={10} />
        </label>
        <label className={labelClass}>
          Pedido o solución solicitada *<textarea className={`${inputClass} h-24 py-3`} name="Pedido solicitado" required />
        </label>
        <label className="flex items-start gap-3 text-xs leading-5 text-muted-foreground">
          <input className="mt-0.5 size-4 accent-secondary" type="checkbox" required />{' '}
          <span>
            Confirmo que la información proporcionada es correcta y autorizo su uso para atender esta solicitud conforme a la{' '}
            <a className="font-medium text-secondary underline underline-offset-4" href="/legal/privacy">
              Política de Privacidad
            </a>
            .
          </span>
        </label>
        <div className="rounded-lg border border-border bg-background p-3 text-xs leading-5 text-muted-foreground">Al continuar, se abrirá tu aplicación de correo con la solicitud preparada para que la revises y la envíes. El registro se inicia cuando el correo sea enviado.</div>
        <div className="flex justify-between">
          <button type="button" onClick={() => setStep(2)} className="inline-flex h-11 items-center gap-2 rounded-lg border border-border px-4 text-xs font-semibold">
            <ArrowLeft aria-hidden="true" className="size-4" /> Volver
          </button>
          <button type="submit" className="inline-flex h-11 items-center gap-2 rounded-lg bg-secondary px-5 text-xs font-semibold text-secondary-foreground">
            Preparar reclamo <ArrowRight aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
    </form>
  );
};

export { ComplaintForm };
