import { useState } from "react";
import { z } from "zod";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useValidatedForm } from "../../../hooks/useValidatedForm";
import KycField from "../shared/KycField";
import { KycPrimaryButton } from "../shared/KycButtons";

const aadhaarSchema = z.object({
  aadhaarNumber: z.string().regex(/^\d{12}$/, "Aadhaar must be 12 digits"),
});

type AadhaarFormData = z.infer<typeof aadhaarSchema>;

interface AadhaarStepProps {
  defaultAadhaar?: string;
  isPending: boolean;
  onSubmit: (aadhaarNumber: string) => Promise<void>;
}

const AadhaarStep = ({ defaultAadhaar, isPending, onSubmit }: AadhaarStepProps) => {
  const [showAadhaar, setShowAadhaar] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useValidatedForm<AadhaarFormData>({
    schema: aadhaarSchema,
    defaultValues: { aadhaarNumber: defaultAadhaar ?? "" },
  });

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values.aadhaarNumber))}
      className="space-y-4"
    >
      <p className="text-sm text-slate-600">
        Enter Aadhaar number to receive OTP on the linked mobile number.
      </p>
      <KycField label="Aadhaar Number" error={errors.aadhaarNumber?.message}>
        <div className="relative">
          <input
            className="kyc-input pr-12"
            inputMode="numeric"
            maxLength={12}
            type={showAadhaar ? "text" : "password"}
            placeholder="••••••••••••"
            onKeyDown={(e) => {
              const allowed = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Enter"];
              if (!allowed.includes(e.key) && !/^\d$/.test(e.key)) {
                e.preventDefault();
              }
            }}
            {...register("aadhaarNumber")}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-slate-500 transition hover:text-slate-800"
            onClick={() => setShowAadhaar((value) => !value)}
            aria-label={showAadhaar ? "Hide Aadhaar number" : "Show Aadhaar number"}
          >
            {showAadhaar ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </KycField>
      <p className="text-xs text-slate-400">12-digit number · only digits allowed</p>
      <KycPrimaryButton type="submit" loading={isPending}>
        Send OTP <ArrowRight size={16} />
      </KycPrimaryButton>
    </form>
  );
};

export default AadhaarStep;
