import type { JSX } from 'react';
import type { AuthCardProps } from '../types';

// Shared card for every auth screen: heading, short description, form body and an optional footer line
export const AuthCard = ({ id, title, description, children, footer }: AuthCardProps): JSX.Element => (
  <section aria-labelledby={id} className="mt-8 rounded-2xl border border-border bg-background p-6 shadow-[0_24px_64px_-32px_rgb(0_0_0/0.3)] md:p-8">
    <h1 id={id} className="text-xl font-semibold tracking-tight text-foreground">
      {title}
    </h1>
    <div className="mt-1 mb-6 text-sm leading-6 text-muted-foreground">{description}</div>
    {children}
    {footer && <div className="mt-6 border-t border-border pt-5 text-center text-sm text-muted-foreground">{footer}</div>}
  </section>
);
