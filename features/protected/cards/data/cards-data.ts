import type { CardFormat, CardFormatSpec } from '../types';

// Physical sizes in millimetres (ISO/IEC 7810 ID-1, the bank-card size, in both orientations)
export const cardFormats: Record<CardFormat, CardFormatSpec> = {
  carnet: { label: 'Carnet', description: '85.6 × 54 mm · horizontal', widthMm: 85.6, heightMm: 54 },
  fotocheck: { label: 'Fotocheck', description: '54 × 85.6 mm · vertical, con ranura', widthMm: 54, heightMm: 85.6 },
};

export const CARD_EXPORT_DPI = 300;

// Fixed print palette: cards always print light, whatever the screen theme
export const cardPalette = { brand: '#c4520a', brandDark: '#9e4208', ink: '#2b211b', muted: '#75685e', paper: '#ffffff', surface: '#f8f5f2', line: '#e9e2db' };
