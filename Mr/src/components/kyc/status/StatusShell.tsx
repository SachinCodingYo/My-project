import type { ReactNode } from "react";

interface StatusShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const StatusShell = ({ title, subtitle, children }: StatusShellProps) => (
  <div className="min-h-dvh bg-slate-50 pb-8 font-sans text-slate-900">
    <div className="bg-slate-950 px-5 pb-7 pt-6 text-white">
      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
        Verification
      </p>
      <h1 className="mt-1 text-2xl font-bold">{title}</h1>
      <p className="mt-1 text-sm text-slate-300">{subtitle}</p>
    </div>
    <div className="px-4 pt-4">{children}</div>
  </div>
);

export default StatusShell;
