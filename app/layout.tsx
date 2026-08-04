import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://axiom-motion-studio.onirtechnology.chatgpt.site"),
  title: "Assistmyday — Digital Marketing & Business Growth",
  description: "Website development, marketing, graphic design, and social media support for growing businesses.",
  openGraph: {
    title: "Assistmyday — Flexible Assistance. Real Business Growth.",
    description: "Tailored digital solutions for websites, marketing, graphic design, and social media.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Assistmyday — Flexible Assistance. Real Business Growth." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Assistmyday — Flexible Assistance. Real Business Growth.",
    description: "Tailored digital solutions for websites, marketing, graphic design, and social media.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
