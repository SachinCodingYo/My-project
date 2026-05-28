import { useState } from "react";
import { Eye, Pencil, Trash } from "lucide-react";
import type { VipCategory } from "../../../common/types/types";

import {
  useVipCategories,
  useDeleteVipCategory,
  useUpdateVipCategory,
} from "../../../hooks/useVipCategories";

import AddVIPCategoryModal from "./AddVIPCategoryModal";
import ViewVIPCategoryModal from "./ViewVIPCategoryModal";
import { confirmDialog } from "../../../utils/confirmDialog";

import PageHeader from "../../common/layout/PageHeader";
import SearchInput from "../../common/inputs/SearchInput";
import TableCard from "../../common/table/TableCard";
import StatusBadge from "../../common/badges/StatusBadge";
import ToggleSwitch from "../../common/toggle/ToggleSwitch";
import DataTable from "../../common/table/DataTable";
import MobileList from "../../common/table/MobileList";

const VIPCategories = () => {
  const { data, isLoading } = useVipCategories();
  const { mutateAsync: deleteVipCategory } = useDeleteVipCategory();
  const { mutateAsync: updateCategory } = useUpdateVipCategory();

  const vipCategories: VipCategory[] = data?.data || [];

  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<VipCategory | null>(null);
  const [editCategory, setEditCategory] = useState<VipCategory | null>(null);

  // ✅ Filter
  const filteredCategories = search
    ? vipCategories.filter((cat) =>
      cat.name.toLowerCase().includes(search.trim().toLowerCase())
    )
    : vipCategories;

  // ✅ Delete
  const handleDelete = async (id: string) => {
    const confirmed = await confirmDialog(
      "delete",
      "Delete Category?",
      "This category will be permanently removed."
    );

    if (!confirmed) return;

    await deleteVipCategory(id);
  };

  // ✅ Toggle
  const handleToggleStatus = async (category: VipCategory) => {
    if (category.isActive) {
      const confirmed = await confirmDialog(
        "disable",
        "Disable Category?",
        "This category will no longer be active."
      );

      if (!confirmed) return;
    }

    await updateCategory({
      id: category._id,
      data: {
        name: category.name,
        slug: category.slug || "",
        isActive: !category.isActive,
      },
    });
  };

  // ✅ Loading
  if (isLoading) {
    return (
      <div className="bg-[#0f172a] rounded-xl p-6 border border-gray-800">
        <p className="text-gray-400">Loading categories...</p>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <PageHeader title="VIP Categories">
        <div className="flex items-center gap-3 max-md:flex-col max-md:items-stretch">

          <div className="w-full md:w-64">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search category..."
            />
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm max-md:w-full"
          >
            + Add Category
          </button>

        </div>
      </PageHeader>

      <TableCard>

        {/* ✅ Desktop Table */}
        <DataTable
          headers={["Name", "Status", "Action"]}
          isEmpty={filteredCategories.length === 0}
          emptyText="No categories found"
        >
          {filteredCategories.map((cat) => (
            <tr
              key={cat._id}
              className="border-t border-gray-800 hover:bg-[#020617]"
            >
              <td className="px-6 py-4 font-medium">{cat.name}</td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <ToggleSwitch
                    checked={cat.isActive}
                    onChange={() => handleToggleStatus(cat)}
                  />
                  <StatusBadge isActive={cat.isActive} />
                </div>
              </td>

              <td className="px-6 py-4 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedCategory(cat)}
                  className="p-2 rounded-lg hover:bg-gray-800"
                >
                  <Eye size={16} />
                </button>

                <button
                  onClick={() => setEditCategory(cat)}
                  className="p-2 rounded-lg hover:bg-gray-800"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => handleDelete(cat._id)}
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
          data={filteredCategories}
          emptyText="No categories found"
          renderItem={(cat) => (
            <div className="bg-[#020617] border border-gray-800 rounded-xl p-4 shadow-sm">

              {/* Top */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{cat.name}</p>
                  <p className="text-xs text-gray-400">VIP Category</p>
                </div>

                <button
                  onClick={() => setSelectedCategory(cat)}
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
                    checked={cat.isActive}
                    onChange={() => handleToggleStatus(cat)}
                  />
                  <StatusBadge isActive={cat.isActive} />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditCategory(cat)}
                    className="p-2 rounded-lg hover:bg-gray-800"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(cat._id)}
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
        <AddVIPCategoryModal onClose={() => setOpenModal(false)} />
      )}

      {selectedCategory && (
        <ViewVIPCategoryModal
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)}
        />
      )}

      {editCategory && (
        <AddVIPCategoryModal
          category={editCategory}
          onClose={() => setEditCategory(null)}
        />
      )}
    </div>
  );
};

export default VIPCategories;