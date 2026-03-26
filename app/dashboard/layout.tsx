import { ClientSessionProvider } from "@/components/ui/ClientSessionProvider";
import DashboardSidebar from "@/components/ui/DashboardSidebar";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientSessionProvider>
      <div className="min-h-screen flex bg-gray-50">
        <DashboardSidebar />
        <main className="flex-1 ml-64 p-8">{children}</main>
      </div>
    </ClientSessionProvider>
  );
}