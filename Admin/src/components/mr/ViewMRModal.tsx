import type { MR } from "../../common/types/types";

type Props = {
  mr: MR;
  onClose: () => void;
};

const ViewMRModal = ({ mr, onClose }: Props) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">

      <div className="bg-[#0f172a] w-100 rounded-xl p-6">

        <h2 className="text-lg font-semibold mb-6">
          MR Details
        </h2>

        <div className="space-y-4 text-sm">

          <div>
            <p className="text-gray-400">Full Name</p>
            <p className="font-medium">{mr.fullName}</p>
          </div>

          <div>
            <p className="text-gray-400">Email</p>
            <p className="font-medium">{mr.email}</p>
          </div>

          <div>
            <p className="text-gray-400">Mobile</p>
            <p className="font-medium">{mr.mobile}</p>
          </div>

          <div>
            <p className="text-gray-400">Role</p>
            <p className="font-medium">{mr.role || "MR"}</p>
          </div>

          <div>
            <p className="text-gray-400">Verified</p>
            <p className="font-medium">
              {mr.isVerified ? "Yes" : "No"}
            </p>
          </div>

        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 rounded-lg"
          >
            Close
          </button>
        </div>

      </div>

    </div>
  );
};

export default ViewMRModal;