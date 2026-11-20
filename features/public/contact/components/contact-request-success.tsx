import type { JSX } from 'react';
import { MailCheck, RotateCcw } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { siteConfig } from '@/lib/site';
import type { ContactRequestSuccessProps } from '../types';

// Shown in place of the form once lt-edu-api stored the inquiry
export const ContactRequestSuccess = ({ email, onReset }: ContactRequestSuccessProps): JSX.Element => (
  <div role="status" className="flex min-h-128 flex-col items-center justify-center gap-6 p-6 text-center md:p-10">
    <span className="flex size-14 items-center justify-center rounded-full bg-success/12 text-success">
      <MorphIcon icon={MailCheck} size={28} />
    </span>
    <div>
      <h3 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
        Recibimos tu <span className="text-gradient">mensaje.</span>
      </h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
        Lo revisamos y te responderemos a <span className="font-medium text-foreground">{email}</span> en un día hábil. Si es urgente, escríbenos a <span className="font-medium text-foreground">{siteConfig.emails.info}</span>.
      </p>
    </div>
    <button type="button" onClick={onReset} className="btn-alt">
      <MorphIcon icon={RotateCcw} size={16} />
      Escribir otro mensaje
    </button>
  </div>
);
