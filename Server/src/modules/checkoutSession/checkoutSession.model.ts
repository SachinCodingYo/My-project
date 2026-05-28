import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICheckoutItem {
  planId: mongoose.Types.ObjectId;
  quantity: number;
  priceAtSnapshot: number; // For price change detection
}

export interface ICheckoutSession extends Document {
  userId: mongoose.Types.ObjectId;
  items: ICheckoutItem[];
  orderType: "DIRECT" | "THROUGHCART";
  expiresAt: Date;
}

const checkoutSessionSchema = new Schema<ICheckoutSession>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      planId: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
      quantity: { type: Number, required: true },
      priceAtSnapshot: { type: Number, required: true },
    },
  ],
  orderType: { type: String, enum: ["DIRECT", "THROUGHCART"], required: true },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 15 * 60 * 1000), // 15 Mins Expiry
  },
});

// TTL Index: Automatic cleanup by MongoDB
checkoutSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const CheckoutSession: Model<ICheckoutSession> =
  mongoose.model<ICheckoutSession>("CheckoutSession", checkoutSessionSchema);
export default CheckoutSession;
