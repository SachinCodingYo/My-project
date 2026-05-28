import { useState } from "react";
import { Eye, Pencil, Trash } from "lucide-react";

import {
  useServices,
  useDeleteService,
  useUpdateService,
} from "../../../hooks/useServices";

import type { Service } from "../../../common/types/types";
import { confirmDialog } from "../../../utils/confirmDialog";

import PageHeader from "../../common/layout/PageHeader";
import TableCard from "../../common/table/TableCard";
import StatusBadge from "../../common/badges/StatusBadge";
import SearchInput from "../../common/inputs/SearchInput";
import ToggleSwitch from "../../common/toggle/ToggleSwitch";
import DataTable from "../../common/table/DataTable";
import MobileList from "../../common/table/MobileList";

import AddServiceModal from "./AddServiceModal";
import ViewServiceModal from "./ViewServiceModal";

const Services = () => {
  const { data, isLoading } = useServices();
  const { mutateAsync: deleteService } = useDeleteService();
  const { mutateAsync: updateService } = useUpdateService();

  const services: Service[] = data?.data ?? [];

  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [editService, setEditService] = useState<Service | null>(null);

  // ✅ Filter
  const filteredServices = search
    ? services.filter((s) =>
        s.name.toLowerCase().includes(search.trim().toLowerCase())
      )
    : services;

  // ✅ Delete
  const handleDelete = async (id: string) => {
    const confirmed = await confirmDialog(
      "delete",
      "Delete Service?",
      "This service will be permanently removed."
    );

    if (!confirmed) return;

    await deleteService(id);
  };

  // ✅ Toggle
  const handleToggleStatus = async (service: Service) => {
    if (service.isActive) {
      const confirmed = await confirmDialog(
        "disable",
        "Disable Service?",
        "This service will no longer be active."
      );

      if (!confirmed) return;
    }

    await updateService({
      id: service._id,
      data: {
        name: service.name,
        slug: service.slug,
        description: service.description,
        isActive: !service.isActive,
      },
    });
  };

  // ✅ Loading
  if (isLoading) {
    return (
      <div className="bg-[#0f172a] rounded-xl p-6 border border-gray-800">
        <p className="text-gray-400">Loading services...</p>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <PageHeader title="Services">
        <div className="flex items-center gap-3 max-md:flex-col max-md:items-stretch">
          <div className="w-full md:w-64">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search service..."
            />
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm max-md:w-full"
          >
            + Add Service
          </button>
        </div>
      </PageHeader>

      <TableCard>
        {/* Desktop */}
        <DataTable
          headers={["Name", "Description", "Status", "Action"]}
          isEmpty={filteredServices.length === 0}
          emptyText="No services found"
        >
          {filteredServices.map((s) => (
            <tr
              key={s._id}
              className="border-t border-gray-800 hover:bg-[#020617]"
            >
              <td className="px-6 py-4 font-medium">{s.name}</td>

              <td className="px-6 py-4 text-sm text-gray-400">
                {s.description || "-"}
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <ToggleSwitch
                    checked={s.isActive}
                    onChange={() => handleToggleStatus(s)}
                  />
                  <StatusBadge isActive={s.isActive} />
                </div>
              </td>

              <td className="px-6 py-4 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedService(s)}
                  className="p-2 rounded-lg hover:bg-gray-800"
                >
                  <Eye size={16} />
                </button>

                <button
                  onClick={() => setEditService(s)}
                  className="p-2 rounded-lg hover:bg-gray-800"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => handleDelete(s._id)}
                  className="p-2 rounded-lg hover:bg-gray-800 text-red-400"
                >
                  <Trash size={16} />
                </button>
              </td>
            </tr>
          ))}
        </DataTable>

        {/* Mobile */}
        <MobileList
          data={filteredServices}
          emptyText="No services found"
          renderItem={(s) => (
            <div className="bg-[#020617] border border-gray-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{s.name}</p>
                  <p className="text-xs text-gray-400">
                    {s.description || "-"}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedService(s)}
                  className="p-2 rounded-lg hover:bg-gray-800 text-indigo-400"
                >
                  <Eye size={18} />
                </button>
              </div>

              <div className="border-t border-gray-800 my-3"></div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ToggleSwitch
                    checked={s.isActive}
                    onChange={() => handleToggleStatus(s)}
                  />
                  <StatusBadge isActive={s.isActive} />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditService(s)}
                    className="p-2 rounded-lg hover:bg-gray-800"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(s._id)}
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
        <AddServiceModal onClose={() => setOpenModal(false)} />
      )}

      {selectedService && (
        <ViewServiceModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}

      {editService && (
        <AddServiceModal
          service={editService}
          onClose={() => setEditService(null)}
        />
      )}
    </div>
  );
};

export default Services;