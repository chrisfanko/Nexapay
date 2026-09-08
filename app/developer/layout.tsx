import { ClientSessionProvider } from "@/components/ui/ClientSessionProvider";
import DeveloperSidebar from "@/components/ui/DeveloperSidebar";
import MerchantGate from "@/components/ui/MerchantGate";

export default function DeveloperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientSessionProvider>
      <div className="min-h-screen bg-slate-50">
        <DeveloperSidebar />

        <main className="min-h-screen lg:ml-64">
          <div className="mx-auto max-w-7xl p-5 sm:p-8 lg:p-10">
            <MerchantGate>{children}</MerchantGate>
          </div>
        </main>
      </div>
    </ClientSessionProvider>
  );
}