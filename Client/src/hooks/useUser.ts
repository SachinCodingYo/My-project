// src/hooks/useUser.ts

import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../constant/apiclient";
import { getToken } from "../utils/getTocken";


// ---------------------
// User details type
// ---------------------
export interface UserDetails {
  id: string;
  fullName: string;
  email?: string;
  mobile?: string;
  address?: string;
  avatarUrl?: string;
}

// ---------------------
// API response type
// ---------------------
interface UserResponse {
  data: UserDetails;
}

// ---------------------
// Hook to fetch user
// ---------------------
export const useUser = (): UseQueryResult<UserDetails, Error> => {
  const token = getToken();

  return useQuery<UserDetails, Error>({
    queryKey: ["user-details"],
    queryFn: async (): Promise<UserDetails> => {
      const response = await apiClient.get<UserResponse>("/user-details");
      return response.data.data;
    },

    enabled: !!token, // ✅🔥 MOST IMPORTANT LINE

    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};