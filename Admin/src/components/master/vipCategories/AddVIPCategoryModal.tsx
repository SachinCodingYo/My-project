import { useForm } from "react-hook-form";
import {
  useCreateVipCategory,
  useUpdateVipCategory,
} from "../../../hooks/useVipCategories";
import { useEffect } from "react";
import type { VipCategory, VipCategoryFormData } from "../../../common/types/types";
import Modal from "../../common/modal/Modal";

type Props = {
  onClose: () => void;
  category?: VipCategory;
};

const AddVIPCategoryModal = ({ onClose, category }: Props) => {
  const { register, handleSubmit, reset } = useForm<VipCategoryFormData>({
    defaultValues: category
      ? {
          name: category.name,
          slug: category.slug || "",
          status: category.isActive ? "active" : "inactive",
        }
      : {
          name: "",
          slug: "",
          status: "active",
        },
  });

  const { mutateAsync: createCategory, isPending } = useCreateVipCategory();
  const { mutateAsync: updateCategory } = useUpdateVipCategory();

  const onSubmit = async (data: VipCategoryFormData) => {
    const payload = {
      name: data.name,
      slug: data.slug,
      isActive: data.status === "active",
    };

    if (category) {
      await updateCategory({
        id: category._id,
        data: payload,
      });
    } else {
      await createCategory(payload);
    }

    onClose();
  };

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        slug: category.slug || "",
        status: category.isActive ? "active" : "inactive",
      });
    }
  }, [category, reset]);

  return (
    <Modal onClose={onClose} width="420px">
      <h2 className="text-lg font-semibold mb-4">
        {category ? "Edit Category" : "Add Category"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("name")}
          placeholder="Category Name"
          className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
        />

        <input
          {...register("slug")}
          placeholder="Slug (example: premium)"
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
            {isPending ? "Saving..." : category ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddVIPCategoryModal;