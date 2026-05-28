import zetexaClient from "./zetexa.client";
import {
  ZetexaPackagesListResponse,
  ZetexaCountriesListResponse,
  ZetexaCreateOrderRequest,
  ZetexaCreateOrderResponse,
  ZetexaQrCodeResponse,
  ZetexaOrderListResponse,
  ZetexaSimUsageResponse,
  ZetexaTransactionListResponse,
} from "./zetexa.types";

// ─── Countries ────────────────────────────────────────────────────────────────
// v2 → flagcdn.com SVGs, proper iso2 casing, has message field

export const getCountries = async () => {
  const response =
    await zetexaClient.get<ZetexaCountriesListResponse>("/v2/Countries-List");
  return response.data;
};

// ─── Packages ─────────────────────────────────────────────────────────────────
// v2 → price is number, typo fixed, has fup_policy, network, status, currency_code

export const getPackagesByCountry = async (countryCode: string) => {
  const response = await zetexaClient.get<ZetexaPackagesListResponse>(
    `/v2/Packages-List?filterby=Country&country_code=${countryCode}`,
  );
  return response.data;
};

export const getPackagesByRegion = async (regionName: string) => {
  const response = await zetexaClient.get<ZetexaPackagesListResponse>(
    `/v2/Packages-List?filterby=Region&region_name=${regionName}`,
  );
  return response.data;
};

// ─── Orders ───────────────────────────────────────────────────────────────────

export const createOrder = async (payload: ZetexaCreateOrderRequest) => {
  const response = await zetexaClient.post<ZetexaCreateOrderResponse>(
    "/v1/Create-Order",
    payload,
  );
  return response.data;
};

export const getOrderList = async (page: number = 1, pageSize: number = 20) => {
  const response = await zetexaClient.get<ZetexaOrderListResponse>(
    `/v1/Orders-List?page=${page}&page_size=${pageSize}`,
  );
  return response.data;
};

// v2 — more detailed than v1/Order-Details
export const getOrderLineDetails = async (orderId: string) => {
  const response = await zetexaClient.post<{
    success: boolean;
    orderlines: {
      id: string;
      package_name: string;
      data: string;
      calls: string;
      sms: string;
      validity: number;
      quantity: number;
      price: string;
      is_kyc_completed: boolean;
    }[];
  }>("/v2/Order-Lines-Details", { order_id: orderId });
  return response.data;
};

// ─── QR Code ──────────────────────────────────────────────────────────────────

export const getQrCodeByOrderId = async (orderId: string) => {
  const response = await zetexaClient.get<ZetexaQrCodeResponse>(
    `/v1/get-qrcode-details?order_id=${orderId}`,
  );
  return response.data;
};

// ─── SIM / Data Usage ─────────────────────────────────────────────────────────

export const getSimUsage = async (iccid: string) => {
  const response = await zetexaClient.post<ZetexaSimUsageResponse>(
    "/v1/ESim-Usage",
    { iccid },
  );
  return response.data;
};

// More detailed than ESim-Usage — includes remaining_data, used_data,
// usage_percentage, plan_status, plan_start_date, plan_end_date
export const getDataUsage = async (iccid: string) => {
  const response = await zetexaClient.post<
    {
      order_id: string;
      orderline_id: string;
      iccid: string;
      plan_id: string;
      plan: string;
      plan_data: string;
      plan_start_date: string | null;
      plan_end_date: string | null;
      expiry_alert: string;
      remaining_data: number;
      used_data: number;
      usage_alert: string;
      usage_percentage: number;
      plan_status: "ACTIVE" | "INACTIVE" | "EXPIRED";
    }[]
  >("/v1/GetDataUsage", { iccid });
  return response.data;
};

// ─── Reseller ─────────────────────────────────────────────────────────────────

export const getResellerBalance = async (): Promise<number> => {
  const response = await zetexaClient.post<{
    success: boolean;
    message: string;
    balance: number;
  }>("/v1/Reseller-Balance");
  return response.data.balance;
};

export const getTransactions = async (page: number = 1, searchKey?: string) => {
  const query = searchKey
    ? `/v1/Transactions-List-With-Search?page=${page}&search_key=${searchKey}`
    : `/v1/Transactions-List-With-Search?page=${page}`;

  const response = await zetexaClient.get<ZetexaTransactionListResponse>(query);
  return response.data;
};

// ─── Refund ───────────────────────────────────────────────────────────────────

export const requestPlanRefund = async (
  orderPackageId: string,
  iccid: string,
  refundComment: string,
) => {
  const response = await zetexaClient.post<{
    success: boolean;
    message: string;
  }>("/v1/Plan-Refund", {
    order_package_id: orderPackageId,
    iccid,
    refund_comment: refundComment,
  });
  return response.data;
};

export const notifyZetexa = async (payload: {
  order_id: string;
  order_amount: number;
  order_status: "SUCCESS" | "FAILED";
  currency: string;
  first_name: string;
  last_name: string;
  email: string;
}) => {
  const response = await zetexaClient.post<{
    success: boolean;
    message: string;
  }>("/v1/Notify", payload);
  return response.data;
};

export const getOrderDetails = async (zetexaOrderId: string) => {
  const response = await zetexaClient.post<{
    success: boolean;
    message: string;
    data: {
      order: {
        order_id: string;
        order_status: string;
      };
    };
  }>("/v1/Order-Details", { order_id: zetexaOrderId });
  return response.data;
};
