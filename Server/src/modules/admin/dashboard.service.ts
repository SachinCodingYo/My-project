/**
 * Dashboard Service Layer
 *
 * Provides role-based dashboard analytics:
 * - ADMIN: system-wide statistics
 * - MR: assigned orders data
 * - USER: personal order history
 *
 * Author: Aman Kumar Singh
 */
import { UserModel } from "../auth/auth.model";
import Operator from "../operator/operator.model";
import VipCategory from "../VIPCategory/VIPCategory.model";
import PlanType from "../planType/planType.model";
import PlanTag from "../planTag/planTag.model";
import OrderModel from "../orders/order.model";
import Service from "../service/service.model";

export const getDashboardData = async (user: any) => {
  try {
    if (!user) {
      throw new Error("Unauthorized");
    }

    if (user.role === "ADMIN") {
      const [
        totalUsers,
        totalVerifiedUsers,
        totalUserRole,
        totalMR,
        totalOperators,
        totalVipCategories,
        totalPlanTypes,
        totalPlanTags,
        totalServices,
        recentUsers,
        recentOrders,
        assignedOrders
      ] = await Promise.all([
        UserModel.countDocuments(),
        UserModel.countDocuments({ isVerified: true }),
        UserModel.countDocuments({ role: "USER" }),
        UserModel.countDocuments({ role: "MR" }),
        Operator.countDocuments(),
        VipCategory.countDocuments(),
        PlanType.countDocuments(),
        PlanTag.countDocuments(),
        Service.countDocuments(),
        UserModel.find({ role: "USER" })
          .sort({ createdAt: -1 })
          .limit(5)
          .select("fullName email mobile role createdAt isActive isVerified"),
        OrderModel.find()
          .sort({ createdAt: -1 })
          .limit(5),
        OrderModel.find({ assignedMR: { $ne: null } })
          .populate("assignedMR", "fullName email mobile role")
          .sort({ createdAt: -1 })
          .limit(10)
      ]);

      return {
        role: "ADMIN",
        totalUsers,
        totalVerifiedUsers,
        totalUserRole,
        totalMR,
        totalOperators,
        totalVipCategories,
        totalPlanTypes,
        totalServices,
        totalPlanTags,
        recentUsers,
        recentOrders,
        assignedOrders
      };
    }

    if (user.role === "MR") {
      const [
        totalAssignedOrders,
        myOrders
      ] = await Promise.all([
        OrderModel.countDocuments({ assignedMR: user.userId }),
        OrderModel.find({ assignedMR: user.userId })
          .sort({ createdAt: -1 })
          .limit(10)
      ]);

      return {
        role: "MR",
        totalAssignedOrders,
        myOrders
      };
    }

    if (user.role === "USER") {
      const myOrders = await OrderModel.find({ userId: user.userId })
        .sort({ createdAt: -1 })
        .limit(10);

      return {
        role: "USER",
        myOrders
      };
    }

    throw new Error("Invalid role");
  } catch (error) {
    throw new Error("Failed to fetch dashboard data");
  }
};