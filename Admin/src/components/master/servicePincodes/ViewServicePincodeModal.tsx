import { useMemo, useState } from "react";
import { Trash2, UserPlus } from "lucide-react";
import type {
  AssignedMR,
  MR,
  ServicePincode,
} from "../../../common/types/types";
import {
  useAssignMRToServicePincode,
  useUnassignMRFromServicePincode,
  useServicePincodes,
} from "../../../hooks/useServicePincodes";
import { useMRs } from "../../../hooks/useMRs";
import { confirmDialog } from "../../../utils/confirmDialog";
import { formatDateIndian } from "../../../utils/dateFormat";
import Modal from "../../common/modal/Modal";
import StatusBadge from "../../common/badges/StatusBadge";

type Props = {
  pincode: ServicePincode;
  onClose: () => void;
};

const ViewServicePincodeModal = ({ pincode, onClose }: Props) => {
  const [selectedMRId, setSelectedMRId] = useState("");

  const { data: pincodesData } = useServicePincodes();
  const { data: mrsData } = useMRs();
  const { mutateAsync: assignMR, isPending: isAssigning } =
    useAssignMRToServicePincode();
  const { mutateAsync: unassignMR, isPending: isUnassigning } =
    useUnassignMRFromServicePincode();

  // always use live data from cache so the list refreshes after assign/unassign
  const livePincode: ServicePincode =
    (pincodesData?.data as ServicePincode[])?.find(
      (p) => p._id === pincode._id
    ) ?? pincode;

  const allMRs: MR[] = mrsData?.data?.results ?? [];

  const assignedIds = useMemo(
    () => new Set(livePincode.assignedMRs.map((mr: AssignedMR) => mr._id)),
    [livePincode.assignedMRs]
  );

  const availableMRs = useMemo(
    () => allMRs.filter((mr) => !assignedIds.has(mr._id) && mr.isActive),
    [allMRs, assignedIds]
  );

  const handleAssign = async () => {
    if (!selectedMRId) return;
    await assignMR({ pincodeId: livePincode._id, mrId: selectedMRId });
    setSelectedMRId("");
  };

  const handleUnassign = async (mr: AssignedMR) => {
    const confirmed = await confirmDialog(
      "disable",
      "Unassign MR?",
      `${mr.fullName} will be removed from pincode ${livePincode.pincode}.`
    );
    if (!confirmed) return;
    await unassignMR({ pincodeId: livePincode._id, mrId: mr._id });
  };

  return (
    <Modal onClose={onClose} width="500px">
      <h2 className="text-lg font-semibold mb-4">Service Pincode Details</h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-400 text-sm">Pincode</p>
          <p className="font-mono font-semibold text-base">{livePincode.pincode}</p>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-gray-400 text-sm">Status</p>
          <StatusBadge isActive={livePincode.isActive} />
        </div>

        <div className="flex justify-between items-center">
          <p className="text-gray-400 text-sm">Created</p>
          <p className="text-sm">{formatDateIndian(livePincode.createdAt)}</p>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-4 mb-4">
        <p className="text-sm font-medium mb-3">
          Assigned MRs ({livePincode.assignedMRs.length})
        </p>

        {livePincode.assignedMRs.length === 0 ? (
          <p className="text-gray-500 text-sm">No MRs assigned yet.</p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {livePincode.assignedMRs.map((mr: AssignedMR) => (
              <div
                key={mr._id}
                className="flex items-center justify-between bg-[#020617] border border-gray-800 rounded-lg px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium">{mr.fullName}</p>
                  <p className="text-xs text-gray-400">{mr.mobile}</p>
                </div>

                <button
                  onClick={() => handleUnassign(mr)}
                  disabled={isUnassigning}
                  className="p-1.5 rounded-lg hover:bg-gray-800 text-red-400"
                  title="Unassign MR"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-800 pt-4">
        <p className="text-sm font-medium mb-3">Assign New MR</p>

        <div className="flex gap-2">
          <select
            value={selectedMRId}
            onChange={(e) => setSelectedMRId(e.target.value)}
            className="flex-1 bg-[#020617] border border-gray-700 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Select an MR</option>
            {availableMRs.map((mr) => (
              <option key={mr._id} value={mr._id}>
                {mr.fullName} — {mr.mobile}
              </option>
            ))}
          </select>

          <button
            onClick={handleAssign}
            disabled={!selectedMRId || isAssigning}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg text-sm"
          >
            <UserPlus size={14} />
            {isAssigning ? "Assigning..." : "Assign"}
          </button>
        </div>

        {availableMRs.length === 0 && (
          <p className="text-gray-500 text-xs mt-2">
            All active MRs are already assigned to this pincode.
          </p>
        )}
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-700 rounded-lg text-sm"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default ViewServicePincodeModal;
