// Uday
import { Request, Response } from "express";
import orderService from "./order.service";
import { sendResponse } from "../../common/http/apiResponse";
import { CreateOrderInput, createOrderSchema } from "./dto/createOrder.dto";
import { IAuthenticatedReq } from "../../common/types/express";
import { AssignMRInput, assignMRSchema } from "./dto/assignMR.dto";
import {
  UpdateStatusInput,
  updateStatusSchema,
} from "./dto/updateStatusSchema.dto";
import mongoose from "mongoose";
import {
  UpdateLocationInput,
  updateLocationSchema,
} from "./dto/updateLocation.dto";

export const createOrder = async (req: IAuthenticatedReq, res: Response) => {
  try {
    if (!req.user)
      return sendResponse(res, 401, null, "Authentication required");
    const userId = req.user.userId.toString();
    const { error, value } = createOrderSchema.validate(req.body, {
      stripUnknown: true,
      abortEarly: false,
    });
    if (error) {
      const errorMsg = error.details.map((e) => e.message).join(", ");
      return sendResponse(res, 400, null, errorMsg);
    }
    const input = {
      ...value,
    } as CreateOrderInput;

    const order = await orderService.createOrder(userId, input);
    sendResponse(res, 201, order, "Order created successfully!");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Error creating the order");
  }
};

export const nearbyMRs = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id as string;
    if (!orderId) return sendResponse(res, 400, null, "OrderId required");

    const nearbyMRs = await orderService.getNearbyMRs(orderId);
    sendResponse(res, 200, nearbyMRs, "Successfully fetched nearby MRs!");
  } catch (err: any) {
    sendResponse(
      res,
      500,
      null,
      err.message || "Error while finding nearby MRs!",
    );
  }
};

export const assignMR = async (req: Request, res: Response) => {
  try {
    const { error, value } = assignMRSchema.validate(req.body, {
      stripUnknown: true,
      abortEarly: false,
    });
    if (error) {
      const errorMsg = error.details.map((e) => e.message).join(", ");
      return sendResponse(res, 400, null, errorMsg);
    }
    const input = value as AssignMRInput;
    const mrId = input.mrId;
    if (!req.user)
      return sendResponse(res, 401, null, "Authentication required");
    const orderId = req.params.id as string;
    if (!orderId) return sendResponse(res, 400, null, "OrderId missing");

    if (!mongoose.Types.ObjectId.isValid(orderId))
      return sendResponse(res, 400, null, "Invalid OrderId!");
    const assignedMR = await orderService.assignMR(orderId, mrId);
    if (!assignedMR) return sendResponse(res, 400, null, "Couldn't assign Mr!");

    sendResponse(res, 200, assignedMR, "MR assigned successfully!");
  } catch (err: any) {
    sendResponse(
      res,
      500,
      null,
      err.message || "Error while assigning the MR!",
    );
  }
};

export const updateOrderStatusMR = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id as string;
    if (!orderId) return sendResponse(res, 400, null, "ID is required!");
    if (!mongoose.Types.ObjectId.isValid(orderId))
      return sendResponse(res, 400, null, "Invalid OrderId");
    if (!req.user)
      return sendResponse(res, 401, null, "Authentication required!");
    const userId = req.user?.userId.toString();
    const { error, value } = updateStatusSchema.validate(req.body, {
      stripUnknown: true,
      abortEarly: false,
    });
    if (error) {
      const errorMsg = error.details.map((e) => e.message).join(", ");
      return sendResponse(res, 400, null, errorMsg);
    }
    const input = value as UpdateStatusInput;

    const updatedOrderStatus = await orderService.updateOrderStatus(
      orderId,
      userId,
      input.status,
    );
    if (!updatedOrderStatus)
      return sendResponse(
        res,
        500,
        null,
        "Error while updating the orderStatus",
      );
    sendResponse(
      res,
      200,
      updatedOrderStatus,
      "Order Status updated Successfully",
    );
  } catch (err: any) {
    sendResponse(
      res,
      500,
      null,
      err.message || "Error updating the Order Status!",
    );
  }
};

export const updateOrderStatusAdmin = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id as string;
    if (!orderId) return sendResponse(res, 400, null, "ID is required!");
    if (!mongoose.Types.ObjectId.isValid(orderId))
      return sendResponse(res, 400, null, "Invalid OrderId");
    if (!req.user)
      return sendResponse(res, 401, null, "Authentication required!");
    const userId = req.user?.userId.toString();
    const { error, value } = updateStatusSchema.validate(req.body, {
      stripUnknown: true,
      abortEarly: false,
    });
    if (error) {
      const errorMsg = error.details.map((e) => e.message).join(", ");
      return sendResponse(res, 400, null, errorMsg);
    }
    const input = value as UpdateStatusInput;

    const updatedOrderStatus = await orderService.updateOrderStatus(
      orderId,
      userId,
      input.status,
      true,
    );
    if (!updatedOrderStatus)
      return sendResponse(
        res,
        500,
        null,
        "Error while updating the orderStatus",
      );
    sendResponse(
      res,
      200,
      updatedOrderStatus,
      "Order Status updated Successfully",
    );
  } catch (err: any) {
    sendResponse(
      res,
      500,
      null,
      err.message || "Error updating the Order Status!",
    );
  }
};

// export const updateLocationMR = async (req: Request, res: Response) => {
//   try {
//     if (!req.user)
//       return sendResponse(res, 401, null, "Authentication required!");
//     const userId = req.user.userId.toString();
//     const { error, value } = updateLocationSchema.validate(req.body, {
//       stripUnknown: true,
//       abortEarly: false,
//     });
//     if (error) {
//       const errorMsg = error.details.map((e) => e.message).join(", ");
//       return sendResponse(res, 400, null, errorMsg);
//     }
//     const input = value as UpdateLocationInput;
//     const updatedLocation = await orderService.updateLocationService(
//       input.longitude,
//       input.latitude,
//       userId,
//     );
//     if (!updatedLocation)
//       return sendResponse(res, 500, null, "Error updating the location!");
//     sendResponse(res, 200, updatedLocation, "Location successfully fetched!");
//   } catch (err: any) {
//     sendResponse(
//       res,
//       500,
//       null,
//       err.message || "Failed to update MR location!",
//     );
//   }
// };

export const getAllOrders = async (req: IAuthenticatedReq, res: Response) => {
  try {
    if (!req.user)
      return sendResponse(res, 401, null, "Authentication required!");
    const userId = req.user.userId.toString();
    const orders = await orderService.getAllOrders(req, userId);
    if (!orders) return sendResponse(res, 400, null, "Error getting orders!");
    sendResponse(res, 200, orders, "Successfully fetched all user orders");
  } catch (err: any) {
    sendResponse(
      res,
      500,
      null,
      err.message || "Error while fetching All orders!",
    );
  }
};

export const getAllOrdersAdmin = async (
  req: IAuthenticatedReq,
  res: Response,
) => {
  try {
    if (!req.user)
      return sendResponse(res, 401, null, "Authentication required!");
    const userId = req.user.userId.toString();
    const orders = await orderService.getAllOrders(req, userId, true);
    if (!orders) return sendResponse(res, 400, null, "Error getting orders!");
    sendResponse(res, 200, orders, "Successfully fetched all user orders");
  } catch (err: any) {
    sendResponse(
      res,
      500,
      null,
      err.message || "Error while fetching All orders!",
    );
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id as string;
    if (!orderId) return sendResponse(res, 400, null, "OrderId required!");
    if (!req.user) return sendResponse(res, 401, null, "Unauthorized!");
    const userId = req.user.userId.toString();

    const order = await orderService.findById(orderId, userId);
    sendResponse(res, 200, order, "Successfully fetched order");
  } catch (err: any) {
    sendResponse(
      res,
      500,
      null,
      err.message || "Error while fetching the order",
    );
  }
};

export const getOrderByIdAdmin = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id as string;
    if (!orderId) return sendResponse(res, 400, null, "OrderId required!");
    if (!req.user) return sendResponse(res, 401, null, "Unauthorized!");
    const userId = req.user.userId.toString();

    const order = await orderService.findById(orderId, userId, true);
    sendResponse(res, 200, order, "Successfully fetched order");
  } catch (err: any) {
    sendResponse(
      res,
      500,
      null,
      err.message || "Error while fetching the order",
    );
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id as string;
    if (!orderId) return sendResponse(res, 400, null, "OrderId required!");
    if (!req.user) throw new Error("Authenticaton required!");
    const userId = req.user.userId.toString();
    const cancelledOrder = await orderService.cancelOrder(orderId, userId);
    if (!cancelledOrder)
      return sendResponse(
        res,
        400,
        null,
        "Order not cancelled due to unknown reasons",
      );
    sendResponse(res, 200, cancelledOrder, "Successfully order cancelled!");
  } catch (err: any) {
    sendResponse(
      res,
      500,
      null,
      err.message || "Error while cancelling the order!",
    );
  }
};

export const mrCancelAssignment = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id as string;
    if (!orderId) return sendResponse(res, 400, null, "Order ID is required");
    if (!req.user)
      return sendResponse(res, 401, null, "Authentication required");
    const mrId = req.user.userId.toString();

    const result = await orderService.mrCancelAssignment(orderId, mrId);
    sendResponse(res, 200, result, "Assignment cancelled successfully");
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Failed to cancel assignment");
  }
};

export const mrAssignedOrders = async (
  req: IAuthenticatedReq,
  res: Response,
) => {
  try {
    if (!req.user) throw new Error("Authentication required!");
    const userId = req.user.userId.toString();
    const mrOrders = await orderService.mrAssignedOrders(req, userId);
    sendResponse(res, 200, mrOrders, "Successfully fetched MR orders!");
  } catch (err: any) {
    sendResponse(
      res,
      500,
      null,
      err.message || "Error fetching MR assigned orders",
    );
  }
};

////A
export const calculateDelivery = async (req: Request, res: Response) => {
  try {
    //Frontend total price fetch
    const totalPrice = Number(req.query.totalPrice);

    // 2. (validation)
    if (isNaN(totalPrice)) {
      return sendResponse(
        res,
        400,
        null,
        "Price calculation error: Invalid Input",
      );
    }

    const deliveryCharge = totalPrice > 500 ? 0 : 100;
    const finalAmount = totalPrice + deliveryCharge;

    sendResponse(
      res,
      200,
      {
        totalPrice,
      },
      "Delivery summary fetched successfully",
    );
  } catch (err: any) {
    sendResponse(res, 500, null, err.message || "Server Error");
  }
};
