import { PageHeader } from "../components/common";
import EarningsDashboard from "../components/earnings/EarningsDashboard";

const Earnings = () => {
  return (
    <div className="space-y-4 animate-fadeIn">
      <PageHeader
        title="My Earnings"
        subtitle="Backend-calculated delivery earnings and payout summary."
      />

      <EarningsDashboard />
    </div>
  );
};

export default Earnings;
