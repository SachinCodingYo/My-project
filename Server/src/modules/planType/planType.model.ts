import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPlanType extends Document {
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PlanTypeSchema = new Schema<IPlanType>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const PlanType: Model<IPlanType> = mongoose.model<IPlanType>(
  "PlanType",
  PlanTypeSchema,
);

export default PlanType;
