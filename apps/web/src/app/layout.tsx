import { NextFontWithVariable } from "next/dist/compiled/@next/font";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";

const geistSans: NextFontWithVariable = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono: NextFontWithVariable = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AirCade",
  description: "A browser-based party game platform where any screen becomes the console and everyone plays together using their phones as controllers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
