import { createServiceInput } from "./dto/createService.dto";
import { updateServiceInput } from "./dto/updateService.dto";
import Service from "./service.model";

export class ServiceKiServices {
  async create(input: createServiceInput) {
    const existing = await Service.findOne({
      $or: [
        {
          name: input.name,
        },
        {
          slug: input.slug,
        },
      ],
    });

    if (existing) throw new Error("Name or slug already exists!");
    const service = await Service.create(input);
    if (!service) throw new Error("Error creating the service");
    return service;
  }

  async findAll(isAdmin: boolean = true) {
    return isAdmin
      ? Service.find().sort({ name: 1 })
      : Service.find({ isActive: true }).sort({ name: 1 });
  }

  async findById(id: string, isAdmin: boolean = true) {
    const service = await Service.findById(id);
    if (!service) throw new Error("Service not found");
    if (!isAdmin && !service.isActive) throw new Error("Service not found");
    return service;
  }

  async update(id: string, input: updateServiceInput) {
    const service = await Service.findById(id);
    if (!service) throw new Error("Service not found");
    if (input.slug && input.slug !== service.slug) {
      const slugExists = await Service.findOne({ slug: input.slug });
      if (slugExists) throw new Error("Slug already exits");
    }
    Object.assign(service, input);
    await service.save();
    return service;
  }

  async delete(id: string) {
    const service = await Service.findById(id);
    if (!service) throw new Error("Service not found");
    await service?.deleteOne();
    return {
      message: "Service deletion successful",
    };
  }
}

export default new ServiceKiServices();
