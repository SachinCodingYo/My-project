/**
 * @author Aman kumar singh
 * @description
 */

import mongoose, { Document, Schema } from "mongoose";

export interface IKyc extends Document {
  userId: mongoose.Types.ObjectId;
  submittedBy?: mongoose.Types.ObjectId;

  fullname?: string;
  // VERIFIED HOLDER NAMES
aadhaarHolderName?: string;
panHolderName?: string;
bankHolderName?: string;
  fatherName?: string;
  dob?: Date;
  gender?: "male" | "female" | "other";

  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;

  aadhaarNumber?: string;
  panNumber?: string;
    // BANK DETAILS (NEW)
  bankAccountNumber?: string;
  ifscCode?: string;

  // External verification reference (Cashfree / Aadhaar API)
  aadhaarRefId?: string | null;

  aadhaarFrontImage?: string;
  aadhaarBackImage?: string;
  panImage?: string;
  selfieImage?: string;
  signatureImage?: string;

  // verification flags
  aadhaarVerified?: boolean;
  panVerified?: boolean;
  bankVerified?: boolean;

  // video kyc
  kycVideo?: string;
  isVideoVerified?: boolean;

    // video review system
  videoKycStatus?: "pending" | "verified" | "failed";

  faceMatchScore?: number;

  livenessScore?: number;

  faceMatched?: boolean;

  livenessPassed?: boolean;

  videoUploadedAt?: Date;

  videoReviewedAt?: Date;

  videoReviewedBy?: mongoose.Types.ObjectId;

   // NEW VIDEO FIELDS
  videoRejectedReason?: string;
  videoStatusUpdatedAt?: Date;

  // otp
  kycOtp?: string;
  kycOtpExpiry?: Date;
  otpAttempts?: number;

  // final status
  isKycVerified?: boolean;

  status:
    | "not_submitted"
    | "initiated"
    | "aadhaar_verified"
    | "pan_verified"
    | "bank_verified"
    | "video_uploaded"
    | "pending"
    | "approved"
    | "rejected";
    // OPTIONAL FLOW TRACKING (VERY USEFUL)
  kycStep?: "aadhaar" | "pan" | "bank" | "video" | "completed";

  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  rejectionReason?: string;

  isDeleted?: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const KycSchema = new Schema<IKyc>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    fullname: String,
    // VERIFIED HOLDER NAMES
aadhaarHolderName: String,
panHolderName: String,
bankHolderName: String,
    fatherName: String,
    dob: Date,

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    address: String,
    city: String,
    state: String,
    pinCode: String,

    aadhaarNumber: String,

    panNumber: {
      type: String,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN format"],
    },
     // BANK DETAILS (NEW FIX)
    bankAccountNumber: String,
    ifscCode: String,

    //  NEW FIELD (AADHAAR REF ID)
    aadhaarRefId: {
      type: String,
      default: null,
    },

    aadhaarFrontImage: String,
    aadhaarBackImage: String,
    panImage: String,
    selfieImage: String,
    signatureImage: String,

    // verification flags
    aadhaarVerified: {
      type: Boolean,
      default: false,
    },

    panVerified: {
      type: Boolean,
      default: false,
    },

    bankVerified: {
      type: Boolean,
      default: false,
    },

    // video kyc
    kycVideo: String,

    isVideoVerified: {
      type: Boolean,
      default: false,
    },
       // video review system
    videoKycStatus: {
      type: String,
      enum: ["pending", "verified", "failed"],
      default: "pending",
    },
    faceMatchScore: {
      type: Number,
      default: 0,
    },

    livenessScore: {
      type: Number,
      default: 0,
    },

    faceMatched: {
      type: Boolean,
      default: false,
    },

    livenessPassed: {
      type: Boolean,
      default: false,
    },

    videoUploadedAt: Date,

    videoReviewedAt: Date,

    videoReviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
      // NEW VIDEO FIELDS
    videoRejectedReason: String,
    videoStatusUpdatedAt: Date,

    // otp
    kycOtp: {
      type: String,
      select: false,
    },

    kycOtpExpiry: Date,

    otpAttempts: {
      type: Number,
      default: 0,
    },

    isKycVerified: {
      type: Boolean,
      default: false,
    },

    //  UPDATED STATUS FLOW (PRODUCTION KYC FLOW)
    status: {
      type: String,
      enum: [
        "not_submitted",
        "initiated",
        "aadhaar_verified",
        "pan_verified",
        "bank_verified",
        "video_uploaded",
        "pending",
        "approved",
        "rejected",
      ],
      default: "not_submitted",
    },
        // OPTIONAL FLOW TRACKING
    kycStep: {
      type: String,
      enum: ["aadhaar", "pan", "bank", "video", "completed"],
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    verifiedAt: Date,

    rejectionReason: String,

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// INDEXES
KycSchema.index({ userId: 1 }, { unique: true });
KycSchema.index({ aadhaarNumber: 1 }, { unique: true, sparse: true });
KycSchema.index({ panNumber: 1 }, { unique: true, sparse: true });
KycSchema.index({ submittedBy: 1 });

export default mongoose.model<IKyc>("Kyc", KycSchema);
