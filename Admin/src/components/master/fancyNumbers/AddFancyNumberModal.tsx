import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import type {
  FancyNumber,
  FancyNumberFormData,
  Operator,
  VipCategory,
} from "../../../common/types/types";
import { useCreateFancyNumber, useUpdateFancyNumber } from "../../../hooks/useFancyNumbers";
import { useOperators } from "../../../hooks/useOperators";
import { useVipCategories } from "../../../hooks/useVipCategories";
import Modal from "../../common/modal/Modal";

type Props = {
  onClose: () => void;
  fancyNumber?: FancyNumber;
};

const AddFancyNumberModal = ({ onClose, fancyNumber }: Props) => {
  const { register, handleSubmit, reset } = useForm<FancyNumberFormData>({
    defaultValues: fancyNumber
      ? {
          number: fancyNumber.number,
          operatorId: fancyNumber.operatorId?._id || "",
          vipCategoryId: fancyNumber.vipCategoryId?._id || "",
          price: fancyNumber.price,
          salePrice: fancyNumber.salePrice,
          status: fancyNumber.isActive ? "active" : "inactive",
          availability: fancyNumber.isAvailable ? "available" : "unavailable",
        }
      : {
          number: "",
          operatorId: "",
          vipCategoryId: "",
          price: undefined,
          salePrice: undefined,
          status: "active",
          availability: "available",
        },
  });

  const { mutateAsync: createFancyNumber, isPending } = useCreateFancyNumber();
  const { mutateAsync: updateFancyNumber } = useUpdateFancyNumber();
  const { data: operatorsData } = useOperators();
  const { data: vipCategoriesData } = useVipCategories();

  const operators = useMemo<Operator[]>(
    () => operatorsData?.data ?? [],
    [operatorsData]
  );
  const vipCategories = useMemo<VipCategory[]>(
    () => vipCategoriesData?.data ?? [],
    [vipCategoriesData]
  );

  const onSubmit = async (data: FancyNumberFormData) => {
    const basePayload = {
      number: data.number.trim(),
      operatorId: data.operatorId,
      vipCategoryId: data.vipCategoryId || null,
      price: data.price ?? 0,
      salePrice: data.salePrice ?? 0,
      isActive: data.status === "active",
    };

    if (fancyNumber) {
      await updateFancyNumber({
        id: fancyNumber._id,
        data: {
          ...basePayload,
          isAvailable: data.availability === "available",
        },
      });
    } else {
      await createFancyNumber(basePayload);
    }

    onClose();
  };

  useEffect(() => {
    if (fancyNumber) {
      reset({
        number: fancyNumber.number,
        operatorId: fancyNumber.operatorId?._id || "",
        vipCategoryId: fancyNumber.vipCategoryId?._id || "",
        price: fancyNumber.price,
        salePrice: fancyNumber.salePrice,
        status: fancyNumber.isActive ? "active" : "inactive",
        availability: fancyNumber.isAvailable ? "available" : "unavailable",
      });
    }
  }, [fancyNumber, reset]);

  return (
    <Modal onClose={onClose} width="520px">
      <h2 className="text-lg font-semibold mb-4">
        {fancyNumber ? "Edit Fancy Number" : "Add Fancy Number"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("number", { required: true })}
          placeholder="Fancy Number"
          className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
        />

        <select
          {...register("operatorId", { required: true })}
          className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
        >
          <option value="">Select Operator</option>
          {operators.map((operator) => (
            <option key={operator._id} value={operator._id}>
              {operator.name}
            </option>
          ))}
        </select>

        <select
          {...register("vipCategoryId")}
          className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
        >
          <option value="">Select VIP Category (Optional)</option>
          {vipCategories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          min={0}
          {...register("price", { valueAsNumber: true })}
          placeholder="Original Price"
          className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
        />

        <input
          type="number"
          min={0}
          {...register("salePrice", { valueAsNumber: true })}
          placeholder="Sale Price"
          className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
        />

        <select
          {...register("status")}
          className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          {...register("availability")}
          className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
        >
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-indigo-600 rounded-lg"
          >
            {isPending ? "Saving..." : fancyNumber ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddFancyNumberModal;
