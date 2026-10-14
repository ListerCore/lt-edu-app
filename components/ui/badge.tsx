import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, JSX } from 'react';
import { cn } from 'cn';

const badgeVariants = cva('inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold leading-none transition-colors', {
  variants: {
    variant: {
      default: 'border-transparent bg-primary text-primary-foreground',
      secondary: 'border-secondary/25 bg-secondary/10 text-secondary',
      outline: 'border-border bg-card text-muted-foreground',
    },
  },
  defaultVariants: { variant: 'default' },
});

interface BadgeProps extends ComponentProps<'span'>, VariantProps<typeof badgeVariants> {}

const Badge = ({ className, variant, ...props }: BadgeProps): JSX.Element => <span data-slot="badge" className={cn(badgeVariants({ variant, className }))} {...props} />;

export { Badge, badgeVariants };
