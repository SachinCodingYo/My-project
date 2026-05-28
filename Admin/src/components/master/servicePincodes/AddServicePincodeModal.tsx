import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type {
  ServicePincode,
  ServicePincodeFormData,
} from "../../../common/types/types";
import {
  useCreateServicePincode,
  useUpdateServicePincode,
} from "../../../hooks/useServicePincodes";
import Modal from "../../common/modal/Modal";

type Props = {
  onClose: () => void;
  pincode?: ServicePincode;
};

const AddServicePincodeModal = ({ onClose, pincode }: Props) => {
  const { register, handleSubmit, reset } = useForm<ServicePincodeFormData>({
    defaultValues: pincode
      ? {
          pincode: pincode.pincode,
          status: pincode.isActive ? "active" : "inactive",
        }
      : {
          pincode: "",
          status: "active",
        },
  });

  const { mutateAsync: createServicePincode, isPending } =
    useCreateServicePincode();
  const { mutateAsync: updateServicePincode } = useUpdateServicePincode();

  const onSubmit = async (data: ServicePincodeFormData) => {
    const payload = {
      pincode: data.pincode.trim(),
      isActive: data.status === "active",
    };

    if (pincode) {
      await updateServicePincode({ id: pincode._id, data: payload });
    } else {
      await createServicePincode(payload);
    }

    onClose();
  };

  useEffect(() => {
    if (pincode) {
      reset({
        pincode: pincode.pincode,
        status: pincode.isActive ? "active" : "inactive",
      });
    }
  }, [pincode, reset]);

  return (
    <Modal onClose={onClose} width="420px">
      <h2 className="text-lg font-semibold mb-4">
        {pincode ? "Edit Service Pincode" : "Add Service Pincode"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("pincode", { required: true })}
          placeholder="6-digit Pincode (e.g. 110001)"
          maxLength={6}
          className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2 text-sm"
        />

        <select
          {...register("status")}
          className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2 text-sm"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 rounded-lg text-sm"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm"
          >
            {isPending ? "Saving..." : pincode ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddServicePincodeModal;
