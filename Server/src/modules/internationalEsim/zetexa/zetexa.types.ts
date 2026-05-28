//Types for zetexa
// ─── Enums / Literals ────────────────────────────────────────────────────────

export type ZetexaOrderStatus =
  | "Pending"
  | "Processing"
  | "Completed"
  | "Refund"
  | "Kyc Pending"
  | "NO EKYC"
  | "Completed: E-KYC Further Action Required"
  | "Completed: E-KYC Not Applicable"
  | "Payment Link Sent";

export type ZetexaSimStatus =
  | "UNUSED"
  | "BPP_INSTALLATION"
  | "ENABLE"
  | "DISABLE"
  | "DELETE";

export type ZetexaPlanStatus = "ACTIVE" | "INACTIVE" | "EXPIRED";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface ZetexaCreateTokenResponse {
  success: boolean;
  session_token: string;
}

// ─── Packages ─────────────────────────────────────────────────────────────────
export interface ZetexaPackageCountry {
  countryname: string;
  countryiso2: string;
}

export interface ZetexaPackage {
  package_id: string;
  package_name: string;
  data: string; // "1.0 GB" or "Unlimited"
  data_in_mb: number; // 0 for unlimited
  call: number;
  call_in_seconds: number;
  sms: number;
  validity: number; // days
  coverage: string; // "4G"
  price: number; //
  network: string | null;
  status: boolean; //
  fup_policy: string | null;
  countries: ZetexaPackageCountry[];
}

export interface ZetexaPackagesListResponse {
  success: boolean;
  currency_code: string; // ✅ new — "INR"
  data: ZetexaPackage[];
}

// v2 Countries (flagcdn SVGs)
export interface ZetexaCountry {
  id: number;
  name: string;
  iso2: string;
  iso3: string;
  image: string; // "https://flagcdn.com/af.svg"
}

export interface ZetexaCountriesListResponse {
  success: boolean;
  message: string;
  data: ZetexaCountry[];
}

// ─── Create Order ─────────────────────────────────────────────────────────────

// What you send TO Zetexa
export interface ZetexaCreateOrderRequest {
  package_id: string;
  country: string;
  first_name: string;
  last_name: string;
  address: string;
  email: string;
  state?: string;
  city?: string;
  pincode?: string;
  phone_number?: string;
  quantity?: number;
  reseller_orderid_name?: string;
  reseller_orderid?: string;
}

// What you get BACK from Zetexa
export interface ZetexaCreateOrderResponse {
  success: boolean;
  message: string;
  order_id: string;
  net_amount: number;
  gross_amount: number;
  total: number;
  status: ZetexaOrderStatus;
  ekyc_link?: string; // only present if KYC required
  ekyc_mail_to?: string; // only present if KYC required
}

// ─── QR Code ──────────────────────────────────────────────────────────────────

export interface ZetexaQrCode {
  order_id: string;
  orderline_id: string;
  iccid: string;
  plan_id: string;
  plan_name: string;
  lpa_server: string; // e.g. "LPA:1$smdp.io$K2-XXXX"
  qr_code: string; // base64 encoded image "data:image/png;base64,..."
}

export interface ZetexaQrCodeResponse {
  success: boolean;
  message: string;
  qr_codes: ZetexaQrCode[];
}

// ─── Order List ───────────────────────────────────────────────────────────────

export interface ZetexaOrder {
  order_id: string;
  order_status: ZetexaOrderStatus;
  email: string;
  reseller: string;
  agent: string;
  currency: string;
  payment_method_name: string;
  total_net: string;
  tax: string;
  total_gross: string;
  total_value: number;
  created_on: string; // ISO date string
}

export interface ZetexaOrderListResponse {
  success: boolean;
  message: string;
  total_pages: number;
  current_page: number;
  total_records: number;
  data: ZetexaOrder[];
}

// ─── SIM Usage ────────────────────────────────────────────────────────────────

export interface ZetexaSimUsage {
  id: number;
  iccid: string;
  data: number; // data used in MB
  out_call: number;
  in_call: number;
  in_sms: number;
  out_sms: number;
  in_voip: number;
  out_voip: number;
}

export interface ZetexaSimUsageResponse {
  success: boolean;
  usage: ZetexaSimUsage;
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export interface ZetexaTransaction {
  order_id?: string;
  transaction_type: string; // "wallet"
  currency: string;
  amount: number;
  balance: number;
  previous_balance: number;
  created_on?: string;
}

export interface ZetexaTransactionListResponse {
  success: boolean;
  message: string;
  total_pages: number;
  current_page: number;
  total_records: number;
  data: ZetexaTransaction[];
}

// ─── Generic Error ────────────────────────────────────────────────────────────

export interface ZetexaErrorResponse {
  success: false;
  message?: string;
  errors?: { field: string; message: string }[];
}
