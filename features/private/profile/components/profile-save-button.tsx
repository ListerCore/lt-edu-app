import type { JSX } from 'react';
import { Check } from 'lucide-react';

const ProfileSaveButton = (): JSX.Element => (
  <button type="button" className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-3.5 text-[10px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:text-[11px]">
    <Check aria-hidden="true" className="size-3.5" />
    Guardar cambios
  </button>
);

export { ProfileSaveButton };
