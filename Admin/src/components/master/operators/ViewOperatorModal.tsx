import type { Operator } from "../../../common/types/types";
import Modal from "../../common/modal/Modal";

type Props = {
  operator: Operator;
  onClose: () => void;
};

const ViewOperatorModal = ({ operator, onClose }: Props) => {
  return (
    <Modal onClose={onClose}>
      <h2 className="text-lg font-semibold mb-4">Operator Details</h2>

      <div className="space-y-4">
        {operator.logo && (
          <img
            src={operator.logo}
            alt={operator.name}
            className="w-16 h-16 object-contain"
          />
        )}

        <div>
          <p className="text-gray-400 text-sm">Name</p>
          <p>{operator.name}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Slug</p>
          <p>{operator.slug}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Created</p>
          <p>{new Date(operator.createdAt || "").toLocaleDateString()}</p>
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

export default ViewOperatorModal;