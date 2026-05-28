import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import KycField from "../shared/KycField";
import { KycPrimaryButton, KycSecondaryButton } from "../shared/KycButtons";

interface OtpStepProps {
  aadhaarNumber: string;
  refId: string;
  isVerifying: boolean;
  isResending: boolean;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  onBack: () => void;
}

const OtpStep = ({
  aadhaarNumber,
  refId,
  isVerifying,
  isResending,
  onVerify,
  onResend,
  onBack,
}: OtpStepProps) => {
  const [otpValue, setOtpValue] = useState("");
  const [resendCountdown, setResendCountdown] = useState(60);
  const timerRef = useRef<number | null>(null);

  const startTimer = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setResendCountdown(60);
    timerRef.current = window.setInterval(() => {
      setResendCountdown((c) => {
        if (c <= 1) {
          window.clearInterval(timerRef.current!);
          timerRef.current = null;
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResend = async () => {
    await onResend();
    startTimer();
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        OTP was sent to the mobile linked with Aadhaar ending in{" "}
        <strong>{aadhaarNumber.slice(-4)}</strong>.
      </p>
      <KycField label="Reference ID">
        <input className="kyc-input bg-slate-50" value={refId} readOnly />
      </KycField>
      <KycField label="OTP">
        <input
          className="kyc-input text-center text-xl font-bold tracking-[0.35em]"
          inputMode="numeric"
          maxLength={6}
          placeholder="000000"
          value={otpValue}
          onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
        />
      </KycField>

      <div className="text-center">
        {resendCountdown > 0 ? (
          <p className="text-xs text-slate-500">
            Resend OTP in <strong>{resendCountdown}s</strong>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
          >
            {isResending ? "Sending..." : "Resend OTP"}
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <KycSecondaryButton type="button" onClick={onBack}>
          <ArrowLeft size={16} /> Back
        </KycSecondaryButton>
        <KycPrimaryButton
          type="button"
          loading={isVerifying}
          disabled={otpValue.length !== 6}
          onClick={() => onVerify(otpValue)}
        >
          Verify OTP <ArrowRight size={16} />
        </KycPrimaryButton>
      </div>
    </div>
  );
};

export default OtpStep;
