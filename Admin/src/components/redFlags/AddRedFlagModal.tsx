import { useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "../common/modal/Modal";
import type { RedFlagFormData, RedFlagUser } from "../../common/types/types";
import { useSearchRedFlagUser } from "../../hooks/useRedFlags";

type Props = {
  onClose: () => void;
  onSave: (data: RedFlagFormData, user: RedFlagUser) => Promise<void>;
  loading?: boolean;
};

const AddRedFlagModal = ({ onClose, onSave, loading = false }: Props) => {
  const [foundUser, setFoundUser] = useState<RedFlagUser | null>(null);
  const searchUser = useSearchRedFlagUser();

  const { register, handleSubmit, getValues } = useForm<RedFlagFormData>({
    defaultValues: {
      identifier: "",
      reason: "",
      remarks: "",
    },
  });

  const handleSearch = async () => {
    const identifier = getValues("identifier").trim();
    if (!identifier) return;

    const response = await searchUser.mutateAsync({ identifier });
    setFoundUser(response.data);
  };

  const onSubmit = async (data: RedFlagFormData) => {
    if (!foundUser) return;

    await onSave(
      {
        ...data,
        identifier: data.identifier.trim(),
      },
      foundUser
    );
    onClose();
  };

  return (
    <Modal onClose={onClose} width="460px">
      <h2 className="text-lg font-semibold mb-4">Create Red Flag</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-2 max-sm:flex-col">
          <input
            {...register("identifier", { required: true })}
            placeholder="Email or Mobile Number"
            className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
          />

          <button
            type="button"
            onClick={handleSearch}
            disabled={searchUser.isPending}
            className="px-4 py-2 bg-gray-700 rounded-lg text-sm whitespace-nowrap disabled:opacity-60"
          >
            {searchUser.isPending ? "Searching..." : "Search"}
          </button>
        </div>

        {foundUser && (
          <div className="rounded-lg border border-gray-700 bg-[#020617] p-3 text-sm">
            <p className="font-semibold">{foundUser.fullName}</p>
            <p className="text-gray-400 break-all">{foundUser.email}</p>
            <p className="text-gray-400">{foundUser.mobile}</p>
            <span className="mt-2 inline-flex rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-400">
              {foundUser.role}
            </span>
          </div>
        )}

        <input
          {...register("reason", { required: true })}
          placeholder="Reason"
          className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
        />

        <textarea
          {...register("remarks", { required: true })}
          placeholder="Remarks"
          rows={4}
          className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2 resize-none"
        />

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
            disabled={!foundUser || loading}
            className="px-4 py-2 bg-indigo-600 rounded-lg disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddRedFlagModal;
