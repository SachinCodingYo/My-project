/**
 * MR Service
 * Author: Aman Kumar Singh
 */
import { UserModel } from "../auth/auth.model";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { decodeCursor } from "../../config/pagination.config";
import { buildCursorPaginationResponse } from "../../common/utils/pagination.util";

export const createMRService = async (data: any) => {
  const { fullName, email, mobile, password, isActive } = data;

  const existing = await UserModel.findOne({
    $or: [{ email }, { mobile }],
  });

  if (existing) {
    throw new Error("MR already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const mr = await UserModel.create({
    fullName,
    email,
    mobile,
    password: hashedPassword,
    role: "MR",
    isVerified: true,
    isActive: isActive ?? true,
  });
  return mr;
};

export const getAllMRService = async (queryParams: any) => {
  const { cursor = null, limit = 10 } = queryParams.pagination || {};
  const { search } = queryParams;

  const parsedLimit = Number(limit) || 10;

  const query: Record<string, any> = {
    role: "MR",
    isActive: true,
  };

  if (search) {
    query.$or = [
      { email: { $regex: search, $options: "i" } },
      { mobile: { $regex: search, $options: "i" } },
      { fullName: { $regex: search, $options: "i" } },
    ];
  }

  if (cursor) {
    const { createdAt, _id } = decodeCursor(cursor);

    query.$and = query.$and || [];
    query.$and.push({
      $or: [
        { createdAt: { $lt: new Date(createdAt) } },
        {
          createdAt: new Date(createdAt),
          _id: { $lt: new mongoose.Types.ObjectId(_id) },
        },
      ],
    });
  }

  const data = await UserModel.find(query)
    .sort({ createdAt: -1, _id: -1 })
    .limit(parsedLimit + 1)
    .select("-password -otp -resetOtp")
    .lean();

  return buildCursorPaginationResponse(data, parsedLimit, {
    createdAtField: "createdAt",
    idField: "_id",
  });
};

export const getMRByIdService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid MR ID");
  }

  const mr = await UserModel.findById(id).select("-password -otp -resetOtp");
  if (!mr || mr.role !== "MR") {
    throw new Error("MR not found");
  }
  return mr;
};

export const updateMRService = async (id: string, data: any) => {
  const mr = await UserModel.findById(id);
  if (!mr || mr.role !== "MR") {
    throw new Error("MR not found");
  }

  const { fullName, email, mobile, password, isActive } = data;

  if (fullName) mr.fullName = fullName;
  if (email) mr.email = email;
  if (mobile) mr.mobile = mobile;

  if (password) {
    mr.password = await bcrypt.hash(password, 10);
  }
  if (typeof isActive === "boolean") {
    mr.isActive = isActive;
  }
  await mr.save();

  return mr;
};

export const deleteMRService = async (id: string) => {
  const mr = await UserModel.findById(id);

  if (!mr || mr.role !== "MR") {
    throw new Error("MR not found");
  }

  // await mr.deleteOne();
  mr.isActive = false;
  await mr.save();

  return true;
};
export const updateProfileImageService = async (
  userId: string,
  imagePath: string,
) => {
  const user = await UserModel.findById(userId);

  if (!user || user.role !== "MR") {
    throw new Error("MR not found");
  }

  user.image = imagePath;
  await user.save();

  return user;
};

// Uday
// ONLINE / OFFLINE TOGGLE SERVICE
// ==========================================
// Flips the isOnline field on the User model.
// order.service.ts filters MRs by isOnline:true for assignment,
// so this directly controls whether an MR can receive orders.
export const toggleOnlineService = async (userId: string) => {
  const mr = await UserModel.findById(userId);
  if (!mr || mr.role !== "MR") {
    throw new Error("MR not found");
  }

  mr.isOnline = !mr.isOnline;
  await mr.save();

  return { isOnline: mr.isOnline };
};
