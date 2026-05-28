/**
 * Authentication Service Layer
 * Handles: Register, Login, OTP, Password Management, Admin User Operations
 * Developer: Aman Kumar Singh
 */
import { UserModel } from "./auth.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateOTP } from "../../common/utils/genrateOTP";
import mongoose from "mongoose";
import { userInfo } from "node:os";

export type UserRole = "ADMIN" | "USER" | "MR";

// Admin: Get user profile
export const getUserByAdmin = async (userId: string) => {
  const user = await UserModel.findById(userId).select(
    "fullName email mobile role image isActive createdAt"
  );
  if (!user) throw new Error("User not found");
  return user;
};

// Admin: Update user profile

export const updateUserByAdmin = async (
  userId: string,
  data: {
    fullName?: string;
    email?: string;
    mobile?: string;
    role?: UserRole;
    image?: string;
    isActive?: boolean;
  }
) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error("User not found");

  if (data.fullName) user.fullName = data.fullName.trim();
  if (data.email) user.email = data.email.toLowerCase().trim();
  if (data.mobile) user.mobile = data.mobile.trim();

  const allowedRoles: UserRole[] = ["ADMIN", "USER", "MR"];
  if (data.role && allowedRoles.includes(data.role)) user.role = data.role;
  if (data.image) user.image = data.image;
  if (typeof data.isActive === "boolean") user.isActive = data.isActive;

  await user.save();
  return user;
};

export const registerUser = async (data: any) => {
  const email = data.email.toLowerCase().trim();
  const mobile = data.mobile.trim();
  const fullName = data.fullName.trim();

  const otp =
    process.env.NODE_ENV === "development"
      ? "123456"
      : generateOTP();

  const emailUser = await UserModel.findOne({ email });
  const mobileUser = await UserModel.findOne({ mobile });
  if (
    emailUser &&
    mobileUser &&
    emailUser._id.toString() === mobileUser._id.toString()
  ) {
    if (emailUser.isVerified) {
      throw new Error("Email and Mobile already used plz try another Mobile and Email");
    }
  }
  if (emailUser) {
    if (emailUser.isVerified) {
      throw new Error("Email already used plz try another Email");
    }

    if (
      mobileUser &&
      emailUser._id.toString() !== mobileUser._id.toString()
    ) {
      throw new Error("Email already exists");
    }
  }

  if (mobileUser) {
    if (mobileUser.isVerified) {
      throw new Error("Mobile already used plz change Mobile Number");
    }

    if (
      emailUser &&
      emailUser._id.toString() !== mobileUser._id.toString()
    ) {
      throw new Error("Mobile already exists");
    }
  }
  const existingUser = emailUser || mobileUser;

  if (existingUser) {
    existingUser.fullName = fullName;
    existingUser.email = email;
    existingUser.mobile = mobile;
    existingUser.otp = otp;

    await existingUser.save();

    return {
      message: "OTP sent successfully",
      userId: existingUser._id,
    };
  }

  const newUser = await UserModel.create({
    fullName,
    email,
    mobile,
    otp,
    isVerified: false,
    isActive: true,
  });

  return {
    // message: "User registered successfully",
    userId: newUser._id,
  }
};

export const verifyOtp = async (
  userId: mongoose.Types.ObjectId | string,
  otp: string,
  password: string,
) => {
  const user = await UserModel.findById(userId).select("+ otp");
  if (!user) throw new Error("User not found");
  if (!user.otp || user.otp !== otp) throw new Error("Invalid OTP");
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.isVerified = true;
  await user.save();
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    },
  );
  return {
    userId: user._id,
    verified: true,
    token
  };
};

export const loginUser = async (emailOrMobile: string, password: string) => {
  const isEmail = emailOrMobile.includes("@");
  const query = isEmail
    ? { email: emailOrMobile, isVerified: true }
    : { mobile: emailOrMobile, isVerified: true };
  const user = await UserModel.findOne(query).select("+ password role isActive");
  if (!user) throw new Error("User not found");
  if (!user.isActive) {
    throw new Error("User is inactive. Contact admin");
  }
  const isMatch = await bcrypt.compare(password, user.password!);
  if (!isMatch) throw new Error("Invalid credentials");
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    },
  );
  return { token };
};
export const forgotPassword = async (emailOrMobile: string) => {
  const value = emailOrMobile.trim().toLowerCase();
  const isEmail = value.includes("@");

  const query = isEmail
    ? { email: value, isVerified: true }
    : { mobile: value, isVerified: true };

  const user = await UserModel.findOne(query);
  if (!user) throw new Error("User not found");
  const otp =
    process.env.NODE_ENV === "development"
      ? "123456"
      : generateOTP();

  const hashedOtp = await bcrypt.hash(otp, 10);

  user.resetOtp = hashedOtp;
  user.resetOtpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min
  await user.save();

  return {
    // message: "Reset OTP sent successfully",
    userId: user._id,
    // ...(process.env.NODE_ENV === "development" && { otp }),
  };
};

export const confirmPassword = async (
  userId: string,
  otp: string,
  newPassword: string
) => {
  const user = await UserModel.findById(userId)
    .select("+resetOtp +resetOtpExpiry");

  if (!user) throw new Error("User not found");

  if (!user.resetOtp || !user.resetOtpExpiry)
    throw new Error("Reset OTP not requested");

  if (user.resetOtpExpiry < new Date())
    throw new Error("OTP expired");

  const isOtpValid = await bcrypt.compare(otp, user.resetOtp);

  if (!isOtpValid) throw new Error("Invalid OTP");

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  user.resetOtp = undefined;
  user.resetOtpExpiry = undefined;

  await user.save();

  return {
    //  message: "Password updated successfully"
  };
};

export const resetPassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = await UserModel.findById(userId).select("+password");

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(oldPassword, user.password!);

  if (!isMatch) throw new Error("Old password incorrect");

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;

  await user.save();

  return {
    // message: "Password reset successfully" 
  };
};
export const adminChangePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await UserModel.findById(userId).select("+password");

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(currentPassword, user.password!);
  if (!isMatch) throw new Error("Current password incorrect");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;

  await user.save();

  return {};
};
