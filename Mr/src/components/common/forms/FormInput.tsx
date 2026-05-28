import type { InputHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  error?: string;
  label?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const FormInput = ({
  icon: Icon,
  error,
  label,
  helperText,
  className = "",
  fullWidth = true,
  ...props
}: FormInputProps) => {
  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <div
        className={[
          "flex items-center gap-3 rounded-xl border px-4 transition-all",
          error
            ? "border-red-300 bg-red-50"
            : "border-slate-200 bg-slate-50 focus-within:border-brand-500 focus-within:bg-white",
          className,
        ].join(" ")}
      >
        {Icon && <Icon className="h-4 w-4 text-slate-400" />}
        <input
          className={[
            "w-full bg-transparent py-3 text-sm outline-none",
            error && "text-red-900 placeholder-red-400",
          ].join(" ")}
          {...props}
        />
      </div>

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
};

export default FormInput;
