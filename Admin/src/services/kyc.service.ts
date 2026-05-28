import apiClient from "../constant/apiclient";

export const getPendingKycs = async (limit = 20, cursor?: string) => {
  const params: Record<string, unknown> = { limit };
  if (cursor) params.cursor = cursor;

  const response = await apiClient.get("../kyc/all", { params });
  return {
    data: (response.data?.data?.results ?? []) as import("../common/types/types").KycApproval[],
    nextCursor: (response.data?.data?.nextCursor as string | null) ?? null,
    hasMore: (response.data?.data?.hasMore as boolean) ?? false,
  };
};

export const approveKyc = async (kycId: string) => {
  const response = await apiClient.put(`../kyc/approve/${kycId}`, {});
  return response.data;
};

export const rejectKyc = async (kycId: string, rejectionReason: string) => {
  const response = await apiClient.put(`../kyc/reject/${kycId}`, {
    reason: rejectionReason,
  });
  return response.data;
};

export const approveVideoKyc = async (kycId: string) => {
  const response = await apiClient.put(`../kyc/video/approve/${kycId}`, {});
  return response.data;
};

export const rejectVideoKyc = async (kycId: string, rejectionReason: string) => {
  const response = await apiClient.put(`../kyc/video/reject/${kycId}`, {
    reason: rejectionReason,
  });
  return response.data;
};
