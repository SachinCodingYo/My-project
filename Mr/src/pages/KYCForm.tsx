import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useProfile } from "../hooks/useProfile";
import {
  useGetMyKYC,
  useResendAadhaarOtp,
  useSendAadhaarOtp,
  useUploadKycVideo,
  useVerifyAadhaarOtp,
  useVerifyBank,
  useVerifyPan,
} from "../hooks/useKYC";
import { APP_ROUTES } from "../constants/routes";
import type { KycStep } from "../common/types/types";
import KycStepper, { KYC_STEPS } from "../components/kyc/KycStepper";
import AadhaarStep from "../components/kyc/form/AadhaarStep";
import OtpStep from "../components/kyc/form/OtpStep";
import PanStep from "../components/kyc/form/PanStep";
import BankStep from "../components/kyc/form/BankStep";
import VideoStep from "../components/kyc/form/VideoStep";

const getStepFromStatus = (status?: string): KycStep => {
  switch (status) {
    case "initiated": return 2;
    case "aadhaar_verified": return 3;
    case "pan_verified": return 4;
    case "bank_verified":
    case "video_uploaded":
    case "video_pending":
    case "video_verified":
    case "pending": return 5;
    default: return 1;
  }
};

const KYCForm = () => {
  const navigate = useNavigate();
  const { data: profileResponse } = useProfile();
  const { data: kycState, refetch: refetchKyc } = useGetMyKYC();

  const [currentStep, setCurrentStep] = useState<KycStep>(() =>
    getStepFromStatus(kycState?.status)
  );
  const [refId, setRefId] = useState(kycState?.aadhaarRefId || "");
  const [aadhaarNumber, setAadhaarNumber] = useState(kycState?.aadhaar || "");

  const sendAadhaarOtp = useSendAadhaarOtp();
  const resendAadhaarOtp = useResendAadhaarOtp();
  const verifyAadhaarOtp = useVerifyAadhaarOtp();
  const verifyPan = useVerifyPan();
  const verifyBank = useVerifyBank();
  const uploadKycVideo = useUploadKycVideo();

  const profile = profileResponse?.data;

  useEffect(() => {
    setCurrentStep((step) => {
      if (step === 3 && kycState?.status === "pan_verified") return step;
      if (step === 4 && kycState?.status === "bank_verified") return step;
      return getStepFromStatus(kycState?.status);
    });
    setRefId(kycState?.aadhaarRefId || "");
    setAadhaarNumber(kycState?.aadhaar || "");
  }, [kycState]);

  const handleSendOtp = async (aadhaar: string) => {
    const response = await sendAadhaarOtp.mutateAsync({ aadhaar });
    setAadhaarNumber(aadhaar);
    setRefId(response.data.refId);
    setCurrentStep(2);
  };

  const handleResendOtp = async () => {
    if (!aadhaarNumber) {
      toast.error("Aadhaar number not found. Go back and re-enter.");
      setCurrentStep(1);
      return;
    }
    const response = await resendAadhaarOtp.mutateAsync({ aadhaar: aadhaarNumber });
    setRefId(response.data.refId);
  };

  const handleVerifyOtp = async (otp: string) => {
    if (!refId) {
      toast.error("Aadhaar reference is missing. Send OTP again.");
      setCurrentStep(1);
      return;
    }
    await verifyAadhaarOtp.mutateAsync({ refId, otp });
    setCurrentStep(3);
  };

  const handleVerifyPan = async (pan: string) => {
    const cleanPan = pan.trim().toUpperCase();
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(cleanPan)) {
      toast.error("Enter a valid PAN number.");
      return undefined;
    }
    const response = await verifyPan.mutateAsync({ pan: cleanPan });
    const latest = await refetchKyc();
    const verifiedName =
      response.data?.panHolderName ||
      response.data?.fullname ||
      latest.data?.panHolderName ||
      latest.data?.fullname;

    if (!verifiedName) {
      toast.error("PAN verified, but holder name was not received.");
      return undefined;
    }

    setCurrentStep(3);
    return verifiedName;
  };

  const handleVerifyBank = async (account: string, ifsc: string) => {
    const cleanAccount = account.trim();
    const cleanIfsc = ifsc.trim().toUpperCase();
    if (!/^\d{9,18}$/.test(cleanAccount)) {
      toast.error("Bank account number must be 9 to 18 digits.");
      return undefined;
    }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(cleanIfsc)) {
      toast.error("Enter a valid IFSC code.");
      return undefined;
    }
    const response = await verifyBank.mutateAsync({ account: cleanAccount, ifsc: cleanIfsc, phone: profile?.mobile || "" });
    const latest = await refetchKyc();
    const verifiedName =
      response.data?.bankHolderName ||
      response.data?.fullname ||
      latest.data?.bankHolderName ||
      latest.data?.fullname;

    if (!verifiedName) {
      toast.error("Bank verified, but account holder name was not received.");
      return undefined;
    }

    setCurrentStep(4);
    return verifiedName;
  };

  const handleUploadVideo = async (video: File) => {
    await uploadKycVideo.mutateAsync(video);
    navigate(APP_ROUTES.kycStatus);
  };

  const stepMeta = KYC_STEPS[currentStep - 1];

  return (
    <div className="min-h-dvh bg-slate-50 pb-8 font-sans text-slate-900">
      <div className="bg-slate-950 px-5 pb-7 pt-6 text-white">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
          MR verification
        </p>
        <h1 className="mt-1 text-2xl font-bold">Complete Your KYC</h1>
        <p className="mt-1 text-sm text-slate-300">
          Aadhaar OTP comes to the linked mobile, then PAN, bank, and video KYC are verified before admin review.
        </p>
      </div>

      <div className="px-4">
        <KycStepper currentStep={currentStep} />

        <div className="mt-4 rounded-lg bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
              <stepMeta.icon size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold">{stepMeta.label}</h2>
              <p className="text-sm text-slate-500">Step {currentStep} of {KYC_STEPS.length}</p>
            </div>
          </div>

          {currentStep === 1 && (
            <AadhaarStep
              defaultAadhaar={kycState?.aadhaar}
              isPending={sendAadhaarOtp.isPending}
              onSubmit={handleSendOtp}
            />
          )}
          {currentStep === 2 && (
            <OtpStep
              aadhaarNumber={aadhaarNumber}
              refId={refId}
              isVerifying={verifyAadhaarOtp.isPending}
              isResending={resendAadhaarOtp.isPending}
              onVerify={handleVerifyOtp}
              onResend={handleResendOtp}
              onBack={() => setCurrentStep(1)}
            />
          )}
          {currentStep === 3 && (
            <PanStep
              defaultPan={kycState?.pan}
              defaultName={kycState?.panHolderName}
              fullNameHint={profile?.fullName}
              isPending={verifyPan.isPending}
              onVerify={handleVerifyPan}
              onContinue={() => setCurrentStep(4)}
              onBack={() => setCurrentStep(2)}
            />
          )}
          {currentStep === 4 && (
            <BankStep
              defaultAccount={kycState?.bankAccountNumber}
              defaultIfsc={kycState?.ifscCode}
              defaultName={kycState?.bankHolderName || kycState?.panHolderName}
              fullNameHint={kycState?.panHolderName || profile?.fullName}
              isPending={verifyBank.isPending}
              onVerify={handleVerifyBank}
              onContinue={() => setCurrentStep(5)}
              onBack={() => setCurrentStep(3)}
            />
          )}
          {currentStep === 5 && (
            <VideoStep
              isPending={uploadKycVideo.isPending}
              onUpload={handleUploadVideo}
              onBack={() => setCurrentStep(4)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default KYCForm;
