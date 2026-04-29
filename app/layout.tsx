import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import { LocaleProvider } from "@/lib/i18n/provider";
import "./globals.css";

const thai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-thai",
  display: "swap",
});

const SITE_TITLE = "Gen SEA Summit 2026 — Apply";
const SITE_DESCRIPTION =
  "Three days in Khon Kaen. 350+ founders, investors, and ministers from 10+ countries. Apply as an individual or as a startup.";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ??
      "https://gensea-summit-delegates-exclusive-f.vercel.app",
  ),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  icons: {
    icon: "/ICON.webp",
    shortcut: "/ICON.webp",
    apple: "/ICON.webp",
  },
  openGraph: {
    type: "website",
    siteName: "Gen SEA Summit 2026",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/IMAGE.webp",
        width: 1200,
        height: 630,
        alt: "Gen SEA Summit 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/IMAGE.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#FBF1E1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${thai.variable}`}>
      <body className="font-sans">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
