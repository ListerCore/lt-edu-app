'use client';

import { useRef, type ClipboardEvent, type JSX, type KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import type { OtpInputProps } from '../types';

// One box per digit: typing advances, Backspace goes back, pasting fills every box; completing submits
export const OtpInput = ({ digits, invalid, disabled, onChange, onComplete }: OtpInputProps): JSX.Element => {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const focus = (index: number): void => inputs.current[Math.max(0, Math.min(index, digits.length - 1))]?.focus();

  // Writes digits starting at `index`; used both for a single keystroke and for a pasted code
  const fill = (index: number, value: string): void => {
    const incoming = value.replace(/\D/g, '').slice(0, digits.length - index).split('');
    if (incoming.length === 0) return;
    const next = [...digits];
    incoming.forEach((digit, offset) => {
      next[index + offset] = digit;
    });
    onChange(next);
    focus(index + incoming.length);
    if (next.every(Boolean)) onComplete();
  };

  const onKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Backspace' && !digits[index]) {
      event.preventDefault();
      const next = [...digits];
      next[index - 1] = '';
      if (index > 0) onChange(next);
      focus(index - 1);
    }
    if (event.key === 'ArrowLeft') focus(index - 1);
    if (event.key === 'ArrowRight') focus(index + 1);
  };

  const onPaste = (index: number, event: ClipboardEvent<HTMLInputElement>): void => {
    event.preventDefault();
    fill(index, event.clipboardData.getData('text'));
  };

  return (
    <div role="group" aria-label="Código de verificación" className="flex justify-between gap-2">
      {digits.map((digit, index): JSX.Element => (
        <input placeholder="·"
          key={index}
          ref={(element): void => {
            inputs.current[index] = element;
          }}
          value={digit}
          disabled={disabled}
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={digits.length}
          aria-label={`Dígito ${index + 1}`}
          aria-invalid={invalid}
          autoFocus={index === 0}
          onChange={(event): void => {
            const raw = event.target.value.replace(/\D/g, '');
            if (!raw) {
              const next = [...digits];
              next[index] = '';
              onChange(next);
              return;
            }
            // The box is selected on focus, so extra characters mean an autofill or a typed digit after the old one
            fill(index, digit && raw.length > 1 && raw.startsWith(digit) ? raw.slice(1) : raw);
          }}
          onKeyDown={(event): void => onKeyDown(index, event)}
          onPaste={(event): void => onPaste(index, event)}
          onFocus={(event): void => event.target.select()}
          className={cn('placeholder:text-muted-foreground/60 size-12 rounded-lg border bg-background text-center font-mono text-xl font-semibold text-foreground outline-none transition-colors focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/20 disabled:opacity-60 sm:size-14', invalid ? 'border-destructive' : 'border-input')}
        />
      ))}
    </div>
  );
};
