import { CreateOperatorInput } from "./dto/createOperator.dto";
import { UpdateOperatorInput } from "./dto/updateOperator.dto";
import Operator from "./operator.model";

export class OperatorService {
  async create(input: CreateOperatorInput) {
    const existing = await Operator.findOne({
      $or: [{ name: input.name }, { slug: input.slug }],
    });
    if (existing) throw new Error("Name or slug already exists!");
    return Operator.create(input);
  }

  async findAll(isAdmin: boolean = false) {
    return isAdmin
      ? Operator.find().sort({ name: 1 })
      : Operator.find({ isActive: true }).sort({ name: 1 });
  }

  async findById(id: string, isAdmin: boolean = false) {
    const operator = await Operator.findById(id);
    if (!operator) throw new Error("Operator not found!");
    if (!isAdmin && !operator.isActive) throw new Error("Operator not found!");
    return operator;
  }

  async update(id: string, input: UpdateOperatorInput) {
    const operator = await Operator.findById(id);
    if (!operator) throw new Error("Operator not found!");
    if (input.slug && input.slug !== operator.slug) {
      const slugExists = await Operator.findOne({ slug: input.slug });
      if (slugExists) throw new Error("Slug already exists!");
    }
    const oldLogo = operator.logo;
    Object.assign(operator, input);
    await operator.save();
    return { operator, oldLogo };
  }

  async delete(id: string) {
    const operator = await Operator.findById(id);
    if (!operator) throw new Error("Operator not found!");
    await operator.deleteOne();
    return { message: "Operator deleted successfully", logo: operator.logo };
  }
}

export default new OperatorService();
