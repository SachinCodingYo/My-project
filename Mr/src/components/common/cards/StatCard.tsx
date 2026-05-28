import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  iconClassName: string;
}

const StatCard = ({ label, value, icon: Icon, iconClassName }: StatCardProps) => {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${iconClassName}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{label}</div>
    </div>
  );
};

export default StatCard;
