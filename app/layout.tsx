import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexaPay — The Unified Payment Gateway for Africa",
  description: "Accept Mobile Money, PayPal, Visa and Mastercard with one API. Built for African businesses.",
  keywords: ["payment gateway", "Africa", "Mobile Money", "MTN", "Orange Money", "PayPal", "fintech"],
  authors: [{ name: "NexaPay" }],
  openGraph: {
    title: "NexaPay — The Unified Payment Gateway for Africa",
    description: "Accept Mobile Money, PayPal, Visa and Mastercard with one API. Built for African businesses.",
    type: "website",
    url: "https://nexapay.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "NexaPay — The Unified Payment Gateway for Africa",
    description: "Accept Mobile Money, PayPal, Visa and Mastercard with one API.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        {children}
      </body>
    </html>
  );
}