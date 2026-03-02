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
  title: {
    default: "Rural Chamber of Commerce & Industry",
    template: "%s | Rural Chamber",
  },
  description:
    "Rural Chamber of Commerce & Industry – empowering rural businesses and communities across Africa.",
  metadataBase: new URL("https://www.ruralchamber.africa"),
  keywords: ["rural chamber",
    "commerce", 
    "industry", 
    "Africa", 
    "business support",
    "business registration",
    "networking events",
    "business opportunities",
    "economic development",
    "investment Africa",
    "rural development",
    "rural economy",
    "rural entrepreneurship",
    "rural communities",
    "small business Africa",
    "rural business"],
  authors: [{ name: "Rural Chamber of Commerce & Industry" }],
  openGraph: {
    title: "Rural Chamber of Commerce & Industry",
    description: "Empowering rural businesses and communities across Africa.",
    url: "https://www.ruralchamber.africa",
    siteName: "Rural Chamber",
    locale: "en_ZA",
    type: "website",
    images: [
      {
        url: "/logo2.png",
        width: 1200,
        height: 630,
        alt: "Rural Chamber of Commerce & Industry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rural Chamber of Commerce & Industry",
    description: "Empowering rural businesses and communities across Africa.",
    images: ["/logo2.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
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