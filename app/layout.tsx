import type { Metadata } from "next";
import { Noto_Sans_KR, Nanum_Gothic } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";

const notoSansKR = Noto_Sans_KR({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans",
});

const nanumGothic = Nanum_Gothic({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-nanum-gothic",
});

export const metadata: Metadata = {
  title: "온라인 설문조사",
  description: "Firebase를 활용한 온라인 설문조사 플랫폼",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${notoSansKR.variable} ${nanumGothic.variable} antialiased`}
      >
        <Header />
        <main style={{ backgroundColor: '#E0DDD8' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
