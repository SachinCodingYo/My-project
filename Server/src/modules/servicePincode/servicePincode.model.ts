import mongoose, { Schema, Document } from "mongoose";

export interface IServicePincode extends Document {
  pincode: string;
  isActive: boolean;
  assignedMRs: mongoose.Types.ObjectId[];
}

const servicePincodeSchema = new Schema<IServicePincode>(
  {
    pincode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^[1-9][0-9]{5}$/, "Please enter a valid 6-digit Indian pincode"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    assignedMRs: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

const ServicePincode = mongoose.model<IServicePincode>(
  "ServicePincode",
  servicePincodeSchema,
);
export default ServicePincode;
