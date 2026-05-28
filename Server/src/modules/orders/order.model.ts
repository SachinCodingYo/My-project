/**
 * @author Uday Pratap Chauhan
 * @desc whole order model , it's interfaces, schemas and things related to it!
 */
import mongoose, { Schema, Document, Model } from "mongoose";

export enum OrderStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  ASSIGNED = "ASSIGNED",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
  ESIM_ACTIVATED = "ESIM_ACTIVATED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  INQUIRY_RECEIVED = "INQUIRY_RECEIVED",
}

export enum PaymentMethod {
  ONLINE = "ONLINE",
  UPI = "UPI",
  NETBANKING = "NETBANKING",
  COD = "COD",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export enum OrderType {
  NORMAL = "NORMAL",
  BUSINESS = "BUSINESS",
  PORT = "PORT",
  ESIM = "ESIM",
  INTERNATIONAL_ESIM = "INTERNATIONAL_ESIM", //  Zetexa orders
  FANCY_NUMBER = "FANCY_NUMBER",
}

export interface IBusinessDetails {
  planId: mongoose.Types.ObjectId;
  numberOfSims: number;
  companyName: string;
  companyPhone: string;
  gstNumber?: string;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  approvedBy?: mongoose.Types.ObjectId;
}

export interface IItem {
  planId: mongoose.Types.ObjectId;
  quantity: number;
  priceAtPurchase: number;
  salePriceAtPurchase: number;
  operatorFee: number;
}

// ─── New: eSIM Details Interface ──────────────────────────────────────────────

export interface IEsimDetails {
  zetexaOrderId: string;
  zetexaPackageId: string;
  countryCode: string;
  planName: string;
  dataLimit: string; // "1.0 GB" | "Unlimited"
  validityDays: number;
  price: number;
  currency: string; // "INR"
  iccid?: string; // assigned after activation
  qrCodeUrl?: string; // base64 image to scan
  lpaServer?: string; // for manual eSIM activation
  isKycRequired: boolean;
  ekycLink?: string; // only present when KYC needed
}

// ─── Main Order Interface ─────────────────────────────────────────────────────

export interface IOrder extends Document {
  orderNumber: string;
  userId: mongoose.Types.ObjectId;
  existingNumber?: string;
  previousOperator?: string;
  fancyNumberId?: mongoose.Types.ObjectId;
  items: IItem[];
  platformFee: number;
  subTotal: number;
  saleSubTotal: number;
  discount: number;
  totalOperatorFee: number;
  deliveryCharge: number;
  totalAmount: number;
  addressId?: mongoose.Types.ObjectId;
  orderType: OrderType;
  status: OrderStatus;
  businessDetails?: IBusinessDetails;
  esimDetails?: IEsimDetails;
  assignedTo?: mongoose.Types.ObjectId | null;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
}

const businessDetailsSchema = new Schema<IBusinessDetails>({
  planId: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
  numberOfSims: { type: Number, required: true },
  companyName: { type: String, trim: true, required: true },
  companyPhone: { type: String, required: true },
  gstNumber: { type: String, required: false },
  approvalStatus: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING",
  },
  approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
});

const itemSchema = new Schema<IItem>({
  planId: { type: Schema.Types.ObjectId, required: true },
  quantity: { type: Number, default: 1 },
  operatorFee: { type: Number, default: 0 },
  priceAtPurchase: { type: Number, required: true },
  salePriceAtPurchase: { type: Number, required: true },
});

// ─── New: eSIM Details Sub-Schema ─────────────────────────────────────────────

const esimDetailsSchema = new Schema<IEsimDetails>({
  zetexaOrderId: { type: String, required: true },
  zetexaPackageId: { type: String, required: true },
  countryCode: { type: String, required: true, uppercase: true },
  planName: { type: String, required: true },
  dataLimit: { type: String, required: true },
  validityDays: { type: Number, required: true },
  price: { type: Number, required: true },
  currency: { type: String, required: true, default: "INR" },
  iccid: { type: String },
  qrCodeUrl: { type: String },
  lpaServer: { type: String },
  isKycRequired: { type: Boolean, default: false },
  ekycLink: { type: String },
});

// ─── Main Order Schema ────────────────────────────────────────────────────────

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, unique: true, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [itemSchema], default: [] },
    platformFee: { type: Number, default: 0 },
    subTotal: { type: Number, default: 0 },
    deliveryCharge: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    saleSubTotal: { type: Number, default: 0 },
    totalOperatorFee: { type: Number, default: 0 },
    existingNumber: { type: String, trim: true },
    previousOperator: { type: String, trim: true },
    fancyNumberId: {
      type: Schema.Types.ObjectId,
      ref: "FancyNumber",
      default: null,
    },
    totalAmount: { type: Number, default: 0 },

    addressId: { type: Schema.Types.ObjectId, ref: "Address", required: false },

    orderType: { type: String, enum: Object.values(OrderType), required: true },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },

    businessDetails: { type: businessDetailsSchema },
    esimDetails: { type: esimDetailsSchema },

    assignedTo: { type: Schema.Types.ObjectId, ref: "User", default: null },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
  },
  { timestamps: true },
);

orderSchema.index({ createdAt: -1, _id: -1 });
const Order: Model<IOrder> = mongoose.model<IOrder>("Order", orderSchema);
export default Order;
