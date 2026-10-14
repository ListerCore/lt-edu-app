import type { ComponentProps, JSX } from 'react';
import { cn } from 'cn';

type TextareaProps = ComponentProps<'textarea'>;

const Textarea = ({ className, ...props }: TextareaProps): JSX.Element => (
  <textarea data-slot="textarea" className={cn('min-h-24 w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-xs outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 dark:bg-input/30', className)} {...props} />
);

export { Textarea };
