import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const siteUrl = "https://getorigin.ai";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Origin — AI Visibility & Web for Contractors",
  description:
    "Origin makes sure your trade business is the name AI gives out when someone asks ChatGPT or Perplexity who to call — then builds you a site fast and sharp enough to close the job.",
  openGraph: {
    title: "Origin — AI Visibility & Web for Contractors",
    description:
      "Someone just asked AI who to call. Was your name in the answer? Origin builds AI visibility and websites for contractors, concrete, and fencing businesses.",
    url: siteUrl,
    siteName: "Origin",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
