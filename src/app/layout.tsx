import type { Metadata, Viewport } from "next";

import { Press_Start_2P } from "next/font/google";

import "./globals.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
  display: "swap",
});

import { Navigation } from "@/components/navigation";
import { Slogan } from "@/components/slogan";
import { Toaster } from "@/components/ui/sonner";

import { Providers } from "./providers";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
const SITE_NAME = "Your Site Name";
const SITE_DESCRIPTION = "Your site description here";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ["photo", "archive", "gallery"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  publisher: "Your Name",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning className={pressStart2P.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen flex flex-col">
        <Providers>
          <Navigation />
          <Slogan />

          {/* Main Content */}
          <main className="flex-1">{children}</main>

          {/* Modal (Intercepting Route) */}
          {modal}

          {/* Footer */}
          <footer className="py-8 text-center border-t border-zinc-800 font-mono italic">
            <div className="flex flex-col items-center gap-2 text-xs text-zinc-500">
              <p>Since 20XX.XX.XX</p>
              <p>Contact: your@email.com</p>
            </div>
          </footer>

          <Toaster position="bottom-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
