import { useMemo, useState } from "react";
import { Eye, Pencil, Trash } from "lucide-react";
import type {
  FancyNumber,
  FancyNumberFilters,
} from "../../../common/types/types";
import {
  useDeleteFancyNumber,
  useFancyNumbers,
  useUpdateFancyNumber,
} from "../../../hooks/useFancyNumbers";
import { useOperators } from "../../../hooks/useOperators";
import { useVipCategories } from "../../../hooks/useVipCategories";
import { confirmDialog } from "../../../utils/confirmDialog";
import { formatDateIndian } from "../../../utils/dateFormat";
import AddFancyNumberModal from "./AddFancyNumberModal";
import ViewFancyNumberModal from "./ViewFancyNumberModal";
import PageHeader from "../../common/layout/PageHeader";
import SearchInput from "../../common/inputs/SearchInput";
import TableCard from "../../common/table/TableCard";
import DataTable from "../../common/table/DataTable";
import MobileList from "../../common/table/MobileList";
import ToggleSwitch from "../../common/toggle/ToggleSwitch";
import StatusBadge from "../../common/badges/StatusBadge";

const FancyNumbers = () => {
  const [search, setSearch] = useState("");
  const [operatorId, setOperatorId] = useState("");
  const [vipCategoryId, setVipCategoryId] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedFancyNumber, setSelectedFancyNumber] = useState<FancyNumber | null>(null);
  const [editFancyNumber, setEditFancyNumber] = useState<FancyNumber | null>(null);

  const filters = useMemo<FancyNumberFilters>(
    () => ({
      limit: 200,
      operatorId: operatorId || undefined,
      vipCategoryId: vipCategoryId || undefined,
    }),
    [operatorId, vipCategoryId]
  );

  const { data, isLoading } = useFancyNumbers(filters);
  const { data: operatorsData } = useOperators();
  const { data: vipCategoriesData } = useVipCategories();
  const { mutateAsync: updateFancyNumber } = useUpdateFancyNumber();
  const { mutateAsync: deleteFancyNumber } = useDeleteFancyNumber();

  const fancyNumbers: FancyNumber[] = data?.data?.results ?? [];
  const operators = operatorsData?.data ?? [];
  const vipCategories = vipCategoriesData?.data ?? [];

  const filteredFancyNumbers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return fancyNumbers;

    return fancyNumbers.filter((item) =>
      [item.number, item.operatorId?.name, item.vipCategoryId?.name]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalizedSearch))
    );
  }, [fancyNumbers, search]);

  const handleDelete = async (id: string) => {
    const confirmed = await confirmDialog(
      "delete",
      "Delete Fancy Number?",
      "This fancy number will be permanently removed."
    );

    if (!confirmed) return;

    await deleteFancyNumber(id);
  };

  const handleToggleActive = async (item: FancyNumber) => {
    if (item.isActive) {
      const confirmed = await confirmDialog(
        "disable",
        "Disable Fancy Number?",
        "This fancy number will no longer be active."
      );

      if (!confirmed) return;
    }

    await updateFancyNumber({
      id: item._id,
      data: {
        isActive: !item.isActive,
      },
    });
  };

  const handleToggleAvailability = async (item: FancyNumber) => {
    if (item.isAvailable) {
      const confirmed = await confirmDialog(
        "disable",
        "Mark As Unavailable?",
        "This fancy number will not be shown as available."
      );

      if (!confirmed) return;
    }

    await updateFancyNumber({
      id: item._id,
      data: {
        isAvailable: !item.isAvailable,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="bg-[#0f172a] rounded-xl p-6 border border-gray-800">
        <p className="text-gray-400">Loading fancy numbers...</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Fancy Numbers">
        <div className="flex items-center gap-3 max-md:flex-col max-md:items-stretch">
          <div className="w-full md:w-64">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search fancy number..."
            />
          </div>

          <select
            value={operatorId}
            onChange={(e) => setOperatorId(e.target.value)}
            className="bg-[#020617] border border-gray-700 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Operators</option>
            {operators.map((operator: { _id: string; name: string }) => (
              <option key={operator._id} value={operator._id}>
                {operator.name}
              </option>
            ))}
          </select>

          <select
            value={vipCategoryId}
            onChange={(e) => setVipCategoryId(e.target.value)}
            className="bg-[#020617] border border-gray-700 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All VIP Categories</option>
            {vipCategories.map((category: { _id: string; name: string }) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setOpenModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm max-md:w-full"
          >
            + Add Fancy Number
          </button>
        </div>
      </PageHeader>

      <TableCard>
        <DataTable
          headers={[
            "Number",
            "Operator",
            "VIP Category",
            "Price",
            "Sale Price",
            "Active",
            "Available",
            "Created",
            "Action",
          ]}
          isEmpty={filteredFancyNumbers.length === 0}
          emptyText="No fancy numbers found"
        >
          {filteredFancyNumbers.map((item) => (
            <tr
              key={item._id}
              className="border-t border-gray-800 hover:bg-[#020617]"
            >
              <td className="px-6 py-4 font-medium">{item.number}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  {item.operatorId?.logo && (
                    <img
                      src={item.operatorId.logo}
                      alt={item.operatorId.name}
                      className="w-6 h-6 object-contain"
                    />
                  )}
                  <span>{item.operatorId?.name || "-"}</span>
                </div>
              </td>
              <td className="px-6 py-4">{item.vipCategoryId?.name || "-"}</td>
              <td className="px-6 py-4">Rs. {item.price}</td>
              <td className="px-6 py-4 text-green-400">Rs. {item.salePrice}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <ToggleSwitch
                    checked={item.isActive}
                    onChange={() => handleToggleActive(item)}
                  />
                  <StatusBadge isActive={item.isActive} />
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <ToggleSwitch
                    checked={item.isAvailable}
                    onChange={() => handleToggleAvailability(item)}
                  />
                  <span
                    className={`text-xs font-medium ${
                      item.isAvailable ? "text-green-400" : "text-yellow-400"
                    }`}
                  >
                    {item.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-400">
                {formatDateIndian(item.createdAt)}
              </td>
              <td className="px-6 py-4 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedFancyNumber(item)}
                  className="p-2 rounded-lg hover:bg-gray-800"
                >
                  <Eye size={16} />
                </button>

                <button
                  onClick={() => setEditFancyNumber(item)}
                  className="p-2 rounded-lg hover:bg-gray-800"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 rounded-lg hover:bg-gray-800 text-red-400"
                >
                  <Trash size={16} />
                </button>
              </td>
            </tr>
          ))}
        </DataTable>

        <MobileList
          data={filteredFancyNumbers}
          emptyText="No fancy numbers found"
          renderItem={(item) => (
            <div className="bg-[#020617] border border-gray-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{item.number}</p>
                  <p className="text-xs text-gray-400">
                    {item.operatorId?.name || "No operator"}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedFancyNumber(item)}
                  className="p-2 rounded-lg hover:bg-gray-800 text-indigo-400"
                >
                  <Eye size={18} />
                </button>
              </div>

              <div className="border-t border-gray-800 my-3"></div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500">VIP Category</p>
                  <p>{item.vipCategoryId?.name || "-"}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Price</p>
                  <p>Rs. {item.salePrice}</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ToggleSwitch
                    checked={item.isActive}
                    onChange={() => handleToggleActive(item)}
                  />
                  <StatusBadge isActive={item.isActive} />
                </div>

                <div className="flex items-center gap-3">
                  <ToggleSwitch
                    checked={item.isAvailable}
                    onChange={() => handleToggleAvailability(item)}
                  />
                  <span
                    className={`text-xs ${
                      item.isAvailable ? "text-green-400" : "text-yellow-400"
                    }`}
                  >
                    {item.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex justify-end gap-2">
                <button
                  onClick={() => setEditFancyNumber(item)}
                  className="p-2 rounded-lg hover:bg-gray-800"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 rounded-lg hover:bg-gray-800 text-red-400"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          )}
        />
      </TableCard>

      {openModal && <AddFancyNumberModal onClose={() => setOpenModal(false)} />}

      {selectedFancyNumber && (
        <ViewFancyNumberModal
          fancyNumber={selectedFancyNumber}
          onClose={() => setSelectedFancyNumber(null)}
        />
      )}

      {editFancyNumber && (
        <AddFancyNumberModal
          fancyNumber={editFancyNumber}
          onClose={() => setEditFancyNumber(null)}
        />
      )}
    </div>
  );
};

export default FancyNumbers;
