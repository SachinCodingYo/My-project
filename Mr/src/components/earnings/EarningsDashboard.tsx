import {
  Bike,
  CheckCircle2,
  IndianRupee,
  TimerReset,
  Wallet,
} from "lucide-react";
import { Alert, LoadingSkeleton } from "../common";
import EarningSummaryCard from "./EarningSummaryCard";
import { useMrDashboardSummary } from "../../hooks/useEarnings";

const formatCurrency = (value?: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);

const formatDistance = (value?: number) =>
  `${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 1,
  }).format(value ?? 0)} km`;

const EarningsDashboard = () => {
  const { data, isLoading, isError, refetch, isFetching } =
    useMrDashboardSummary();

  const summary = data?.data;

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return (
      <Alert
        type="error"
        title="Unable to load earnings"
        message="Please check your connection and try again."
        action={
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Retry
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <EarningSummaryCard
          label="Total Earned"
          value={formatCurrency(summary?.totalEarned)}
          icon={IndianRupee}
          iconClassName="bg-green-50 text-green-600"
        />
        <EarningSummaryCard
          label="Pending Payout"
          value={formatCurrency(summary?.pendingPayout)}
          icon={TimerReset}
          iconClassName="bg-yellow-50 text-yellow-600"
        />
        <EarningSummaryCard
          label="Paid Amount"
          value={formatCurrency(summary?.paidAmount)}
          icon={Wallet}
          iconClassName="bg-blue-50 text-blue-600"
        />
        <EarningSummaryCard
          label="Total Deliveries"
          value={summary?.totalDeliveries ?? 0}
          icon={CheckCircle2}
          iconClassName="bg-emerald-50 text-emerald-600"
        />
        <EarningSummaryCard
          label="Distance Travelled"
          value={formatDistance(summary?.totalDistanceTravelled)}
          icon={Bike}
          iconClassName="bg-indigo-50 text-indigo-600"
          helper="Calculated by backend"
        />
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-slate-500 shadow-sm">
        {isFetching
          ? "Refreshing latest backend earnings..."
          : "Earnings are calculated automatically after delivered orders."}
      </div>
    </div>
  );
};

export default EarningsDashboard;
