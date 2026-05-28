/**
 * @author Uday Pratap
 * @description whole order related business logic
 */
import { CreateOrderInput } from "./dto/createOrder.dto";
import { IAddress } from "../address/address.model";
import Plan from "../plan/plan.model";
import Address from "../address/address.model";
import FancyNumber from "../fancyNumber/fancyNumber.model";
import Order, {
  IOrder,
  OrderStatus,
  OrderType,
  PaymentMethod,
  PaymentStatus,
} from "../orders/order.model";
import { UserModel } from "../auth/auth.model";
import { IAuthenticatedReq } from "../../common/types/express";
import {
  decodeCursor,
  PAGINATION_CONFIG,
} from "../../config/pagination.config";
import { buildCursorPaginationResponse } from "../../common/utils/pagination.util";
import { createNotification } from "../notification/notification.service";
import { ORDER_NOTIFICATION_MESSAGES } from "../notification/notification.constants";
import Cart from "../cart/cart.model";
import { PRICING_CONFIG } from "../../config/pricing.config";
import CheckoutSession from "../checkoutSession/checkoutSession.model";
import { v4 as uuidv4 } from "uuid";
import ServicePincode from "../servicePincode/servicePincode.model";
import { calculateAndSaveMREarning } from "../earning/earning.service";

export class OrderService {
  private async autoAssignMR(order: IOrder) {
    const address = await Address.findById(order.addressId);
    if (!address) return;

    const orderPincode = address.pincode;
    const serviceArea = await ServicePincode.findOne({
      pincode: orderPincode,
      isActive: true,
    });

    if (!serviceArea)
      return await this.notifyAdminForManualAssignment(order._id);

    const eligibleMRs = await UserModel.find({
      role: "MR",
      _id: { $in: serviceArea.assignedMRs },
      isOnline: true,
      isActive: true,
    });
    if (eligibleMRs.length === 0) {
      // Notify Admin if no MR serves this area
      return await this.notifyAdminForManualAssignment(order._id);
    }

    // 3. LOAD BALANCING LOGIC:
    // Har MR ke "Active Orders" count karo aur sabse kam wale ko pick karo
    const mrOrderCounts = await Promise.all(
      eligibleMRs.map(async (mr) => {
        const count = await Order.countDocuments({
          assignedTo: mr._id,
          status: { $in: [OrderStatus.ASSIGNED, OrderStatus.OUT_FOR_DELIVERY] },
        });
        return { mr, count };
      }),
    );
    // Sort by active order count — pick the least busy MR
    mrOrderCounts.sort((a, b) => a.count - b.count);
    const bestMR = mrOrderCounts[0].mr;

    // Actually assign
    order.assignedTo = bestMR._id;
    order.status = OrderStatus.ASSIGNED;
    await order.save();

    await createNotification(
      bestMR._id.toString(),
      "ORDER_ASSIGNED",
      "New Order Assigned",
      `Order ${order.orderNumber} has been assigned to you.`,
      ["IN_APP", "SMS"],
    );
  }

  private async notifyAdminForManualAssignment(orderId: any) {
    const admin = await UserModel.findOne({ role: "ADMIN" });
    if (admin) {
      await createNotification(
        admin._id.toString(),
        "SYSTEM",
        "No MR Available!",
        `No MR found for order. Manual assignment required for ${orderId}`,
        ["IN_APP", "EMAIL"],
      );
    }
  }

  async calculateOrderSummary(items: { planId: string; quantity: number }[]) {
    let subTotal = 0,
      discount = 0,
      saleSubTotal = 0,
      platformFee = PRICING_CONFIG.PLATFORM_FEE,
      totalOperatorFee = 0;

    const plans = await Promise.all(
      items.map(async (item) => {
        const plan = await Plan.findById(item.planId)
          .populate("operatorId", "name slug logo isOperatorFee operatorFee")
          .populate("serviceId", "name slug")
          .populate("planTypeId", "name slug")
          .lean();
        return plan;
      }),
    );

    const processedItems = items.map((item, index) => {
      const plan = plans[index];
      if (!plan || !plan.isActive)
        throw new Error("Plan not found or not available at this moment!");
      subTotal += plan.price * item.quantity;
      saleSubTotal += plan.salePrice * item.quantity;

      const operatorId = plan.operatorId as any;
      if (operatorId.isOperatorFee)
        totalOperatorFee += operatorId.operatorFee * item.quantity;

      return {
        planId: plan._id,
        quantity: item.quantity,
        priceAtPurchase: plan.price,
        salePriceAtPurchase: plan.salePrice,
        operatorFee: operatorId.isOperatorFee ? operatorId.operatorFee : 0,
      };
    });

    // for (const item of items) {
    //   const plan = await Plan.findById(item.planId)
    //     .populate("operatorId", "name slug logo isOperatorFee operatorFee")
    //     .populate("serviceId", "name slug")
    //     .populate("planTypeId", "name slug");
    //   if (!plan || !plan.isActive)
    //     throw new Error("Plan not found or not available at this moment!");

    //   processedItems.push({
    //     planId: plan._id,
    //     quantity: item.quantity,
    //     priceAtPurchase: plan.price,
    //     salePriceAtPurchase: plan.salePrice,
    //     operatorFee: operatorId.isOperatorFee ? operatorId.operatorFee : 0,
    //   });
    // }

    discount = subTotal - saleSubTotal;
    let deliveryPrice: number =
      saleSubTotal < PRICING_CONFIG.FREE_DELIVERY_THRESHOLD
        ? PRICING_CONFIG.DELIVERY_CHARGE
        : 0;
    const totalAmount =
      saleSubTotal + deliveryPrice + platformFee + totalOperatorFee;

    return {
      processedItems,
      subTotal,
      saleSubTotal,
      discount,
      platformFee,
      totalOperatorFee,
      deliveryPrice,
      totalAmount,
    };
  }

  private async validateAddress(addressId: string, userId: string) {
    const address = await Address.findById(addressId);
    if (!address) throw new Error("Address not found!");
    if (address.userId.toString() !== userId)
      throw new Error("This address does not belong to you");
    return address;
  }

  private async checkServicePincode(pincode: string) {
    const serviceArea = await ServicePincode.findOne({
      pincode,
      isActive: true,
    });
    if (!serviceArea)
      throw new Error("Sorry, we don't deliver to this pincode!");
  }

  private formatOrderResponse(order: any) {
    const obj = order.toObject();

    if (obj.orderType === OrderType.BUSINESS) {
      const {
        subTotal,
        saleSubTotal,
        discount,
        platformFee,
        totalOperatorFee,
        deliveryCharge,
        totalAmount,
        items,
        ...rest
      } = obj;
      return rest;
    }

    return obj;
  }

  private async createBusinessOrder(userId: string, input: CreateOrderInput) {
    const address = await this.validateAddress(input.addressId, userId);

    const plan = await Plan.findById(input.businessDetails!.planId);
    if (!plan || !plan.isActive || !plan.isBusinessSim)
      throw new Error("Invalid business plan!");
    if (
      plan.minQuantity &&
      input.businessDetails!.numberOfSims < plan.minQuantity
    )
      throw new Error(
        `Minimum ${plan.minQuantity} SIMs required for this plan`,
      );

    const orderNumber = `BUS-ORD-${uuidv4()}`;

    const order = await Order.create({
      orderNumber,
      userId,
      addressId: address._id,
      orderType: OrderType.BUSINESS,
      status: OrderStatus.INQUIRY_RECEIVED,
      paymentMethod: PaymentMethod.COD,
      paymentStatus: PaymentStatus.PENDING,
      businessDetails: {
        ...input.businessDetails,
        approvalStatus: "PENDING",
      },
    });

    await createNotification(
      userId,
      "ORDER_PLACED",
      "Business Inquiry Received",
      "We have received your business SIM inquiry. Our team will contact you shortly.",
      ["IN_APP", "EMAIL"],
    );
    return this.formatOrderResponse(order);
  }

  private async createNormalOrder(userId: string, input: CreateOrderInput) {
    const session = await CheckoutSession.findById(input.sessionId);
    if (!session) throw new Error("Session not found!");
    if (session.userId.toString() !== userId)
      throw new Error("Unauthorized User!");
    if (session.expiresAt < new Date()) throw new Error("Session Expired!");
    if (input.orderType === OrderType.ESIM && session.orderType !== "DIRECT")
      throw new Error("eSIM orders must be placed directly, not through cart.");

    const address = await this.validateAddress(input.addressId, userId);
    await this.checkServicePincode(address.pincode);

    const formattedItems = session.items.map((item) => ({
      planId: item.planId.toString(),
      quantity: item.quantity,
    }));

    const {
      deliveryPrice,
      discount,
      platformFee,
      processedItems,
      saleSubTotal,
      subTotal,
      totalAmount,
      totalOperatorFee,
    } = await this.calculateOrderSummary(formattedItems);

    const orderNumber = `ORD-${uuidv4()}`;

    const order = await Order.create({
      orderNumber,
      userId,
      items: processedItems,
      platformFee,
      subTotal,
      saleSubTotal,
      discount,
      deliveryCharge: deliveryPrice,
      totalOperatorFee,
      totalAmount,
      addressId: address._id,
      orderType: input.orderType,
      status: OrderStatus.PENDING,
      assignedTo: null,
      paymentMethod: input.paymentMethod,
      ...(input.existingNumber && { existingNumber: input.existingNumber }),
      ...(input.previousOperator && {
        previousOperator: input.previousOperator,
      }),
      paymentStatus: PaymentStatus.PENDING,
    });

    if (!order) throw new Error("Error creating the order!");

    const isEsimOrder = input.orderType === OrderType.ESIM;
    await createNotification(
      userId,
      "ORDER_PLACED",
      isEsimOrder
        ? ORDER_NOTIFICATION_MESSAGES.ESIM_ORDER_PLACED.title
        : ORDER_NOTIFICATION_MESSAGES.ORDER_PLACED.title,
      isEsimOrder
        ? ORDER_NOTIFICATION_MESSAGES.ESIM_ORDER_PLACED.message
        : ORDER_NOTIFICATION_MESSAGES.ORDER_PLACED.message,
      ["IN_APP", "EMAIL", "SMS"],
    );

    if (session.orderType === "THROUGHCART") {
      await Cart.findOneAndUpdate({ userId }, { items: [] });
    } else if (session.orderType === "DIRECT") {
      const orderedPlanIds = processedItems.map((item) =>
        item.planId.toString(),
      );
      await Cart.findOneAndUpdate(
        { userId },
        { $pull: { items: { planId: { $in: orderedPlanIds } } } },
      );
    }

    await CheckoutSession.findByIdAndDelete(input.sessionId);

    try {
      await this.autoAssignMR(order);
      console.log("Mr assigned successfully");
    } catch (assignError: any) {
      console.error(
        "MR Assignment failed but order was created:",
        assignError.message,
      );
    }
    return order;
  }

  private async createFancyNumberOrder(
    userId: string,
    input: CreateOrderInput,
  ) {
    const address = await this.validateAddress(input.addressId, userId);
    await this.checkServicePincode(address.pincode);

    // Atomic check + reserve — prevents race condition if two users order simultaneously
    const fancyNumber = await FancyNumber.findOneAndUpdate(
      { _id: input.fancyNumberId, isActive: true, isAvailable: true },
      { $set: { isAvailable: false } },
      { new: true },
    );
    if (!fancyNumber)
      throw new Error(
        "This fancy number is not available or has already been taken!",
      );

    const discount = fancyNumber.price - fancyNumber.salePrice;
    const orderNumber = `FN-ORD-${uuidv4()}`;

    let order;
    try {
      order = await Order.create({
        orderNumber,
        userId,
        fancyNumberId: fancyNumber._id,
        platformFee: 0,
        subTotal: fancyNumber.price,
        saleSubTotal: fancyNumber.salePrice,
        discount,
        deliveryCharge: 0,
        totalOperatorFee: 0,
        totalAmount: fancyNumber.salePrice,
        addressId: address._id,
        orderType: OrderType.FANCY_NUMBER,
        status: OrderStatus.PENDING,
        assignedTo: null,
        paymentMethod: input.paymentMethod,
        paymentStatus: PaymentStatus.PENDING,
      });
    } catch (err) {
      // Restore availability if order creation fails so the number isn't permanently locked
      await FancyNumber.findByIdAndUpdate(fancyNumber._id, {
        isAvailable: true,
      });
      throw err;
    }

    await createNotification(
      userId,
      "ORDER_PLACED",
      ORDER_NOTIFICATION_MESSAGES.FANCY_NUMBER_ORDER_PLACED.title,
      ORDER_NOTIFICATION_MESSAGES.FANCY_NUMBER_ORDER_PLACED.message,
      ["IN_APP", "EMAIL", "SMS"],
    );

    try {
      await this.autoAssignMR(order);
    } catch (assignError: any) {
      console.error(
        "MR Assignment failed but order was created:",
        assignError.message,
      );
    }

    return order;
  }

  // Main createOrder — sirf router hai ab
  async createOrder(userId: string, input: CreateOrderInput) {
    if (input.orderType === OrderType.BUSINESS)
      return this.createBusinessOrder(userId, input);
    if (input.orderType === OrderType.FANCY_NUMBER)
      return this.createFancyNumberOrder(userId, input);
    // ESIM and PORT use the same checkout session flow as NORMAL
    return this.createNormalOrder(userId, input);
  }

  async getNearbyMRs(orderId: string) {
    const order = await Order.findById(orderId).populate("addressId");
    if (!order) throw new Error("Order not found!");

    const address = order.addressId as unknown as IAddress;
    const coordinates = address.location.coordinates;

    const nearbyMRs = await UserModel.find({
      role: "MR",
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates,
          },
          $maxDistance: 5000,
        },
      },
    });
    return nearbyMRs;
  }

  async assignMR(orderId: string, mrId: string) {
    //abhi isme improvements karne hain bahot saare
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found!");

    const mr = await UserModel.findById(mrId);
    if (!mr) throw new Error("MR not found!");

    if (mr.role !== "MR") throw new Error("User is not an MR");
    if (mr.isActive === false) throw new Error("MR is not active");

    order.assignedTo = mr._id;
    order.status = OrderStatus.ASSIGNED;
    await order.save();

    await createNotification(
      order.userId.toString(),
      "MR_ASSIGNED",
      ORDER_NOTIFICATION_MESSAGES.MR_ASSIGNED.title,
      ORDER_NOTIFICATION_MESSAGES.MR_ASSIGNED.message,
      ["IN_APP", "EMAIL", "SMS"],
    );
    return order;
  }

  async updateOrderStatus(
    orderId: string,
    userId: string,
    status: OrderStatus,
    isAdmin: boolean = false,
  ) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found!");

    if (!isAdmin && order.assignedTo?.toString() !== userId.toString())
      throw new Error("Unauthorized!, You are not assigned to this order!");

    // I want MR to only update status to OUT_FOR_DELIVERY, DELIVERED, and ESIM_ACTIVATED; admin can update to any status.
    const mrOrderStatuses = [
      OrderStatus.OUT_FOR_DELIVERY,
      OrderStatus.DELIVERED,
      OrderStatus.ESIM_ACTIVATED,
    ];
    if (!isAdmin && !mrOrderStatuses.includes(status)){
      throw new Error(
        "Unauthorized!, You can only update status to OUT_FOR_DELIVERY, DELIVERED or ESIM_ACTIVATED!",
      );
    }
      const previousStatus = order.status;
    order.status = status;
    await order.save();
    if (
  status === OrderStatus.DELIVERED &&
  previousStatus !== OrderStatus.DELIVERED &&
  order.assignedTo
) {
    try {
      // Earning calculate karo (Order ID aur MR ID pass kar rahe hain)
      await calculateAndSaveMREarning(order._id.toString(), order.assignedTo.toString());
      console.log(`Earning generated for MR: ${order.assignedTo}`);
    } catch (error: any) {
      // Agar earning calculation fail ho, toh sirf log karein (order flow rukna nahi chahiye)
      console.error("Error generating MR earning:", error.message);
    }
  }
    if (status === OrderStatus.OUT_FOR_DELIVERY) {
      await createNotification(
        order.userId.toString(),
        "OUT_FOR_DELIVERY",
        ORDER_NOTIFICATION_MESSAGES.OUT_FOR_DELIVERY.title,
        ORDER_NOTIFICATION_MESSAGES.OUT_FOR_DELIVERY.message,
        ["IN_APP", "EMAIL", "SMS"],
      );
    }

    if (status === OrderStatus.DELIVERED) {
      await createNotification(
        order.userId.toString(),
        "SIM_DELIVERED",
        ORDER_NOTIFICATION_MESSAGES.SIM_DELIVERED.title,
        ORDER_NOTIFICATION_MESSAGES.SIM_DELIVERED.message,
        ["IN_APP", "EMAIL", "SMS"],
      );
    }

    if (status === OrderStatus.ESIM_ACTIVATED) {
      await createNotification(
        order.userId.toString(),
        "SIM_ACTIVATED",
        ORDER_NOTIFICATION_MESSAGES.ESIM_ACTIVATED.title,
        ORDER_NOTIFICATION_MESSAGES.ESIM_ACTIVATED.message,
        ["IN_APP", "EMAIL", "SMS"],
      );
    }
    if (status === OrderStatus.APPROVED) {
      await createNotification(
        order.userId.toString(),
        "SIM_ACTIVATED",
        ORDER_NOTIFICATION_MESSAGES.SIM_ACTIVATED.title,
        ORDER_NOTIFICATION_MESSAGES.SIM_ACTIVATED.message,
        ["IN_APP", "EMAIL", "SMS"],
      );
    }

    return order;
  }

  // async updateLocationService(
  //   longitude: number,
  //   latitude: number,
  //   userId: string,
  // ) {
  //   const MR = await UserModel.findById(userId).select(
  //     "-password -otp -resetOtp -resetOtpExpiry",
  //   );
  //   if (!MR) throw new Error("MR not found!");

  //   if (MR.isActive !== true) throw new Error("Not an active MR!");

  //   MR.location = {
  //     type: "Point",
  //     coordinates: [longitude, latitude],
  //   };
  //   await MR.save();
  //   // ✅ LOCATION UPDATE NOTIFICATION (FIX)
  //   const order = await Order.findOne({ assignedTo: userId });

  //   if (order) {
  //     await createNotification(
  //       order.userId.toString(),
  //       "LOCATION_UPDATE",
  //       ORDER_NOTIFICATION_MESSAGES.LOCATION_UPDATE.title,
  //       ORDER_NOTIFICATION_MESSAGES.LOCATION_UPDATE.message,
  //       ["IN_APP", "EMAIL", "SMS"],
  //     );
  //   }
  //   return MR;
  // }

  async getAllOrders(
    req: IAuthenticatedReq,
    userId: string,
    isAdmin: boolean = false,
  ) {
    let { limit, cursor } = req.pagination || {
      limit: PAGINATION_CONFIG.DEFAULT_LIMIT,
      cursor: null,
    };
    limit = typeof limit === "string" ? parseInt(limit, 10) : limit;
    if (limit > PAGINATION_CONFIG.MAX_LIMIT)
      limit = PAGINATION_CONFIG.MAX_LIMIT;

    let query = isAdmin ? Order.find() : Order.find({ userId });

    if (req.query.status) query = query.where("status", req.query.status);
    if (req.query.assignedTo)
      query = query.where("assignedTo", req.query.assignedTo);

    if (cursor) {
      const decoded = decodeCursor(cursor as string);
      query.where({
        $or: [
          { createdAt: { $lt: decoded.createdAt } },
          { createdAt: decoded.createdAt, _id: { $lt: decoded._id } },
        ],
      });
    }

    const data = await query
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1)
      .populate("items.planId", "price salePrice validity data")
      .populate("fancyNumberId", "number price salePrice operatorId")
      .populate("addressId", "houseNo street city")
      .populate("assignedTo", "fullName mobile");

    return buildCursorPaginationResponse(data, limit, {
      createdAtField: "createdAt",
      idField: "_id",
    });
  }

  async findById(orderId: string, userid: string, isAdmin: boolean = false) {
    const order = await Order.findById(orderId)
      .populate("items.planId", "price validity data")
      .populate("fancyNumberId", "number price salePrice operatorId")
      .populate("addressId")
      .populate("assignedTo", "fullName mobile");

    if (!order) throw new Error("Order Not Found!");

    if (!isAdmin && order.userId.toString() !== userid.toString())
      throw new Error("Unauthorized!");
    return order;
  }

  async cancelOrder(orderId: string, userId: string) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found!");

    if (order.userId.toString() !== userId.toString())
      throw new Error("Unauthorized!");

    if (
      order.status !== OrderStatus.PENDING &&
      order.status !== OrderStatus.APPROVED &&
      order.status !== OrderStatus.ASSIGNED &&
      order.status !== OrderStatus.INQUIRY_RECEIVED
    )
      throw new Error("Too late to cancel the order!");

    order.status = OrderStatus.CANCELLED;
    await order.save();

    if (order.orderType === OrderType.FANCY_NUMBER && order.fancyNumberId) {
      await FancyNumber.findByIdAndUpdate(order.fancyNumberId, {
        isAvailable: true,
      });
    }

    return order;
  }

  async mrCancelAssignment(orderId: string, mrId: string) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found!");

    if (order.assignedTo?.toString() !== mrId.toString())
      throw new Error("You are not an authorized MR to cancel this order !");
    if (
      order.status === OrderStatus.DELIVERED ||
      order.status === OrderStatus.ESIM_ACTIVATED ||
      order.status === OrderStatus.CANCELLED
    )
      throw new Error(
        "Cannot cancel this order as it is already completed or cancelled!",
      );
    order.assignedTo = null;
    order.status = OrderStatus.PENDING;
    await order.save();

    await this.autoAssignMR(order);
    return order;
  }

  async mrAssignedOrders(req: IAuthenticatedReq, userId: string) {
    let { limit, cursor } = req.pagination || {
      limit: PAGINATION_CONFIG.DEFAULT_LIMIT,
      cursor: null,
    };
    limit = typeof limit === "string" ? parseInt(limit, 10) : limit;
    if (limit > PAGINATION_CONFIG.MAX_LIMIT)
      limit = PAGINATION_CONFIG.MAX_LIMIT;

    const view = ((req.query.view as string) || "active").toLowerCase();
    const ACTIVE_STATUSES = [
      OrderStatus.ASSIGNED,
      OrderStatus.OUT_FOR_DELIVERY,
    ];
    const HISTORY_STATUSES = [
      OrderStatus.DELIVERED,
      OrderStatus.ESIM_ACTIVATED,
      OrderStatus.CANCELLED,
      OrderStatus.FAILED,
    ];

    const baseFilter: any = { assignedTo: userId };
    if (view === "active") baseFilter.status = { $in: ACTIVE_STATUSES };
    else if (view === "history") baseFilter.status = { $in: HISTORY_STATUSES };

    let query = Order.find(baseFilter);

    if (cursor) {
      const decoded = decodeCursor(cursor as string);
      query.where({
        $or: [
          { createdAt: { $lt: decoded.createdAt } },
          { createdAt: decoded.createdAt, _id: { $lt: decoded._id } },
        ],
      });
    }

    const data = await query
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1)
      .populate("userId", "fullName mobile")
      .populate({
        path: "items.planId",
        select: "validity data calls operatorId planTypeId",
        populate: [
          { path: "operatorId", select: "name" },
          { path: "planTypeId", select: "name" },
        ],
      })
      .populate("fancyNumberId", "number")
      .populate("addressId");

    const formatted = data.map(formatOrderForMR);

    return buildCursorPaginationResponse(formatted, limit, {
      createdAtField: "createdAt",
      idField: "_id",
    });
  }
}

const formatOrderForMR = (order: any) => {
  const o = typeof order.toObject === "function" ? order.toObject() : order;

  const customer = o.userId
    ? { fullName: o.userId.fullName, mobile: o.userId.mobile }
    : null;

  const items = (o.items || []).map((item: any) => {
    const plan = item.planId;
    return {
      quantity: item.quantity,
      plan: plan
        ? {
            _id: plan._id,
            operator: plan.operatorId?.name ?? null,
            planType: plan.planTypeId?.name ?? null,
            validity: plan.validity ?? null,
            data: plan.data ?? null,
            calls: plan.calls ?? null,
          }
        : null,
    };
  });

  const base: Record<string, any> = {
    _id: o._id,
    orderNumber: o.orderNumber,
    orderType: o.orderType,
    status: o.status,
    createdAt: o.createdAt,
    paymentMethod: o.paymentMethod,
    paymentStatus: o.paymentStatus,
    customer,
    address: o.addressId,
    items,
  };

  if (o.fancyNumberId) {
    base.fancyNumber = { number: o.fancyNumberId.number };
  }
  if (o.existingNumber) base.existingNumber = o.existingNumber;
  if (o.previousOperator) base.previousOperator = o.previousOperator;

  if (o.paymentMethod === PaymentMethod.COD) {
    base.amountToCollect = o.totalAmount;
  }

  return base;
};

export default new OrderService();
