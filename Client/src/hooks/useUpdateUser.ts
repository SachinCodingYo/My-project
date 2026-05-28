import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getToken } from "../utils/getTocken";

interface UpdateUserPayload {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

const updateUser = async (payload: UpdateUserPayload) => {
  const token = getToken();

  const response = await axios.patch(
    "http://localhost:5000/api/v1/user/update-user",
    payload,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data.data;
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,

    onSuccess: (data) => {
      queryClient.setQueryData(["user-details"], data);
    },
  });
};