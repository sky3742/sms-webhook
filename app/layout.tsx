import type { Metadata, Viewport } from "next";
import { Fira_Code, Space_Grotesk } from "next/font/google";
import { ServiceWorkerUpdater } from "@/lib/components/ServiceWorkerUpdater";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SMS Webhook Dashboard",
  description: "Monitor SMS messages via webhook",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SMS Dashboard",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${firaCode.variable} antialiased`}
      >
        <ServiceWorkerUpdater />
        {children}
      </body>
    </html>
  );
}
