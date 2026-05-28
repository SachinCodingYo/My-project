import { CheckCircle2, Clock } from "lucide-react";

interface ProgressListProps {
  items: { label: string; done: boolean }[];
}

const ProgressList = ({ items }: ProgressListProps) => (
  <div className="rounded-lg bg-slate-50 p-3 text-left">
    {items.map((item) => (
      <div
        key={item.label}
        className="flex items-center gap-3 border-b border-slate-200 py-2 last:border-0"
      >
        {item.done ? (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
        ) : (
          <Clock className="h-5 w-5 shrink-0 text-slate-400" />
        )}
        <span className={`text-sm font-medium ${item.done ? "text-slate-800" : "text-slate-500"}`}>
          {item.label}
        </span>
      </div>
    ))}
  </div>
);

export default ProgressList;
