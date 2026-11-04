'use client';

import type { JSX } from 'react';
import { useRotatingIndex } from '@/hooks/use-rotating-index';
import type { NavLabelProps } from './types';

const ROTATE_MS = 2000;

// Link text for the navbar; with rotatingLabels it alternates every 2 s. All labels share one grid cell,
// so the link keeps the width of the longest and the navbar never shifts; screen readers get them all at once
export const NavLabel = ({ link }: NavLabelProps): JSX.Element => {
  const labels = link.rotatingLabels ?? [link.label];
  const index = useRotatingIndex(labels.length, ROTATE_MS);

  if (labels.length < 2) return <span className="link-underline">{link.label}</span>;

  return (
    <span className="link-underline">
      <span className="sr-only">{labels.join(', ')}</span>
      <span aria-hidden="true" className="inline-grid">
        {labels.map((label, position): JSX.Element => (
          <span key={label} className={`col-start-1 row-start-1 ${position === index ? 'row-in' : 'invisible'}`}>
            {label}
          </span>
        ))}
      </span>
    </span>
  );
};
