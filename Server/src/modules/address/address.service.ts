import Address from "./address.model";
import { createAddressInput } from "./dto/createAddress.dto";
import { updateAddressInput } from "./dto/updateAddress.dto";

export class AddressServices {
  async create(input: createAddressInput, userId: string) {
    const address = await Address.create({
      ...input,
      userId,
      location: {
        type: "Point",
        coordinates: [input.longitude, input.latitude],
      },
    });
    if (!address) throw new Error("Error creating the address");
    return address;
  }

  async findAll(userId: string) {
    return await Address.find({ userId });
  }

  async findById(id: string) {
    const address = await Address.findById(id);
    if (!address) throw new Error("Address not found");
    return address;
  }

  async update(id: string, userId: string, input: updateAddressInput) {
    const address = await Address.findById(id);
    if (!address) throw new Error("Address not found");
    if (address?.userId.toString() !== userId.toString())
      throw new Error("Unauthorized!");
    if (input.longitude && input.latitude) {
      address.location = {
        type: "Point",
        coordinates: [input.longitude, input.latitude],
      };
    }
    Object.assign(address, input);
    await address.save();
    return address;
  }

  async delete(id: string, userId: string) {
    const address = await Address.findById(id);
    if (!address) throw new Error("Address not found");
    if (address?.userId.toString() !== userId.toString())
      throw new Error("Unauthorized!");
    await address?.deleteOne();
    return {
      message: "Address deletion successful",
    };
  }

  async setDefault(id: string, userId: string) {
    const address = await Address.findById(id);
    if (!address) throw new Error("Address not found!");
    if (address.userId.toString() !== userId.toString())
      throw new Error("Unauthorized!");

    await Address.updateMany({ userId }, { isDefault: false });
    const updatedAddress = await Address.findByIdAndUpdate(
      id,
      { isDefault: true },
      { new: true },
    );
    if (!updatedAddress)
      throw new Error("Error while making the address default!");
    return updatedAddress;
  }
}

export default new AddressServices();
