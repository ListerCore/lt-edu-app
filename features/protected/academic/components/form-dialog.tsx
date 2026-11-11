'use client';

import type { FormEvent, JSX, ReactNode } from 'react';
import { LoaderCircle } from 'lucide';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MorphIcon } from '@/components/ui/morph-icon';
import { cn } from '@/lib/utils';

interface FormDialogProps {
  title: string;
  description?: string;
  submitLabel: string;
  isPending: boolean;
  onSubmit: () => void;
  onClose: () => void;
  wide?: boolean;
  // Submit unavailable without being busy (nothing chosen yet)
  disabled?: boolean;
  children: ReactNode;
}

// A dialog that is mounted only while open, so every opening starts from fresh values
export const FormDialog = ({ title, description, submitLabel, isPending, onSubmit, onClose, wide, disabled, children }: FormDialogProps): JSX.Element => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <Dialog open onOpenChange={(open): void => (open || isPending ? undefined : onClose())}>
      <DialogContent className={cn('max-h-[92svh] overflow-y-auto', wide ? 'sm:max-w-2xl' : 'sm:max-w-lg')}>
        <form onSubmit={handleSubmit} noValidate className="grid gap-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          <div className="grid gap-5">{children}</div>
          <DialogFooter>
            <button type="button" onClick={onClose} disabled={isPending} className="btn-alt">
              Cancelar
            </button>
            <button type="submit" disabled={isPending || disabled} className="btn-brand">
              {isPending && <MorphIcon icon={LoaderCircle} size={16} className="animate-spin" />}
              {submitLabel}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
