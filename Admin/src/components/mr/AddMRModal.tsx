import { useForm } from "react-hook-form";
import { useEffect } from "react";

import { useCreateMR, useUpdateMR } from "../../hooks/useMRs";
import type { MR, MRFormData } from "../../common/types/types";

type Props = {
  onClose: () => void;
  mr?: MR;
};

const AddMRModal = ({ onClose, mr }: Props) => {
  const { register, handleSubmit, reset } = useForm<MRFormData>({
    defaultValues: mr
      ? {
          fullName: mr.fullName,
          email: mr.email,
          mobile: mr.mobile,
          password: "",
        }
      : {
          fullName: "",
          email: "",
          mobile: "",
          password: "",
        },
  });

  const { mutateAsync: createMR, isPending } = useCreateMR();
  const { mutateAsync: updateMR } = useUpdateMR();

  const onSubmit = async (data: MRFormData) => {
    try {
      if (mr) {
        await updateMR({
          id: mr._id,
          data,
        });
      } else {
        await createMR(data);
      }

      onClose();
    } catch {
      // toast handled by queryToast
    }
  };

  useEffect(() => {
    if (mr) {
      reset({
        fullName: mr.fullName,
        email: mr.email,
        mobile: mr.mobile,
        password: "",
      });
    }
  }, [mr, reset]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">

      <div className="bg-[#0f172a] w-100 rounded-xl p-6">

        <h2 className="text-lg font-semibold mb-4">
          {mr ? "Edit MR" : "Add MR"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <input
            {...register("fullName")}
            placeholder="Full Name"
            className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
          />

          <input
            {...register("email")}
            placeholder="Email"
            type="email"
            className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
          />

          <input
            {...register("mobile")}
            placeholder="Mobile Number"
            className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
          />

          <input
            {...register("password")}
            placeholder="Password"
            type="password"
            className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
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
              {isPending ? "Saving..." : mr ? "Update" : "Save"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AddMRModal;