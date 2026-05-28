import { CreateVipCategoryInput } from "./dto/createVipCategory.dto";
import { UpdateVipCategoryInput } from "./dto/updateVipCategory.dto";
import VipCategory from "./VIPCategory.model";

export class VipCategoryService {
  async create(input: CreateVipCategoryInput) {
    const existing = await VipCategory.findOne({
      $or: [
        {
          name: input.name,
        },
        {
          slug: input.slug,
        },
      ],
    });

    if (existing) throw new Error("Name or slug already exists");

    return VipCategory.create(input);
  }

  async findAll(isAdmin: boolean = false) {
    if (isAdmin) return VipCategory.find().sort({ name: 1 });
    return VipCategory.find({ isActive: true }).sort({ name: 1 });
  }

  async findById(id: string, isAdmin: boolean = false) {
    const category = await VipCategory.findById(id);
    if (!category) throw new Error("VipCategory not found");
    if (!isAdmin && !category.isActive)
      throw new Error("VIP category not found");
    return category;
  }

  async updateCategory(id: string, input: UpdateVipCategoryInput) {
    const category = await this.findById(id, true);
    if (input.slug && input.slug !== category.slug) {
      const slugExists = await VipCategory.findOne({ slug: input.slug });
      if (slugExists) throw new Error("Slug already exists");
    }
    Object.assign(category, input);
    await category.save();
    return category;
  }

  async deleteCategory(id: string) {
    const category = await this.findById(id, true);
    await category.deleteOne();
    return { message: "VipCategory deletion successfully" };
  }
}

export default new VipCategoryService();
