'use client';

import { MorphIcon as BaseMorphIcon, type MorphIconProps } from 'morphicons/react';
import type { JSX } from 'react';

// Animated icon swap (morphicons). Icons are lucide data (`import { Eye } from 'lucide'`), not lucide-react components.
// Honours prefers-reduced-motion by default: the change becomes an instant swap
export const MorphIcon = ({ reducedMotion = 'user', spring = 'snappy', ...props }: MorphIconProps): JSX.Element => <BaseMorphIcon reducedMotion={reducedMotion} spring={spring} {...props} />;
