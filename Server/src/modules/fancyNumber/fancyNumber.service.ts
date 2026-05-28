import { IAuthenticatedReq } from "../../common/types/express";
import {
  decodeCursor,
  PAGINATION_CONFIG,
} from "../../config/pagination.config";
import Operator from "../operator/operator.model";
import { CreateFancyNumberInput } from "./dto/createFancyNumber.dto";
import { UpdateFancyNumberInput } from "./dto/updateFancyNumber.dto";
import FancyNumber from "./fancyNumber.model";
import { buildCursorPaginationResponse } from "../../common/utils/pagination.util";

export class FancyNumberService {
  async createFancyNumberPlan(input: CreateFancyNumberInput) {
    const operator = await Operator.findById(input.operatorId);
    if (!operator) throw new Error("Operator is required");

    const duplicate = await FancyNumber.findOne({ number: input.number });
    if (duplicate) throw new Error("Fancy Number plan already exists!");

    if (input.salePrice > input.price) {
      throw new Error("Sale Price cannot be greater than price");
    }

    const fancyNumberPlan = await FancyNumber.create(input);
    if (!fancyNumberPlan)
      throw new Error("Error while creating Fancy Number Plan");

    return fancyNumberPlan;
  }

  async findAllFancyNumberPlans(
    req: IAuthenticatedReq,
    isAdmin: boolean = false,
  ) {
    let { limit, cursor } = req.pagination || {
      limit: PAGINATION_CONFIG.DEFAULT_LIMIT,
      cursor: null,
    };

    limit = typeof limit === "string" ? parseInt(limit, 10) : limit;
    if (limit > PAGINATION_CONFIG.MAX_LIMIT)
      limit = PAGINATION_CONFIG.MAX_LIMIT;

    let query: any = isAdmin ? {} : { isActive: true, isAvailable: true };
    let fancyNumberQuery = FancyNumber.find(query);

    if (req.query.vipCategoryId)
      fancyNumberQuery = fancyNumberQuery.where(
        "vipCategoryId",
        req.query.vipCategoryId,
      );
    if (req.query.operatorId)
      fancyNumberQuery = fancyNumberQuery.where(
        "operatorId",
        req.query.operatorId,
      );
    if (req.query.minPrice)
      fancyNumberQuery = fancyNumberQuery
        .where("salePrice")
        .gte(parseInt(req.query.minPrice as string));
    if (req.query.maxPrice)
      fancyNumberQuery = fancyNumberQuery
        .where("salePrice")
        .lte(parseInt(req.query.maxPrice as string));

    // Added partial search for specific number digits
    if (req.query.search) {
      fancyNumberQuery = fancyNumberQuery.where({
        number: { $regex: req.query.search as string, $options: "i" },
      });
    }

    if (cursor) {
      const decoded = decodeCursor(cursor as string);
      fancyNumberQuery = fancyNumberQuery.where({
        $or: [
          { createdAt: { $lt: decoded.createdAt } },
          { createdAt: decoded.createdAt, _id: { $lt: decoded._id } },
        ],
      });
    }

    const data = await fancyNumberQuery
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1)
      .populate("operatorId", "name slug logo")
      .populate("vipCategoryId", "name slug")
      .lean();

    return buildCursorPaginationResponse(data, limit, {
      createdAtField: "createdAt",
      idField: "_id",
    });
  }

  async findFancyNumberByIdPlan(id: string, isAdmin: boolean = false) {
    const fancyNumber = await FancyNumber.findById(id);
    if (!fancyNumber) throw new Error("Fancy number not found");

    if (!isAdmin && (!fancyNumber.isActive || !fancyNumber.isAvailable)) {
      throw new Error("Fancy number not found");
    }
    return fancyNumber;
  }

  async updateFancyNumberPlan(id: string, input: UpdateFancyNumberInput) {
    const fancyNumber = await FancyNumber.findById(id);
    if (!fancyNumber) throw new Error("Fancy Number not found");

    // Validate Price Logic during updates
    const finalPrice = input.price ?? fancyNumber.price;
    const finalSalePrice = input.salePrice ?? fancyNumber.salePrice;
    if (finalSalePrice > finalPrice) {
      throw new Error("Sale Price cannot be greater than price");
    }

    // Uniqueness check if number is changing
    if (input.number && input.number !== fancyNumber.number) {
      const duplicate = await FancyNumber.findOne({ number: input.number });
      if (duplicate) throw new Error("This number is already registered");
    }

    Object.assign(fancyNumber, input);
    await fancyNumber.save();
    return fancyNumber;
  }

  async deleteFancyNumberPlan(fancyPlanId: string) {
    const fancyNumber = await FancyNumber.findByIdAndDelete(fancyPlanId);
    if (!fancyNumber) throw new Error("Error deleting the fancy Number plan");

    return { message: "Fancy number Plan deleted successfully!" };
  }
}
