import mongoose, { Schema, Model, Document } from "mongoose";

export interface IPlan extends Document {
  operatorId: mongoose.Types.ObjectId;
  planTypeId: mongoose.Types.ObjectId;
  planTagsId: mongoose.Types.ObjectId[];
  vipCategoryId: mongoose.Types.ObjectId;
  serviceId: mongoose.Types.ObjectId;
  price: number;
  salePrice: number;
  description?: string;
  validity?: number;
  data?: string;
  calls?: string;
  sms?: string;
  networkType: string;
  isBusinessSim: boolean;
  simTypes: string[];
  minQuantity: number;
  // bulkDiscountPercentage: number;
  // minQuantityForDiscount: number;
  isActive?: boolean;
  benefits?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const planSchema = new Schema<IPlan>(
  {
    operatorId: {
      type: Schema.Types.ObjectId,
      ref: "Operator",
      required: true,
    },
    planTypeId: {
      type: Schema.Types.ObjectId,
      ref: "PlanType",
      required: true,
    },
    planTagsId: [
      {
        type: Schema.Types.ObjectId,
        ref: "PlanTag",
      },
    ],
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    salePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    vipCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "VipCategory",
      required: false,
    },
    validity: {
      type: Number,
      required: false,
    },
    data: {
      type: String,
      trim: true,
    },
    calls: {
      type: String,
      trim: true,
    },
    sms: {
      type: String,
      trim: true,
    },
    networkType: {
      type: String,
      enum: ["2G", "3G", "4G", "5G"],
      required: false,
    },
    isBusinessSim: { type: Boolean, default: false },
    simTypes: {
      type: [String],
      enum: ["physical", "esim"],
      default: ["physical"],
    },
    minQuantity: {
      type: Number,
      required: false,
    },
    // minQuantityForDiscount: { type: Number, default: 5, min: 1 },
    // bulkDiscountPercentage: { type: Number, default: 0, min: 0, max: 100 },
    description: {
      type: String,
      trim: true,
    },
    benefits: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Plan: Model<IPlan> = mongoose.model<IPlan>("Plan", planSchema);

export default Plan;
