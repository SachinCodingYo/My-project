import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../constants/queryKeys";
import { getMrDashboardSummary } from "../services/earning.service";

export const useMrDashboardSummary = () =>
  useQuery({
    queryKey: queryKeys.mrEarningSummary,
    queryFn: getMrDashboardSummary,
    refetchInterval: 30_000,
    refetchIntervalInBackground: true,
  });
