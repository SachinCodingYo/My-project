import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICartItem {
  planId: mongoose.Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
}

const cartItemSchema = new Schema<ICartItem>({
  planId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Plan",
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

const cartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true },
);

const Cart: Model<ICart> = mongoose.model<ICart>("Cart", cartSchema);

export default Cart;
