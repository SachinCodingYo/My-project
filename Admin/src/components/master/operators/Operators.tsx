import { useState } from "react";
import AddOperatorModal from "./AddOperatorModal";
import { Eye, Pencil, Trash } from "lucide-react";
import {
  useOperators,
  useDeleteOperator,
  useUpdateOperator,
} from "../../../hooks/useOperators";
import ViewOperatorModal from "./ViewOperatorModal";
import type { Operator } from "../../../common/types/types";
import { confirmDialog } from "../../../utils/confirmDialog";

import PageHeader from "../../common/layout/PageHeader";
import TableCard from "../../common/table/TableCard";
import StatusBadge from "../../common/badges/StatusBadge";
import SearchInput from "../../common/inputs/SearchInput";
import ToggleSwitch from "../../common/toggle/ToggleSwitch";
import DataTable from "../../common/table/DataTable";
import MobileList from "../../common/table/MobileList";

const Operators = () => {
  const { data, isLoading } = useOperators();
  const { mutateAsync: deleteOperator } = useDeleteOperator();
  const { mutateAsync: updateOperator } = useUpdateOperator();

  const operators: Operator[] = data?.data ?? [];

  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [editOperator, setEditOperator] = useState<Operator | null>(null);

  // ✅ Filter
  const filteredOperators = search
    ? operators.filter((op) =>
      op.name.toLowerCase().includes(search.trim().toLowerCase())
    )
    : operators;

  // ✅ Delete
  const handleDelete = async (id: string) => {
    const confirmed = await confirmDialog(
      "delete",
      "Delete Operator?",
      "This operator will be permanently removed."
    );

    if (!confirmed) return;

    await deleteOperator(id);
  };

  // ✅ Toggle
  const handleToggleStatus = async (operator: Operator) => {
    if (operator.isActive) {
      const confirmed = await confirmDialog(
        "disable",
        "Disable Operator?",
        "This operator will no longer be active."
      );

      if (!confirmed) return;
    }

    const formData = new FormData();
    formData.append("name", operator.name);
    formData.append("slug", operator.slug || "");
    formData.append("isActive", String(!operator.isActive));

    await updateOperator({
      id: operator._id,
      data: formData,
    });
  };

  // ✅ Loading
  if (isLoading) {
    return (
      <div className="bg-[#0f172a] rounded-xl p-6 border border-gray-800">
        <p className="text-gray-400">Loading operators...</p>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <PageHeader title="Operators">
        <div className="flex items-center gap-3 max-md:flex-col max-md:items-stretch">

          <div className="w-full md:w-64">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search operator..."
            />
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm max-md:w-full"
          >
            + Add Operator
          </button>

        </div>
      </PageHeader>

      <TableCard>

        {/* ✅ Desktop Table */}
        <DataTable
          headers={["Logo", "Operator Name", "Status", "Action"]}
          isEmpty={filteredOperators.length === 0}
          emptyText="No operators found"
        >
          {filteredOperators.map((op) => (
            <tr
              key={op._id}
              className="border-t border-gray-800 hover:bg-[#020617]"
            >
              <td className="px-6 py-4">
                <img
                  src={op.logo}
                  alt={op.name}
                  className="w-8 h-8 object-contain"
                />
              </td>

              <td className="px-6 py-4 font-medium">{op.name}</td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <ToggleSwitch
                    checked={op.isActive}
                    onChange={() => handleToggleStatus(op)}
                  />
                  <StatusBadge isActive={op.isActive} />
                </div>
              </td>

              <td className="px-6 py-4 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedOperator(op)}
                  className="p-2 rounded-lg hover:bg-gray-800"
                >
                  <Eye size={16} />
                </button>

                <button
                  onClick={() => setEditOperator(op)}
                  className="p-2 rounded-lg hover:bg-gray-800"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => handleDelete(op._id)}
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
          data={filteredOperators}
          emptyText="No operators found"
          renderItem={(op) => (
            <div className="bg-[#020617] border border-gray-800 rounded-xl p-4 shadow-sm">

              {/* Top */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/5 p-2 rounded-lg">
                    <img
                      src={op.logo}
                      alt={op.name}
                      className="w-8 h-8 object-contain"
                    />
                  </div>

                  <div>
                    <p className="font-semibold text-sm">{op.name}</p>
                    <p className="text-xs text-gray-400">Operator</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedOperator(op)}
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
                    checked={op.isActive}
                    onChange={() => handleToggleStatus(op)}
                  />
                  <StatusBadge isActive={op.isActive} />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditOperator(op)}
                    className="p-2 rounded-lg hover:bg-gray-800"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(op._id)}
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
        <AddOperatorModal onClose={() => setOpenModal(false)} />
      )}

      {selectedOperator && (
        <ViewOperatorModal
          operator={selectedOperator}
          onClose={() => setSelectedOperator(null)}
        />
      )}

      {editOperator && (
        <AddOperatorModal
          operator={editOperator}
          onClose={() => setEditOperator(null)}
        />
      )}
    </div>
  );
};

export default Operators;