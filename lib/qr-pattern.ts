export const QR_SIZE = 21;

// Deterministic QR-like pattern from a code: decorative (not scannable), but stable between renders and builds
export const qrCells = (seed: string): boolean[] => {
  let state = [...seed].reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 7);
  return Array.from({ length: QR_SIZE * QR_SIZE }, () => {
    state = (state * 1103515245 + 12345) >>> 0;
    return (state >>> 16) % 2 === 0;
  });
};

// The three corner squares every QR has, so the pattern reads as one at a glance
export const isFinder = (x: number, y: number): boolean => (x < 7 && y < 7) || (x >= QR_SIZE - 7 && y < 7) || (x < 7 && y >= QR_SIZE - 7);

export const finderOrigins: Array<[number, number]> = [
  [0, 0],
  [QR_SIZE - 7, 0],
  [0, QR_SIZE - 7],
];
