import { createPlanTypeInput } from "./dto/createPlanType.dto";
import { UpdatePlanTypeInput } from "./dto/updatePlanType.dto";
import PlanType from "./planType.model";

export class PlanTypeService {
  async create(input: createPlanTypeInput) {
    const existing = await PlanType.findOne({
      $or: [{ name: input.name }, { slug: input.slug }],
    });
    if (existing) throw new Error("Name or slug already exists!");
    return PlanType.create(input);
  }

  async findAll(isAdmin: boolean = false) {
    return isAdmin
      ? PlanType.find().sort({ name: 1 })
      : PlanType.find({ isActive: true }).sort({ name: 1 });
  }

  async findById(id: string, isAdmin: boolean = false) {
    const planType = await PlanType.findById(id);
    if (!planType) throw new Error("PlanType not found!");
    if (!isAdmin && !planType.isActive) throw new Error("PlanType not found!");
    return planType;
  }

  async update(id: string, input: UpdatePlanTypeInput) {
    const planType = await PlanType.findById(id);
    if (!planType) throw new Error("PlanType not found!");
    if (input.slug && input.slug !== planType.slug) {
      const slugExists = await PlanType.findOne({ slug: input.slug });
      if (slugExists) throw new Error("Slug already exists!");
    }
    Object.assign(planType, input);
    await planType.save();
    return planType;
  }

  async delete(id: string) {
    const planType = await PlanType.findById(id);
    if (!planType) throw new Error("PlanType not found!");
    await planType.deleteOne();
    return { message: "PlanType deleted successfully" };
  }
}

export default new PlanTypeService();
