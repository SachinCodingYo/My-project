import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  showBackButton?: boolean;
}

const PageHeader = ({
  title,
  subtitle,
  action,
  showBackButton = false,
}: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        {showBackButton ? (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-1 rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        ) : null}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
        </div>
      </div>
      {action}
    </div>
  );
};

export default PageHeader;
