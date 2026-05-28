import type { PlanType } from "../../../common/types/types";
import Modal from "../../common/modal/Modal";

type Props = {
  planType: PlanType;
  onClose: () => void;
};

const ViewPlanTypeModal = ({ planType, onClose }: Props) => {
  return (
    <Modal onClose={onClose} width="420px">

      <h2 className="text-lg font-semibold mb-4">
        Plan Type Details
      </h2>

      <div className="space-y-4">

        <div>
          <p className="text-gray-400 text-sm">Name</p>
          <p>{planType.name}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Slug</p>
          <p>{planType.slug}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Created</p>
          <p>
            {planType.createdAt
              ? new Date(planType.createdAt).toLocaleDateString()
              : "-"}
          </p>
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

export default ViewPlanTypeModal;