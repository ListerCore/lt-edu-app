'use client';

import { useRef, useState, type FormEvent, type JSX } from 'react';
import { ArrowLeft, ArrowRight, Banknote, Check, ClipboardCheck, ContactRound, FileText, GraduationCap, IdCard, LockKeyhole, Mail, MapPin, MapPinned, MessageSquareText, MessagesSquare, Phone, ShieldCheck, UserRound, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FieldLabel } from './field-label';

const ComplaintForm = (): JSX.Element => {
  const [step, setStep] = useState(1);
  const [isMinor, setIsMinor] = useState(false);
  const [amountNotApplicable, setAmountNotApplicable] = useState(false);
  const [detailLength, setDetailLength] = useState(0);
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
    const attachments = values.getAll('Evidencias').filter((value): value is File => value instanceof File && value.size > 0);
    const body = [
      ...Array.from(values.entries()).filter(([key]) => key !== 'Evidencias').map(([key, value]) => `${key}: ${String(value)}`),
      ...(attachments.length > 0 ? [`Evidencias seleccionadas: ${attachments.map((file) => file.name).join(', ')}`, 'Adjunta manualmente estos archivos en el correo antes de enviarlo.'] : []),
    ].join('\n');
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
          <label className="flex items-start gap-3 rounded-lg border border-border bg-background p-3 text-xs leading-5 text-muted-foreground"><input type="checkbox" className="mt-0.5 size-4 accent-secondary" checked={isMinor} onChange={(event) => setIsMinor(event.currentTarget.checked)} /><span className="flex items-start gap-2"><UserRound aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-secondary" /><span><span className="font-semibold text-foreground">El estudiante o reclamante es menor de edad.</span> Marca esta casilla para ingresar los datos del apoderado autorizado.</span></span></label>
          {isMinor && <div className="grid gap-4 rounded-lg border border-secondary/20 bg-secondary/5 p-4 sm:grid-cols-2"><FieldLabel icon={UserRound} label="Nombres y apellidos del apoderado *"><Input name="Apoderado: nombres y apellidos" placeholder="Nombre completo" required /></FieldLabel><FieldLabel icon={IdCard} label="DNI o documento del apoderado *"><Input name="Apoderado: documento" placeholder="Número de documento" required /></FieldLabel><FieldLabel icon={ContactRound} label="Parentesco o representación *"><Input name="Apoderado: parentesco" placeholder="Ej. Madre, padre o tutor" required /></FieldLabel><FieldLabel icon={Phone} label="Teléfono del apoderado *"><Input name="Apoderado: teléfono" type="tel" placeholder="+51 966 000 000" required /></FieldLabel></div>}
          <label className="flex items-start gap-3 rounded-lg border border-border bg-background p-4 text-xs leading-5 text-muted-foreground">
            <input className="mt-0.5 size-4 accent-secondary" type="checkbox" name="Representante de menor de edad" value="Sí" />
            <span className="flex items-start gap-2"><UserRound aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-secondary" />Presento esta solicitud en representación de una persona menor de edad y cuento con autorización para proporcionar sus datos.</span>
          </label>
          <div className="flex justify-end"><Button type="button" size="lg" variant="secondary" onClick={() => move(2)}>Continuar: servicio contratado <ArrowRight aria-hidden="true" /></Button></div>
        </CardContent>

        <CardContent data-step="2" className={`space-y-5 p-4 sm:p-6 ${step !== 2 ? 'hidden' : ''}`} hidden={step !== 2}>
          <div><h2 className="inline-flex items-center gap-2 font-heading text-lg font-bold"><GraduationCap aria-hidden="true" className="size-5 text-secondary" />Identificación del servicio educativo</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">Indica el servicio relacionado con tu reclamo o queja.</p></div>
          <FieldLabel icon={GraduationCap} label="Servicio contratado *"><Select className="mt-0.5" name="Servicio contratado" required defaultValue=""><option value="" disabled>Selecciona un servicio</option><option>Matrícula institucional</option><option>Pensión mensual</option><option>Aula virtual SIGE-JL</option><option>Certificados y trámites</option><option>Tutoría y docencia</option><option>Otro servicio</option></Select></FieldLabel>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end"><FieldLabel icon={Banknote} label="Monto reclamado en soles (si corresponde)"><Input className="mt-0.5" name="Monto reclamado" inputMode="decimal" placeholder="S/ 0.00" disabled={amountNotApplicable} /></FieldLabel><label className="flex min-h-9 items-center gap-2 text-xs text-muted-foreground"><input type="checkbox" name="Monto no aplica" value="Sí" className="size-4 accent-secondary" checked={amountNotApplicable} onChange={(event) => setAmountNotApplicable(event.currentTarget.checked)} /><Banknote aria-hidden="true" className="size-3.5 text-secondary" />No aplica</label></div>
          <FieldLabel icon={FileText} label="Descripción del servicio o ciclo contratado *"><Input className="mt-0.5" name="Descripción del servicio" placeholder="Ej. Ciclo Avanzado, modalidad virtual" required /></FieldLabel>
          <div className="rounded-lg border border-border bg-background p-4 text-xs leading-5 text-muted-foreground">Proveedor: <span className="font-semibold text-foreground">CEBA Privado Virtual Joseph Lister</span><br />Sede de atención: Jr. 28 de Julio N.° 342, Huamanga, Ayacucho.</div>
          <div className="flex justify-between"><Button type="button" size="lg" variant="outline" onClick={() => setStep(1)}><ArrowLeft aria-hidden="true" />Volver</Button><Button type="button" size="lg" variant="secondary" onClick={() => move(3)}>Continuar: detalle <ArrowRight aria-hidden="true" /></Button></div>
        </CardContent>

        <CardContent data-step="3" className={`space-y-5 p-4 sm:p-6 ${step !== 3 ? 'hidden' : ''}`} hidden={step !== 3}>
          <div><h2 className="inline-flex items-center gap-2 font-heading text-lg font-bold"><MessageSquareText aria-hidden="true" className="size-5 text-secondary" />Detalle de la reclamación</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">Describe lo ocurrido y la solución que solicitas.</p></div>
          <fieldset className="space-y-2"><legend className="mb-2 inline-flex items-center gap-2 text-xs font-medium"><MessagesSquare aria-hidden="true" className="size-4 text-secondary" />Naturaleza de la hoja de reclamación *</legend><label className="flex cursor-pointer gap-3 rounded-lg border border-border bg-background p-3 text-xs"><input type="radio" name="Tipo de comunicación" value="Reclamo" required defaultChecked className="mt-0.5 size-4 accent-secondary" /><span><span className="font-semibold text-foreground">Reclamo</span><br /><span className="text-muted-foreground">Disconformidad relacionada con el servicio educativo contratado.</span></span></label><label className="flex cursor-pointer gap-3 rounded-lg border border-border bg-background p-3 text-xs"><input type="radio" name="Tipo de comunicación" value="Queja" required className="mt-0.5 size-4 accent-secondary" /><span><span className="font-semibold text-foreground">Queja</span><br /><span className="text-muted-foreground">Disconformidad relacionada con la atención recibida.</span></span></label></fieldset>
          <FieldLabel icon={FileText} label={`Detalle pormenorizado de los hechos * · ${detailLength} / 1500`}><Textarea className="mt-0.5 min-h-32" name="Detalle" placeholder="Describe qué ocurrió, cuándo y cómo te afectó." required minLength={10} maxLength={1500} onChange={(event) => setDetailLength(event.currentTarget.value.length)} /></FieldLabel>
          <FieldLabel icon={ClipboardCheck} label="Pedido o solución solicitada *"><Textarea className="mt-0.5 min-h-24" name="Pedido solicitado" placeholder="Indica qué solución esperas recibir." required /></FieldLabel>
          <FieldLabel icon={Upload} label="Documentos de respaldo o evidencias (opcional)"><Input className="mt-0.5 h-auto min-h-10 cursor-pointer py-2 text-xs file:mr-3 file:rounded file:border-0 file:bg-secondary/10 file:px-2 file:py-1 file:text-[10px] file:font-semibold file:text-secondary" type="file" name="Evidencias" accept=".pdf,.jpg,.jpeg,.png" multiple /></FieldLabel>
          <label className="flex items-start gap-3 text-xs leading-5 text-muted-foreground"><input className="mt-0.5 size-4 accent-secondary" type="checkbox" required /><span className="flex items-start gap-2"><ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-secondary" /><span>Confirmo que la información proporcionada es correcta y autorizo su uso para atender esta solicitud conforme a la <a className="font-medium text-secondary underline underline-offset-4" href="/legal/privacy">Política de Privacidad</a>.</span></span></label>
          <div className="rounded-lg border border-border bg-background p-3 text-xs leading-5 text-muted-foreground">Al continuar, se abrirá tu aplicación de correo con la solicitud preparada para que la revises y la envíes. Si seleccionaste evidencias, adjúntalas manualmente al correo antes de enviarlo.</div>
          <div className="flex justify-between"><Button type="button" size="lg" variant="outline" onClick={() => setStep(2)}><ArrowLeft aria-hidden="true" />Volver</Button><Button type="submit" size="lg" variant="secondary">Preparar reclamo <ArrowRight aria-hidden="true" /></Button></div>
        </CardContent>
      </Card>
    </form>
  );
};

export { ComplaintForm };
