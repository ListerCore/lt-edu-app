'use client';

import { useState, type FormEvent, type JSX } from 'react';
import { ArrowRight, FileCheck2, IdCard, Mail, MessageSquareText, Scale, ShieldCheck, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const PrivacyRightsForm = (): JSX.Element => {
  const [sent, setSent] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const body = Array.from(values.entries()).map(([key, value]) => `${key}: ${String(value)}`).join('\n');
    const subject = encodeURIComponent('Solicitud de derechos ARCO · CEBA Joseph Lister');
    window.location.href = `mailto:informes@cebajosephlister.edu.pe?subject=${subject}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <form onSubmit={submit} className="mt-4 space-y-4 rounded-xl border border-border bg-background p-4 sm:p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Label className="flex-col items-stretch gap-1.5 text-xs"><span className="inline-flex items-center gap-2"><Scale className="size-3.5 text-secondary" />Tipo de derecho a ejercer</span>
          <Select name="Derecho solicitado" required defaultValue="" className="mt-1"><option value="" disabled>Selecciona un derecho</option><option>Acceso</option><option>Rectificación</option><option>Cancelación</option><option>Oposición</option></Select>
        </Label>
        <Label className="flex-col items-stretch gap-1.5 text-xs"><span className="inline-flex items-center gap-2"><UserRound className="size-3.5 text-secondary" />Nombres y apellidos</span>
          <Input name="Nombres y apellidos" autoComplete="name" placeholder="Nombre completo del titular" required />
        </Label>
        <Label className="flex-col items-stretch gap-1.5 text-xs"><span className="inline-flex items-center gap-2"><IdCard className="size-3.5 text-secondary" />DNI o carné de extranjería</span>
          <Input name="Documento de identidad" placeholder="Número de documento" required />
        </Label>
        <Label className="flex-col items-stretch gap-1.5 text-xs"><span className="inline-flex items-center gap-2"><Mail className="size-3.5 text-secondary" />Correo para recibir respuesta</span>
          <Input name="Correo electrónico" type="email" autoComplete="email" placeholder="nombre@ejemplo.com" required />
        </Label>
        <Label className="flex-col items-stretch gap-1.5 text-xs sm:col-span-2"><span className="inline-flex items-center gap-2"><MessageSquareText className="size-3.5 text-secondary" />Detalle de la solicitud</span>
          <Textarea name="Detalle de la solicitud" placeholder="Describe de forma clara los datos o el tratamiento relacionado con tu solicitud." required minLength={10} />
        </Label>
      </div>
      <label className="flex items-start gap-2.5 text-xs leading-5 text-muted-foreground"><input type="checkbox" name="Confirmación" value="Confirmo la titularidad de los datos" required className="mt-1 size-4 accent-secondary" /><span className="flex items-start gap-2"><ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-secondary" />Declaro que soy titular de los datos o representante autorizado y autorizo el uso de esta información para atender mi solicitud.</span></label>
      <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between"><Button type="submit" variant="secondary"><FileCheck2 aria-hidden="true" />Preparar solicitud ARCO <ArrowRight aria-hidden="true" /></Button><span className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground"><ShieldCheck className="size-3.5 text-secondary" />Se abrirá tu aplicación de correo</span></div>
      {sent && <p role="status" className="text-xs text-secondary">Revisa tu aplicación de correo y envía el mensaje para registrar tu solicitud.</p>}
    </form>
  );
};

export { PrivacyRightsForm };
