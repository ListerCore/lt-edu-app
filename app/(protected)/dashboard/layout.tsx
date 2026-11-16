import type { Metadata } from 'next';
import type { JSX, ReactNode } from 'react';
import { BrandWatermark } from '@/components/layout/brand-watermark';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { DashboardHeader } from '@/features/protected/dashboard/components/dashboard-header';
import { DashboardSidebar } from '@/features/protected/dashboard/components/dashboard-sidebar';

export const metadata: Metadata = {
  title: { default: 'Panel', template: '%s · Panel' },
};

interface DashboardLayoutProps {
  children: ReactNode;
}

// Panel shell: permission-aware sidebar beside the module content, with the brand watermark behind it
const DashboardLayout = ({ children }: DashboardLayoutProps): JSX.Element => (
  <SidebarProvider>
    <DashboardSidebar />
    <SidebarInset>
      <DashboardHeader />
      <div className="relative isolate flex-1">
        <BrandWatermark />
        {children}
      </div>
    </SidebarInset>
  </SidebarProvider>
);

export default DashboardLayout;
