import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://originvisibility.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Origin Visibility — AI Search Visibility, SEO & Website Rebuilds",
    template: "%s — Origin Visibility",
  },
  description:
    "Origin Visibility helps businesses become the answer AI gives. We combine complete website rebuilds, traditional SEO, and AI search (GEO) visibility so you're found by both search engines and answer engines like ChatGPT and Perplexity.",
  openGraph: {
    title: "Origin Visibility — AI Search Visibility, SEO & Website Rebuilds",
    description:
      "Be the answer AI gives. Website rebuilds, SEO, and GEO strategy built for how people search now.",
    url: siteUrl,
    siteName: "Origin Visibility",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
