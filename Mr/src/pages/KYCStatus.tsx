import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight, BadgeCheck, Clock, XCircle } from "lucide-react";
import { LoadingSkeleton } from "../components/common";
import { useGetMyKYC } from "../hooks/useKYC";
import { APP_ROUTES } from "../constants/routes";
import type { LocalKycState } from "../common/types/types";
import StatusShell from "../components/kyc/status/StatusShell";
import StateCard from "../components/kyc/status/StateCard";
import ProgressList from "../components/kyc/status/ProgressList";
import { KycPrimaryButton, KycRefreshButton } from "../components/kyc/shared/KycButtons";

const getProgress = (kyc: LocalKycState) => [
  {
    label: "Aadhaar OTP sent",
    done: ["initiated", "aadhaar_verified", "pan_verified", "bank_verified", "video_uploaded", "pending", "approved", "rejected"].includes(kyc.status),
  },
  { label: "Aadhaar verified", done: Boolean(kyc.aadhaarVerified) },
  { label: "PAN verified", done: Boolean(kyc.panVerified) },
  { label: "Bank verified", done: Boolean(kyc.bankVerified) },
  { label: "Video submitted", done: Boolean(kyc.kycVideo || kyc.isVideoVerified) },
  { label: "Video verified", done: kyc.videoKycStatus === "verified" },
];

const KYCStatus = () => {
  const { data: kyc, isLoading, refetch, isFetching } = useGetMyKYC();
  const navigate = useNavigate();

  useEffect(() => {
    if (kyc?.status === "approved") navigate(APP_ROUTES.dashboard);
  }, [kyc?.status, navigate]);

  if (isLoading) return <LoadingSkeleton />;

  const state = kyc ?? { status: "not_submitted" as const, aadhaarVerified: false, panVerified: false, bankVerified: false };
  const progress = getProgress(state);
  const hasSubmittedVideo = Boolean(state.kycVideo) || state.status === "video_uploaded";
  const isVideoUnderReview =
    hasSubmittedVideo && state.videoKycStatus === "pending";
  const isVideoRejected = state.videoKycStatus === "failed";

  return (
    <StatusShell title="KYC Status" subtitle="Track your current verification state">
      {state.status === "not_submitted" && (
        <StateCard icon={<AlertCircle size={36} />} tone="indigo" title="Start your KYC" message="Begin Aadhaar OTP verification to unlock the rest of the KYC steps.">
          <KycPrimaryButton full onClick={() => navigate(APP_ROUTES.kycForm)}>
            Start KYC <ArrowRight size={16} />
          </KycPrimaryButton>
        </StateCard>
      )}

      {["initiated", "aadhaar_verified", "pan_verified", "bank_verified"].includes(state.status) && (
        <StateCard icon={<Clock size={36} />} tone="indigo" title="KYC in progress" message="Your Cashfree verification is underway. Continue the remaining steps to submit KYC for admin review.">
          <ProgressList items={progress} />
          <KycPrimaryButton full onClick={() => navigate(APP_ROUTES.kycForm)}>
            Continue KYC <ArrowRight size={16} />
          </KycPrimaryButton>
        </StateCard>
      )}

      {state.status === "pending" && (
        <StateCard icon={<Clock size={36} />} tone="amber" title="Awaiting admin approval" message="Aadhaar, PAN, bank, and video KYC are complete. Admin approval is now pending.">
          <ProgressList items={progress} />
          <div className="rounded-lg bg-amber-50 p-3 text-left text-sm text-amber-900">
            This page checks approval status automatically. Once admin approves, you will be redirected to the dashboard.
          </div>
          <KycRefreshButton onClick={() => refetch()} loading={isFetching} />
        </StateCard>
      )}

      {isVideoUnderReview && (
        <StateCard icon={<Clock size={36} />} tone="amber" title="Video KYC under review" message="Your recorded video has been submitted. Admin will review the video before final KYC approval begins.">
          <ProgressList items={progress} />
          <div className="rounded-lg bg-amber-50 p-3 text-left text-sm text-amber-900">
            You do not need to upload again unless admin rejects the video.
          </div>
          <KycRefreshButton onClick={() => refetch()} loading={isFetching} />
        </StateCard>
      )}

      {isVideoRejected && (
        <StateCard icon={<XCircle size={36} />} tone="red" title="Video KYC rejected" message="Please record and submit your KYC video again.">
          <ProgressList items={progress} />
          {state.rejectionReason && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-left">
              <p className="text-xs font-bold uppercase tracking-wide text-red-700">Rejection reason</p>
              <p className="mt-1 text-sm text-red-800">{state.rejectionReason}</p>
            </div>
          )}
          <KycPrimaryButton full onClick={() => navigate(APP_ROUTES.kycForm)}>
            Record Again <ArrowRight size={16} />
          </KycPrimaryButton>
        </StateCard>
      )}

      {state.status === "approved" && (
        <StateCard icon={<BadgeCheck size={36} />} tone="green" title="KYC approved" message="Your identity has been verified successfully.">
          <ProgressList items={progress} />
          <KycPrimaryButton full onClick={() => navigate(APP_ROUTES.dashboard)}>
            Go to Dashboard <ArrowRight size={16} />
          </KycPrimaryButton>
        </StateCard>
      )}

      {state.status === "rejected" && (
        <StateCard icon={<XCircle size={36} />} tone="red" title="KYC rejected" message="Please review the rejection reason and complete the KYC flow again.">
          <ProgressList items={progress} />
          {state.rejectionReason && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-left">
              <p className="text-xs font-bold uppercase tracking-wide text-red-700">Rejection reason</p>
              <p className="mt-1 text-sm text-red-800">{state.rejectionReason}</p>
            </div>
          )}
          <KycPrimaryButton full onClick={() => navigate(APP_ROUTES.kycForm)}>
            Retry KYC <ArrowRight size={16} />
          </KycPrimaryButton>
        </StateCard>
      )}
    </StatusShell>
  );
};

export default KYCStatus;
