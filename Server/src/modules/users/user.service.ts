/**
 * Module: User Service
 * Description: Handles business logic for user operations including fetch, list, and update
 * Author: Aman Kumar Singh
 */
import mongoose from "mongoose";
import { UserModel } from "../auth/auth.model";
import { decodeCursor } from "../../config/pagination.config";
import { buildCursorPaginationResponse } from "../../common/utils/pagination.util";
// import { redis } from "../../config/redis";

export const getUserById = async (id: mongoose.Types.ObjectId) => {
  const user = await UserModel.findById(id);
  if (!user) {
    throw new Error("User not Found");
  }
  return user;
};

export const userList = async (queryParams: any) => {
  const { cursor = null, limit = 10 } = queryParams.pagination || {};
  const { search } = queryParams;
  const cacheKey = `users:list:${search || "all"}:${cursor || "first"}:${limit}`;
  // const cached = await redis.get(cacheKey);
  // if (cached) {
  //   return JSON.parse(cached);
  // }

  const query: Record<string, any> = {
    role: "USER",
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
          _id: { $lt: _id },
        },
      ],
    });
  }

  const data = await UserModel.find(query)
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit)
    .select("-password -otp");

  const response = buildCursorPaginationResponse(data, limit);
  // await redis.set(cacheKey, JSON.stringify(response), {
  //   EX: 60,
  // });
  return response;
};
export const updateUser = async (
  id: mongoose.Types.ObjectId,
  body: any
) => {

  const user = await UserModel.findByIdAndUpdate(
    id,
    { $set: body },
    { new: true }
  ).select("-password -otp");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
