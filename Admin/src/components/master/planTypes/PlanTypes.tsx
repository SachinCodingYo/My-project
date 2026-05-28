import { useState } from "react";
import { Eye, Pencil, Trash } from "lucide-react";
import type { PlanType } from "../../../common/types/types";

import {
  usePlanTypes,
  useDeletePlanType,
  useUpdatePlanType,
} from "../../../hooks/usePlanTypes";

import AddPlanTypeModal from "./AddPlanTypeModal";
import ViewPlanTypeModal from "./ViewPlanTypeModal";
import { confirmDialog } from "../../../utils/confirmDialog";

import PageHeader from "../../common/layout/PageHeader";
import SearchInput from "../../common/inputs/SearchInput";
import TableCard from "../../common/table/TableCard";
import StatusBadge from "../../common/badges/StatusBadge";
import ToggleSwitch from "../../common/toggle/ToggleSwitch";
import DataTable from "../../common/table/DataTable";
import MobileList from "../../common/table/MobileList";

const PlanTypes = () => {
  const { data, isLoading } = usePlanTypes();
  const { mutateAsync: deletePlanType } = useDeletePlanType();
  const { mutateAsync: updatePlanType } = useUpdatePlanType();

  const planTypes: PlanType[] = data?.data || [];

  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedPlanType, setSelectedPlanType] = useState<PlanType | null>(null);
  const [editPlanType, setEditPlanType] = useState<PlanType | null>(null);

  // ✅ Filter
  const filteredPlanTypes = search
    ? planTypes.filter((plan) =>
      plan.name.toLowerCase().includes(search.trim().toLowerCase())
    )
    : planTypes;

  // ✅ Delete
  const handleDelete = async (id: string) => {
    const confirmed = await confirmDialog(
      "delete",
      "Delete Plan Type?",
      "This plan type will be permanently removed."
    );

    if (!confirmed) return;

    await deletePlanType(id);
  };

  // ✅ Toggle
  const handleToggleStatus = async (planType: PlanType) => {
    if (planType.isActive) {
      const confirmed = await confirmDialog(
        "disable",
        "Disable Plan Type?",
        "This plan type will no longer be available."
      );

      if (!confirmed) return;
    }

    await updatePlanType({
      id: planType._id,
      data: {
        name: planType.name,
        slug: planType.slug,
        isActive: !planType.isActive,
      },
    });
  };

  // ✅ Loading
  if (isLoading) {
    return (
      <div className="bg-[#0f172a] rounded-xl p-6 border border-gray-800">
        <p className="text-gray-400">Loading plan types...</p>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <PageHeader title="Plan Types">
        <div className="flex items-center gap-3 max-md:flex-col max-md:items-stretch">

          <div className="w-full md:w-64">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search plan type..."
            />
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm max-md:w-full"
          >
            + Add Plan Type
          </button>

        </div>
      </PageHeader>

      <TableCard>

        {/* ✅ Desktop Table (Reusable) */}
        <DataTable
          headers={["Name", "Status", "Action"]}
          isEmpty={filteredPlanTypes.length === 0}
          emptyText="No plan types found"
        >
          {filteredPlanTypes.map((plan) => (
            <tr
              key={plan._id}
              className="border-t border-gray-800 hover:bg-[#020617]"
            >
              <td className="px-6 py-4 font-medium">{plan.name}</td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <ToggleSwitch
                    checked={plan.isActive}
                    onChange={() => handleToggleStatus(plan)}
                  />
                  <StatusBadge isActive={plan.isActive} />
                </div>
              </td>

              <td className="px-6 py-4 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedPlanType(plan)}
                  className="p-2 rounded-lg hover:bg-gray-800"
                >
                  <Eye size={16} />
                </button>

                <button
                  onClick={() => setEditPlanType(plan)}
                  className="p-2 rounded-lg hover:bg-gray-800"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => handleDelete(plan._id)}
                  className="p-2 rounded-lg hover:bg-gray-800 text-red-400"
                >
                  <Trash size={16} />
                </button>
              </td>
            </tr>
          ))}
        </DataTable>

        {/* ✅ Mobile List (Reusable) */}
        <MobileList
          data={filteredPlanTypes}
          emptyText="No plan types found"
          renderItem={(plan) => (
            <div className="bg-[#020617] border border-gray-800 rounded-xl p-4 shadow-sm">

              {/* Top */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{plan.name}</p>
                  <p className="text-xs text-gray-400">Plan Type</p>
                </div>

                <button
                  onClick={() => setSelectedPlanType(plan)}
                  className="p-2 rounded-lg hover:bg-gray-800 text-indigo-400"
                >
                  <Eye size={18} />
                </button>
              </div>

              <div className="border-t border-gray-800 my-3"></div>

              {/* Bottom */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ToggleSwitch
                    checked={plan.isActive}
                    onChange={() => handleToggleStatus(plan)}
                  />
                  <StatusBadge isActive={plan.isActive} />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditPlanType(plan)}
                    className="p-2 rounded-lg hover:bg-gray-800"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(plan._id)}
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
      {openModal && (
        <AddPlanTypeModal onClose={() => setOpenModal(false)} />
      )}

      {selectedPlanType && (
        <ViewPlanTypeModal
          planType={selectedPlanType}
          onClose={() => setSelectedPlanType(null)}
        />
      )}

      {editPlanType && (
        <AddPlanTypeModal
          planType={editPlanType}
          onClose={() => setEditPlanType(null)}
        />
      )}
    </div>
  );
};

export default PlanTypes;