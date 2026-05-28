import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck } from "lucide-react";
import KycField from "../shared/KycField";
import { KycPrimaryButton, KycSecondaryButton } from "../shared/KycButtons";

interface BankStepProps {
  defaultAccount?: string;
  defaultIfsc?: string;
  defaultName?: string;
  fullNameHint?: string;
  isPending: boolean;
  onVerify: (account: string, ifsc: string) => Promise<string | undefined>;
  onContinue: () => void;
  onBack: () => void;
}

const BankStep = ({
  defaultAccount,
  defaultIfsc,
  defaultName,
  fullNameHint,
  isPending,
  onVerify,
  onContinue,
  onBack,
}: BankStepProps) => {
  const [bankAccount, setBankAccount] = useState(defaultAccount ?? "");
  const [ifsc, setIfsc] = useState(defaultIfsc ?? "");
  const [bankName, setBankName] = useState(defaultName ?? "");
  const [verifiedKey, setVerifiedKey] = useState(
    defaultName && defaultAccount && defaultIfsc ? `${defaultAccount}|${defaultIfsc}` : ""
  );

  const currentKey = `${bankAccount}|${ifsc}`;
  const isVerified = Boolean(bankName) && verifiedKey === currentKey;

  useEffect(() => {
    setBankAccount(defaultAccount ?? "");
    setIfsc(defaultIfsc ?? "");
    setBankName(defaultName ?? "");
    setVerifiedKey(defaultName && defaultAccount && defaultIfsc ? `${defaultAccount}|${defaultIfsc}` : "");
  }, [defaultAccount, defaultIfsc, defaultName]);

  const handleAccountChange = (value: string) => {
    const nextAccount = value.replace(/\D/g, "");
    setBankAccount(nextAccount);
    if (`${nextAccount}|${ifsc}` !== verifiedKey) {
      setBankName("");
    }
  };

  const handleIfscChange = (value: string) => {
    const nextIfsc = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    setIfsc(nextIfsc);
    if (`${bankAccount}|${nextIfsc}` !== verifiedKey) {
      setBankName("");
    }
  };

  const handleVerify = async () => {
    const verifiedName = await onVerify(bankAccount, ifsc);
    if (verifiedName) {
      setBankName(verifiedName);
      setVerifiedKey(`${bankAccount}|${ifsc}`);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Enter bank account details and verify to fetch the account holder name.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <KycField label="Account Number">
          <input
            className="kyc-input"
            inputMode="numeric"
            maxLength={18}
            value={bankAccount}
            onChange={(e) => handleAccountChange(e.target.value)}
          />
        </KycField>
        <KycField label="IFSC Code">
          <input
            className="kyc-input uppercase"
            maxLength={11}
            value={ifsc}
            onChange={(e) => handleIfscChange(e.target.value)}
          />
        </KycField>
      </div>
      <KycPrimaryButton
        type="button"
        full
        loading={isPending}
        disabled={isVerified}
        onClick={handleVerify}
      >
        {isVerified ? (
          <>
            Bank Verified <BadgeCheck size={16} />
          </>
        ) : (
          "Verify Bank Details"
        )}
      </KycPrimaryButton>
      <KycField label="Account Holder Name">
        <input
          className="kyc-input bg-slate-50"
          value={bankName}
          readOnly
          placeholder={fullNameHint ?? "Verify bank details to fetch name"}
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

export default BankStep;
