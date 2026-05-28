import type { OrderStatus } from "../../common/types/types";
import { formatStatus } from "../../utils/format";

const steps: OrderStatus[] = [
  "PENDING",
  "ASSIGNED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "ESIM_ACTIVATED",
];

interface OrderTimelineProps {
  currentStatus: OrderStatus;
}

const OrderTimeline = ({ currentStatus }: OrderTimelineProps) => {
  const currentIndex = steps.indexOf(currentStatus);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-base font-semibold text-slate-900">Status Timeline</h3>
      <div className="space-y-4">
        {steps.map((step, index) => {
          const completed = currentIndex >= index;
          const active = currentIndex === index;

          return (
            <div key={step} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={[
                    "flex h-4 w-4 items-center justify-center rounded-full border-2",
                    completed ? "border-brand-600 bg-brand-600" : "border-slate-300 bg-white",
                    active ? "animate-pulse ring-4 ring-brand-100" : "",
                  ].join(" ")}
                />
                {index !== steps.length - 1 ? (
                  <span className={`mt-1 h-10 w-px ${completed ? "bg-brand-300" : "bg-slate-200"}`} />
                ) : null}
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-800">{formatStatus(step)}</div>
                <div className="text-xs text-slate-500">
                  {step === currentStatus ? "Current stage" : completed ? "Completed" : "Upcoming"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
