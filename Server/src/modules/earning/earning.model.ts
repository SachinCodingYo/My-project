import mongoose, { Schema, Document, Model } from "mongoose";

export enum EarningStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  PAID = "PAID",
}

export interface IEarning extends Document {
  mrId: mongoose.Types.ObjectId;

  orderId: mongoose.Types.ObjectId;

  baseEarning: number;

  fixedDistanceKm: number;

  actualDistanceKm: number;

  extraDistanceKm: number;

  perKmRate: number;

  distanceEarning: number;

  incentive: number;

  totalEarning: number;

  status: EarningStatus;
}

const earningSchema = new Schema<IEarning>(
  {
    mrId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },

    baseEarning: {
      type: Number,
      required: true,
    },

    fixedDistanceKm: {
      type: Number,
      default: 5,
    },

    actualDistanceKm: {
      type: Number,
      required: true,
    },

    extraDistanceKm: {
      type: Number,
      default: 0,
    },

    perKmRate: {
      type: Number,
      default: 20,
    },

    distanceEarning: {
      type: Number,
      default: 0,
    },

    incentive: {
      type: Number,
      default: 0,
    },

    totalEarning: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(EarningStatus),
      default: EarningStatus.PENDING,
    },
  },
  {
    timestamps: true,
  }
);

earningSchema.index({ mrId: 1, createdAt: -1 });

earningSchema.index({ mrId: 1, status: 1 });

const Earning: Model<IEarning> = mongoose.model<IEarning>(
  "Earning",
  earningSchema
);

export default Earning;