import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck } from "lucide-react";
import KycField from "../shared/KycField";
import { KycPrimaryButton, KycSecondaryButton } from "../shared/KycButtons";

interface PanStepProps {
  defaultPan?: string;
  defaultName?: string;
  fullNameHint?: string;
  isPending: boolean;
  onVerify: (pan: string) => Promise<string | undefined>;
  onContinue: () => void;
  onBack: () => void;
}

const PanStep = ({
  defaultPan,
  defaultName,
  fullNameHint,
  isPending,
  onVerify,
  onContinue,
  onBack,
}: PanStepProps) => {
  const [panNumber, setPanNumber] = useState(defaultPan ?? "");
  const [panName, setPanName] = useState(defaultName ?? "");
  const [verifiedPan, setVerifiedPan] = useState(defaultPan ?? "");

  useEffect(() => {
    setPanNumber(defaultPan ?? "");
    setPanName(defaultName ?? "");
    setVerifiedPan(defaultName ? defaultPan ?? "" : "");
  }, [defaultName, defaultPan]);

  const isVerified = Boolean(panName) && verifiedPan === panNumber;

  const handlePanChange = (value: string) => {
    const nextPan = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    setPanNumber(nextPan);
    if (nextPan !== verifiedPan) {
      setPanName("");
    }
  };

  const handleVerify = async () => {
    const verifiedName = await onVerify(panNumber);
    if (verifiedName) {
      setPanName(verifiedName);
      setVerifiedPan(panNumber);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Enter PAN number and verify it to fetch the name from Cashfree.
      </p>
      <KycField label="PAN Number">
        <div className="grid gap-2 sm:grid-cols-[1fr_180px]">
          <input
            className="kyc-input uppercase"
            maxLength={10}
            placeholder="ABCDE1234F"
            value={panNumber}
            onKeyDown={(e) => {
              const allowed = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Enter"];
              if (!allowed.includes(e.key) && !/^[a-zA-Z0-9]$/.test(e.key)) {
                e.preventDefault();
              }
            }}
            onChange={(e) => handlePanChange(e.target.value)}
          />
          <KycPrimaryButton
            type="button"
            loading={isPending}
            disabled={isVerified}
            onClick={handleVerify}
          >
            {isVerified ? (
              <>
                Verified <BadgeCheck size={16} />
              </>
            ) : (
              "Verify PAN"
            )}
          </KycPrimaryButton>
        </div>
      </KycField>
      <p className="text-xs text-slate-400">Format: ABCDE1234F · 5 letters, 4 digits, 1 letter</p>
      <KycField label="Name As Per PAN">
        <input
          className="kyc-input bg-slate-50"
          value={panName}
          readOnly
          placeholder={fullNameHint ?? "Verify PAN to fetch name"}
        />
      </KycField>
      <div className="flex gap-2">
        <KycSecondaryButton type="button" onClick={onBack}>
          <ArrowLeft size={16} /> Back
        </KycSecondaryButton>
        <KycPrimaryButton type="button" disabled={!isVerified} onClick={onContinue}>
          Continue <ArrowRight size={16} />
        </KycPrimaryButton>
      </div>
    </div>
  );
};

export default PanStep;
