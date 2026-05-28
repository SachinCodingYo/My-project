import ServicePincode from "./servicePincode.model";
import { UserModel } from "../auth/auth.model";
import { CreateServicePincodeInput } from "./dto/createServicePincode.dto";
import { UpdateServicePincodeInput } from "./dto/updateServicePincode.dto";

export class ServicePincodeService {
  async createPincode(input: CreateServicePincodeInput) {
    const existing = await ServicePincode.findOne({ pincode: input.pincode });
    if (existing) throw new Error("Pincode already exists in service areas!");

    return await ServicePincode.create(input);
  }

  async getAllPincodes() {
    return await ServicePincode.find().populate(
      "assignedMRs",
      "fullName email mobile isOnline isActive",
    );
  }

  async updatePincode(id: string, input: UpdateServicePincodeInput) {
    const updated = await ServicePincode.findByIdAndUpdate(
      id,
      { $set: input },
      { new: true, runValidators: true },
    ).populate("assignedMRs", "fullName email mobile");

    if (!updated) throw new Error("Service pincode not found!");
    return updated;
  }

  async assignMR(pincodeId: string, mrId: string) {
    const pincode = await ServicePincode.findById(pincodeId);
    if (!pincode) throw new Error("Service pincode not found!");

    const mr = await UserModel.findById(mrId);
    if (!mr) throw new Error("MR not found!");
    if (mr.role !== "MR") throw new Error("User is not an MR!");
    if (!mr.isActive) throw new Error("MR is not active!");

    // check if mr is already assigned
    if (pincode.assignedMRs.some((id) => id.toString() === mrId))
      throw new Error("MR is already assigned to this pincode");

    // assign mr
    await ServicePincode.findByIdAndUpdate(pincodeId, {
      $addToSet: { assignedMRs: mrId },
    });
    // if (pincode.assignedMRs.some((id) => id.toString() === mrId))
    //   throw new Error("MR is already assigned to this pincode!");

    // // Sync both — ServicePincode.assignedMRs and User.servicingPincodes
    // await ServicePincode.findByIdAndUpdate(pincodeId, {
    //   $addToSet: { assignedMRs: mrId },
    // });
    // await UserModel.findByIdAndUpdate(mrId, {
    //   $addToSet: { servicingPincodes: pincode.pincode },
    // });

    return await ServicePincode.findById(pincodeId).populate(
      "assignedMRs",
      "fullName email mobile",
    );
  }

  async unassignMR(pincodeId: string, mrId: string) {
    const pincode = await ServicePincode.findById(pincodeId);
    if (!pincode) throw new Error("Service pincode not found!");

    const mr = await UserModel.findById(mrId);
    if (!mr) throw new Error("MR not found!");

    if (!pincode.assignedMRs.some((id) => id.toString() === mrId))
      throw new Error("MR is not assigned to this pincode!");

    // pull the specific mr from the assigned MRs list
    await ServicePincode.findByIdAndUpdate(pincodeId, {
      $pull: { assignedMRs: mrId },
    });

    return await ServicePincode.findById(pincodeId).populate(
      "assignedMRs",
      "fullName email mobile",
    );
  }

  async deletePincode(id: string) {
    const pincode = await ServicePincode.findById(id);
    if (!pincode) throw new Error("Service pincode not found!");

    await ServicePincode.findByIdAndDelete(id);
    return { message: "Service pincode deleted successfully" };
  }
}

export const servicePincodeService = new ServicePincodeService();
