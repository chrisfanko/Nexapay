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
      <div className="min-h-screen flex bg-gray-50">
        <DeveloperSidebar />
        <main className="flex-1 ml-64 p-8">
          <MerchantGate>{children}</MerchantGate>
        </main>
      </div>
    </ClientSessionProvider>
  );
}