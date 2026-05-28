import { useState } from "react";
import { Eye, MapPin, Pencil, Radar, Trash } from "lucide-react";

import { useMRs, useDeleteMR, useUpdateMR } from "../../hooks/useMRs";
import type { MR } from "../../common/types/types";

import AddMRModal from "./AddMRModal";
import ViewMRModal from "./ViewMRModal";
import ViewMRLocationModal from "./ViewMRLocationModal";
import NearbyMRSearchModal from "./NearbyMRSearchModal";
import { confirmDialog } from "../../utils/confirmDialog";
import ToggleSwitch from "../common/toggle/ToggleSwitch";
import { formatDateIndian } from "../../utils/dateFormat";

import PageHeader from "../common/layout/PageHeader";
import SearchInput from "../common/inputs/SearchInput";
import TableCard from "../common/table/TableCard";
import DataTable from "../common/table/DataTable";
import MobileList from "../common/table/MobileList";
import StatusBadge from "../common/badges/StatusBadge";

const MRs = () => {
  const { data, isLoading } = useMRs();
  const { mutateAsync: deleteMR } = useDeleteMR();
  const { mutateAsync: updateMR } = useUpdateMR();

  const mrs: MR[] = data?.data?.results ?? [];

  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedMR, setSelectedMR] = useState<MR | null>(null);
  const [editMR, setEditMR] = useState<MR | null>(null);
  const [locationMR, setLocationMR] = useState<MR | null>(null);
  const [nearbyOpen, setNearbyOpen] = useState(false);

  // ✅ Filter
  const filteredMRs = search
    ? mrs.filter((mr) =>
        mr.fullName.toLowerCase().includes(search.trim().toLowerCase())
      )
    : mrs;

  // ✅ Delete
  const handleDelete = async (id: string) => {
    const confirmed = await confirmDialog(
      "delete",
      "Delete MR?",
      "This MR will be permanently removed."
    );

    if (!confirmed) return;

    await deleteMR(id);
  };

  // ✅ Toggle
  const handleToggleStatus = async (mr: MR) => {
    if (mr.isActive) {
      const confirmed = await confirmDialog(
        "disable",
        "Disable MR?",
        "This MR will no longer be able to access the system."
      );

      if (!confirmed) return;
    }

    await updateMR({
      id: mr._id,
      data: {
        isActive: !mr.isActive,
      },
    });
  };

  // ✅ Loading
  if (isLoading) {
    return (
      <div className="bg-[#0f172a] rounded-xl p-6 border border-gray-800">
        <p className="text-gray-400">Loading MR list...</p>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <PageHeader title="MR Management">
        <div className="flex items-center gap-3 max-md:flex-col max-md:items-stretch">

          <div className="w-full md:w-64">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search MR..."
            />
          </div>

          <button
            onClick={() => setNearbyOpen(true)}
            className="flex items-center gap-2 border border-gray-700 hover:border-indigo-500 hover:text-indigo-400 px-4 py-2 rounded-lg text-sm max-md:w-full transition-colors"
          >
            <Radar size={15} />
            Nearby Search
          </button>

          <button
            onClick={() => setOpenModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm max-md:w-full"
          >
            + Add MR
          </button>

        </div>
      </PageHeader>

      <TableCard>

        {/* ✅ Desktop Table */}
        <DataTable
          headers={["Name", "Email", "Mobile", "Status", "Created", "Action"]}
          isEmpty={filteredMRs.length === 0}
          emptyText="No MR found"
        >
          {filteredMRs.map((mr) => (
            <tr
              key={mr._id}
              className="border-t border-gray-800 hover:bg-[#020617]"
            >
              <td className="px-6 py-4 font-medium">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full shrink-0 ${
                      mr.isOnline ? "bg-green-400" : "bg-gray-500"
                    }`}
                    title={mr.isOnline ? "Online" : "Offline"}
                  />
                  <span>{mr.fullName}</span>
                  {mr.isRedFlagged && (
                    <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400">
                      Red Flag
                    </span>
                  )}
                </div>
              </td>

              <td className="px-6 py-4 text-gray-400">{mr.email}</td>

              <td className="px-6 py-4 text-gray-400">{mr.mobile}</td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <ToggleSwitch
                    checked={mr.isActive}
                    onChange={() => handleToggleStatus(mr)}
                  />
                  <StatusBadge isActive={mr.isActive} />
                </div>
              </td>

              <td className="px-6 py-4 text-gray-400">
                {formatDateIndian(mr.createdAt)}
              </td>

              <td className="px-6 py-4 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedMR(mr)}
                  className="p-2 rounded-lg hover:bg-gray-800"
                >
                  <Eye size={16} />
                </button>

                <button
                  onClick={() => setEditMR(mr)}
                  className="p-2 rounded-lg hover:bg-gray-800"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => setLocationMR(mr)}
                  className="p-2 rounded-lg hover:bg-gray-800 text-cyan-400"
                  title="View Location"
                >
                  <MapPin size={16} />
                </button>

                <button
                  onClick={() => handleDelete(mr._id)}
                  className="p-2 rounded-lg hover:bg-gray-800 text-red-400"
                >
                  <Trash size={16} />
                </button>
              </td>
            </tr>
          ))}
        </DataTable>

        {/* ✅ Mobile List */}
        <MobileList
          data={filteredMRs}
          emptyText="No MR found"
          renderItem={(mr) => (
            <div className="bg-[#020617] border border-gray-800 rounded-xl p-4 shadow-sm">

              {/* Top */}
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-sm">{mr.fullName}</p>
                  {mr.isRedFlagged && (
                    <span className="mt-1 inline-flex rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400">
                      Red Flag
                    </span>
                  )}
                  <p className="text-xs text-gray-400">{mr.email}</p>
                </div>

                <button
                  onClick={() => setSelectedMR(mr)}
                  className="p-2 rounded-lg hover:bg-gray-800 text-indigo-400"
                >
                  <Eye size={18} />
                </button>
              </div>

              <div className="border-t border-gray-800 my-3"></div>

              {/* Middle */}
              <div className="text-sm text-gray-400 mb-2">
                {mr.mobile}
              </div>

              <div className="text-xs text-gray-400 mb-3">
                {formatDateIndian(mr.createdAt)}
              </div>

              {/* Bottom */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <ToggleSwitch
                    checked={mr.isActive}
                    onChange={() => handleToggleStatus(mr)}
                  />
                  <StatusBadge isActive={mr.isActive} />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setLocationMR(mr)}
                    className="p-2 rounded-lg hover:bg-gray-800 text-cyan-400"
                  >
                    <MapPin size={16} />
                  </button>

                  <button
                    onClick={() => setEditMR(mr)}
                    className="p-2 rounded-lg hover:bg-gray-800"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(mr._id)}
                    className="p-2 rounded-lg hover:bg-gray-800 text-red-400"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>

            </div>
          )}
        />

      </TableCard>

      {/* MODALS */}
      {openModal && <AddMRModal onClose={() => setOpenModal(false)} />}

      {selectedMR && (
        <ViewMRModal
          mr={selectedMR}
          onClose={() => setSelectedMR(null)}
        />
      )}

      {editMR && (
        <AddMRModal
          mr={editMR}
          onClose={() => setEditMR(null)}
        />
      )}

      {locationMR && (
        <ViewMRLocationModal
          mr={locationMR}
          onClose={() => setLocationMR(null)}
        />
      )}

      {nearbyOpen && (
        <NearbyMRSearchModal
          mrs={mrs}
          onClose={() => setNearbyOpen(false)}
        />
      )}
    </div>
  );
};

export default MRs;
