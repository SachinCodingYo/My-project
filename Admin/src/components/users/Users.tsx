import { useState } from "react";
import { Eye } from "lucide-react";

import { useUsers, useUpdateUser } from "../../hooks/useUsers";
import type { User } from "../../common/types/types";

import ViewUserModal from "./ViewUserModal";
import ToggleSwitch from "../common/toggle/ToggleSwitch";
import StatusBadge from "../common/badges/StatusBadge";
import PageHeader from "../common/layout/PageHeader";
import SearchInput from "../common/inputs/SearchInput";
import TableCard from "../common/table/TableCard";
import DataTable from "../common/table/DataTable";
import MobileList from "../common/table/MobileList";
import { formatDateIndian } from "../../utils/dateFormat";
import { confirmDialog } from "../../utils/confirmDialog";

const Users = () => {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { mutateAsync: updateUser } = useUpdateUser();

  const { data, isLoading } = useUsers({ search });

  const users: User[] = data?.data?.results ?? [];

  // ✅ Toggle
  const handleToggle = async (user: User) => {
    if (user.isActive) {
      const confirmed = await confirmDialog(
        "disable",
        "Disable User?",
        "This user will not be able to access the system."
      );

      if (!confirmed) return;
    }

    await updateUser({
      id: user._id!,
      data: {
        isActive: !user.isActive,
      },
    });
  };

  // ✅ Loading
  if (isLoading) {
    return (
      <div className="bg-[#0f172a] rounded-xl p-6 border border-gray-800">
        <p className="text-gray-400">Loading users...</p>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <PageHeader title="Users">
        <div className="w-full md:w-64">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search users..."
          />
        </div>
      </PageHeader>

      <TableCard>

        {/* ✅ Desktop Table */}
        <DataTable
          headers={[
            "Name",
            "Email",
            "Mobile",
            "Role",
            "Status",
            "Created",
            "Action",
          ]}
          isEmpty={users.length === 0}
          emptyText="No users found"
        >
          {users.map((user) => (
            <tr
              key={user._id}
              className="border-t border-gray-800 hover:bg-[#020617]"
            >
              <td className="px-6 py-4 font-medium">
                <div className="flex items-center gap-2">
                  <span>{user.fullName}</span>
                  {user.isRedFlagged && (
                    <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400">
                      Red Flag
                    </span>
                  )}
                </div>
              </td>

              <td className="px-6 py-4 text-gray-400">
                {user.email}
              </td>

              <td className="px-6 py-4 text-gray-400">
                {user.mobile}
              </td>

              <td className="px-6 py-4">
                <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-xs">
                  {user.role}
                </span>
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <ToggleSwitch
                    checked={user.isActive ?? true}
                    onChange={() => handleToggle(user)}
                  />
                  <StatusBadge isActive={user.isActive ?? true} />
                </div>
              </td>

              <td className="px-6 py-4 text-gray-400">
                {formatDateIndian(user.createdAt)}
              </td>

              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => setSelectedUser(user)}
                  className="p-2 rounded-lg hover:bg-gray-800"
                >
                  <Eye size={16} />
                </button>
              </td>
            </tr>
          ))}
        </DataTable>

        {/* ✅ Mobile List */}
        <MobileList
          data={users}
          emptyText="No users found"
          renderItem={(user) => (
            <div className="bg-[#020617] border border-gray-800 rounded-xl p-4 shadow-sm">

              {/* Top */}
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-sm">
                    {user.fullName}
                  </p>
                  {user.isRedFlagged && (
                    <span className="mt-1 inline-flex rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400">
                      Red Flag
                    </span>
                  )}
                  <p className="text-xs text-gray-400">
                    {user.email}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedUser(user)}
                  className="p-2 rounded-lg hover:bg-gray-800 text-indigo-400"
                >
                  <Eye size={18} />
                </button>
              </div>

              <div className="border-t border-gray-800 my-3"></div>

              {/* Middle */}
              <div className="text-sm text-gray-400 mb-2">
                {user.mobile}
              </div>

              <div className="mb-2">
                <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-xs">
                  {user.role}
                </span>
              </div>

              <div className="text-xs text-gray-400 mb-3">
                {formatDateIndian(user.createdAt)}
              </div>

              {/* Bottom */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <ToggleSwitch
                    checked={user.isActive ?? true}
                    onChange={() => handleToggle(user)}
                  />
                  <StatusBadge isActive={user.isActive ?? true} />
                </div>
              </div>

            </div>
          )}
        />

      </TableCard>

      {/* MODAL */}
      {selectedUser && (
        <ViewUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default Users;
