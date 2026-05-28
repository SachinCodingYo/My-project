import type { ReactNode } from "react";

interface KycFieldProps {
  label: string;
  error?: string;
  children: ReactNode;
}

const KycField = ({ label, error, children }: KycFieldProps) => (
  <label className="block">
    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
      {label}
    </span>
    {children}
    {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
  </label>
);

export default KycField;
