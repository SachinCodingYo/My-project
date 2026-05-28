/**
 * MR GPS Model
 * Description: Stores real-time MR location data including coordinates, speed, battery, and movement status
 * Author: Aman Kumar Singh
 */
import mongoose, { Document, Schema } from "mongoose";

export interface IMrGPS extends Document {
  userId: mongoose.Types.ObjectId;
  location: {
    type: string;
    coordinates: [number, number];
  };
  speed?: number;
  heading?: number;
  accuracy?: number;
  batteryLevel?: number;
  isMockLocation?: boolean;
  isMoving?: boolean;
  timestamp: Date;
  isLatest?: boolean;
}

const MrGPSSchema = new Schema<IMrGPS>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: (val: number[]) => val.length === 2,
          message: "Coordinates must be [lng, lat]",
        },
      },
    },

    speed: { type: Number, default: 0 },

    heading: { type: Number, min: 0, max: 360 },

    accuracy: Number,

    batteryLevel: { type: Number, min: 0, max: 100 },

    isMockLocation: { type: Boolean, default: false },

    isMoving: { type: Boolean, default: false },

    timestamp: {
      type: Date,
      default: Date.now,
      // index: true,
    },

    isLatest: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { versionKey: false }
);

MrGPSSchema.index({ location: "2dsphere" });
MrGPSSchema.index({ timestamp: 1 }, { expireAfterSeconds: 86400 });
MrGPSSchema.index({ userId: 1, isLatest: 1 });

export default mongoose.model<IMrGPS>("MrGpsLocation", MrGPSSchema);