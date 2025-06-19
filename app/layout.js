import { Geist, Geist_Mono } from "next/font/google";
import { Nanum_Pen_Script } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nanumPenScript = Nanum_Pen_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-handwriting",
});

export const metadata = {
  title: "Yello's Zib - 따뜻한 아날로그 감성의 공간",
  description: "Yello's Zib는 따뜻한 아날로그 감성을 담은 브랜드입니다.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/xdl4pul.css" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${nanumPenScript.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
