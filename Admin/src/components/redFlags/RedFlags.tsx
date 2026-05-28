import { useEffect, useMemo, useState } from "react";
import { Eye, FlagOff } from "lucide-react";

import type { RedFlag, RedFlagApiItem, RedFlagFormData, RedFlagUser } from "../../common/types/types";
import { formatDateIndian } from "../../utils/dateFormat";
import { useAddRedFlag, useRedFlags, useRemoveRedFlag } from "../../hooks/useRedFlags";
import { confirmDialog } from "../../utils/confirmDialog";

import PageHeader from "../common/layout/PageHeader";
import SearchInput from "../common/inputs/SearchInput";
import TableCard from "../common/table/TableCard";
import DataTable from "../common/table/DataTable";
import MobileList from "../common/table/MobileList";
import AddRedFlagModal from "./AddRedFlagModal";
import ViewRedFlagModal from "./ViewRedFlagModal";

const RedFlags = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedRedFlag, setSelectedRedFlag] = useState<RedFlag | null>(null);
  const addRedFlagMutation = useAddRedFlag();
  const removeRedFlagMutation = useRemoveRedFlag();
  const { data, isLoading } = useRedFlags({
    search: debouncedSearch,
    limit: 10,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const redFlags = useMemo<RedFlag[]>(() => {
    const items: RedFlagApiItem[] = data?.data ?? [];

    return items.map((item) => ({
      _id: item._id,
      userId: item.userId._id,
      fullName: item.userId.fullName,
      email: item.userId.email,
      mobile: item.userId.mobile,
      role: item.userId.role,
      reason: item.reason,
      remarks: item.remarks,
      flaggedBy:
        typeof item.flaggedBy === "string"
          ? item.flaggedBy
          : item.flaggedBy?._id,
      createdAt: item.createdAt ?? "",
      updatedAt: item.updatedAt,
    }));
  }, [data?.data]);

  const handleCreate = async (data: RedFlagFormData, _user: RedFlagUser) => {
    await addRedFlagMutation.mutateAsync({
      identifier: data.identifier,
      reason: data.reason,
      remarks: data.remarks,
    });
    setSelectedRedFlag(null);
  };

  const handleRemove = async (redFlag: RedFlag) => {
    const confirmed = await confirmDialog(
      "remove",
      "Remove Red Flag?",
      "This will mark the red flag as inactive. The record will remain in history."
    );

    if (!confirmed) return;

    await removeRedFlagMutation.mutateAsync(redFlag._id);
  };

  if (isLoading) {
    return (
      <div className="bg-[#0f172a] rounded-xl p-6 border border-gray-800">
        <p className="text-gray-400">Loading red flags...</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Red Flags">
        <div className="flex items-center gap-3 max-md:flex-col max-md:items-stretch">
          <div className="w-full md:w-64">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search red flags..."
            />
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm max-md:w-full"
          >
            + Create Red Flag
          </button>
        </div>
      </PageHeader>

      <TableCard>
        <DataTable
          headers={[
            "Name",
            "Role",
            "Email",
            "Mobile",
            "Reason",
            "Created",
            "Action",
          ]}
          isEmpty={redFlags.length === 0}
          emptyText="No red flags found"
        >
          {redFlags.map((redFlag) => (
            <tr
              key={redFlag._id}
              className="border-t border-gray-800 hover:bg-[#020617]"
            >
              <td className="px-6 py-4 font-medium">{redFlag.fullName}</td>

              <td className="px-6 py-4">
                <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs">
                  {redFlag.role}
                </span>
              </td>

              <td className="px-6 py-4 text-gray-400">{redFlag.email}</td>

              <td className="px-6 py-4 text-gray-400">{redFlag.mobile}</td>

              <td className="px-6 py-4 text-gray-400 max-w-xs truncate">
                {redFlag.reason}
              </td>

              <td className="px-6 py-4 text-gray-400">
                {formatDateIndian(redFlag.createdAt)}
              </td>

              <td className="px-6 py-4 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedRedFlag(redFlag)}
                  className="p-2 rounded-lg hover:bg-gray-800"
                >
                  <Eye size={16} />
                </button>

                <button
                  onClick={() => handleRemove(redFlag)}
                  disabled={removeRedFlagMutation.isPending}
                  className="p-2 rounded-lg hover:bg-gray-800 text-red-400 disabled:opacity-60"
                  title="Remove Red Flag"
                >
                  <FlagOff size={16} />
                </button>
              </td>
            </tr>
          ))}
        </DataTable>

        <MobileList
          data={redFlags}
          emptyText="No red flags found"
          renderItem={(redFlag) => (
            <div className="bg-[#020617] border border-gray-800 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{redFlag.fullName}</p>
                  <p className="text-xs text-gray-400 break-all">
                    {redFlag.email}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedRedFlag(redFlag)}
                  className="p-2 rounded-lg hover:bg-gray-800 text-indigo-400 shrink-0"
                >
                  <Eye size={18} />
                </button>
              </div>

              <div className="border-t border-gray-800 my-3"></div>

              <div className="flex items-center gap-2 mb-2">
                <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs">
                  {redFlag.role}
                </span>
                <span className="text-xs text-gray-400">
                  {formatDateIndian(redFlag.createdAt)}
                </span>
              </div>

              <p className="text-sm text-gray-400 mb-2">{redFlag.mobile}</p>
              <p className="text-sm text-gray-300 break-words">
                {redFlag.reason}
              </p>

              <div className="flex justify-end mt-3">
                <button
                  onClick={() => handleRemove(redFlag)}
                  disabled={removeRedFlagMutation.isPending}
                  className="p-2 rounded-lg hover:bg-gray-800 text-red-400 disabled:opacity-60"
                  title="Remove Red Flag"
                >
                  <FlagOff size={16} />
                </button>
              </div>
            </div>
          )}
        />
      </TableCard>

      {openModal && (
        <AddRedFlagModal
          onClose={() => setOpenModal(false)}
          onSave={handleCreate}
          loading={addRedFlagMutation.isPending}
        />
      )}

      {selectedRedFlag && (
        <ViewRedFlagModal
          redFlag={selectedRedFlag}
          onClose={() => setSelectedRedFlag(null)}
        />
      )}
    </div>
  );
};

export default RedFlags;
