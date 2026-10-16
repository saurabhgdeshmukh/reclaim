import type { Metadata } from "next";
import {
  Big_Shoulders_Stencil,
  IBM_Plex_Mono,
  Source_Serif_4,
} from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const display = Big_Shoulders_Stencil({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-display-family",
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif-family",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-family",
});

export const metadata: Metadata = {
  title: "Reclaim",
  description: "Detention hours the dock kept, billed before they disappear.",
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${serif.variable} ${mono.variable}`}
    >
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
