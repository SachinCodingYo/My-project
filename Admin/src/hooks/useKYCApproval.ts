import { useMutation, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveKyc,
  approveVideoKyc,
  getPendingKycs,
  rejectKyc,
  rejectVideoKyc,
} from "../services/kyc.service";
import { handleApiHookResponse } from "../utils/queryToast";

export const usePendingKycs = (limit = 20) =>
  useInfiniteQuery({
    queryKey: ["kyc-approvals"],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      getPendingKycs(limit, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 1000 * 60,
  });

export const useApproveKyc = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (kycId: string) => approveKyc(kycId),
    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["kyc-approvals"] });
    }),
  });
};

export const useRejectKyc = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      kycId,
      reason,
    }: {
      kycId: string;
      reason: string;
    }) => rejectKyc(kycId, reason),
    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["kyc-approvals"] });
    }),
  });
};

export const useApproveVideoKyc = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (kycId: string) => approveVideoKyc(kycId),
    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["kyc-approvals"] });
    }),
  });
};

export const useRejectVideoKyc = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      kycId,
      reason,
    }: {
      kycId: string;
      reason: string;
    }) => rejectVideoKyc(kycId, reason),
    ...handleApiHookResponse(() => {
      queryClient.invalidateQueries({ queryKey: ["kyc-approvals"] });
    }),
  });
};
