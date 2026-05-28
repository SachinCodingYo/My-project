import { useForm } from "react-hook-form";
import { useCreateOperator, useUpdateOperator } from "../../../hooks/useOperators";
import { useEffect } from "react";
import type { Operator, OperatorFormInputs } from "../../../common/types/types";
import Modal from "../../common/modal/Modal";

type Props = {
  onClose: () => void;
  operator?: Operator;
};

const AddOperatorModal = ({ onClose, operator }: Props) => {
  const { register, handleSubmit, reset } = useForm<OperatorFormInputs>({
    defaultValues: operator
      ? {
          name: operator.name,
          slug: operator.slug || "",
          status: operator.isActive ? "active" : "inactive",
        }
      : {
          name: "",
          slug: "",
          status: "active",
        },
  });

  const { mutateAsync: createOperator, isPending } = useCreateOperator();
  const { mutateAsync: updateOperator } = useUpdateOperator();

  const onSubmit = async (data: OperatorFormInputs) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("slug", data.slug);
    formData.append("isActive", String(data.status === "active"));

    if (data.logo && data.logo[0]) {
      formData.append("logo", data.logo[0]);
    }

    if (operator) {
      await updateOperator({
        id: operator._id,
        data: formData,
      });
    } else {
      await createOperator(formData);
    }

    onClose();
  };

  useEffect(() => {
    if (operator) {
      reset({
        name: operator.name,
        slug: operator.slug || "",
        status: operator.isActive ? "active" : "inactive",
      });
    }
  }, [operator, reset]);

  return (
    <Modal onClose={onClose}>
      <h2 className="text-lg font-semibold mb-4">
        {operator ? "Edit Operator" : "Add Operator"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("name")}
          placeholder="Operator Name"
          className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
        />

        <input
          {...register("slug")}
          placeholder="Operator Slug"
          className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
        />

        <select
          {...register("status")}
          className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <input
          type="file"
          {...register("logo")}
          className="w-full text-sm text-gray-400
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:bg-indigo-600 file:text-white
            hover:file:bg-indigo-700"
        />

        <div className="flex justify-end gap-3 pt-2">
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
            {isPending ? "Saving..." : operator ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddOperatorModal;