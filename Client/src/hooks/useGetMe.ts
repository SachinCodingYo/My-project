import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getToken } from "../utils/getTocken";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  // add other fields as per your user schema
}

const fetchMe = async (): Promise<User> => {
  const token = getToken();
  const response = await axios.get("http://localhost:5000/api/v1/user/user-details", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data; // assuming your sendResponse wraps data in .data
};

export const useGetMe = () => {
  return useQuery<User, Error>({
    queryKey: ["me"],
    queryFn: fetchMe,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};