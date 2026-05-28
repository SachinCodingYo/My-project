import type { User } from "../../common/types/types";

type Props = {
  user: User;
  onClose: () => void;
};

const ViewUserModal = ({ user, onClose }: Props) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">

      <div className="bg-[#0f172a] w-105 rounded-xl p-6 border border-gray-800">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">User Details</h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* User Info */}
        <div className="space-y-4 text-sm">

          <div>
            <p className="text-gray-400">Full Name</p>
            <p className="font-medium">{user.fullName}</p>
          </div>

          <div>
            <p className="text-gray-400">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>

          <div>
            <p className="text-gray-400">Mobile</p>
            <p className="font-medium">{user.mobile}</p>
          </div>

          <div>
            <p className="text-gray-400">Role</p>
            <p className="font-medium">{user.role}</p>
          </div>

          <div>
            <p className="text-gray-400">User ID</p>
            <p className="font-medium text-xs break-all">{user._id}</p>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end mt-6">

          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
};

export default ViewUserModal;