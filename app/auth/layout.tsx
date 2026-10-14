import type { Metadata } from 'next';
import { ParticleNetwork } from '@/features/public/landing/components/particle-network';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const AuthLayout = ({ children }: Readonly<{ children: React.ReactNode }>): React.ReactNode => (
  <div className="relative isolate min-h-svh">
    <ParticleNetwork />
    <div className="relative z-10 min-h-svh">{children}</div>
  </div>
);

export default AuthLayout;
