'use client';

import Link from 'next/link';
import { useRef, type JSX } from 'react';
import { Camera, IdCard, LoaderCircle, Mail } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { IMAGE_TYPES } from '@/features/protected/announcements/data/announcements-data';
import { UserAvatar } from '@/features/protected/dashboard/components/user-avatar';
import { useFileDrop } from '@/hooks/use-file-drop';
import { cn } from '@/lib/utils';
import type { AccountHeaderProps } from '../types';

// Identity block: photo (click or drop to change; it is the photo the ID card prints), name, email and the role in use
export const AccountHeader = ({ account, activeRole, photoUrl, isPhotoPending, photoError, onPhotoSelect }: AccountHeaderProps): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isDragging, dropHandlers } = useFileDrop(onPhotoSelect);

  return (
    <header className="flex flex-col gap-6 rounded-2xl border border-border bg-background p-6 md:flex-row md:items-center md:p-8">
      <div className="flex flex-col items-start gap-2">
        <button type="button" {...dropHandlers} onClick={(): void => inputRef.current?.click()} disabled={isPhotoPending} aria-label={photoUrl ? 'Cambiar foto de perfil' : 'Subir foto de perfil'} className={cn('group relative rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:ring-offset-background', isDragging && 'ring-4 ring-brand ring-offset-4 ring-offset-background')}>
          <UserAvatar name={account.fullName} avatarUrl={photoUrl ?? account.avatarUrl} className="size-24 text-2xl" />
          <span className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full bg-brand-solid text-white ring-4 ring-background transition-transform group-hover:scale-110">
            <MorphIcon icon={isPhotoPending ? LoaderCircle : Camera} size={14} className={isPhotoPending ? 'animate-spin' : ''} />
          </span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={IMAGE_TYPES.join(',')}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(event): void => {
            const file = event.target.files?.item(0);
            if (file) onPhotoSelect(file);
            event.target.value = '';
          }}
        />
        {photoError && (
          <p role="alert" className="max-w-40 text-xs text-destructive">
            {photoError}
          </p>
        )}
      </div>

      <div className="min-w-0 flex-1">
        {activeRole && <span className="pill bg-brand-soft text-brand">{activeRole.name}</span>}
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{account.fullName}</h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MorphIcon icon={Mail} size={14} />
          <span className="truncate">{account.email}</span>
        </p>
        {activeRole?.institution && <p className="mt-3 text-sm text-muted-foreground">{activeRole.institution.name}</p>}
        <p className="mt-2 text-xs text-muted-foreground">Tu foto es la que se imprime en tu carnet. Haz clic en ella o arrastra una nueva para cambiarla.</p>
      </div>

      <div className="flex flex-wrap gap-2 md:flex-col md:items-stretch">
        <Link href="/dashboard/cards" className="btn-alt">
          <MorphIcon icon={IdCard} size={16} />
          Ver carnet
        </Link>
      </div>
    </header>
  );
};
