/**
 * Authentication Module
 * Handles: Register, Login, OTP, Password Management
 * Developer: Aman Kumar Singh
 */
import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../../common/types/express";
const otpTimeouts = new Map<string, NodeJS.Timeout>();

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      sparse: true,
      trim: true,
      index: true,
    },
    mobile: {
      type: String,
      unique: true,
      trim: true,
      sparse: true,
      index: true,
    },
    password: {
      type: String,
      select: false,
    },
    otp: {
      type: String,
      select: false,
    },

    resetOtp: {
      type: String,
      select: false,
    },

    resetOtpExpiry: {
      type: Date,
      select: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER", "MR"],
      default: "USER",
    },
    image: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Uday Pratap
    isOnline: { type: Boolean, default: false },
  },
  { timestamps: true },
);

userSchema.methods.removeOTPAfter2Minutes = function () {
  const userId = this._id.toString();
  if (otpTimeouts.has(userId)) {
    clearTimeout(otpTimeouts.get(userId)!);
  }
  const timeout = setTimeout(
    async () => {
      try {
        this.otp = undefined;
        await this.save();
        otpTimeouts.delete(userId);
      } catch (err: any) {
        console.error("Error removing OTP for user:", userId, err.message);
      }
    },
    2 * 60 * 1000,
  );

  otpTimeouts.set(userId, timeout);
};

userSchema.post("save", function (doc: IUser) {
  if (doc.otp) {
    doc.removeOTPAfter2Minutes();
  }
});

userSchema.index({ createdAt: -1, _id: -1 });
export const UserModel = mongoose.model<IUser>("User", userSchema);
