import { ClientSessionProvider } from "@/components/ui/ClientSessionProvider";

export default function RegisterBusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientSessionProvider>{children}</ClientSessionProvider>;
}