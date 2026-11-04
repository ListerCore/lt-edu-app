'use client';

import { useState, type ComponentProps, type JSX } from 'react';
import { Eye, EyeOff } from 'lucide';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';

// Password input with a show/hide toggle; the eye morphs between both states
export const PasswordInput = ({ className, ...props }: Omit<ComponentProps<typeof Input>, 'type'>): JSX.Element => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input type={visible ? 'text' : 'password'} className={`${className ?? ''} pr-11`} {...props} />
      <button type="button" onClick={(): void => setVisible(!visible)} aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'} aria-pressed={visible} className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground transition-colors hover:text-brand">
        <MorphIcon icon={visible ? EyeOff : Eye} size={16} />
      </button>
    </div>
  );
};
