import Image from 'next/image';
import type { JSX } from 'react';
import { cn } from '@/lib/utils';
import type { BrandMarkProps } from './types';

// Platform logo from public/logo.png; decorative because the brand name is always rendered next to it
export const BrandMark = ({ className }: BrandMarkProps): JSX.Element => <Image src="/logo.png" alt="" aria-hidden="true" width={96} height={96} priority unoptimized className={cn('size-8 object-contain', className)} />;
