"use client";

import Link from "next/link";
import { Mail, Facebook, Instagram, Linkedin } from "lucide-react";
import { useLocale } from "@/lib/i18n/provider";
import { BrandMark } from "./brand-mark";

const SOCIAL_LINKS = [
  { name: "LinkedIn", href: "https://linkedin.com/company/seabridge", Icon: Linkedin },
  { name: "Facebook", href: "https://facebook.com/seabridge", Icon: Facebook },
  { name: "Instagram", href: "https://instagram.com/seabridge", Icon: Instagram },
];

const EMAIL = "team@seabridge.space";

export function Footer() {
  const { t } = useLocale();
  return (
    <footer className="border-t border-navy/10 bg-cream-100">
      <div className="container-page flex flex-col gap-10 py-14 md:flex-row md:items-start md:justify-between md:gap-12">
        <div>
          <Link href="/" aria-label="Gen SEA Summit home">
            <BrandMark />
          </Link>
          <p className="mt-4 max-w-md text-sm text-navy/75">{t("footer.tagline")}</p>
        </div>

        <div>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-navy/65">
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
                  className="text-navy transition-colors hover:text-coral-700"
                >
                  <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          <a
            href={`mailto:${EMAIL}`}
            className="mt-4 inline-flex items-center gap-2 text-sm text-navy transition-colors hover:text-coral-700"
          >
            <Mail className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            {EMAIL}
          </a>
        </div>
      </div>
      <div className="border-t border-navy/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-navy/70 md:flex-row md:items-center md:justify-between">
          <span>{t("footer.rights")}</span>
          <span>Khon Kaen · {t("brand.year")}</span>
        </div>
      </div>
    </footer>
  );
}
