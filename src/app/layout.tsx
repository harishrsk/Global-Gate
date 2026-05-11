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
  title: "Global-Gate | Multi-Sector Trade Intelligence & PQC Security",
  description: "The world's first AI-driven trade platform secured by Post-Quantum Cryptography. Real-time compliance, multi-sector vision analysis, and sovereign audit trails.",
  keywords: ["Trade Intelligence", "Post-Quantum Cryptography", "Global Trade", "AI Compliance", "Sovereign Audit"],
  authors: [{ name: "Global-Gate Architect" }],
  openGraph: {
    title: "Global-Gate: The Future of Secure Trade",
    description: "AI-driven compliance and PQC security for global import/export.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
