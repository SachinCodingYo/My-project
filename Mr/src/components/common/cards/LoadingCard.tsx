import type { ReactNode } from "react";
import Card from "./Card";

interface LoadingCardProps {
  title?: boolean;
  lines?: number;
  showAvatar?: boolean;
  action?: ReactNode;
}

const LoadingCard = ({
  title = false,
  lines = 3,
  showAvatar = false,
  action = false,
}: LoadingCardProps) => {
  return (
    <Card padding="md">
      <div className="animate-pulse space-y-4">
        {showAvatar && (
          <div className="flex gap-3">
            <div className="h-12 w-12 rounded-full bg-slate-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-20 rounded bg-slate-200" />
              <div className="h-3 w-32 rounded bg-slate-200" />
            </div>
          </div>
        )}

        {title && <div className="h-5 w-40 rounded bg-slate-200" />}

        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 rounded bg-slate-200" />
            <div className="h-4 w-5/6 rounded bg-slate-200" />
          </div>
        ))}

        {action && <div className="h-10 rounded bg-slate-200" />}
      </div>
    </Card>
  );
};

export default LoadingCard;
