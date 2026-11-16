'use client';

import Link from 'next/link';
import type { JSX } from 'react';
import { MonitorPlay, UserRound } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { StatusPill } from '@/features/protected/academic/components/academic-ui';
import { roomPath, roomStatusClass, roomStatusLabels } from '../data/classroom-data';
import type { RoomCardProps } from '../types';

// A room in the catalog: area, teacher and how much material it has; staff also see whether it is published
export const RoomCard = ({ room, family }: RoomCardProps): JSX.Element => (
  <Link href={roomPath(room.id)} className="group flex flex-col rounded-xl border border-border bg-background p-4 transition-colors hover:border-brand">
    <div className="flex items-start justify-between gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand" aria-hidden="true">
        <MorphIcon icon={MonitorPlay} size={16} />
      </span>
      {!family && <StatusPill className={roomStatusClass[room.status]}>{roomStatusLabels[room.status]}</StatusPill>}
    </div>
    <p className="mt-3 text-sm font-semibold text-foreground group-hover:text-brand">{room.subjectName}</p>
    <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <MorphIcon icon={UserRound} size={12} />
      {room.staffName || 'Sin docente asignado'}
    </p>
    <p className="mt-3 text-xs text-muted-foreground">
      {room.units === 0 ? 'Sin unidades aún' : `${room.units} ${room.units === 1 ? 'unidad' : 'unidades'} · ${room.items} ${room.items === 1 ? 'material' : 'materiales'}`}
    </p>
  </Link>
);
