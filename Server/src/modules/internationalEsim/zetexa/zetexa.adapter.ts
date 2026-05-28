import { ESIM_MARKUP } from "../../../config/pricing.config";
import { ZetexaPackage, ZetexaCountry } from "./zetexa.types";

// ─── Our Internal Formats ─────────────────────────────────────────────────────
// These are what get saved to MongoDB and served to frontend
// Zetexa's raw shape → our clean shape

export interface AdaptedPlan {
  zetexaPackageId: string;
  name: string;
  dataLimit: string; // "1.0 GB" | "Unlimited"
  dataInMb: number; // 0 for unlimited
  validityDays: number;
  coverage: string; // "4G" | "5G"
  network: string | null; // "Bharti Airtel India" | null
  price: number; // in reseller's currency (INR for us)
  currency: string; // "INR"
  isUnlimited: boolean;
  fupPolicy: string | null; // only present for unlimited plans
  isActive: boolean;
  countries: { name: string; iso2: string }[];
  callInSeconds: number;
  sms: number;
}

export interface AdaptedCountry {
  zetexaId: number;
  name: string;
  iso2: string;
  iso3: string;
  flagUrl: string; // "https://flagcdn.com/in.svg"
}

// ─── Adapters ─────────────────────────────────────────────────────────────────

export const adaptPackage = (
  pkg: ZetexaPackage,
  currencyCode: string, // comes from root-level currency_code in v2 response
): AdaptedPlan => {
  return {
    zetexaPackageId: pkg.package_id,
    name: pkg.package_name,
    dataLimit: pkg.data,
    dataInMb: pkg.data_in_mb,
    validityDays: pkg.validity,
    coverage: pkg.coverage,
    network: pkg.network,
    price: pkg.price,
    currency: currencyCode,
    isUnlimited: pkg.data.toLowerCase() === "unlimited" || pkg.data_in_mb === 0,
    fupPolicy: pkg.fup_policy,
    isActive: pkg.status,
    countries: pkg.countries.map((c) => ({
      name: c.countryname,
      iso2: c.countryiso2,
    })),
    callInSeconds: pkg.call_in_seconds,
    sms: pkg.sms,
  };
};
export const adaptCountry = (country: ZetexaCountry): AdaptedCountry => {
  return {
    zetexaId: country.id,
    name: country.name,
    iso2: country.iso2,
    iso3: country.iso3,
    flagUrl: country.image,
  };
};

// ─── Batch Adapters ───────────────────────────────────────────────────────────
// These are what you actually call — takes the full API response

export const adaptPackageList = (response: {
  data: ZetexaPackage[];
  currency_code: string;
}): AdaptedPlan[] => {
  return response.data
    .filter((pkg) => pkg.status === true) // drop inactive packages
    .map((pkg) => adaptPackage(pkg, response.currency_code));
};

export const adaptCountryList = (
  countries: ZetexaCountry[],
): AdaptedCountry[] => {
  return countries.map(adaptCountry);
};
