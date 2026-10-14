import type { ComponentProps, JSX } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from 'cn';

type SelectProps = ComponentProps<'select'>;

const Select = ({ className, ...props }: SelectProps): JSX.Element => (
  <span className="relative block w-full">
    <select data-slot="select" className={cn('h-9 w-full min-w-0 appearance-none rounded-md border border-input bg-transparent px-2.5 py-1 pr-9 text-base text-foreground shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 md:text-sm dark:bg-input/30', className)} {...props} />
    <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
  </span>
);

export { Select };
