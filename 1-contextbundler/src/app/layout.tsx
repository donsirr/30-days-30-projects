import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ContextBundler - Bundle Your Codebase for LLMs",
  description: "Transform your codebase into a single, LLM-ready markdown bundle. Fast, private, and optimized for AI context windows. All processing happens locally in your browser.",
  keywords: ["LLM", "AI", "codebase", "markdown", "bundler", "context window", "GPT", "Claude", "developer tools"],
  authors: [{ name: "ContextBundler" }],
  openGraph: {
    title: "ContextBundler - Bundle Your Codebase for LLMs",
    description: "Transform your codebase into a single, LLM-ready markdown bundle. Fast, private, and client-side only.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#09090b" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
