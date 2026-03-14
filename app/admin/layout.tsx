import AdminSidebar from "@/components/ui/AdminSidebar";
import { ClientSessionProvider } from "@/components/ui/ClientSessionProvider";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientSessionProvider>
      <div className="min-h-screen flex bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 ml-64 p-8">{children}</main>
      </div>
    </ClientSessionProvider>
  );
}