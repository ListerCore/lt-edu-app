import type { CSSProperties } from 'react';

// CSS custom property read by [data-reveal] to stagger entrances
export type RevealStyle = CSSProperties & { '--reveal-delay'?: string };

// Builds the inline style that delays a [data-reveal] element
export const revealDelay = (ms: number): RevealStyle => ({ '--reveal-delay': `${ms}ms` });
