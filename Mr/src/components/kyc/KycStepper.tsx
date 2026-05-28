import { Building2, CreditCard, Fingerprint, ShieldCheck, Video } from "lucide-react";
import type { KycStep } from "../../common/types/types";

export const KYC_STEPS = [
  { id: 1, label: "Aadhaar", icon: Fingerprint },
  { id: 2, label: "OTP", icon: ShieldCheck },
  { id: 3, label: "PAN", icon: CreditCard },
  { id: 4, label: "Bank", icon: Building2 },
  { id: 5, label: "Video", icon: Video },
] as const;

interface KycStepperProps {
  currentStep: KycStep;
}

const KycStepper = ({ currentStep }: KycStepperProps) => (
  <div className="-mt-4 grid grid-cols-5 gap-1 rounded-lg bg-white p-2 shadow-sm">
    {KYC_STEPS.map((step) => {
      const Icon = step.icon;
      const isDone = step.id < currentStep;
      const isActive = step.id === currentStep;

      return (
        <div
          key={step.id}
          className={`flex min-w-0 flex-col items-center rounded-md px-1 py-2 text-center ${
            isActive
              ? "bg-indigo-50 text-indigo-700"
              : isDone
                ? "text-emerald-600"
                : "text-slate-400"
          }`}
        >
          <Icon size={18} />
          <span className="mt-1 truncate text-[10px] font-semibold">{step.label}</span>
        </div>
      );
    })}
  </div>
);

export default KycStepper;
