import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Iskolar-Hub | Scholarship Matcher",
  description: "Find scholarships matched to your profile with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F8FAFC] text-slate-900 min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1 w-full container mx-auto px-4 md:px-6 py-6 md:py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
