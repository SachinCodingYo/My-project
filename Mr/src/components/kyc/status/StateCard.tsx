import type { ReactNode } from "react";

const toneClass = {
  green: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  amber: "bg-amber-50 text-amber-600 ring-amber-100",
  red: "bg-red-50 text-red-600 ring-red-100",
  indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
};

interface StateCardProps {
  icon: ReactNode;
  tone: keyof typeof toneClass;
  title: string;
  message: string;
  children: ReactNode;
}

const StateCard = ({ icon, tone, title, message, children }: StateCardProps) => (
  <div className="rounded-lg bg-white p-5 text-center shadow-sm">
    <div
      className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ring-8 ${toneClass[tone]}`}
    >
      {icon}
    </div>
    <h2 className="mt-5 text-xl font-bold">{title}</h2>
    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">{message}</p>
    <div className="mt-5 space-y-4">{children}</div>
  </div>
);

export default StateCard;
