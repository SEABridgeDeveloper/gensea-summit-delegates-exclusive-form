/**
 * Country / dial-code list for the phone input. Curated for the Gen SEA
 * Summit audience: ASEAN first, then APAC, then a long tail covering
 * major regions. Roughly 110 entries — enough that any reasonable
 * applicant finds their country, small enough to ship without a CDN.
 *
 * Flags are unicode (🇹🇭 etc.). They render natively on macOS / iOS /
 * Android; Windows shows the ISO letters as a fallback (acceptable —
 * the dial code is the load-bearing identifier).
 *
 * Order is intentional: search matches against name + dialCode + iso,
 * but when the user opens the picker without typing they see this
 * ordering. ASEAN at the top because that's the cohort.
 */

export type Country = {
  iso: string;        // ISO 3166-1 alpha-2 ("TH", "US")
  name: string;
  dialCode: string;   // E.164 prefix incl. "+", e.g. "+66"
  flag: string;       // Unicode flag emoji
};

export const COUNTRIES: Country[] = [
  // ── ASEAN (10) ─────────────────────────────────────────────
  { iso: "TH", name: "Thailand",          dialCode: "+66",  flag: "🇹🇭" },
  { iso: "ID", name: "Indonesia",         dialCode: "+62",  flag: "🇮🇩" },
  { iso: "MY", name: "Malaysia",          dialCode: "+60",  flag: "🇲🇾" },
  { iso: "SG", name: "Singapore",         dialCode: "+65",  flag: "🇸🇬" },
  { iso: "PH", name: "Philippines",       dialCode: "+63",  flag: "🇵🇭" },
  { iso: "VN", name: "Vietnam",           dialCode: "+84",  flag: "🇻🇳" },
  { iso: "MM", name: "Myanmar",           dialCode: "+95",  flag: "🇲🇲" },
  { iso: "KH", name: "Cambodia",          dialCode: "+855", flag: "🇰🇭" },
  { iso: "LA", name: "Laos",              dialCode: "+856", flag: "🇱🇦" },
  { iso: "BN", name: "Brunei",            dialCode: "+673", flag: "🇧🇳" },

  // ── APAC + Oceania ────────────────────────────────────────
  { iso: "JP", name: "Japan",             dialCode: "+81",  flag: "🇯🇵" },
  { iso: "KR", name: "South Korea",       dialCode: "+82",  flag: "🇰🇷" },
  { iso: "CN", name: "China",             dialCode: "+86",  flag: "🇨🇳" },
  { iso: "HK", name: "Hong Kong",         dialCode: "+852", flag: "🇭🇰" },
  { iso: "TW", name: "Taiwan",            dialCode: "+886", flag: "🇹🇼" },
  { iso: "MO", name: "Macao",             dialCode: "+853", flag: "🇲🇴" },
  { iso: "MN", name: "Mongolia",          dialCode: "+976", flag: "🇲🇳" },
  { iso: "IN", name: "India",             dialCode: "+91",  flag: "🇮🇳" },
  { iso: "BD", name: "Bangladesh",        dialCode: "+880", flag: "🇧🇩" },
  { iso: "LK", name: "Sri Lanka",         dialCode: "+94",  flag: "🇱🇰" },
  { iso: "NP", name: "Nepal",             dialCode: "+977", flag: "🇳🇵" },
  { iso: "PK", name: "Pakistan",          dialCode: "+92",  flag: "🇵🇰" },
  { iso: "BT", name: "Bhutan",            dialCode: "+975", flag: "🇧🇹" },
  { iso: "MV", name: "Maldives",          dialCode: "+960", flag: "🇲🇻" },
  { iso: "AU", name: "Australia",         dialCode: "+61",  flag: "🇦🇺" },
  { iso: "NZ", name: "New Zealand",       dialCode: "+64",  flag: "🇳🇿" },
  { iso: "FJ", name: "Fiji",              dialCode: "+679", flag: "🇫🇯" },
  { iso: "PG", name: "Papua New Guinea",  dialCode: "+675", flag: "🇵🇬" },

  // ── Middle East ───────────────────────────────────────────
  { iso: "AE", name: "United Arab Emirates", dialCode: "+971", flag: "🇦🇪" },
  { iso: "SA", name: "Saudi Arabia",      dialCode: "+966", flag: "🇸🇦" },
  { iso: "QA", name: "Qatar",             dialCode: "+974", flag: "🇶🇦" },
  { iso: "KW", name: "Kuwait",            dialCode: "+965", flag: "🇰🇼" },
  { iso: "OM", name: "Oman",              dialCode: "+968", flag: "🇴🇲" },
  { iso: "BH", name: "Bahrain",           dialCode: "+973", flag: "🇧🇭" },
  { iso: "IL", name: "Israel",            dialCode: "+972", flag: "🇮🇱" },
  { iso: "JO", name: "Jordan",            dialCode: "+962", flag: "🇯🇴" },
  { iso: "LB", name: "Lebanon",           dialCode: "+961", flag: "🇱🇧" },
  { iso: "TR", name: "Türkiye",           dialCode: "+90",  flag: "🇹🇷" },
  { iso: "IR", name: "Iran",              dialCode: "+98",  flag: "🇮🇷" },
  { iso: "IQ", name: "Iraq",              dialCode: "+964", flag: "🇮🇶" },

  // ── Europe ────────────────────────────────────────────────
  { iso: "GB", name: "United Kingdom",    dialCode: "+44",  flag: "🇬🇧" },
  { iso: "IE", name: "Ireland",           dialCode: "+353", flag: "🇮🇪" },
  { iso: "FR", name: "France",            dialCode: "+33",  flag: "🇫🇷" },
  { iso: "DE", name: "Germany",           dialCode: "+49",  flag: "🇩🇪" },
  { iso: "IT", name: "Italy",             dialCode: "+39",  flag: "🇮🇹" },
  { iso: "ES", name: "Spain",             dialCode: "+34",  flag: "🇪🇸" },
  { iso: "PT", name: "Portugal",          dialCode: "+351", flag: "🇵🇹" },
  { iso: "NL", name: "Netherlands",       dialCode: "+31",  flag: "🇳🇱" },
  { iso: "BE", name: "Belgium",           dialCode: "+32",  flag: "🇧🇪" },
  { iso: "LU", name: "Luxembourg",        dialCode: "+352", flag: "🇱🇺" },
  { iso: "CH", name: "Switzerland",       dialCode: "+41",  flag: "🇨🇭" },
  { iso: "AT", name: "Austria",           dialCode: "+43",  flag: "🇦🇹" },
  { iso: "SE", name: "Sweden",            dialCode: "+46",  flag: "🇸🇪" },
  { iso: "NO", name: "Norway",            dialCode: "+47",  flag: "🇳🇴" },
  { iso: "DK", name: "Denmark",           dialCode: "+45",  flag: "🇩🇰" },
  { iso: "FI", name: "Finland",           dialCode: "+358", flag: "🇫🇮" },
  { iso: "IS", name: "Iceland",           dialCode: "+354", flag: "🇮🇸" },
  { iso: "GR", name: "Greece",            dialCode: "+30",  flag: "🇬🇷" },
  { iso: "PL", name: "Poland",            dialCode: "+48",  flag: "🇵🇱" },
  { iso: "CZ", name: "Czechia",           dialCode: "+420", flag: "🇨🇿" },
  { iso: "SK", name: "Slovakia",          dialCode: "+421", flag: "🇸🇰" },
  { iso: "HU", name: "Hungary",           dialCode: "+36",  flag: "🇭🇺" },
  { iso: "RO", name: "Romania",           dialCode: "+40",  flag: "🇷🇴" },
  { iso: "BG", name: "Bulgaria",          dialCode: "+359", flag: "🇧🇬" },
  { iso: "HR", name: "Croatia",           dialCode: "+385", flag: "🇭🇷" },
  { iso: "SI", name: "Slovenia",          dialCode: "+386", flag: "🇸🇮" },
  { iso: "EE", name: "Estonia",           dialCode: "+372", flag: "🇪🇪" },
  { iso: "LV", name: "Latvia",            dialCode: "+371", flag: "🇱🇻" },
  { iso: "LT", name: "Lithuania",         dialCode: "+370", flag: "🇱🇹" },
  { iso: "RU", name: "Russia",            dialCode: "+7",   flag: "🇷🇺" },
  { iso: "UA", name: "Ukraine",           dialCode: "+380", flag: "🇺🇦" },
  { iso: "BY", name: "Belarus",           dialCode: "+375", flag: "🇧🇾" },
  { iso: "RS", name: "Serbia",            dialCode: "+381", flag: "🇷🇸" },
  { iso: "AL", name: "Albania",           dialCode: "+355", flag: "🇦🇱" },
  { iso: "MK", name: "North Macedonia",   dialCode: "+389", flag: "🇲🇰" },
  { iso: "MT", name: "Malta",             dialCode: "+356", flag: "🇲🇹" },
  { iso: "CY", name: "Cyprus",            dialCode: "+357", flag: "🇨🇾" },

  // ── North America ─────────────────────────────────────────
  { iso: "US", name: "United States",     dialCode: "+1",   flag: "🇺🇸" },
  { iso: "CA", name: "Canada",            dialCode: "+1",   flag: "🇨🇦" },
  { iso: "MX", name: "Mexico",            dialCode: "+52",  flag: "🇲🇽" },

  // ── Latin America + Caribbean ─────────────────────────────
  { iso: "BR", name: "Brazil",            dialCode: "+55",  flag: "🇧🇷" },
  { iso: "AR", name: "Argentina",         dialCode: "+54",  flag: "🇦🇷" },
  { iso: "CL", name: "Chile",             dialCode: "+56",  flag: "🇨🇱" },
  { iso: "CO", name: "Colombia",          dialCode: "+57",  flag: "🇨🇴" },
  { iso: "PE", name: "Peru",              dialCode: "+51",  flag: "🇵🇪" },
  { iso: "UY", name: "Uruguay",           dialCode: "+598", flag: "🇺🇾" },
  { iso: "PY", name: "Paraguay",          dialCode: "+595", flag: "🇵🇾" },
  { iso: "BO", name: "Bolivia",           dialCode: "+591", flag: "🇧🇴" },
  { iso: "EC", name: "Ecuador",           dialCode: "+593", flag: "🇪🇨" },
  { iso: "VE", name: "Venezuela",         dialCode: "+58",  flag: "🇻🇪" },
  { iso: "CR", name: "Costa Rica",        dialCode: "+506", flag: "🇨🇷" },
  { iso: "PA", name: "Panama",            dialCode: "+507", flag: "🇵🇦" },
  { iso: "GT", name: "Guatemala",         dialCode: "+502", flag: "🇬🇹" },
  { iso: "DO", name: "Dominican Republic", dialCode: "+1",  flag: "🇩🇴" },
  { iso: "JM", name: "Jamaica",           dialCode: "+1",   flag: "🇯🇲" },

  // ── Africa ────────────────────────────────────────────────
  { iso: "EG", name: "Egypt",             dialCode: "+20",  flag: "🇪🇬" },
  { iso: "ZA", name: "South Africa",      dialCode: "+27",  flag: "🇿🇦" },
  { iso: "NG", name: "Nigeria",           dialCode: "+234", flag: "🇳🇬" },
  { iso: "KE", name: "Kenya",             dialCode: "+254", flag: "🇰🇪" },
  { iso: "GH", name: "Ghana",             dialCode: "+233", flag: "🇬🇭" },
  { iso: "ET", name: "Ethiopia",          dialCode: "+251", flag: "🇪🇹" },
  { iso: "MA", name: "Morocco",           dialCode: "+212", flag: "🇲🇦" },
  { iso: "DZ", name: "Algeria",           dialCode: "+213", flag: "🇩🇿" },
  { iso: "TN", name: "Tunisia",           dialCode: "+216", flag: "🇹🇳" },
  { iso: "SN", name: "Senegal",           dialCode: "+221", flag: "🇸🇳" },
  { iso: "CI", name: "Côte d'Ivoire",     dialCode: "+225", flag: "🇨🇮" },
  { iso: "UG", name: "Uganda",            dialCode: "+256", flag: "🇺🇬" },
  { iso: "TZ", name: "Tanzania",          dialCode: "+255", flag: "🇹🇿" },
  { iso: "RW", name: "Rwanda",            dialCode: "+250", flag: "🇷🇼" },
  { iso: "ZW", name: "Zimbabwe",          dialCode: "+263", flag: "🇿🇼" },
  { iso: "MZ", name: "Mozambique",        dialCode: "+258", flag: "🇲🇿" },
];

const DEFAULT_ISO = "TH";

/**
 * Resolve an ISO-2 country code to its Country record.
 * Falls back to Thailand (the program's host) if not found.
 */
export function getCountryByIso(iso?: string): Country {
  return (
    COUNTRIES.find((c) => c.iso === iso?.toUpperCase()) ??
    COUNTRIES.find((c) => c.iso === DEFAULT_ISO)!
  );
}

/**
 * Find the country whose dial-code is the longest prefix of `value`.
 * Used to parse a stored E.164 string back into picker state.
 *
 * Several countries share "+1" (US, Canada, Dominican Republic,
 * Jamaica). The first match (US, by ordering above) wins — acceptable
 * because the picker still lets the user pick a different one and the
 * stored value doesn't change.
 */
export function findCountryByDialPrefix(value: string): Country | undefined {
  if (!value || !value.startsWith("+")) return undefined;
  const sorted = [...COUNTRIES].sort(
    (a, b) => b.dialCode.length - a.dialCode.length,
  );
  return sorted.find((c) => value.startsWith(c.dialCode));
}

/**
 * Search the country list. Matches against name (case-insensitive
 * substring), ISO code, and dial code. Empty query returns the full
 * list in declaration order.
 */
export function searchCountries(query: string, limit = 80): Country[] {
  const q = query.trim().toLowerCase();
  if (!q) return COUNTRIES.slice(0, limit);
  // Allow "+66" or "66" to find Thailand.
  const normalized = q.startsWith("+") ? q : `+${q}`;
  const isNumericQuery = /^\+?\d+$/.test(q);

  const matches = COUNTRIES.filter((c) => {
    if (c.name.toLowerCase().includes(q)) return true;
    if (c.iso.toLowerCase() === q) return true;
    if (isNumericQuery && c.dialCode.startsWith(normalized)) return true;
    return false;
  });
  return matches.slice(0, limit);
}
