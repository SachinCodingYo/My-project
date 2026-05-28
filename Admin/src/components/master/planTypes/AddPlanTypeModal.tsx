import { useForm } from "react-hook-form";
import {
  useCreatePlanType,
  useUpdatePlanType,
} from "../../../hooks/usePlanTypes";
import { useEffect } from "react";
import type { PlanType, PlanTypeFormData } from "../../../common/types/types";
import Modal from "../../common/modal/Modal";

type Props = {
  onClose: () => void;
  planType?: PlanType;
};

const AddPlanTypeModal = ({ onClose, planType }: Props) => {

  const { register, handleSubmit, reset } = useForm<PlanTypeFormData>({
    defaultValues: {
      name: "",
      slug: "",
      status: "active",
    },
  });

  const { mutateAsync: createPlanType, isPending } = useCreatePlanType();
  const { mutateAsync: updatePlanType } = useUpdatePlanType();

  const onSubmit = async (data: PlanTypeFormData) => {

    const payload = {
      name: data.name,
      slug: data.slug,
      isActive: data.status === "active",
    };

    if (planType) {
      await updatePlanType({
        id: planType._id,
        data: payload,
      });
    } else {
      await createPlanType(payload);
    }

    onClose();
  };

  useEffect(() => {
    if (planType) {
      reset({
        name: planType.name,
        slug: planType.slug,
        status: planType.isActive ? "active" : "inactive",
      });
    }
  }, [planType, reset]);

  return (
    <Modal onClose={onClose} width="420px">

      <h2 className="text-lg font-semibold mb-4">
        {planType ? "Edit Plan Type" : "Add Plan Type"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <input
          {...register("name")}
          placeholder="SIM Type (Prepaid/Postpaid)"
          className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
        />

        <input
          {...register("slug")}
          placeholder="Slug (example: prepaid)"
          className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
        />

        <select
          {...register("status")}
          className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
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
            {isPending ? "Saving..." : planType ? "Update" : "Save"}
          </button>

        </div>

      </form>

    </Modal>
  );
};

export default AddPlanTypeModal;