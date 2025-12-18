import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VisaGuardian AI - Immigration Intelligence Platform",
  description: "Enterprise-grade immigration intelligence dashboard for processing US visa petitions with AI-powered adjudication.",
  keywords: ["immigration", "visa", "USCIS", "H-1B", "O-1", "EB-2", "AI", "adjudication"],
  authors: [{ name: "VisaGuardian AI" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
