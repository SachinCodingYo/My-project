import type { ReactNode } from "react";
import Card from "../cards/Card";

interface FormSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  footerAction?: ReactNode;
}

const FormSection = ({
  title,
  description,
  children,
  footerAction,
}: FormSectionProps) => {
  return (
    <Card>
      {title && (
        <div className="mb-4">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>
      )}

      <div className="space-y-4">{children}</div>

      {footerAction && <div className="mt-5">{footerAction}</div>}
    </Card>
  );
};

export default FormSection;
