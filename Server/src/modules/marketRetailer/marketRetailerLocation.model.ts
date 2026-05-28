/**
 * MR GPS Model
 * Author: Aman Kumar Singh
 */
import mongoose, { Document, Schema } from 'mongoose';

export interface IMrGPS extends Document {
  userId: mongoose.Types.ObjectId;
  tripId?: string;
  deviceId?: string;
  location: {
    type: String;
    coordinates: [number, number];
  };
  speed?: number;
  heading?: number;
  accuracy?: number;
  batteryLevel?: number;
  isMockLocation?: boolean;
  status?: "ONLINE" | "OFFLINE";
  timestamp: Date;
}

const MrGPSSchema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true, index: true },
     tripId: { type: String, index: true },
     deviceId: { type: String },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    speed: Number,
    heading: Number,
    accuracy: Number,
    batteryLevel: Number,
    isMockLocation: Boolean,
     status: {
      type: String,
      enum: ["ONLINE", "OFFLINE"],
      default: "ONLINE",
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
  },
  { versionKey: false }
);

MrGPSSchema.index({ location: '2dsphere' });
MrGPSSchema.index({ userId: 1, timestamp: -1 });
export default mongoose.model('mrGpsLocations', MrGPSSchema);

