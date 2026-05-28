import mongoose, { Schema, Document, Model } from "mongoose";

export interface IService extends Document {
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
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

const Service: Model<IService> = mongoose.model<IService>(
  "Service",
  serviceSchema,
);
export default Service;
