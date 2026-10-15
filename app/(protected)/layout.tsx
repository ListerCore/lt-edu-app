import type { JSX, ReactNode } from 'react';

interface ProtectedLayoutProps {
  children: ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps): JSX.Element => <>{children}</>;

export default ProtectedLayout;
