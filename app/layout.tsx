import type { Metadata, Viewport } from "next";
import { Noto_Sans_SC, ZCOOL_KuaiLe } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

import "./globals.css";

const bodyFont = Noto_Sans_SC({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const displayFont = ZCOOL_KuaiLe({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
});

const siteUrl = (
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000"
).replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "趣味测评｜卖老公合格线",
    template: "%s｜趣味测评",
  },
  description:
    "面向移动端的趣味测评网站。卖老公多少分合格，另有人格、恋爱与心理年龄测试，轻松几分钟可分享。",
  keywords: [
    "趣味测评",
    "卖老公",
    "老公分数",
    "人格测试",
    "恋爱测试",
    "心理年龄",
    "proballace",
  ],
  openGraph: {
    title: "趣味测评｜卖老公合格线",
    description:
      "卖老公五维打分：短板劝退、全过线才续约（趣味）。还有人格、恋爱、心理年龄等轻松自测。",
    locale: "zh_CN",
    type: "website",
    siteName: "趣味测评",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "趣味测评｜卖老公合格线",
    description:
      "面向移动端用户的趣味测评站，卖老公五维打分，覆盖人格、恋爱与心理年龄测试。",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fff8f3",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
