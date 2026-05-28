import { useState } from "react";
import { Check, Truck } from "lucide-react";
import PageHeader from "../common/layout/PageHeader";

interface DeliveryRow {
  service: string;
  charge: number;
}

const initialDelivery: DeliveryRow[] = [
  { service: "New Connection", charge: 0 },
  { service: "Port", charge: 0 },
  { service: "Business SIM", charge: 0 },
  { service: "SIM Replacement", charge: 49 },
  { service: "eSIM", charge: 0 },
];

const Settings = () => {
  const [delivery, setDelivery] = useState<DeliveryRow[]>(initialDelivery);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // TODO: wire to API
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <PageHeader title="Settings" />

      <div className="mx-auto mt-6">
        <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-6 space-y-5">

          {/* Icon + heading */}
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-600/20 rounded-lg">
              <Truck size={18} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Delivery Charges</p>
              <p className="text-xs text-gray-400">
                Set charge (₹) per service. Enter 0 for free delivery.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800" />

          {/* Rows */}
          <div className="divide-y divide-gray-800/60">
            {delivery.map((row, i) => (
              <div
                key={row.service}
                className="flex items-center justify-between py-3"
              >
                <p className="text-sm font-medium text-gray-200">
                  {row.service}
                </p>

                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">₹</span>
                  <input
                    type="number"
                    min={0}
                    value={row.charge}
                    onChange={(e) => {
                      const updated = [...delivery];
                      updated[i] = {
                        ...updated[i],
                        charge: Number(e.target.value),
                      };
                      setDelivery(updated);
                    }}
                    className="w-24 bg-[#020617] border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white text-center focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Save button full width */}
          <div className="border-t border-gray-800 pt-4 flex justify-center">
            <button
              onClick={handleSave}
              className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-colors ${saved
                  ? "bg-green-600/20 text-green-400 border border-green-600/30"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
            >
              {saved ? (
                <>
                  <Check size={15} />
                  Changes Saved
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;