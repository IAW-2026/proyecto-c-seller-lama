import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/navbar/Navbar";
import { NotificationProvider } from "@/context/NotificationContext";
import { NotificationContainer } from "@/providers/NotificationContainer";
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
  title: "LAMA seller app",
  description: "Marketplace de ropa vintage y usada",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f6f1e7]">
        <ClerkProvider>
          <NotificationProvider>
            <Navbar />
            {children}
            <NotificationContainer />
          </NotificationProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}