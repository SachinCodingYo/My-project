import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const TableCard = ({ children }: Props) => {
  return (
    <div className="bg-[#0f172a] rounded-xl border border-gray-800 overflow-hidden">
      {children}
    </div>
  );
};

export default TableCard;