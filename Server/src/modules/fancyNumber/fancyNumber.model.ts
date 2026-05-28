import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFancyNumber extends Document {
  number: string;
  price: number;
  salePrice: number;
  isActive: boolean;
  isAvailable: boolean;
  vipCategoryId?: mongoose.Types.ObjectId;
  operatorId: mongoose.Types.ObjectId;
}

const fancyNumberSchema = new Schema<IFancyNumber>(
  {
    number: { type: String, required: true, unique: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
    vipCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "VipCategory",
      required: false,
    },
    operatorId: {
      type: Schema.Types.ObjectId,
      ref: "Operator",
      required: true,
    },
  },
  { timestamps: true },
);

// Added Compound Index for cursor-based pagination sorting
fancyNumberSchema.index({ createdAt: -1, _id: -1 });

const FancyNumber: Model<IFancyNumber> = mongoose.model<IFancyNumber>(
  "FancyNumber",
  fancyNumberSchema,
);

export default FancyNumber;
