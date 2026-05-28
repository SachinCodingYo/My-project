import mongoose, { Schema, Model, Document } from "mongoose";

export interface IAddress extends Document {
  houseNo: string;
  street: string;
  landmark?: string;
  pincode: string;
  city: string;
  state: string;
  location: {
    type: string;
    coordinates: number[];
  };
  isDefault: boolean;
  userId: mongoose.Types.ObjectId;
}

const addressSchema = new Schema<IAddress>({
  houseNo: {
    type: String,
    required: true,
    trim: true,
  },
  street: {
    type: String,
    required: true,
    trim: true,
  },
  landmark: {
    type: String,
    required: false,
    trim: true,
  },
  pincode: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: [Number],
  },
});

addressSchema.index({ location: "2dsphere" });
const Address: Model<IAddress> = mongoose.model<IAddress>(
  "Address",
  addressSchema,
);
export default Address;
