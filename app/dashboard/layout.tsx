import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from '../component/DashboardSidebar';

const DashboardLayout = ({children} : {children: React.ReactNode}) => {
    return (
        <SidebarProvider>
      <DashboardSidebar></DashboardSidebar>
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
    );
};

export default DashboardLayout;