import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/ui/navbar";
import { ClientSessionProvider } from "@/components/ui/ClientSessionProvider";
import Footer from "@/components/ui/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientSessionProvider>
      <Toaster />
      <Navbar />
      <main className={`${geistSans.variable} ${geistMono.variable} pt-20`}>
        {children}
      </main>
      <Footer />
    </ClientSessionProvider>
  );
}