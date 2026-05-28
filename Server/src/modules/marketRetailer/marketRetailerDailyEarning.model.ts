/**
 * MR GPS Location Schema
 * Author: Aman Kumar Singh
 */
import mongoose, { Schema, Document } from 'mongoose';

export interface IMrEarnings extends Document {
  userId: string;
  date: string;
  basePay: number;
  distancePay: number;
  bonus: number;
  total: number;
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
        validate: {
          validator: (val: number[]) => val.length === 2,
          message: "Coordinates must be [lng, lat]",
        },
      },
    },

    speed: { type: Number, min: 0 },
    heading: { type: Number, min: 0, max: 360 },
    accuracy: { type: Number, min: 0 },
    batteryLevel: { type: Number, min: 0, max: 100 },

    isMockLocation: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["ONLINE", "OFFLINE"],
      default: "ONLINE",
      index: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    versionKey: false,
    strict: true,
  }
);

// Geo index
MrGPSSchema.index({ location: '2dsphere' });

// Fast queries
MrGPSSchema.index({ userId: 1, timestamp: -1 });

export default mongoose.model('mrGpsLocations', MrGPSSchema);
