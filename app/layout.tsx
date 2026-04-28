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

export const metadata: Metadata = {
  title: "Gen SEA Summit - Apply for your Scholarship",
  description:
    "50 students. One room. ASEAN's next decade starts here. Apply for the 1967 fellowship in Khon Kaen.",
};

export const viewport: Viewport = {
  themeColor: "#FBF1E1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${GeistSans.variable} ${thai.variable}`}>
      <body className="font-sans">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
