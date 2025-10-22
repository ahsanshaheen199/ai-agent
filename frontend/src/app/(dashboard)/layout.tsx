import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import { MainContent } from "@/components/dashboard/main-content";
import { NoteDialog } from "@/components/note/dialog";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative overflow-x-hidden pt-0">
        <MainContent>
          {children}
          <NoteDialog />
        </MainContent>
      </SidebarInset>
    </SidebarProvider>
  );
}
