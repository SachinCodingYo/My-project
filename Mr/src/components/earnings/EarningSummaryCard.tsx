import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconClassName: string;
  helper?: string;
};

const EarningSummaryCard = ({
  label,
  value,
  icon: Icon,
  iconClassName,
  helper,
}: Props) => {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div
        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${iconClassName}`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{label}</div>
      {helper ? <div className="mt-3 text-xs text-slate-400">{helper}</div> : null}
    </div>
  );
};

export default EarningSummaryCard;
