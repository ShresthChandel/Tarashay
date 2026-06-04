import type { Metadata } from "next";
import { Inter, Playfair_Display, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari",
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "तराशय | Rewa Supari Art — Cultural Heritage",
    template: "%s | तराशय",
  },
  description:
    "A cultural embassy for Rewa Supari Art — 80 years of areca nut sculpture by the Kunder family of Rewa, Madhya Pradesh. Critically endangered craft practiced by only 4–5 artisans worldwide.",
  keywords: [
    "Rewa Supari Art",
    "Kunder family",
    "areca nut sculpture",
    "Madhya Pradesh craft",
    "endangered Indian art",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} ${devanagari.variable} film-grain min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
