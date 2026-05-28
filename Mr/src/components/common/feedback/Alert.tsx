import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";

interface AlertProps {
  type?: "info" | "success" | "warning" | "error";
  title?: string;
  message: string;
  action?: ReactNode;
  onClose?: () => void;
}

const styles = {
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "text-blue-600",
    text: "text-blue-900",
    Icon: Info,
  },
  success: {
    bg: "bg-green-50",
    border: "border-green-200",
    icon: "text-green-600",
    text: "text-green-900",
    Icon: CheckCircle2,
  },
  warning: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    icon: "text-yellow-600",
    text: "text-yellow-900",
    Icon: AlertCircle,
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    icon: "text-red-600",
    text: "text-red-900",
    Icon: XCircle,
  },
};

const Alert = ({
  type = "info",
  title,
  message,
  action,
  onClose,
}: AlertProps) => {
  const style = styles[type];
  const Icon = style.Icon;

  return (
    <div className={`rounded-lg border ${style.bg} ${style.border} p-4`}>
      <div className="flex gap-3">
        <Icon className={`h-5 w-5 ${style.icon} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          {title && (
            <h3 className={`font-semibold ${style.text}`}>{title}</h3>
          )}
          <p className={`text-sm ${style.text}`}>{message}</p>
          {action && <div className="mt-3">{action}</div>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <XCircle className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
