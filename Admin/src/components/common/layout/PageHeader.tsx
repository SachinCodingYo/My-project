import type { ReactNode } from "react";

type Props = {
  title: string;
  children?: ReactNode;
};

const PageHeader = ({ title, children }: Props) => {
  return (
    <div className="flex items-center justify-between mb-6 max-md:flex-col max-md:items-start max-md:gap-3">
      
      <h1 className="text-2xl font-semibold">{title}</h1>

      {children && (
        <div className="w-full md:w-auto">
          {children}
        </div>
      )}

    </div>
  );
};

export default PageHeader;