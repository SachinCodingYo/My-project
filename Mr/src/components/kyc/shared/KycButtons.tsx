import type { ButtonHTMLAttributes } from "react";
import { RefreshCw } from "lucide-react";

// For form steps — sits in a `flex gap-2` row, takes equal width
export const KycPrimaryButton = ({
  children,
  loading,
  full,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean; full?: boolean }) => (
  <button
    {...props}
    disabled={loading || props.disabled}
    className={`flex h-12 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-bold text-white transition hover:bg-indigo-500 disabled:opacity-60 ${full ? "w-full" : "flex-1"}`}
  >
    {loading ? "Please wait..." : children}
  </button>
);

// For form steps — secondary action in a `flex gap-2` row
export const KycSecondaryButton = ({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-slate-100 px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-200 disabled:opacity-60"
  >
    {children}
  </button>
);

// For status page — full-width refresh button
export const KycRefreshButton = ({
  onClick,
  loading,
}: {
  onClick: () => void;
  loading: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
  >
    <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
    {loading ? "Checking..." : "Check Status"}
  </button>
);
