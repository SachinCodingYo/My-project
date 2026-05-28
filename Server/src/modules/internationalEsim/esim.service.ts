import { InternationalPlan, Country } from "./esim.model";
import {
  getPackagesByCountry,
  getCountries,
  createOrder,
  getQrCodeByOrderId,
  getResellerBalance,
  notifyZetexa,
  getOrderDetails,
} from "./zetexa/zetexa.endpoints";
import { adaptPackageList, adaptCountryList } from "./zetexa/zetexa.adapter";
import { syncCountries } from "./jobs/syncPackages.job";
import { ZetexaCreateOrderRequest } from "./zetexa/zetexa.types";
import Order, {
  OrderType,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
} from "../orders/order.model";
import { createNotification } from "../notification/notification.service";
import { ORDER_NOTIFICATION_MESSAGES } from "../notification/notification.constants";
import { IAuthenticatedReq } from "../../common/types/express";
import {
  PAGINATION_CONFIG,
  decodeCursor,
} from "../../config/pagination.config";
import { buildCursorPaginationResponse } from "../../common/utils/pagination.util";
import { ESIM_MARKUP } from "../../config/pricing.config";
import { sendEsimQrEmail } from "../../common/utils/email.service";

// ─── Countries ────────────────────────────────────────────────────────────────

export const getAvailableCountries = async () => {
  const count = await Country.countDocuments();

  if (count === 0) {
    console.log("[EsimService] No countries in DB, syncing from Zetexa...");
    await syncCountries();
  }

  return Country.find().sort({ name: 1 });
};

const applyMarkup = (plans: any[]) => {
  return plans.map((plan) => ({
    ...plan.toObject(),
    price: plan.price + ESIM_MARKUP,
  }));
};

// ─── Plans ────────────────────────────────────────────────────────────────────
export const getPlansByCountry = async (
  countryCode: string,
  req: IAuthenticatedReq,
) => {
  const code = countryCode.toUpperCase();

  // ── Lazy load if country not in DB yet ──────────────────────────────────────
  const existingCount = await InternationalPlan.countDocuments({
    countryCode: code,
    isActive: true,
  });

  if (existingCount === 0) {
    console.log(`[EsimService] ${code} not in DB, fetching from Zetexa...`);
    const response = await getPackagesByCountry(code);

    if (!response.data || response.data.length === 0) {
      throw new Error(`No plans available for country: ${code}`);
    }

    const adapted = adaptPackageList(response);
    const operations = adapted.map((plan) => ({
      updateOne: {
        filter: { zetexaPackageId: plan.zetexaPackageId },
        update: {
          $set: { ...plan, countryCode: code, lastSyncedAt: new Date() },
        },
        upsert: true,
      },
    }));
    await InternationalPlan.bulkWrite(operations);
  }

  // ── Pagination setup ────────────────────────────────────────────────────────
  let { limit, cursor } = req.pagination || {
    limit: PAGINATION_CONFIG.DEFAULT_LIMIT,
    cursor: null,
  };
  limit = typeof limit === "string" ? parseInt(limit, 10) : limit;
  if (limit > PAGINATION_CONFIG.MAX_LIMIT) limit = PAGINATION_CONFIG.MAX_LIMIT;

  // ── Base query ───────────────────────────────────────────────────────────────
  let query = InternationalPlan.find({ countryCode: code, isActive: true });

  // ── Filters ──────────────────────────────────────────────────────────────────

  // Price range
  if (req.query.minPrice)
    query = query.where("price").gte(Number(req.query.minPrice));
  if (req.query.maxPrice)
    query = query.where("price").lte(Number(req.query.maxPrice));

  // Validity (exact) e.g. ?validity=7
  if (req.query.validity)
    query = query.where("validityDays", Number(req.query.validity));

  // Validity range
  if (req.query.minValidity)
    query = query.where("validityDays").gte(Number(req.query.minValidity));
  if (req.query.maxValidity)
    query = query.where("validityDays").lte(Number(req.query.maxValidity));

  // Unlimited only
  if (req.query.isUnlimited !== undefined)
    query = query.where("isUnlimited", req.query.isUnlimited === "true");

  // Coverage (4G/5G)
  if (req.query.coverage) query = query.where("coverage", req.query.coverage);

  // Network operator
  if (req.query.network)
    query = query.where(
      "network",
      new RegExp(req.query.network as string, "i"),
    );

  // Search by plan name
  if (req.query.search)
    query = query.where("name", new RegExp(req.query.search as string, "i"));

  // Data limit range (in MB)
  if (req.query.minData)
    query = query.where("dataInMb").gte(Number(req.query.minData));
  if (req.query.maxData)
    query = query.where("dataInMb").lte(Number(req.query.maxData));

  // ── Sorting ──────────────────────────────────────────────────────────────────
  // default: price asc, can override with ?sortBy=validity or ?sortBy=data
  const sortMap: Record<string, Record<string, 1 | -1>> = {
    price_asc: { price: 1, _id: 1 },
    price_desc: { price: -1, _id: -1 },
    validity_asc: { validityDays: 1, _id: 1 },
    validity_desc: { validityDays: -1, _id: -1 },
    data_asc: { dataInMb: 1, _id: 1 },
    data_desc: { dataInMb: -1, _id: -1 },
  };
  const sortKey = (req.query.sortBy as string) || "price_asc";
  const sortOrder = sortMap[sortKey] || sortMap["price_asc"];

  // ── Cursor ───────────────────────────────────────────────────────────────────
  if (cursor) {
    const decoded = decodeCursor(cursor as string);
    query = query.where({
      createdAt: { $lt: decoded.createdAt },
      _id: { $lt: decoded._id },
    });
  }

  // ── Execute ──────────────────────────────────────────────────────────────────
  const data = await query
    .sort(sortOrder)
    .limit(limit + 1)
    .lean();

  const paginated = buildCursorPaginationResponse(data, limit, {
    createdAtField: "createdAt",
    idField: "_id",
  });

  return {
    ...paginated,
    results: paginated.results.map((plan: any) => ({
      ...plan,
      price: plan.price + ESIM_MARKUP,
    })),
  };
};

export const getPlanById = async (planId: string) => {
  const plan = await InternationalPlan.findById(planId);
  if (!plan || !plan.isActive) {
    throw new Error("Plan not found or no longer available");
  }
  return {
    ...plan.toObject(),
    price: plan.price + ESIM_MARKUP,
  };
};

// ─── Create eSIM Order ────────────────────────────────────────────────────────

interface CreateEsimOrderInput {
  zetexaPackageId: string;
  countryCode: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  paymentMethod: PaymentMethod;
  state?: string;
  city?: string;
  pincode?: string;
  phoneNumber?: string;
}

export const createEsimOrder = async (
  input: CreateEsimOrderInput,
  userId: string,
) => {
  // Step 1 — verify plan exists in DB
  const plan = await InternationalPlan.findOne({
    zetexaPackageId: input.zetexaPackageId,
    isActive: true,
  });
  if (!plan) throw new Error("Plan not found or no longer available");

  // Step 2 — check reseller balance before touching Zetexa
  const balance = await getResellerBalance();

  if (balance < plan.price) {
    // originalPrice, not plan.price
    throw new Error("Insufficient reseller balance");
  }

  // Step 3 — build Zetexa payload
  const zetexaPayload: ZetexaCreateOrderRequest = {
    package_id: input.zetexaPackageId,
    country: input.countryCode.toUpperCase(),
    first_name: input.firstName,
    last_name: input.lastName,
    email: input.email,
    address: input.address,
    state: input.state,
    city: input.city,
    pincode: input.pincode,
    phone_number: input.phoneNumber,
  };

  // here we'll write the payment logic

  // Step 4 — place order on Zetexa
  const zetexaOrder = await createOrder(zetexaPayload);
  if (!zetexaOrder.success) {
    throw new Error("Zetexa order creation failed");
  }

  // Step 5 — fetch QR code if KYC not pending
  let qrData = null;
  if (zetexaOrder.status !== "Kyc Pending") {
    try {
      const qrResponse = await getQrCodeByOrderId(zetexaOrder.order_id);
      qrData = qrResponse.qr_codes?.[0] ?? null;
    } catch (err) {
      // don't fail the order if QR fetch fails — can retry later
      console.error("[EsimService] QR fetch failed, continuing:", err);
    }

    // notify zetexa that payment was successfull so that it can cut from reseller wallet
    try {
      await notifyZetexa({
        order_id: zetexaOrder.order_id,
        order_amount: plan.price,
        order_status: "SUCCESS",
        currency: plan.currency,
        first_name: input.firstName,
        last_name: input.lastName,
        email: input.email,
      });
    } catch (err) {
      console.error("[EsimService] Notify failed, continuing:", err);
    }
  }

  // Step 6 — save Order in our DB
  const orderNumber = `IESIM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const order = await Order.create({
    orderNumber,
    userId,
    orderType: OrderType.INTERNATIONAL_ESIM,
    status: OrderStatus.PENDING,
    paymentMethod: input.paymentMethod,
    paymentStatus: PaymentStatus.PENDING,
    totalAmount: plan.price,
    items: [], // no domestic SIM items

    esimDetails: {
      zetexaOrderId: zetexaOrder.order_id,
      zetexaPackageId: input.zetexaPackageId,
      countryCode: input.countryCode.toUpperCase(),
      planName: plan.name,
      dataLimit: plan.dataLimit,
      validityDays: plan.validityDays,
      price: plan.price + ESIM_MARKUP,
      currency: plan.currency,
      iccid: qrData?.iccid,
      qrCodeUrl: qrData?.qr_code,
      lpaServer: qrData?.lpa_server,
      isKycRequired: zetexaOrder.status === "Kyc Pending",
      ekycLink: zetexaOrder.ekyc_link,
    },
  });

  if (!order) throw new Error("Failed to save order");

  // Step 7 — notify user
  await createNotification(
    userId,
    "ORDER_PLACED",
    ORDER_NOTIFICATION_MESSAGES.ORDER_PLACED.title,
    ORDER_NOTIFICATION_MESSAGES.ORDER_PLACED.message,
  );

  // Step 8 — QR email bhejo
  if (order.esimDetails?.qrCodeUrl && order.esimDetails?.lpaServer) {
    await sendEsimQrEmail(
      input.email,
      input.firstName,
      plan.name,
      plan.dataLimit,
      plan.validityDays,
      input.countryCode,
      order.esimDetails.qrCodeUrl,
      order.esimDetails.lpaServer,
    );
  }

  return order;
};

// ─── Wallet Balance (admin) ───────────────────────────────────────────────────

export const getWalletBalance = async () => {
  const balance = await getResellerBalance();
  return { balance, currency: "INR" };
};

export const checkEsimStatus = async (orderId: string, userId: string) => {
  // Step 1 — find order in our DB
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");
  if (order.userId.toString() !== userId) throw new Error("Unauthorized");
  if (order.orderType !== OrderType.INTERNATIONAL_ESIM) {
    throw new Error("Not an international eSIM order");
  }
  if (!order.esimDetails) throw new Error("No eSIM details found");

  // Step 2 — if QR already exists, just return it
  if (order.esimDetails.qrCodeUrl) {
    return order;
  }

  // Step 3 — check status on Zetexa
  const zetexaDetails = await getOrderDetails(order.esimDetails.zetexaOrderId);
  const zetexaStatus = zetexaDetails.data?.order?.order_status;

  // Step 4 — if still pending KYC, return current state
  if (zetexaStatus === "Kyc Pending") {
    return {
      ...order.toObject(),
      zetexaStatus,
      message: "KYC still pending",
    };
  }

  // Step 5 — KYC done, fetch QR now
  const qrResponse = await getQrCodeByOrderId(order.esimDetails.zetexaOrderId);
  const qrData = qrResponse.qr_codes?.[0] ?? null;

  if (!qrData) throw new Error("QR not ready yet, try again in a few minutes");

  // Step 6 — update our DB with QR
  order.esimDetails.iccid = qrData.iccid;
  order.esimDetails.qrCodeUrl = qrData.qr_code;
  order.esimDetails.lpaServer = qrData.lpa_server;
  order.esimDetails.isKycRequired = false;
  order.status = OrderStatus.ESIM_ACTIVATED;
  await order.save();

  // Step 7 — notify user
  await createNotification(
    userId,
    "SYSTEM",
    "Your eSIM is Ready!",
    "Your eSIM has been activated. Open the app to scan your QR code.",
  );

  return order;
};
