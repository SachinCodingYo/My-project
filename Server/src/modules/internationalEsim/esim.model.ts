/**
 * @author Uday Pratap Chauhan
 * @desc whole international esim module along with the zetexa apis and orders
 */

import mongoose, { Schema, Document } from "mongoose";
import { AdaptedPlan, AdaptedCountry } from "./zetexa/zetexa.adapter";

// ─── Country Model ────────────────────────────────────────────────────────────

export interface ICountry extends AdaptedCountry, Document {}

const CountrySchema = new Schema<ICountry>(
  {
    zetexaId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    iso2: { type: String, required: true, unique: true, uppercase: true },
    iso3: { type: String, required: true },
    flagUrl: { type: String, required: true },
  },
  { timestamps: true },
);

CountrySchema.index({ name: "text" }); // for search by country name

// ─── International Plan Model ─────────────────────────────────────────────────

export interface IInternationalPlan extends AdaptedPlan, Document {
  countryCode: string; // which country this plan belongs to (iso2)
  lastSyncedAt: Date; // when did we last fetch this from Zetexa
}

const InternationalPlanSchema = new Schema<IInternationalPlan>(
  {
    zetexaPackageId: { type: String, required: true, unique: true },
    countryCode: { type: String, required: true, uppercase: true }, // "IN"

    // Plan Details
    name: { type: String, required: true },
    dataLimit: { type: String, required: true }, // "1.0 GB" | "Unlimited"
    dataInMb: { type: Number, required: true }, // 0 for unlimited
    validityDays: { type: Number, required: true },
    coverage: { type: String, required: true }, // "4G" | "5G"
    network: { type: String, default: null },
    callInSeconds: { type: Number, default: 0 },
    sms: { type: Number, default: 0 },

    // Pricing
    price: { type: Number, required: true },
    currency: { type: String, required: true, default: "INR" },

    // Flags
    isUnlimited: { type: Boolean, required: true, default: false },
    isActive: { type: Boolean, required: true, default: true },

    // FUP — "1GB/day then throttled to 256kbps"
    // Only present for unlimited plans, null for data-capped plans
    fupPolicy: { type: String, default: null },

    // Which countries this plan covers
    // A plan can cover multiple countries (e.g. regional plans)
    countries: [
      {
        name: { type: String, required: true },
        iso2: { type: String, required: true },
      },
    ],

    // Sync tracking
    lastSyncedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

// Most common query: "give me all active plans for India"
InternationalPlanSchema.index({ countryCode: 1, isActive: 1 });

// Sorting by price on frontend
InternationalPlanSchema.index({ countryCode: 1, price: 1 });

// Cron job uses this to find stale plans
InternationalPlanSchema.index({ lastSyncedAt: 1 });

// ─── Exports ──────────────────────────────────────────────────────────────────

export const Country = mongoose.model<ICountry>("Country", CountrySchema);

export const InternationalPlan = mongoose.model<IInternationalPlan>(
  "InternationalPlan",
  InternationalPlanSchema,
);
