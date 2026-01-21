// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import HeaderWrapper from "@/components/common/NavbarWrapper";
import FooterWrapper from "@/components/common/FooterWrapper";
import { AutoTokenSync } from "@/components/auth/AutoTokenSync";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rural Chamber",
  description: "Of Commerce and Industry",
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
        <AuthProvider>
          <AutoTokenSync />
          <HeaderWrapper />
          {children}
          <Toaster position="top-center" />
          <FooterWrapper />
        </AuthProvider>
      </body>
    </html>
  );
}