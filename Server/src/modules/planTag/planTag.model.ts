import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPlanTag extends Document {
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const planTagSchema = new Schema<IPlanTag>(
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const PlanTag: Model<IPlanTag> = mongoose.model<IPlanTag>(
  "PlanTag",
  planTagSchema,
);

export default PlanTag;
