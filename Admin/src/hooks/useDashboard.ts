import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "../services/dashboard.service";
import type { DashboardData } from "../common/types/types";

export const useDashboard = () => {
  return useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });
};