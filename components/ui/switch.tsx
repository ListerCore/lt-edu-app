import { Switch as SwitchPrimitive } from '@base-ui/react/switch';
import { cn } from 'cn';

const Switch = ({ className, ...props }: SwitchPrimitive.Root.Props) => (
  <SwitchPrimitive.Root
    data-slot="switch"
    className={cn(
      'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent p-0.5 outline-none transition-colors data-checked:bg-primary data-unchecked:bg-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb
      data-slot="switch-thumb"
      className="pointer-events-none block size-5 rounded-full bg-background shadow-sm ring-0 transition-transform data-checked:translate-x-5 data-unchecked:translate-x-0"
    />
  </SwitchPrimitive.Root>
);

export { Switch };
