import { createPlanTagInput } from "./dto/createPlanTag.dto";
import { updatePlanTagInput } from "./dto/updatePlanTag.dto";
import PlanTag from "./planTag.model";

export class PlanTagService {
  async create(input: createPlanTagInput) {
    const existing = await PlanTag.findOne({
      $or: [{ name: input.name }, { slug: input.slug }],
    });
    if (existing) throw new Error("Name or slug already exists!");
    return PlanTag.create(input);
  }

  async findAll(isAdmin: boolean = false) {
    return isAdmin
      ? PlanTag.find().sort({ name: 1 })
      : PlanTag.find({ isActive: true }).sort({ name: 1 });
  }

  async findById(id: string, isAdmin: boolean = false) {
    const planTag = await PlanTag.findById(id);
    if (!planTag) throw new Error("PlanTag not found!");
    if (!isAdmin && !planTag.isActive) throw new Error("PlanTag not found!");
    return planTag;
  }

  async update(id: string, input: updatePlanTagInput) {
    const planTag = await PlanTag.findById(id);
    if (!planTag) throw new Error("PlanTag not found!");
    if (input.slug && input.slug !== planTag.slug) {
      const slugExists = await PlanTag.findOne({ slug: input.slug });
      if (slugExists) throw new Error("Slug already exists!");
    }
    Object.assign(planTag, input);
    await planTag.save();
    return planTag;
  }

  async delete(id: string) {
    const planTag = await PlanTag.findById(id);
    if (!planTag) throw new Error("PlanTag not found!");
    await planTag.deleteOne();
    return { message: "PlanTag deleted successfully" };
  }
}

export default new PlanTagService();
