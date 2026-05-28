import type { LucideIcon } from "lucide-react";
import Button from "../Button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>
      {actionLabel && onAction ? (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
};

export default EmptyState;
