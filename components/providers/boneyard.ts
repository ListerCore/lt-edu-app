'use client';

import { configureBoneyard } from 'boneyard-js/react';
// Bones captured from the real screens with `pnpm run bones` (see boneyard.config.json)
import '@/bones/registry';

// Skeleton bones in the site's own palette (tokens from globals.css; boneyard switches on the .dark class)
configureBoneyard({
  color: 'var(--accent)',
  darkColor: 'var(--accent)',
  shimmerColor: 'var(--surface)',
  darkShimmerColor: 'var(--surface)',
  animate: 'shimmer',
  speed: '1.6s',
  transition: 200,
});
