// ─── Shared eSIM data — imported by EsimApp & RegionPage ─────────────────────

export interface EsimCountry {
  name: string;
  code: string;
  price: string;
  flag: string;
  hasPlans: boolean; // false → show "No plans available" on card
}

export interface EsimRegion {
  name: string;
  price: string;
  emoji: string;
  codes: string[];
}

// Codes that have actual plans in your backend
// ✅ Update this set whenever you add/remove countries from the backend
export const CODES_WITH_PLANS = new Set([
  "IN","US","AE","DE","FR","JP","SG","AU","GB","CA",
  "TH","KR","IT","ES","NL","MY","ID","PH","MX","BR",
]);

export const STATIC_COUNTRIES: EsimCountry[] = [
  { name: "India",                code: "IN", price: "₹199",  flag: "https://flagcdn.com/in.svg",  hasPlans: true  },
  { name: "United States",        code: "US", price: "₹540",  flag: "https://flagcdn.com/us.svg",  hasPlans: true  },
  { name: "United Arab Emirates", code: "AE", price: "₹400",  flag: "https://flagcdn.com/ae.svg",  hasPlans: true  },
  { name: "Germany",              code: "DE", price: "₹420",  flag: "https://flagcdn.com/de.svg",  hasPlans: true  },
  { name: "France",               code: "FR", price: "₹410",  flag: "https://flagcdn.com/fr.svg",  hasPlans: true  },
  { name: "Japan",                code: "JP", price: "₹450",  flag: "https://flagcdn.com/jp.svg",  hasPlans: true  },
  { name: "Singapore",            code: "SG", price: "₹350",  flag: "https://flagcdn.com/sg.svg",  hasPlans: true  },
  { name: "Australia",            code: "AU", price: "₹500",  flag: "https://flagcdn.com/au.svg",  hasPlans: true  },
  { name: "United Kingdom",       code: "GB", price: "₹480",  flag: "https://flagcdn.com/gb.svg",  hasPlans: true  },
  { name: "Canada",               code: "CA", price: "₹430",  flag: "https://flagcdn.com/ca.svg",  hasPlans: true  },
  { name: "Thailand",             code: "TH", price: "₹280",  flag: "https://flagcdn.com/th.svg",  hasPlans: true  },
  { name: "South Korea",          code: "KR", price: "₹390",  flag: "https://flagcdn.com/kr.svg",  hasPlans: true  },
  { name: "Italy",                code: "IT", price: "₹320",  flag: "https://flagcdn.com/it.svg",  hasPlans: true  },
  { name: "Spain",                code: "ES", price: "₹410",  flag: "https://flagcdn.com/es.svg",  hasPlans: true  },
  { name: "Netherlands",          code: "NL", price: "₹430",  flag: "https://flagcdn.com/nl.svg",  hasPlans: true  },
  { name: "Malaysia",             code: "MY", price: "₹260",  flag: "https://flagcdn.com/my.svg",  hasPlans: true  },
  { name: "Indonesia",            code: "ID", price: "₹240",  flag: "https://flagcdn.com/id.svg",  hasPlans: true  },
  { name: "Philippines",          code: "PH", price: "₹250",  flag: "https://flagcdn.com/ph.svg",  hasPlans: true  },
  { name: "Mexico",               code: "MX", price: "₹360",  flag: "https://flagcdn.com/mx.svg",  hasPlans: true  },
  { name: "Brazil",               code: "BR", price: "₹380",  flag: "https://flagcdn.com/br.svg",  hasPlans: true  },
  // ↓ No plans yet
  { name: "South Africa",         code: "ZA", price: "—",     flag: "https://flagcdn.com/za.svg",  hasPlans: false },
  { name: "Nigeria",              code: "NG", price: "—",     flag: "https://flagcdn.com/ng.svg",  hasPlans: false },
  { name: "Kenya",                code: "KE", price: "—",     flag: "https://flagcdn.com/ke.svg",  hasPlans: false },
  { name: "Egypt",                code: "EG", price: "—",     flag: "https://flagcdn.com/eg.svg",  hasPlans: false },
  { name: "New Zealand",          code: "NZ", price: "—",     flag: "https://flagcdn.com/nz.svg",  hasPlans: false },
  { name: "Portugal",             code: "PT", price: "—",     flag: "https://flagcdn.com/pt.svg",  hasPlans: false },
  { name: "Saudi Arabia",         code: "SA", price: "—",     flag: "https://flagcdn.com/sa.svg",  hasPlans: false },
  { name: "Qatar",                code: "QA", price: "—",     flag: "https://flagcdn.com/qa.svg",  hasPlans: false },
  { name: "Kuwait",               code: "KW", price: "—",     flag: "https://flagcdn.com/kw.svg",  hasPlans: false },
  { name: "Bahrain",              code: "BH", price: "—",     flag: "https://flagcdn.com/bh.svg",  hasPlans: false },
];

export const REGIONS: EsimRegion[] = [
  { name: "Asia",        price: "₹999",  emoji: "🌏", codes: ["IN","AE","JP","SG","TH","MY","ID","PH","KR"] },
  { name: "Europe",      price: "₹1499", emoji: "🌍", codes: ["GB","FR","DE","IT","ES","PT","NL"] },
  { name: "Americas",    price: "₹1699", emoji: "🗽", codes: ["US","CA","MX","BR"] },
  { name: "Africa",      price: "₹1299", emoji: "🌍", codes: ["ZA","NG","KE","EG"] },
  { name: "Oceania",     price: "₹1899", emoji: "🌊", codes: ["AU","NZ"] },
  { name: "Middle East", price: "₹1199", emoji: "🏜️", codes: ["AE","SA","QA","KW","BH"] },
];

// Normalise API response → EsimCountry
// The API may return a `planCount` or `hasPlans` field — use it if present,
// otherwise fall back to CODES_WITH_PLANS set.
export function normaliseCountry(c: any): EsimCountry {
  const code = (c.code || c.isoCode || c.countryCode || "").toUpperCase();

  const hasPlans =
    typeof c.hasPlans === "boolean" ? c.hasPlans
    : typeof c.planCount === "number" ? c.planCount > 0
    : CODES_WITH_PLANS.has(code);

  const price = hasPlans
    ? (c.price ? `₹${c.price}` : c.basePrice ? `₹${c.basePrice}` : STATIC_COUNTRIES.find(s => s.code === code)?.price ?? "View Plans")
    : "—";

  return {
    name: c.name,
    code,
    price,
    flag: c.flag || `https://flagcdn.com/${code.toLowerCase()}.svg`,
    hasPlans,
  };
}