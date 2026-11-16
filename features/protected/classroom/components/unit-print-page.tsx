'use client';

import type { JSX } from 'react';
import { Printer } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { formatDay } from '@/features/protected/academic/data/academic-data';
import { formatLive, itemKinds } from '../data/classroom-data';
import { useGetRoom } from '../hooks/use-get-room';
import type { UnitPrintProps } from '../types';

// Printable package of a unit for the itinerant distance form: its texts, activities and links on paper, with room
// for the student's name and the dates of delivery and return
export const UnitPrintPage = ({ roomId, unitId }: UnitPrintProps): JSX.Element => {
  const { data, error, isLoading } = useGetRoom(roomId);
  const unit = data?.units.find((u) => u.id === unitId);

  if (error) return <p className="p-8 text-sm text-destructive">{error}</p>;
  if (isLoading || !data) return <p className="p-8 text-sm text-muted-foreground">Preparando la unidad…</p>;
  if (!unit) return <p className="p-8 text-sm text-muted-foreground">No encontramos esa unidad en el aula.</p>;
  const items = unit.items.filter((i) => i.published || data.canEdit);

  return (
    <article className="mx-auto max-w-3xl bg-background px-6 py-8 text-foreground print:max-w-none print:px-0 print:py-0 print:text-black">
      <div className="mb-6 flex justify-end print:hidden">
        <button type="button" className="btn-brand" onClick={(): void => window.print()}>
          <MorphIcon icon={Printer} size={16} />
          Imprimir
        </button>
      </div>
      <header className="border-b border-border pb-4">
        <p className="text-xs tracking-wide text-muted-foreground uppercase">
          {data.room.levelName} · {data.room.gradeName} · {data.room.periodName}
        </p>
        <h1 className="mt-1 text-2xl font-semibold">{data.room.subjectName}</h1>
        <h2 className="mt-1 text-lg">{unit.title}</h2>
        {unit.summary && <p className="mt-2 text-sm leading-6">{unit.summary}</p>}
        <dl className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">Estudiante</dt>
            <dd className="mt-6 border-b border-foreground/40" />
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Entregado</dt>
            <dd className="mt-6 border-b border-foreground/40" />
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Devuelto</dt>
            <dd className="mt-6 border-b border-foreground/40" />
          </div>
        </dl>
      </header>

      <ol className="mt-6 space-y-6">
        {items.map((it, i) => (
          <li key={it.id} className="break-inside-avoid">
            <p className="text-xs text-muted-foreground">
              {i + 1}. {itemKinds[it.kind]?.label ?? it.kind}
              {it.complementary && ' · Complementario'}
            </p>
            <h3 className="text-base font-semibold">{it.title}</h3>
            {it.body && <p className="mt-2 text-sm leading-7 whitespace-pre-line">{it.body}</p>}
            {it.kind === 'live' && it.startsAt && <p className="mt-2 text-sm">Sesión en vivo el {formatLive(it.startsAt)}; si no puedes conectarte, consulta con tu tutor.</p>}
            {(it.kind === 'video' || it.kind === 'link') && it.url && <p className="mt-2 text-sm break-all">Enlace: {it.url}</p>}
            {it.files > 0 && <p className="mt-2 text-sm">Incluye {it.files === 1 ? 'un archivo' : `${it.files} archivos`}: el tutor los entrega impresos con esta unidad.</p>}
            {it.kind === 'activity' && <div className="mt-3 h-40 rounded border border-dashed border-foreground/30" aria-label="Espacio para responder" />}
          </li>
        ))}
      </ol>
      <footer className="mt-10 border-t border-border pt-3 text-xs text-muted-foreground">
        Impreso el {formatDay(new Date().toISOString().slice(0, 10))} desde el aula virtual.
      </footer>
    </article>
  );
};
