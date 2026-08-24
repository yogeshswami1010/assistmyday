import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://assistmyday.com"),
  title: "Assistmyday — Digital Marketing & Software Development",
  description: "Custom software, high-performance websites, automation, and full-funnel digital marketing for ambitious businesses.",
  openGraph: {
    title: "Assistmyday — Software That Scales. Marketing That Converts.",
    description: "An integrated software development and digital marketing partner for ambitious businesses.",
    type: "website",
    images: [{ url: "/og-software-marketing.png", width: 1200, height: 630, alt: "Assistmyday — Software That Scales. Marketing That Converts." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Assistmyday — Software That Scales. Marketing That Converts.",
    description: "Custom software, web platforms, automation, and digital marketing connected by one team.",
    images: ["/og-software-marketing.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
