'use client';

import { useRef, useState, type FormEvent, type JSX } from 'react';
import { ArrowLeft, ArrowRight, Banknote, Check, ClipboardCheck, ContactRound, FileText, GraduationCap, IdCard, LockKeyhole, Mail, MapPin, MapPinned, MessageSquareText, MessagesSquare, Phone, ShieldCheck, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FieldLabel } from './field-label';

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
    const values = new FormData(event.currentTarget);
    const body = Array.from(values.entries())
      .map(([key, value]) => `${key}: ${String(value)}`)
      .join('\n');
    const subject = encodeURIComponent('Libro de Reclamaciones Virtual');
    window.location.href = `mailto:informes@cebajosephlister.edu.pe?subject=${subject}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form ref={formRef} onSubmit={submit}>
      <Card className="gap-0 py-0">
        <CardContent className="flex-none border-b border-border px-3 py-5 sm:px-6">
          <div className="grid grid-cols-3">
            {['Identificación', 'Servicio', 'Reclamo / Queja'].map((label, index) => {
              const number = index + 1;
              const active = number === step;
              const complete = number < step;
              return (
                <div key={label} className="relative flex flex-col items-center gap-2 text-center">
                  {index < 2 && <span className="absolute left-1/2 top-4 h-px w-full bg-border" />}
                  <span className={`relative z-10 grid size-8 place-items-center rounded-full border text-xs font-bold ${active ? 'border-secondary bg-secondary text-secondary-foreground' : complete ? 'border-secondary bg-secondary/15 text-secondary' : 'border-border bg-background text-muted-foreground'}`}>
                    {complete ? <Check aria-hidden="true" className="size-4" /> : number}
                  </span>
                  <span className={`text-[11px] font-semibold sm:text-xs ${active ? 'text-secondary' : 'text-muted-foreground'}`}>{label}</span>
                </div>
              );
            })}
          </div>
        </CardContent>

        <CardContent data-step="1" className={`space-y-5 p-4 sm:p-6 ${step !== 1 ? 'hidden' : ''}`} hidden={step !== 1}>
          <div>
            <div className="flex items-center justify-between gap-3">
              <h2 className="inline-flex items-center gap-2 font-heading text-lg font-bold"><UserRound aria-hidden="true" className="size-5 text-secondary" />Identificación del consumidor</h2>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-secondary/30 bg-secondary/10 px-2 py-1 text-[10px] font-semibold text-secondary"><LockKeyhole aria-hidden="true" className="size-3" /> Datos protegidos</span>
            </div>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">Ingresa los datos de la persona que presenta el reclamo.</p>
          </div>
          <FieldLabel icon={UserRound} label="Nombres y apellidos completos *"><Input className="mt-0.5" name="Nombres y apellidos" autoComplete="name" placeholder="Ej. Juan Carlos Mendoza Quispe" required /></FieldLabel>
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldLabel icon={ContactRound} label="Tipo de documento *"><Select className="mt-0.5" name="Tipo de documento" required defaultValue="DNI"><option>DNI</option><option>Carné de Extranjería</option><option>Pasaporte</option><option>Otro documento</option></Select></FieldLabel>
            <FieldLabel icon={IdCard} label="Número de documento *"><Input className="mt-0.5" name="Número de documento" placeholder="8 dígitos para DNI" required /></FieldLabel>
          </div>
          <FieldLabel icon={MapPin} label="Domicilio para notificaciones *"><Input className="mt-0.5" name="Domicilio" autoComplete="street-address" placeholder="Av., Jr., calle, urbanización y número" required /></FieldLabel>
          <div className="grid gap-4 sm:grid-cols-3">
            <FieldLabel icon={MapPinned} label="Departamento *"><Input className="mt-0.5" name="Departamento" placeholder="Ej. Ayacucho" required /></FieldLabel>
            <FieldLabel icon={MapPinned} label="Provincia *"><Input className="mt-0.5" name="Provincia" placeholder="Ej. Huamanga" required /></FieldLabel>
            <FieldLabel icon={MapPin} label="Distrito *"><Input className="mt-0.5" name="Distrito" placeholder="Ej. Ayacucho (Cercado)" required /></FieldLabel>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldLabel icon={Phone} label="Teléfono celular / WhatsApp *"><Input className="mt-0.5" name="Teléfono" type="tel" autoComplete="tel" placeholder="+51 966 000 000" required /></FieldLabel>
            <FieldLabel icon={Mail} label="Correo electrónico *"><Input className="mt-0.5" name="Correo electrónico" type="email" autoComplete="email" placeholder="nombre@ejemplo.com" required /></FieldLabel>
          </div>
          <label className="flex items-start gap-3 rounded-lg border border-border bg-background p-4 text-xs leading-5 text-muted-foreground">
            <input className="mt-0.5 size-4 accent-secondary" type="checkbox" name="Representante de menor de edad" value="Sí" />
            <span className="flex items-start gap-2"><UserRound aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-secondary" />Presento esta solicitud en representación de una persona menor de edad y cuento con autorización para proporcionar sus datos.</span>
          </label>
          <div className="flex justify-end"><Button type="button" size="lg" variant="secondary" onClick={() => move(2)}>Continuar: servicio contratado <ArrowRight aria-hidden="true" /></Button></div>
        </CardContent>

        <CardContent data-step="2" className={`space-y-5 p-4 sm:p-6 ${step !== 2 ? 'hidden' : ''}`} hidden={step !== 2}>
          <div><h2 className="inline-flex items-center gap-2 font-heading text-lg font-bold"><GraduationCap aria-hidden="true" className="size-5 text-secondary" />Identificación del servicio educativo</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">Indica el servicio relacionado con tu reclamo o queja.</p></div>
          <FieldLabel icon={GraduationCap} label="Servicio contratado *"><Select className="mt-0.5" name="Servicio contratado" required defaultValue=""><option value="" disabled>Selecciona un servicio</option><option>Matrícula</option><option>Servicio educativo</option><option>Plataforma virtual</option><option>Atención y orientación</option><option>Pagos o facturación</option><option>Otro servicio</option></Select></FieldLabel>
          <FieldLabel icon={Banknote} label="Monto reclamado (si corresponde)"><Input className="mt-0.5" name="Monto reclamado" inputMode="decimal" placeholder="S/ 0.00" /></FieldLabel>
          <div className="rounded-lg border border-border bg-background p-4 text-xs leading-5 text-muted-foreground">Proveedor: <span className="font-semibold text-foreground">CEBA Privado Virtual Joseph Lister</span><br />Sede de atención: Jr. 28 de Julio N.° 342, Huamanga, Ayacucho.</div>
          <div className="flex justify-between"><Button type="button" size="lg" variant="outline" onClick={() => setStep(1)}><ArrowLeft aria-hidden="true" />Volver</Button><Button type="button" size="lg" variant="secondary" onClick={() => move(3)}>Continuar: detalle <ArrowRight aria-hidden="true" /></Button></div>
        </CardContent>

        <CardContent data-step="3" className={`space-y-5 p-4 sm:p-6 ${step !== 3 ? 'hidden' : ''}`} hidden={step !== 3}>
          <div><h2 className="inline-flex items-center gap-2 font-heading text-lg font-bold"><MessageSquareText aria-hidden="true" className="size-5 text-secondary" />Detalle de la reclamación</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">Describe lo ocurrido y la solución que solicitas.</p></div>
          <FieldLabel icon={MessagesSquare} label="Tipo de comunicación *"><Select className="mt-0.5" name="Tipo de comunicación" required defaultValue="Reclamo"><option>Reclamo</option><option>Queja</option></Select></FieldLabel>
          <FieldLabel icon={FileText} label="Detalle de los hechos *"><Textarea className="mt-0.5 min-h-32" name="Detalle" placeholder="Describe qué ocurrió, cuándo y cómo te afectó." required minLength={10} /></FieldLabel>
          <FieldLabel icon={ClipboardCheck} label="Pedido o solución solicitada *"><Textarea className="mt-0.5 min-h-24" name="Pedido solicitado" placeholder="Indica qué solución esperas recibir." required /></FieldLabel>
          <label className="flex items-start gap-3 text-xs leading-5 text-muted-foreground"><input className="mt-0.5 size-4 accent-secondary" type="checkbox" required /><span className="flex items-start gap-2"><ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-secondary" /><span>Confirmo que la información proporcionada es correcta y autorizo su uso para atender esta solicitud conforme a la <a className="font-medium text-secondary underline underline-offset-4" href="/legal/privacy">Política de Privacidad</a>.</span></span></label>
          <div className="rounded-lg border border-border bg-background p-3 text-xs leading-5 text-muted-foreground">Al continuar, se abrirá tu aplicación de correo con la solicitud preparada para que la revises y la envíes. El registro se inicia cuando el correo sea enviado.</div>
          <div className="flex justify-between"><Button type="button" size="lg" variant="outline" onClick={() => setStep(2)}><ArrowLeft aria-hidden="true" />Volver</Button><Button type="submit" size="lg" variant="secondary">Preparar reclamo <ArrowRight aria-hidden="true" /></Button></div>
        </CardContent>
      </Card>
    </form>
  );
};

export { ComplaintForm };
