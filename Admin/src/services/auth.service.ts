import apiClient from "../constant/apiclient";

export const adminChangePassword = async (data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string; // ✅ correct
}) => {
  const res = await apiClient.post(
    "../auth/admin-change-password",
    data
  );
  return res.data;
};