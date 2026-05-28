import { useMemo, useState } from "react";
import { Eye, Pencil, Trash } from "lucide-react";
import type { ServicePincode } from "../../../common/types/types";
import {
  useServicePincodes,
  useDeleteServicePincode,
  useUpdateServicePincode,
} from "../../../hooks/useServicePincodes";
import { confirmDialog } from "../../../utils/confirmDialog";
import { formatDateIndian } from "../../../utils/dateFormat";
import AddServicePincodeModal from "./AddServicePincodeModal";
import ViewServicePincodeModal from "./ViewServicePincodeModal";
import PageHeader from "../../common/layout/PageHeader";
import SearchInput from "../../common/inputs/SearchInput";
import TableCard from "../../common/table/TableCard";
import DataTable from "../../common/table/DataTable";
import MobileList from "../../common/table/MobileList";
import ToggleSwitch from "../../common/toggle/ToggleSwitch";
import StatusBadge from "../../common/badges/StatusBadge";

const ServicePincodes = () => {
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedPincode, setSelectedPincode] = useState<ServicePincode | null>(null);
  const [editPincode, setEditPincode] = useState<ServicePincode | null>(null);

  const { data, isLoading } = useServicePincodes();
  const { mutateAsync: updateServicePincode } = useUpdateServicePincode();
  const { mutateAsync: deleteServicePincode } = useDeleteServicePincode();

  const pincodes: ServicePincode[] = data?.data ?? [];

  const filteredPincodes = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return pincodes;
    return pincodes.filter((item) =>
      item.pincode.toLowerCase().includes(q)
    );
  }, [pincodes, search]);

  const handleDelete = async (id: string) => {
    const confirmed = await confirmDialog(
      "delete",
      "Delete Service Pincode?",
      "This pincode and all its MR assignments will be permanently removed."
    );
    if (!confirmed) return;
    await deleteServicePincode(id);
  };

  const handleToggleActive = async (item: ServicePincode) => {
    if (item.isActive) {
      const confirmed = await confirmDialog(
        "disable",
        "Disable Service Pincode?",
        "This area will no longer be serviceable."
      );
      if (!confirmed) return;
    }
    await updateServicePincode({
      id: item._id,
      data: { isActive: !item.isActive },
    });
  };

  if (isLoading) {
    return (
      <div className="bg-[#0f172a] rounded-xl p-6 border border-gray-800">
        <p className="text-gray-400">Loading service pincodes...</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Service Pincodes">
        <div className="flex items-center gap-3 max-md:flex-col max-md:items-stretch">
          <div className="w-full md:w-64">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search pincode..."
            />
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm max-md:w-full"
          >
            + Add Pincode
          </button>
        </div>
      </PageHeader>

      <TableCard>
        <DataTable
          headers={[
            "Pincode",
            "Assigned MRs",
            "Status",
            "Created",
            "Action",
          ]}
          isEmpty={filteredPincodes.length === 0}
          emptyText="No service pincodes found"
        >
          {filteredPincodes.map((item) => (
            <tr
              key={item._id}
              className="border-t border-gray-800 hover:bg-[#020617]"
            >
              <td className="px-6 py-4 font-mono font-semibold">
                {item.pincode}
              </td>

              <td className="px-6 py-4">
                {item.assignedMRs.length === 0 ? (
                  <span className="text-gray-500 text-sm">None</span>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {item.assignedMRs.slice(0, 2).map((mr) => (
                      <span
                        key={mr._id}
                        className="text-xs bg-indigo-900/40 text-indigo-300 px-2 py-0.5 rounded-full"
                      >
                        {mr.fullName}
                      </span>
                    ))}
                    {item.assignedMRs.length > 2 && (
                      <span className="text-xs text-gray-400">
                        +{item.assignedMRs.length - 2} more
                      </span>
                    )}
                  </div>
                )}
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <ToggleSwitch
                    checked={item.isActive}
                    onChange={() => handleToggleActive(item)}
                  />
                  <StatusBadge isActive={item.isActive} />
                </div>
              </td>

              <td className="px-6 py-4 text-gray-400">
                {formatDateIndian(item.createdAt)}
              </td>

              <td className="px-6 py-4 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedPincode(item)}
                  className="p-2 rounded-lg hover:bg-gray-800"
                  title="View & Manage MRs"
                >
                  <Eye size={16} />
                </button>

                <button
                  onClick={() => setEditPincode(item)}
                  className="p-2 rounded-lg hover:bg-gray-800"
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 rounded-lg hover:bg-gray-800 text-red-400"
                  title="Delete"
                >
                  <Trash size={16} />
                </button>
              </td>
            </tr>
          ))}
        </DataTable>

        <MobileList
          data={filteredPincodes}
          emptyText="No service pincodes found"
          renderItem={(item) => (
            <div className="bg-[#020617] border border-gray-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono font-semibold text-sm">
                    {item.pincode}
                  </p>
                  <p className="text-xs text-gray-400">
                    {item.assignedMRs.length} MR
                    {item.assignedMRs.length !== 1 ? "s" : ""} assigned
                  </p>
                </div>

                <button
                  onClick={() => setSelectedPincode(item)}
                  className="p-2 rounded-lg hover:bg-gray-800 text-indigo-400"
                >
                  <Eye size={18} />
                </button>
              </div>

              <div className="border-t border-gray-800 my-3" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ToggleSwitch
                    checked={item.isActive}
                    onChange={() => handleToggleActive(item)}
                  />
                  <StatusBadge isActive={item.isActive} />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditPincode(item)}
                    className="p-2 rounded-lg hover:bg-gray-800"
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 rounded-lg hover:bg-gray-800 text-red-400"
                  >
                    <Trash size={15} />
                  </button>
                </div>
              </div>
            </div>
          )}
        />
      </TableCard>

      {openModal && (
        <AddServicePincodeModal onClose={() => setOpenModal(false)} />
      )}

      {editPincode && (
        <AddServicePincodeModal
          pincode={editPincode}
          onClose={() => setEditPincode(null)}
        />
      )}

      {selectedPincode && (
        <ViewServicePincodeModal
          pincode={selectedPincode}
          onClose={() => setSelectedPincode(null)}
        />
      )}
    </div>
  );
};

export default ServicePincodes;
