"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import {
  COUNTRIES,
  findCountryByDialPrefix,
  getCountryByIso,
  searchCountries,
  type Country,
} from "@/lib/data/countries";
import { cn } from "@/lib/cn";

/**
 * PhoneInput — country-code picker + digit-only number field.
 *
 * The form value is **strict E.164**: "+<dial><digits>", no spaces, no
 * parens, no dashes. e.g. "+66919946459". Storage in the Google Sheet
 * mirrors this exactly — no per-row formatting drift.
 *
 *     value="+66919946459"
 *     ↓
 *     [🇹🇭 +66 ▾] [919946459]
 *
 * Internals:
 *   - parseValue() splits the stored value into country + local digits
 *     by longest-dial-prefix match.
 *   - The country picker is a popover with search by country name,
 *     ISO code, or dial code ("66" or "+66" both find Thailand).
 *   - The number input strips everything except digits on each
 *     keystroke, so paste-from-anywhere-on-the-internet just works.
 */
export function PhoneInput({
  value,
  onChange,
  onBlur,
  invalid,
  id: propId,
  placeholder = "8 1234 5678",
  defaultCountryIso = "TH",
}: {
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
  id?: string;
  placeholder?: string;
  defaultCountryIso?: string;
}) {
  const autoId = useId();
  const baseId = propId ?? autoId;
  const listboxId = `${baseId}-listbox`;

  const { country, digits } = useMemo(
    () => parseValue(value, defaultCountryIso),
    [value, defaultCountryIso],
  );

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const results = useMemo(() => searchCountries(query, 100), [query]);

  // Reset highlight + scroll position when the query / open state changes.
  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (open) {
      optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, open]);

  const handleCountryPick = (c: Country) => {
    onChange(buildValue(c.dialCode, digits));
    setOpen(false);
    setQuery("");
  };

  const handleDigitsChange = (raw: string) => {
    const cleaned = raw.replace(/\D/g, "");
    onChange(buildValue(country.dialCode, cleaned));
  };

  const handleListboxKey = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (results[activeIndex]) handleCountryPick(results[activeIndex]);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(Math.max(results.length - 1, 0));
        break;
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      {/* Combined input: country trigger + digit input share one
          rounded shell so the two halves read as a single field. */}
      <div
        className={cn(
          "flex items-stretch overflow-hidden rounded-xl border border-bone-hairline bg-ink-elevated transition focus-within:border-sunset-500 focus-within:ring-2 focus-within:ring-sunset-500/30",
          invalid && "border-sunset-500 focus-within:ring-sunset-500/30",
        )}
      >
        <button
          type="button"
          id={baseId}
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-label={`Country code: ${country.name} ${country.dialCode}`}
          className="flex shrink-0 items-center gap-1.5 border-r border-bone-hairline bg-ink-subtle/40 px-3 text-sm text-bone transition hover:bg-ink-subtle/60"
        >
          <span aria-hidden="true" className="text-base leading-none">
            {country.flag}
          </span>
          <span className="font-medium tabular-nums">{country.dialCode}</span>
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 text-bone-subtle transition-transform",
              open && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>

        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={digits}
          onChange={(e) => handleDigitsChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          aria-invalid={invalid || undefined}
          className="flex-1 bg-transparent px-4 py-3 text-base text-bone placeholder:text-bone-subtle focus:outline-none"
        />
      </div>

      {open && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-bone-hairline bg-ink-elevated shadow-ink">
          <div className="flex items-center gap-2 border-b border-bone-hairline px-3 py-2.5">
            <Search className="h-4 w-4 text-bone-subtle" aria-hidden="true" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleListboxKey}
              placeholder="Search country or code (e.g. Thailand or +66)"
              aria-controls={listboxId}
              className="w-full bg-transparent text-sm text-bone placeholder:text-bone-subtle focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="text-bone-subtle hover:text-bone"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <ul
            id={listboxId}
            role="listbox"
            aria-label="Country dial codes"
            className="max-h-[min(20rem,55vh)] overflow-y-auto py-1"
          >
            {results.length === 0 && (
              <li className="px-4 py-3 text-sm text-bone-subtle">
                No matches. Try the country name or dial code.
              </li>
            )}
            {results.map((c, i) => (
              <li key={c.iso}>
                <button
                  ref={(el) => {
                    optionRefs.current[i] = el;
                  }}
                  type="button"
                  role="option"
                  aria-selected={c.iso === country.iso}
                  onClick={() => handleCountryPick(c)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition",
                    i === activeIndex ? "bg-ink-subtle" : "hover:bg-ink-subtle",
                    c.iso === country.iso && "font-semibold",
                  )}
                >
                  <span aria-hidden="true" className="text-base leading-none">
                    {c.flag}
                  </span>
                  <span className="flex-1 text-bone">{c.name}</span>
                  <span className="shrink-0 font-medium tabular-nums text-bone-muted">
                    {c.dialCode}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t border-bone-hairline px-4 py-2 text-[11px] text-bone-subtle">
            {COUNTRIES.length} countries
          </div>
        </div>
      )}
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────

function buildValue(dialCode: string, digits: string): string {
  const cleaned = digits.replace(/\D/g, "");
  if (!cleaned) return "";
  return `${dialCode}${cleaned}`;
}

function parseValue(
  value: string,
  defaultIso: string,
): { country: Country; digits: string } {
  if (!value) {
    return { country: getCountryByIso(defaultIso), digits: "" };
  }
  const match = findCountryByDialPrefix(value);
  if (match) {
    return {
      country: match,
      digits: value.slice(match.dialCode.length).replace(/\D/g, ""),
    };
  }
  // No matching dial prefix — keep digits, fall back to default country.
  return {
    country: getCountryByIso(defaultIso),
    digits: value.replace(/\D/g, ""),
  };
}
