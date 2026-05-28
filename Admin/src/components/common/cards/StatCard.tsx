import type { ReactNode } from "react";

interface Props {
  title: string;
  value: number;
  icon: ReactNode;
}

const StatCard = ({ title, value, icon }: Props) => {
  return (
    <div className="w-full min-w-0 bg-[#020617] border border-gray-800 rounded-xl p-5 flex items-center justify-between transition-all duration-300 hover:border-indigo-500 hover:bg-[#020617]/80 hover:scale-[1.02]">

      <div className="min-w-0">
        <p className="text-sm text-gray-400 truncate">{title}</p>
        <h2 className="text-2xl font-semibold text-white mt-1">{value}</h2>
      </div>

      <div className="text-indigo-500 shrink-0">
        {icon}
      </div>

    </div>
  );
};

export default StatCard;