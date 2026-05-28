import { useForm } from "react-hook-form";
import Modal from "../../common/modal/Modal";
import {
  useCreatePlanTag,
  useUpdatePlanTag,
} from "../../../hooks/usePlanTags";

import type { PlanTag, PlanTagFormData } from "../../../common/types/types";

type Props = {
  onClose: () => void;
  planTag?: PlanTag;
};

const AddPlanTagModal = ({ onClose, planTag }: Props) => {

  const { register, handleSubmit } = useForm<PlanTagFormData>({
    defaultValues: {
      name: planTag?.name || "",
      slug: planTag?.slug || "",
      status: planTag?.isActive ? "active" : "inactive",
    },
  });

  const { mutateAsync: createPlanTag } = useCreatePlanTag();
  const { mutateAsync: updatePlanTag } = useUpdatePlanTag();

  const onSubmit = async (data: PlanTagFormData) => {
    const payload = {
      name: data.name,
      slug: data.slug,
      isActive: data.status === "active",
    };

    if (planTag) {
      await updatePlanTag({ id: planTag._id, data: payload });
    } else {
      await createPlanTag(payload);
    }

    onClose();
  };

  return (
    <Modal onClose={onClose} width="420px">

      <h2 className="text-lg font-semibold mb-4">
        {planTag ? "Edit Plan Tag" : "Add Plan Tag"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <input
          {...register("name")}
          placeholder="Tag Name"
          className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
        />

        <input
          {...register("slug")}
          placeholder="Slug"
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
            className="px-4 py-2 bg-indigo-600 rounded-lg"
          >
            {planTag ? "Update" : "Save"}
          </button>

        </div>

      </form>

    </Modal>
  );
};

export default AddPlanTagModal;