import { ReactNode } from "react";

import { SidebarProvider, SidebarTrigger } from "@/components/shadcn/sidebar"
import { AppSidebar } from "../shadcn/app-sidebar";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
        <SidebarTrigger />
      <main className="w-full flex flex-col items-center py-10">
        <div className="w-full">
        {children}
        </div>
      </main>
    </SidebarProvider>
  );
};

export default AdminLayout;

