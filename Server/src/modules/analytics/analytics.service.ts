/**
 * @author Aman kumar singh
 * @description
 */
import Order, { OrderStatus, OrderType, PaymentStatus } from "../orders/order.model";
import { UserModel } from "../auth/auth.model";
import Plan from "../plan/plan.model";
import PlanType from "../planType/planType.model"; 
import PlanTag from "../planTag/planTag.model";  

export class AnalyticsService {
  
  async getDashboardData() {
    const orderStats = await Order.aggregate([
      {
        $facet: {
          overallStats: [
            {
              $group: {
                _id: null,
                totalRevenue: {
                  $sum: {
                    $cond: [{ $eq: ["$paymentStatus", PaymentStatus.SUCCESS] }, "$totalAmount", 0]
                  }
                },
                totalOrders: { $sum: 1 }
              }
            }
          ],
          statusBreakdown: [
            { $group: { _id: "$status", count: { $sum: 1 } } }
          ],
          typeBreakdown: [
            { $group: { _id: "$orderType", count: { $sum: 1 } } }
          ]
        }
      }
    ]);
    const totalUsers = await UserModel.countDocuments({ role: "USER" });
    const totalMRs = await UserModel.countDocuments({ role: "MR" });
    const activePlans = await Plan.countDocuments({ isActive: true });
    const activePlanTypes = await PlanType.countDocuments({ isActive: true });
    const activePlanTags = await PlanTag.countDocuments({ isActive: true });

    const stats = orderStats[0]?.overallStats[0] || { totalRevenue: 0, totalOrders: 0 };

    return {
      totalRevenue: stats.totalRevenue,
      totalOrders: stats.totalOrders,
      totalUsers,
      totalMRs,
      activePlans,
      activePlanTypes,
      activePlanTags,
      statusBreakdown: orderStats[0]?.statusBreakdown || [],
      typeBreakdown: orderStats[0]?.typeBreakdown || []
    };
  }

  async getSalesTrend() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          paymentStatus: PaymentStatus.SUCCESS 
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          dailyRevenue: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
  }

  async getMRPerformance() {
    return await Order.aggregate([
      {
        $match: {
          assignedTo: { $ne: null }, 
          status: OrderStatus.DELIVERED 
        }
      },
      {
        $group: {
          _id: "$assignedTo",
          ordersDelivered: { $sum: 1 },
          totalBusinessAmount: { $sum: "$totalAmount" }
        }
      },
      {
        $lookup: {
          from: "users", 
          localField: "_id",
          foreignField: "_id",
          as: "mrDetails"
        }
      },
      { $unwind: "$mrDetails" },
      {
        $project: {
          _id: 1,
          ordersDelivered: 1,
          totalBusinessAmount: 1,
          "mrDetails.fullName": 1,
          "mrDetails.email": 1,
          "mrDetails.mobile": 1,
          "mrDetails.isOnline": 1
        }
      },
      { $sort: { ordersDelivered: -1 } }
    ]);
  }
}