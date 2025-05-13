import type { Metadata } from "next";
import "./globals.css";
import StarfieldBackground from "@/components/StarfieldBackground";

export const metadata: Metadata = {
  title: "Soufiane Aboulhamam - Portfolio",
  description: "Portfolio of Soufiane Aboulhamam, Web Developer and AI Enthusiast",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://geist-font.vercel.app/font.css" />
      </head>
      <body style={{ fontFamily: 'Geist, sans-serif' }} className="dark:bg-black bg-white">
        <StarfieldBackground />
        {children}
      </body>
    </html>
  );
}