import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../services/user.service";
import { getTokenData } from "../utils/token";

export const useUserProfile = () => {
    const tokenData = getTokenData();
    const userId = tokenData?.id;

    return useQuery({
        queryKey: ["user-profile", userId],
        queryFn: () => getUserProfile(userId!),
        enabled: !!userId, // only run when userId exists
        select: (res) => res.data, // adjust if needed
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: true,
    });
};