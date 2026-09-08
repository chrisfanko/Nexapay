import { ClientSessionProvider } from "@/components/ui/ClientSessionProvider";
import AdminSidebar from "@/components/ui/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientSessionProvider>
      <div className="min-h-screen bg-slate-50">
        <AdminSidebar />

        <main className="min-h-screen lg:ml-64">
          <div className="mx-auto max-w-7xl p-5 sm:p-8 lg:p-10">
            {children}
          </div>
        </main>
      </div>
    </ClientSessionProvider>
  );
}