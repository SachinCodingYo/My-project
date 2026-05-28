import Modal from "../common/modal/Modal";
import type { RedFlag } from "../../common/types/types";
import { formatDateIndian } from "../../utils/dateFormat";

type Props = {
  redFlag: RedFlag;
  onClose: () => void;
};

const ViewRedFlagModal = ({ redFlag, onClose }: Props) => {
  return (
    <Modal onClose={onClose} width="460px">
      <h2 className="text-lg font-semibold mb-6">Red Flag Details</h2>

      <div className="space-y-4 text-sm">
        <div>
          <p className="text-gray-400">Name</p>
          <p className="font-medium">{redFlag.fullName}</p>
        </div>

        <div>
          <p className="text-gray-400">Role</p>
          <p className="font-medium">{redFlag.role}</p>
        </div>

        <div>
          <p className="text-gray-400">Email</p>
          <p className="font-medium break-all">{redFlag.email}</p>
        </div>

        <div>
          <p className="text-gray-400">Mobile</p>
          <p className="font-medium">{redFlag.mobile}</p>
        </div>

        <div>
          <p className="text-gray-400">Reason</p>
          <p className="font-medium break-words">{redFlag.reason}</p>
        </div>

        <div>
          <p className="text-gray-400">Remarks</p>
          <p className="font-medium break-words">{redFlag.remarks || "-"}</p>
        </div>

        <div>
          <p className="text-gray-400">Created</p>
          <p className="font-medium">{formatDateIndian(redFlag.createdAt)}</p>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button onClick={onClose} className="px-4 py-2 bg-gray-700 rounded-lg">
          Close
        </button>
      </div>
    </Modal>
  );
};

export default ViewRedFlagModal;
