import type { JSX } from 'react';
import { cardFormats } from '../data/cards-data';
import type { Cardholder, CardsPrintSheetProps } from '../types';
import { IdCardSvg } from './id-card-svg';

// Cards per row that fit the printable width of an A4 sheet (190 mm with 10 mm margins)
const PER_ROW: Record<keyof typeof cardFormats, number> = { carnet: 2, fotocheck: 3 };

// Splits into rows; on the backs page each row is mirrored so every back lands behind its front when printing double-sided
const rows = (items: Cardholder[], perRow: number, mirrored: boolean): Array<Array<Cardholder | null>> =>
  Array.from({ length: Math.ceil(items.length / perRow) }, (_, index) => {
    const row: Array<Cardholder | null> = items.slice(index * perRow, index * perRow + perRow);
    while (row.length < perRow) row.push(null);
    return mirrored ? [...row].reverse() : row;
  });

// Hidden on screen; when printing it is the only visible thing: a page of fronts, then a page of mirrored backs
export const CardsPrintSheet = ({ cardholders, issuer, format }: CardsPrintSheetProps): JSX.Element | null => {
  if (cardholders.length === 0) return null;
  const perRow = PER_ROW[format];
  const { widthMm, heightMm } = cardFormats[format];

  return (
    <div data-print-cards aria-hidden="true" className="hidden print:block">
      {(['front', 'back'] as const).map((side): JSX.Element => (
        <div key={side} className={side === 'back' ? 'print:break-before-page' : undefined}>
          {rows(cardholders, perRow, side === 'back').map((row, rowIndex): JSX.Element => (
            <div key={rowIndex} className="flex gap-[4mm] pb-[4mm] break-inside-avoid">
              {row.map((cardholder, index): JSX.Element =>
                cardholder ? (
                  <IdCardSvg key={cardholder.id} cardholder={cardholder} issuer={issuer} format={format} side={side} idPrefix="print" className="shrink-0 outline-dashed outline-[0.2mm] outline-offset-[1mm] outline-neutral-400" />
                ) : (
                  <span key={`empty-${index}`} style={{ width: `${widthMm}mm`, height: `${heightMm}mm` }} className="shrink-0" />
                ),
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
