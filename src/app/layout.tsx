import React from "react";
import "./globals.css";
import Providers from "@/components/Providers";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export const metadata = {
  title: "Spotify Clone - High-Fidelity Audio Experience",
  description: "A premium production-grade audio streaming platform with canvas visualizations, real-time collaboration, and synchronized lyrics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full w-full">
      <body className="bg-black text-zinc-100 antialiased selection:bg-emerald-500/30 overflow-hidden h-full w-full font-sans">
        <Providers>
          {children}
          <ServiceWorkerRegister />
        </Providers>
      </body>
    </html>
  );
}
