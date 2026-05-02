"use client";

import Link from "next/link";
import { Mail, Facebook, Instagram, Linkedin } from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";
import { BrandMark } from "./brand-mark";

const SOCIAL_LINKS = [
  { name: "LinkedIn", href: "https://www.linkedin.com/company/growwithseabridge/posts/?feedView=all", Icon: Linkedin },
  { name: "Facebook", href: "https://www.facebook.com/SEABridgeNextGen?locale=th_TH", Icon: Facebook },
  { name: "Instagram", href: "https://www.instagram.com/seabridge.nextgen/", Icon: Instagram },
];

const EMAIL = "team@seabridge.space";

export function Footer() {
  const { t } = useLocale();
  return (
    <footer className="surface-poster relative">
      {/* Top gradient seam ties the footer into the dark continuum. */}
      <div className="gradient-strip" aria-hidden="true" />
      <div className="container-page flex flex-col gap-10 py-14 md:flex-row md:items-start md:justify-between md:gap-12">
        <div>
          <Link href="/" aria-label="Gen SEA Summit home">
            <BrandMark />
          </Link>
          <p className="mt-4 max-w-md text-sm text-cream-50/75">{t("footer.tagline")}</p>
        </div>

        <div>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-sunset-400">
            Connect
          </h2>
          <ul className="flex items-center gap-4">
            {SOCIAL_LINKS.map(({ name, href, Icon }) => (
              <li key={name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${name} (opens in new tab)`}
                  className="text-cream-50/85 transition-colors hover:text-sunset-400"
                >
                  <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          <a
            href={`mailto:${EMAIL}`}
            className="mt-4 inline-flex items-center gap-2 text-sm text-cream-50/85 transition-colors hover:text-sunset-400"
          >
            <Mail className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            {EMAIL}
          </a>
        </div>
      </div>
      <div className="border-t border-cream-50/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-cream-50/60 md:flex-row md:items-center md:justify-between">
          <span>{t("footer.rights")}</span>
          <span>Khon Kaen · {t("brand.year")}</span>
        </div>
      </div>
    </footer>
  );
}
