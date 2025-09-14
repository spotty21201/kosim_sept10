import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppHeader from "@/components/AppHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KoSim - Kost Financial Simulator",
  description: "Plan and analyze your boarding house project with our comprehensive financial simulator.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-slate-50">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-full text-slate-900 antialiased`}>
        <AppHeader />
        <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6">{children}</main>
      </body>
    </html>
  );
}
