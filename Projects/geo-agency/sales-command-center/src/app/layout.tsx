import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Manrope, Plus_Jakarta_Sans } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardShell } from "@/components/glass/dashboard-shell";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AppearanceProvider } from "@/components/theme/appearance-provider";
import { noFlashAppearanceScript } from "@/lib/appearance";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sales Command Center",
  description: "GEO / AI Visibility agency sales operations dashboard.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jakarta.variable} ${inter.variable} ${geistSans.variable} ${manrope.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: noFlashAppearanceScript }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AppearanceProvider>
            <TooltipProvider delayDuration={150}>
              <DashboardShell>{children}</DashboardShell>
            </TooltipProvider>
          </AppearanceProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
