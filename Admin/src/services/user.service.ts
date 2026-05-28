import apiClient from "../constant/apiclient";

export const getUsers = async (params?: {
  search?: string;
  cursor?: string | null;
}) => {
  const response = await apiClient.get("/user-list", {
    params,
  });

  return response.data;
};

export const updateUser = async (
  id: string,
  data: { isActive: boolean }
) => {
  const response = await apiClient.patch(`/update-user/${id}`, data);
  return response.data;
};

// 🔹 Get single user (profile)
export const getUserProfile = async (userId: string) => {
  const response = await apiClient.get(`/user/${userId}`);
  return response.data;
};

// 🔹 Update profile (admin side)
// export const updateUserProfile = async (
//   userId: string,
//   data: {
//     fullName?: string;
//     email?: string;
//     mobile?: string;
//     role?: "ADMIN" | "USER" | "MR";
//     isActive?: boolean;
//   }
// ) => {
//   const response = await apiClient.patch(`/user/${userId}`, data);
//   return response.data;
// };

export const updateUserProfile = async (
  userId: string,
  data: FormData
) => {
  const response = await apiClient.patch(`/user/${userId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};