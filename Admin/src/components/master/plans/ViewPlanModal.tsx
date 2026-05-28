import type { Plan } from "../../../common/types/types";
import Modal from "../../common/modal/Modal";

type Props = {
  plan: Plan;
  onClose: () => void;
};

const ViewPlanModal = ({ plan, onClose }: Props) => {
  return (
    <Modal onClose={onClose} width="420px">

      <h2 className="text-lg font-semibold mb-4">Plan Details</h2>

      <div className="space-y-4">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {plan.operatorId?.logo && (
              <img
                src={plan.operatorId.logo}
                className="w-5 h-5 object-contain"
              />
            )}
            <p>{plan.operatorId?.name}</p>
          </div>

          <div className="flex items-center gap-2">
            {plan.isBusinessSim && (
              <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded font-medium">
                Business SIM
              </span>
            )}
            {plan.vipCategoryId && (
              <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-400 rounded">
                {plan.vipCategoryId.name}
              </span>
            )}
          </div>
        </div>

        {!plan.isBusinessSim && plan.simTypes && plan.simTypes.length > 0 && (
          <div>
            <p className="text-gray-400 text-sm">SIM Type</p>
            <div className="flex gap-2 mt-1">
              {plan.simTypes.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 text-xs bg-gray-700 rounded capitalize"
                >
                  {t === "esim" ? "eSIM" : "Physical"}
                </span>
              ))}
            </div>
          </div>
        )}

        {plan.isBusinessSim && plan.minQuantity && (
          <div>
            <p className="text-gray-400 text-sm">Minimum Quantity</p>
            <p>{plan.minQuantity} SIMs</p>
          </div>
        )}

        <div>
          <p className="text-gray-400 text-sm">Service</p>
          <p>{plan.serviceId?.name || "-"}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Plan Type</p>
          <p>{plan.planTypeId?.name}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Plan Tag</p>
          <p>{plan.planTagsId?.map(tag => tag.name).join(", ") || "-"}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Cost Price</p>
          <p>₹{plan.price}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Sale Price</p>
          <p>₹{plan.salePrice}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Validity</p>
          <p>{plan.validity} days</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Data</p>
          <p>{plan.data || "-"}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Calls</p>
          <p>{plan.calls || "-"}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">SMS</p>
          <p>{plan.sms || "-"}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Network</p>
          <p>{plan.networkType || "-"}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Benefits</p>
          {plan.benefits?.length ? (
            <ul className="list-disc ml-5">
              {plan.benefits.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          ) : (
            <p>-</p>
          )}
        </div>

        <div>
          <p className="text-gray-400 text-sm">Description</p>
          <p>{plan.description || "-"}</p>
        </div>

      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-700 rounded-lg"
        >
          Close
        </button>
      </div>

    </Modal>
  );
};

export default ViewPlanModal;
