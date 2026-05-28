import Modal from "../../common/modal/Modal";
import type { PlanTag } from "../../../common/types/types";

type Props = {
  planTag: PlanTag;
  onClose: () => void;
};

const ViewPlanTagModal = ({ planTag, onClose }: Props) => {
  return (
    <Modal onClose={onClose} width="380px">

      <h2 className="text-lg font-semibold mb-4">
        Plan Tag Details
      </h2>

      <div className="space-y-4">

        <div>
          <p className="text-gray-400 text-sm">Name</p>
          <p>{planTag.name}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Slug</p>
          <p>{planTag.slug}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Status</p>
          <p>{planTag.isActive ? "Active" : "Inactive"}</p>
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

export default ViewPlanTagModal;