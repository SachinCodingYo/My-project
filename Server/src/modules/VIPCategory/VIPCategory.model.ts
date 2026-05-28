import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVipCategory extends Document {
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VipCategorySchema = new Schema<IVipCategory>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
      trim: true,
      unique: true,
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

const VipCategory: Model<IVipCategory> = mongoose.model<IVipCategory>(
  "VipCategory",
  VipCategorySchema,
);

export default VipCategory;
