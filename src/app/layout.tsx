import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Outfit, Lexend } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { headers } from "next/headers";
import { getSiteConfig } from "@/lib/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Bestie+",
    default: "Bestie+ | 王道モールの人気ランキングをリアルタイム比較",
  },
  description: "Bestie+（ベスティプラス）は、大手モールの売上ランキングをリアルタイムに集計。今まさに売れている人気商品を厳選して紹介し、あなたのベストな選択をサポートします。",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const host = (await headers()).get("host") || "";
  const config = getSiteConfig(host);

  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${outfit.variable} ${lexend.variable} font-sans antialiased`}
      >
        <Providers initialBrand={config.id}>{children}</Providers>
      </body>
    </html>
  );
}
