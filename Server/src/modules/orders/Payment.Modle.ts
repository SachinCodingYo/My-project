//ARVIND
import mongoose, { Schema, Document } from "mongoose";
export interface IPayment extends Document {
  orderId: mongoose.Types.ObjectId;
  transactionId: string;
  gatewayResponse: object;
  amount: number;
  status: "SUCCESS" | "FAILED";
}

const paymentSchema = new Schema<IPayment>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    transactionId: { type: String, required: true },

    gatewayResponse: { type: Object },

    amount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["SUCCESS", "FAILED"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>("Payment", paymentSchema);