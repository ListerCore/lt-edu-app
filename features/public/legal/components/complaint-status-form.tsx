'use client';

import type { FormEvent, JSX } from 'react';
import { ArrowRight, FileSearch, FileText, IdCard, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ComplaintStatusForm = (): JSX.Element => {
  const submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const body = Array.from(values.entries()).map(([key, value]) => `${key}: ${String(value)}`).join('\n');
    const subject = encodeURIComponent('Consulta de estado de reclamación · CEBA Joseph Lister');
    window.location.href = `mailto:informes@cebajosephlister.edu.pe?subject=${subject}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form onSubmit={submit} className="mt-5 grid gap-4 rounded-xl border border-border bg-background p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
      <Label className="flex-col items-stretch gap-1.5 text-xs"><span className="inline-flex items-center gap-2"><FileText className="size-3.5 text-secondary" />Número de hoja de reclamación</span><Input name="Número de hoja" placeholder="Ej. 0001-2026-JL" required /></Label>
      <Label className="flex-col items-stretch gap-1.5 text-xs"><span className="inline-flex items-center gap-2"><IdCard className="size-3.5 text-secondary" />Número de documento</span><Input name="DNI o CE" placeholder="Documento registrado" required /></Label>
      <Button type="submit" variant="secondary" className="h-9 text-xs"><FileSearch aria-hidden="true" />Consultar por correo <ArrowRight aria-hidden="true" /></Button>
      <p className="inline-flex items-center gap-1.5 text-[10px] leading-4 text-muted-foreground sm:col-span-3"><ShieldCheck aria-hidden="true" className="size-3.5 shrink-0 text-secondary" />Se preparará un correo para que el equipo verifique y responda el estado de tu solicitud. Evita incluir información que no sea necesaria.</p>
    </form>
  );
};

export { ComplaintStatusForm };
