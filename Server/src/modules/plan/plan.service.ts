/**
 * @author Uday Pratap
 * @desc Plan's whole business logic
 */

import { IAuthenticatedReq } from "../../common/types/express";
import Operator from "../operator/operator.model";
import PlanType from "../planType/planType.model";
import { CreatePlanInput } from "./dto/createPlan.dto";
import { UpdatePlanInput } from "./dto/updatePlan.dto";
import Plan from "./plan.model";
import {
  decodeCursor,
  PAGINATION_CONFIG,
} from "../../config/pagination.config";
import { buildCursorPaginationResponse } from "../../common/utils/pagination.util";
import VipCategory from "../VIPCategory/VIPCategory.model";
import PlanTag from "../planTag/planTag.model";
import Service from "../service/service.model";

export class PlanService {
  async create(input: CreatePlanInput) {
    const operatorExists = await Operator.findById(input.operatorId);
    const planTypeExists = await PlanType.findById(input.planTypeId);
    if (!operatorExists || !planTypeExists)
      throw new Error("Operator id or planType id missing!");
    if (input.salePrice > input.price)
      throw new Error("salePrice cannot be greater than original price ");
    const duplicate = await Plan.findOne({
      operatorId: input.operatorId,
      planTypeId: input.planTypeId,
      salePrice: input.salePrice,
    });
    if (duplicate) throw new Error("Similar plan already exists");

    if (input.planTagsId && input.planTagsId.length > 0) {
      const tagsExist = await PlanTag.find({
        _id: { $in: input.planTagsId },
      });
      if (tagsExist.length !== input.planTagsId.length)
        throw new Error("One or more tags not found!");
    }

    // Business plans are categorically separate from physical/esim — clear simTypes
    // minQuantity is only meaningful for business plans
    if (input.isBusinessSim) {
      input.simTypes = [];
    } else {
      input.minQuantity = undefined;
    }
    const plan = await Plan.create(input);
    return plan;
  }

  async findAll(req: IAuthenticatedReq, isAdmin: boolean = false) {
    let { limit, cursor } = req.pagination || {
      limit: PAGINATION_CONFIG.DEFAULT_LIMIT,
      cursor: null,
    };
    limit = typeof limit === "string" ? parseInt(limit, 10) : limit; // String to number
    if (limit > PAGINATION_CONFIG.MAX_LIMIT)
      limit = PAGINATION_CONFIG.MAX_LIMIT;

    let query = isAdmin ? Plan.find() : Plan.find({ isActive: true });
    // Saurav
    if (req.query.search) {
      const search = req.query.search as string;
      const numericValue = Number(search);

      const conditions: any[] = [];

      // ✅ Numeric search
      if (!isNaN(numericValue)) {
        conditions.push(
          { price: numericValue },
          { salePrice: numericValue },
          { validity: numericValue },
        );
      }

      // ✅ Only apply if conditions exist
      if (conditions.length > 0) {
        query = query.find({ $or: conditions });
      }
    }
    // till above i added backend(saurav)
    if (req.query.operatorId)
      query = query.where("operatorId", req.query.operatorId);

    if (req.query.planTypeId)
      query = query.where("planTypeId", req.query.planTypeId);

    if (req.query.minPrice)
      query = query
        .where("salePrice")
        .gte(parseInt(req.query.minPrice as string));

    if (req.query.maxPrice)
      query = query
        .where("salePrice")
        .lte(parseInt(req.query.maxPrice as string));

    if (req.query.vipCategoryId)
      query = query.where("vipCategoryId", req.query.vipCategoryId);

    if (req.query.planTagsId)
      query = query.where("planTagsId").in([req.query.planTagsId as string]);

    if (req.query.minValidity)
      query = query
        .where("validity")
        .gte(parseInt(req.query.minValidity as string));

    if (req.query.networkType)
      query = query.where("networkType", req.query.networkType);

    if (req.query.maxValidity)
      query = query
        .where("validity")
        .lte(parseInt(req.query.maxValidity as string));

    if (req.query.isBusinessSim) {
      query = query.where("isBusinessSim", req.query.isBusinessSim);
    }
    if (req.query.simType) {
      const simType = req.query.simType as string;
      if (simType === "physical") {
        query = query.find({
          isBusinessSim: false,
          $or: [
            { simTypes: "physical" },
            { simTypes: { $exists: false } },
            { simTypes: { $size: 0 } },
          ],
        });
      } else {
        query = query.find({ isBusinessSim: false, simTypes: simType });
      }
    }

    if (cursor) {
      const decoded = decodeCursor(cursor as string);
      // console.log(decoded);
      query = query.where({
        createdAt: { $lt: decoded.createdAt },
        _id: { $lt: decoded._id },
      });
    }

    const data = await query
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1)
      .populate("operatorId", "name slug logo")
      .populate("planTypeId", "name slug")
      .populate("vipCategoryId", "name")
      .populate("serviceId", "name slug")
      .populate("planTagsId", "name slug")
      .lean();

    return buildCursorPaginationResponse(data, limit, {
      createdAtField: "createdAt",
      idField: "_id",
    });
  }

  async findById(req: IAuthenticatedReq, isAdmin: boolean = false) {
    const id = req.params.id as string;
    if (!id) throw new Error("ID is required!");
    const plan = await Plan.findById(id)
      .populate("operatorId", "name slug logo")
      .populate("planTypeId", "name slug")
      .populate("vipCategoryId", "name")
      .lean();
    if (!plan) throw new Error("Plan not found!");
    if (!isAdmin && !plan.isActive) throw new Error("Plan not found");
    return plan;
  }

  async getAvailableOperators(serviceId: string) {
    const operatorIds = await Plan.distinct("operatorId", {
      serviceId,
      isActive: true,
    }); //Returns operator ids which are filtered by this distinct operator and its conditions
    if (!operatorIds) throw new Error("Operator not found");

    const operators = await Operator.find({
      _id: { $in: operatorIds },
      isActive: true,
    });

    return operators;
  }

  async getAvailableServices(operatorId: string, planTypeId: string) {
    const serviceIds = await Plan.distinct("serviceId", {
      operatorId,
      planTypeId,
      isActive: true,
    });

    const services = await Service.find({
      _id: { $in: serviceIds },
      isActive: true,
    });

    return services;
  }

  async getAvailablePlanTypes(serviceId: string) {
    const planTypeIds = await Plan.distinct("planTypeId", {
      serviceId,
      isActive: true,
    });

    const planTypes = await PlanType.find({
      _id: { $in: planTypeIds },
      isActive: true,
    });

    return planTypes;
  }

  async update(id: string, input: UpdatePlanInput) {
    const currentPlan = await Plan.findById(id);
    if (!currentPlan) throw new Error("Plan not found!");
    if (input.operatorId) {
      const operatorExists = await Operator.findById(input.operatorId);
      if (!operatorExists) throw new Error("Operator not found");
    }
    if (input.planTypeId) {
      const planTypeExists = await PlanType.findById(input.planTypeId);
      if (!planTypeExists) throw new Error("PlanType not found");
    }
    if (input.vipCategoryId) {
      const vipCategoryExists = await VipCategory.findById(input.vipCategoryId);
      if (!vipCategoryExists) throw new Error("VipCategory not found");
    }
    if (input.planTagsId && input.planTagsId.length > 0) {
      const tagsExist = await PlanTag.find({
        _id: { $in: input.planTagsId },
      });
      if (tagsExist.length !== input.planTagsId.length)
        throw new Error("One or more tags not found!");
    }

    const finalPrice =
      input.price !== undefined ? input.price : currentPlan.price;
    const finalSalePrice =
      input.salePrice !== undefined ? input.salePrice : currentPlan.salePrice;

    if (finalSalePrice > finalPrice) {
      throw new Error("Sale price cannot be greater than original price");
    }

    // Check for duplicate after update (if changing key fields)
    const existingPlan = await Plan.findOne({
      _id: { $ne: id }, // Exclude current plan
      operatorId: input.operatorId || currentPlan.operatorId,
      planTypeId: input.planTypeId || currentPlan.planTypeId,
      price: input.price !== undefined ? input.price : currentPlan.price,
    });
    if (existingPlan) throw new Error("Similar plan already exists");

    // Business plans are categorically separate from physical/esim — clear simTypes
    // minQuantity is only meaningful for business plans — clear when not business
    const finalIsBusinessSim =
      (input as any).isBusinessSim !== undefined
        ? (input as any).isBusinessSim
        : currentPlan.isBusinessSim;
    if (finalIsBusinessSim) {
      input.simTypes = [];
    } else {
      input.minQuantity = null;
    }

    const updatedPlan = await Plan.findByIdAndUpdate(id, input, {
      new: true,
      runValidators: true,
    });

    if (!updatedPlan) throw new Error("Plan not found");

    return updatedPlan;
  }

  async delete(id: string) {
    const plan = await Plan.findById(id);
    if (!plan) throw new Error("Plan not found");

    await Plan.findByIdAndDelete(id);
    return { message: "Plan deleted successfully" };
  }
}

export default new PlanService();
