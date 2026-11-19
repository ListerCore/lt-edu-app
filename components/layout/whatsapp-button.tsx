import Image from 'next/image';
import type { JSX } from 'react';
import type { WhatsAppButtonProps } from './types';

// Floating chat button, bottom right on every public page; opens WhatsApp with the preset message
export const WhatsAppButton = ({ number, message }: WhatsAppButtonProps): JSX.Element => (
  <a href={`https://wa.me/${number}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" aria-label="Escríbenos por WhatsApp" title="Escríbenos por WhatsApp" className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex size-14 items-center justify-center rounded-full border border-border bg-background shadow-lg transition-transform hover:scale-105 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:scale-100 md:right-6 md:bottom-6 print:hidden">
    <Image src="/icons/whatsapp-icon.svg" alt="" width={32} height={32} unoptimized className="size-8" />
  </a>
);
