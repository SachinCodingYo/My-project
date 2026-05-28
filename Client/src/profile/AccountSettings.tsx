import { FiLogOut, FiLock } from "react-icons/fi";
import { useState } from "react";
import PasswordModal from "../profile/modals/PasswordModal";
import { removeToken } from "../utils/getTocken";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser"; // ✅ ADD THIS

const AccountSettings = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const navigate = useNavigate();
  const { data: user } = useUser(); // ✅ GET USER HERE

  return (
    <>
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 space-y-6">
        
        <h3 className="text-xl font-semibold text-gray-800">
          Account Settings
        </h3>

        {/* Change Password */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <FiLock className="text-lg" />
            </div>
            <div>
              <p className="text-gray-800 font-medium">Change Password</p>
              <p className="text-sm text-gray-500">
                Update your account password
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowPasswordModal(true)}
            className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Change
          </button>
        </div>

        {/* Logout */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 hover:bg-red-100 transition">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <FiLogOut className="text-lg" />
            </div>
            <div>
              <p className="text-gray-800 font-medium">Logout</p>
              <p className="text-sm text-gray-500">
                Sign out from your account
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              removeToken();
              navigate("/");
            }}
            className="text-sm px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <PasswordModal
          close={() => setShowPasswordModal(false)}
         
        />
      )}
    </>
  );
};

export default AccountSettings;