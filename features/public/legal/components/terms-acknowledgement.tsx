'use client';

import { useState, type FormEvent, type JSX } from 'react';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TermsAcknowledgement = (): JSX.Element => {
  const [acknowledged, setAcknowledged] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setAcknowledged(true);
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border border-secondary/20 bg-secondary/5 p-4 sm:p-5">
      <div className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary/10 text-secondary"><BadgeCheck aria-hidden="true" className="size-4" /></span><div><h3 className="text-sm font-semibold text-foreground">Confirmación de lectura</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">Revisa también la Política de Privacidad antes de continuar.</p></div></div>
      <label className="flex items-start gap-2.5 text-xs leading-5 text-muted-foreground"><input type="checkbox" name="acknowledgement" required className="mt-1 size-4 shrink-0 accent-secondary" /><span className="flex items-start gap-2"><BadgeCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-secondary" /><span>He leído los Términos y Condiciones del Servicio y la <Link href="/legal/privacy" className="font-medium text-secondary underline underline-offset-4">Política de Privacidad y Protección de Datos Personales</Link>.</span></span></label>
      <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between"><Button type="submit" variant="secondary"><ShieldCheck aria-hidden="true" />Confirmar lectura <ArrowRight aria-hidden="true" /></Button><Link href="/contact" className="text-xs font-medium text-secondary underline underline-offset-4">Consultar con la institución</Link></div>
      {acknowledged && <p role="status" className="text-xs text-secondary">Gracias. Ya puedes continuar explorando la información del sitio.</p>}
    </form>
  );
};

export { TermsAcknowledgement };
