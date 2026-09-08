import { ClientSessionProvider } from "@/components/ui/ClientSessionProvider";
import DashboardSidebar from "@/components/ui/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientSessionProvider>
      <div className="min-h-screen bg-slate-50">
        <DashboardSidebar />
        <main className="min-h-screen lg:ml-64">
          <div className="mx-auto max-w-7xl p-5 sm:p-8 lg:p-10">{children}</div>
        </main>
      </div>
    </ClientSessionProvider>
  );
}