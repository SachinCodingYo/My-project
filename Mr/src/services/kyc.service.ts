import { kycClient } from "./api";
import type {
  ApiResponse,
  KYCResponse,
  AadhaarOtpResponse,
  AadhaarOtpPayload,
  AadhaarVerifyPayload,
  PanVerificationData,
  BankVerificationData,
  LocalKycState,
  KycStatus,
} from "../common/types/types";

const KYC_STATE_KEY = "mr_kyc_state";

const defaultState: LocalKycState = {
  status: "not_submitted",
  aadhaarVerified: false,
  panVerified: false,
  bankVerified: false,
  isVideoVerified: false,
  videoKycStatus: undefined,
  isKycVerified: false,
};

const readLocalState = (): LocalKycState => {
  if (typeof window === "undefined") {
    return defaultState;
  }

  try {
    const raw = window.localStorage.getItem(KYC_STATE_KEY);
    if (!raw) {
      return defaultState;
    }

    return {
      ...defaultState,
      ...JSON.parse(raw),
    } as LocalKycState;
  } catch {
    return defaultState;
  }
};

const writeLocalState = (patch: Partial<LocalKycState>) => {
  if (typeof window === "undefined") {
    return defaultState;
  }

  const nextState = {
    ...readLocalState(),
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(KYC_STATE_KEY, JSON.stringify(nextState));
  return nextState;
};

const isMaskedValue = (value?: string) => Boolean(value?.includes("X"));

const normalizeRemoteKyc = (kyc: KYCResponse | null | undefined) => {
  if (!kyc || Array.isArray(kyc)) {
    return defaultState;
  }

  const localState = readLocalState();
  const status: KycStatus =
    kyc.kycVideo && kyc.videoKycStatus === "pending" && kyc.status === "bank_verified"
      ? "video_uploaded"
      : kyc.status;
  const aadhaarNumber =
    kyc.aadhaarNumber && !isMaskedValue(kyc.aadhaarNumber)
      ? kyc.aadhaarNumber
      : localState.aadhaarNumber;
  const bankAccountNumber =
    kyc.bankAccountNumber && !isMaskedValue(kyc.bankAccountNumber)
      ? kyc.bankAccountNumber
      : localState.bankAccountNumber;

  return {
    ...localState,
    ...kyc,
    aadhaarNumber,
    bankAccountNumber,
    status,
    aadhaar: aadhaarNumber || localState.aadhaar,
    pan: kyc.panNumber || localState.pan,
    fullName:
      kyc.bankHolderName ||
      kyc.panHolderName ||
      kyc.fullname ||
      localState.fullName,
  } as LocalKycState;
};

class KYCService {
  getLocalKycState() {
    return readLocalState();
  }

  clearLocalKycState() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(KYC_STATE_KEY);
    }
  }

  async getMyKYC() {
    try {
      const response = await kycClient.get<ApiResponse<KYCResponse>>("/me");
      const nextState = normalizeRemoteKyc(response.data.data);
      writeLocalState(nextState);
      return nextState;
    } catch {
      return readLocalState();
    }
  }

  async sendAadhaarOtp(data: AadhaarOtpPayload) {
    const response = await kycClient.post<ApiResponse<AadhaarOtpResponse>>(
      "/aadhaar/send-otp",
      data
    );

    const nextState = writeLocalState({
      status: "initiated",
      aadhaar: data.aadhaar,
      aadhaarNumber: data.aadhaar,
      aadhaarRefId: response.data.data?.refId ?? null,
      aadhaarVerified: false,
      panVerified: false,
      bankVerified: false,
      isVideoVerified: false,
      isKycVerified: false,
      rejectionReason: undefined,
    });

    return {
      ...response.data,
      localState: nextState,
    };
  }

  async resendAadhaarOtp(data: AadhaarOtpPayload) {
    const response = await kycClient.post<ApiResponse<AadhaarOtpResponse>>(
      "/aadhaar/resend-otp",
      data
    );

    const nextState = writeLocalState({
      aadhaarRefId: response.data.data?.refId ?? null,
    });

    return {
      ...response.data,
      localState: nextState,
    };
  }

  async verifyAadhaarOtp(data: AadhaarVerifyPayload) {
    const response = await kycClient.post<ApiResponse<{ message: string; aadhaarHolderName?: string }>>(
      "/aadhaar/verify-otp",
      data
    );

    const nextState = writeLocalState({
      status: "aadhaar_verified",
      aadhaarVerified: true,
      aadhaarRefId: data.refId,
      aadhaarHolderName: response.data.data?.aadhaarHolderName,
    });

    return {
      ...response.data,
      localState: nextState,
    };
  }

  async verifyPan(data: PanVerificationData) {
    const response = await kycClient.post<ApiResponse<{ message: string; panHolderName?: string; fullname?: string }>>(
      "/pan/verify",
      data
    );
    const verifiedName =
      response.data.data?.panHolderName || response.data.data?.fullname || "";

    const nextState = writeLocalState({
      status: "pan_verified",
      panVerified: true,
      panHolderName: verifiedName,
      fullName: verifiedName || readLocalState().fullName,
      pan: data.pan,
    });

    return {
      ...response.data,
      localState: nextState,
    };
  }

  async verifyBank(data: BankVerificationData) {
    const response = await kycClient.post<ApiResponse<{ message: string; bankHolderName?: string; fullname?: string }>>(
      "/bank/verify",
      data
    );
    const verifiedName =
      response.data.data?.bankHolderName || response.data.data?.fullname || "";

    const nextState = writeLocalState({
      status: "bank_verified",
      bankVerified: true,
      bankHolderName: verifiedName,
      fullName: verifiedName || readLocalState().fullName,
      bankAccountNumber: data.account,
      ifscCode: data.ifsc,
      phone: data.phone,
    });

    return {
      ...response.data,
      localState: nextState,
    };
  }

  async uploadKycVideo(video: File) {
    const formData = new FormData();
    formData.append("video", video);

    const response = await kycClient.post<ApiResponse<KYCResponse>>(
      "/video/upload",
      formData
    );

    const nextState = writeLocalState({
      status: "video_uploaded",
      bankVerified: true,
      isVideoVerified: response.data.data?.isVideoVerified ?? false,
      videoKycStatus: response.data.data?.videoKycStatus ?? "pending",
      kycVideo: response.data.data?.kycVideo,
      isKycVerified: false,
    });

    return {
      ...response.data,
      localState: nextState,
    };
  }
}

export default new KYCService();
