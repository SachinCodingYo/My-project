import type { FancyNumber } from "../../../common/types/types";
import { formatDateIndian } from "../../../utils/dateFormat";
import Modal from "../../common/modal/Modal";

type Props = {
  fancyNumber: FancyNumber;
  onClose: () => void;
};

const ViewFancyNumberModal = ({ fancyNumber, onClose }: Props) => {
  return (
    <Modal onClose={onClose} width="420px">
      <h2 className="text-lg font-semibold mb-4">Fancy Number Details</h2>

      <div className="space-y-4">
        <div>
          <p className="text-gray-400 text-sm">Number</p>
          <p>{fancyNumber.number}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Operator</p>
          <p>{fancyNumber.operatorId?.name || "-"}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">VIP Category</p>
          <p>{fancyNumber.vipCategoryId?.name || "-"}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Original Price</p>
          <p>Rs. {fancyNumber.price}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Sale Price</p>
          <p>Rs. {fancyNumber.salePrice}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Status</p>
          <p>{fancyNumber.isActive ? "Active" : "Inactive"}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Availability</p>
          <p>{fancyNumber.isAvailable ? "Available" : "Unavailable"}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Created</p>
          <p>{formatDateIndian(fancyNumber.createdAt)}</p>
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

export default ViewFancyNumberModal;
