import type { JSX } from 'react';

// "o con tu correo" separator between the Google button and the email form
export const AuthDivider = ({ label }: { label: string }): JSX.Element => (
  <div className="flex items-center gap-3 text-xs text-muted-foreground">
    <span aria-hidden="true" className="h-px flex-1 bg-border" />
    {label}
    <span aria-hidden="true" className="h-px flex-1 bg-border" />
  </div>
);
