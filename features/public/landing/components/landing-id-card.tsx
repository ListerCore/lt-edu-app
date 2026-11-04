import type { JSX } from 'react';
import { BrandMark } from '@/components/layout/brand-mark';
import { finderOrigins, isFinder, QR_SIZE, qrCells } from '@/lib/qr-pattern';
import { siteConfig } from '@/lib/site';
import type { IdCardProps } from '../types';

// Hero ID card (CR80 proportions) hanging from a lanyard: institution, photo, name, level and attendance QR
export const LandingIdCard = ({ card }: IdCardProps): JSX.Element => {
  const cells = qrCells(card.code);

  return (
    <figure aria-label={`Carnet de ${card.role.toLowerCase()} de ${siteConfig.name}`} className="carnet-swing relative mx-auto w-full max-w-[22rem]">
      <div aria-hidden="true" className="mx-auto flex h-24 w-12 justify-center">
        <span className="h-full w-4 -skew-x-6 bg-brand-solid" />
        <span className="h-full w-4 skew-x-6 bg-brand-vivid" />
      </div>
      <div aria-hidden="true" className="mx-auto -mt-1 h-5 w-10 rounded-b-md border-4 border-t-0 border-muted-foreground/50" />

      <div className="-mt-1 overflow-hidden rounded-2xl border border-border bg-background shadow-[0_30px_70px_-30px_rgb(43_33_27/0.45)]">
        <div className="flex items-center gap-3 bg-brand-solid px-5 py-3.5 text-white">
          <BrandMark className="size-8 rounded-md bg-white/90 p-0.5" />
          <span className="leading-tight">
            <span className="block text-sm font-semibold">{siteConfig.name}</span>
            <span className="block text-[11px] text-white/80">{siteConfig.tagline}</span>
          </span>
          <span className="ml-auto rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-medium">{card.role}</span>
        </div>

        <div className="grid grid-cols-[5.5rem_1fr] gap-4 p-5">
          <div aria-hidden="true" className="flex aspect-[3/4] items-end justify-center overflow-hidden rounded-lg bg-secondary">
            <svg viewBox="0 0 60 80" className="w-full text-muted-foreground/45">
              <circle cx="30" cy="30" r="14" fill="currentColor" />
              <path d="M4 80 C6 58 18 50 30 50 C42 50 54 58 56 80 Z" fill="currentColor" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-base leading-snug font-semibold text-foreground">{card.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{card.detail}</p>
            <p className="mt-3 text-xs text-muted-foreground">Código</p>
            <p className="font-mono text-sm font-medium text-foreground">{card.code}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-dashed border-border px-5 py-4">
          <p className="max-w-[10rem] text-xs leading-5 text-muted-foreground">Muéstralo al ingresar: el QR registra tu asistencia.</p>
          <svg viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`} aria-hidden="true" className="size-20 shrink-0 text-foreground" shapeRendering="crispEdges">
            {cells.map((on, index): JSX.Element | null => {
              const x = index % QR_SIZE;
              const y = Math.floor(index / QR_SIZE);
              return on && !isFinder(x, y) ? <rect key={index} x={x} y={y} width="1" height="1" fill="currentColor" /> : null;
            })}
            {finderOrigins.map(([x, y]): JSX.Element => (
              <g key={`${x}-${y}`} fill="currentColor">
                <path d={`M${x} ${y}h7v7h-7z M${x + 1} ${y + 1}v5h5v-5z`} fillRule="evenodd" />
                <rect x={x + 2} y={y + 2} width="3" height="3" />
              </g>
            ))}
          </svg>
        </div>
      </div>
    </figure>
  );
};
