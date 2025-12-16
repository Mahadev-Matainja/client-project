import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import App from "./App";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Predikr Dashboard",
  description: "Comprehensive health management system",
  generator: "v0.dev",
  icons: {
    icon: "/fav-icon/favicon.ico",
    apple: "/fav-icon/apple-touch-icon.png",
    other: [
      { rel: "icon", url: "/fav-icon/favicon-32x32.png", sizes: "32x32" },
      { rel: "icon", url: "/fav-icon/favicon-16x16.png", sizes: "16x16" },
    ],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <App>{children}</App>
        <Toaster />
      </body>
    </html>
  );
}
