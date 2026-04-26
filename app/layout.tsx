import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, IBM_Plex_Sans_Thai } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { Analytics } from "@vercel/analytics/next"
import { I18nProvider } from "@/lib/i18n"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  subsets: ["thai"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-thai",
})

export const metadata: Metadata = {
  title: "Gen SEA Summit 2026 — Apply for Scholarship",
  description:
    "Win your seat. 50 students. One room. ASEAN's next decade starts here. Apply for the Gen SEA Delegates scholarship.",
  keywords: [
    "Gen SEA Summit",
    "ASEAN",
    "scholarship",
    "students",
    "entrepreneurship",
    "Khon Kaen",
    "Thailand",
    "SEA Bridge",
  ],
  authors: [{ name: "SEA Bridge Institute of Entrepreneurship" }],
  openGraph: {
    title: "Gen SEA Summit 2026 — Apply for Scholarship",
    description:
      "Win your seat. 50 students. One room. ASEAN's next decade starts here.",
    type: "website",
    locale: "th_TH",
    alternateLocale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gen SEA Summit 2026 — Apply for Scholarship",
    description:
      "Win your seat. 50 students. One room. ASEAN's next decade starts here.",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF7F0" },
    { media: "(prefers-color-scheme: dark)", color: "#0A1A35" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${ibmPlexSansThai.variable} font-sans antialiased bg-background`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
