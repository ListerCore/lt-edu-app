import type { JSX } from 'react';
import { Check, Circle } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { passwordRules } from '../data/auth-data';
import type { PasswordChecklistProps } from '../types';

// Live password requirements; each icon morphs from circle to check as the rule is met
export const PasswordChecklist = ({ password }: PasswordChecklistProps): JSX.Element => (
  <ul aria-label="Requisitos de la contraseña" className="grid grid-cols-1 gap-1.5 text-xs sm:grid-cols-2">
    {passwordRules.map(({ label, test }): JSX.Element => {
      const met = test(password);
      return (
        <li key={label} className={`flex items-center gap-2 transition-colors ${met ? 'text-success' : 'text-muted-foreground'}`}>
          <MorphIcon icon={met ? Check : Circle} size={14} strokeWidth={met ? 2.5 : 2} />
          {label}
          <span className="sr-only">{met ? '(cumplido)' : '(pendiente)'}</span>
        </li>
      );
    })}
  </ul>
);
