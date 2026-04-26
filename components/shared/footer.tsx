"use client"

import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { Linkedin, Twitter, Instagram, Mail } from "lucide-react"

export function Footer() {
  const { t } = useI18n()

  const socialLinks = [
    { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
    { href: "https://twitter.com", icon: Twitter, label: "X (Twitter)" },
    { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
  ]

  return (
    <footer className="border-t border-cream-200 bg-cream-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Logo & Tagline */}
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-xl font-bold tracking-tight text-navy-900">
                SEA BRIDGE
              </span>
            </div>
            <p className="text-sm text-gold-500 font-medium">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-navy-300">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="#theme"
                className="text-sm text-navy-700 hover:text-navy-900 transition-colors"
              >
                {t("footer.links.about")}
              </Link>
              <Link
                href="#sectors"
                className="text-sm text-navy-700 hover:text-navy-900 transition-colors"
              >
                {t("footer.links.sectors")}
              </Link>
              <Link
                href="/apply"
                className="text-sm text-navy-700 hover:text-navy-900 transition-colors"
              >
                {t("footer.links.apply")}
              </Link>
              <Link
                href="mailto:team@seabridge.space"
                className="text-sm text-navy-700 hover:text-navy-900 transition-colors"
              >
                {t("footer.links.contact")}
              </Link>
            </nav>
          </div>

          {/* Social & Contact */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-navy-300">
              Connect
            </h3>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-navy-700 hover:text-navy-900 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
            <a
              href="mailto:team@seabridge.space"
              className="flex items-center gap-2 text-sm text-navy-700 hover:text-navy-900 transition-colors"
            >
              <Mail className="h-4 w-4" />
              team@seabridge.space
            </a>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-cream-200 pt-8 sm:flex-row">
          <p className="text-xs text-navy-700">{t("footer.copyright")}</p>
          <Link
            href="#"
            className="text-xs text-navy-700 hover:text-navy-900 transition-colors"
          >
            {t("footer.pdpa")}
          </Link>
        </div>
      </div>
    </footer>
  )
}
