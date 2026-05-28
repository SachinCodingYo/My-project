import type { VipCategory } from "../../../common/types/types";
import Modal from "../../common/modal/Modal";

type Props = {
  category: VipCategory;
  onClose: () => void;
};

const ViewVIPCategoryModal = ({ category, onClose }: Props) => {
  return (
    <Modal onClose={onClose} width="420px">
      <h2 className="text-lg font-semibold mb-4">Category Details</h2>

      <div className="space-y-4">
        <div>
          <p className="text-gray-400 text-sm">Name</p>
          <p>{category.name}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Status</p>
          <p>{category.isActive ? "Active" : "Inactive"}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Created</p>
          <p>
            {category.createdAt
              ? new Date(category.createdAt).toLocaleDateString()
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

export default ViewVIPCategoryModal;