import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOperator extends Document {
  name: string;
  slug: string;
  logo?: string;
  isOperatorFee: boolean;
  operatorFee: number;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const operatorSchema = new Schema<IOperator>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isOperatorFee: {
      type: Boolean,
      default: false,
    },
    operatorFee: {
      type: Number,
      default: 0,
    },
    logo: {
      type: String,
      // default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Operator: Model<IOperator> = mongoose.model<IOperator>(
  "Operator",
  operatorSchema,
);

export default Operator;
