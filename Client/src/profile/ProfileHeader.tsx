import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { useUser } from "../hooks/useUser";
import EditProfileModal from "../profile/modals/EditProfileModal";

const ProfileHeader = () => {
  const { data: user } = useUser();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const firstLetter = user?.fullName?.[0]?.toUpperCase() || "U";

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md p-8 flex justify-between mb-8">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-blue-600 text-white flex items-center justify-center rounded-full">
            {firstLetter}
          </div>
          <div>
            <h2>{user?.fullName}</h2>
            <p>{user?.mobile}</p>
          </div>
        </div>

        <button onClick={() => setIsEditOpen(true)}>
          <FiEdit /> Edit Profile
        </button>
      </div>

      {isEditOpen && <EditProfileModal close={() => setIsEditOpen(false)} />}
    </>
  );
};

export default ProfileHeader;