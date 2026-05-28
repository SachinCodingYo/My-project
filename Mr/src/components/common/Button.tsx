import type { ButtonHTMLAttributes, ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  fullWidth?: boolean;
}

const variantStyles = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-soft",
  secondary: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
  danger: "bg-red-500 text-white hover:bg-red-600",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
};

const Button = ({
  children,
  className = "",
  loading = false,
  variant = "primary",
  fullWidth = false,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all active:scale-[0.98]",
        variantStyles[variant],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...props}
    >
      {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
};

export default Button;
