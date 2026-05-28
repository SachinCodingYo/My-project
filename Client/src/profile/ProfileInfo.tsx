import { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiPlus } from "react-icons/fi";
import { useUser } from "../hooks/useUser";
import AddressSection from "../profile/AddressSection";
import AddressModal from "../profile/modals/AddressModal";
import { useAddress } from "../hooks/useAddressHooks";

const ProfileInfo = () => {
  const { data: user } = useUser();
  const [showModal, setShowModal] = useState(false);

  const { data: addresses } = useAddress();
const hasAddress = addresses && addresses.length > 0;

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
      
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Contact Information
      </h3>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Phone */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50">
          <FiPhone className="text-blue-500 text-xl" />
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="text-gray-800 font-medium">
              {user?.mobile || "Not provided"}
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50">
          <FiMail className="text-green-500 text-xl" />
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-gray-800 font-medium">
              {user?.email || "Not provided"}
            </p>
          </div>
        </div>

        {/* Address Section */}
        <div className="md:col-span-2 p-4 rounded-xl bg-gray-50">
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FiMapPin className="text-red-500 text-xl" />
              <p className="text-sm text-gray-500">Address</p>
            </div>

            
          </div>

          <AddressSection />
        </div>

      </div>

      {/* Modal */}
      {showModal && (
        <AddressModal close={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default ProfileInfo;