import { useState } from "react";
import { Eye, Pencil, Trash } from "lucide-react";
import type { PlanTag } from "../../../common/types/types";

import {
  usePlanTags,
  useDeletePlanTag,
  useUpdatePlanTag,
} from "../../../hooks/usePlanTags";

import AddPlanTagModal from "./AddPlanTagModal";
import ViewPlanTagModal from "./ViewPlanTagModal";
import { confirmDialog } from "../../../utils/confirmDialog";

import PageHeader from "../../common/layout/PageHeader";
import SearchInput from "../../common/inputs/SearchInput";
import TableCard from "../../common/table/TableCard";
import StatusBadge from "../../common/badges/StatusBadge";
import ToggleSwitch from "../../common/toggle/ToggleSwitch";
import DataTable from "../../common/table/DataTable";
import MobileList from "../../common/table/MobileList";

const PlanTags = () => {
  const { data, isLoading } = usePlanTags();
  const { mutateAsync: deletePlanTag } = useDeletePlanTag();
  const { mutateAsync: updatePlanTag } = useUpdatePlanTag();

  const planTags: PlanTag[] = data?.data ?? [];

  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState<PlanTag | null>(null);
  const [editTag, setEditTag] = useState<PlanTag | null>(null);

  // ✅ Filter
  const filteredTags = search
    ? planTags.filter((tag) =>
      tag.name.toLowerCase().includes(search.trim().toLowerCase())
    )
    : planTags;

  // ✅ Delete
  const handleDelete = async (id: string) => {
    const confirmed = await confirmDialog(
      "delete",
      "Delete Plan Tag?",
      "This plan tag will be permanently removed."
    );

    if (!confirmed) return;

    await deletePlanTag(id);
  };

  // ✅ Toggle
  const handleToggleStatus = async (tag: PlanTag) => {
    if (tag.isActive) {
      const confirmed = await confirmDialog(
        "disable",
        "Disable Plan Tag?",
        "This plan tag will no longer be available."
      );

      if (!confirmed) return;
    }

    await updatePlanTag({
      id: tag._id,
      data: {
        name: tag.name,
        slug: tag.slug,
        isActive: !tag.isActive,
      },
    });
  };

  // ✅ Loading
  if (isLoading) {
    return (
      <div className="bg-[#0f172a] rounded-xl p-6 border border-gray-800">
        <p className="text-gray-400">Loading plan tags...</p>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <PageHeader title="Plan Tags">
        <div className="flex items-center gap-3 max-md:flex-col max-md:items-stretch">

          <div className="w-full md:w-64">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search plan tag..."
            />
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm max-md:w-full"
          >
            + Add Plan Tag
          </button>

        </div>
      </PageHeader>

      <TableCard>

        {/* ✅ Desktop Table */}
        <DataTable
          headers={["Name", "Slug", "Status", "Action"]}
          isEmpty={filteredTags.length === 0}
          emptyText="No plan tags found"
        >
          {filteredTags.map((tag) => (
            <tr
              key={tag._id}
              className="border-t border-gray-800 hover:bg-[#020617]"
            >
              <td className="px-6 py-4 font-medium">{tag.name}</td>

              <td className="px-6 py-4 text-gray-400">{tag.slug}</td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <ToggleSwitch
                    checked={tag.isActive}
                    onChange={() => handleToggleStatus(tag)}
                  />
                  <StatusBadge isActive={tag.isActive} />
                </div>
              </td>

              <td className="px-6 py-4 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedTag(tag)}
                  className="p-2 rounded-lg hover:bg-gray-800"
                >
                  <Eye size={16} />
                </button>

                <button
                  onClick={() => setEditTag(tag)}
                  className="p-2 rounded-lg hover:bg-gray-800"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => handleDelete(tag._id)}
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
          data={filteredTags}
          emptyText="No plan tags found"
          renderItem={(tag) => (
            <div className="bg-[#020617] border border-gray-800 rounded-xl p-4 shadow-sm">

              {/* Top */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{tag.name}</p>
                  <p className="text-xs text-gray-400">{tag.slug}</p>
                </div>

                <button
                  onClick={() => setSelectedTag(tag)}
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
                    checked={tag.isActive}
                    onChange={() => handleToggleStatus(tag)}
                  />
                  <StatusBadge isActive={tag.isActive} />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditTag(tag)}
                    className="p-2 rounded-lg hover:bg-gray-800"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(tag._id)}
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
      {openModal && <AddPlanTagModal onClose={() => setOpenModal(false)} />}

      {selectedTag && (
        <ViewPlanTagModal
          planTag={selectedTag}
          onClose={() => setSelectedTag(null)}
        />
      )}

      {editTag && (
        <AddPlanTagModal
          planTag={editTag}
          onClose={() => setEditTag(null)}
        />
      )}
    </div>
  );
};

export default PlanTags;