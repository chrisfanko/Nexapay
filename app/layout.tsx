import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Toaster } from "@/components/ui/sonner";

const geistSans = localFont({
  src: "../node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "../node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Toaster />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}