import { useState, useEffect, useMemo } from "react";
import { Eye, Pencil, Trash } from "lucide-react";
import { usePlans, useDeletePlan, useUpdatePlan } from "../../../hooks/usePlans";
import AddPlanModal from "./AddPlanModal";
import ViewPlanModal from "./ViewPlanModal";
import type { Plan, PlanFilters } from "../../../common/types/types";
import { confirmDialog } from "../../../utils/confirmDialog";

import PageHeader from "../../common/layout/PageHeader";
import SearchInput from "../../common/inputs/SearchInput";
import TableCard from "../../common/table/TableCard";
import StatusBadge from "../../common/badges/StatusBadge";
import ToggleSwitch from "../../common/toggle/ToggleSwitch";
import DataTable from "../../common/table/DataTable";
import MobileList from "../../common/table/MobileList";

const Plans = () => {
  const { mutateAsync: deletePlan } = useDeletePlan();
  const { mutateAsync: updatePlan } = useUpdatePlan();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [editPlan, setEditPlan] = useState<Plan | null>(null);

  // ✅ Debounce (important)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // ✅ Backend filters
  const filters = useMemo<PlanFilters>(() => {
    if (!debouncedSearch) return {};

    return {
      search: debouncedSearch, // 🔥 simple & clean
    };
  }, [debouncedSearch]);

  // ✅ Fetch with filters
  const { data, isLoading } = usePlans(filters || {});

  const plans: Plan[] = Array.isArray(data?.data?.results)
    ? data.data.results
    : [];

  const filteredPlans = plans; // ✅ No frontend filtering

  // ✅ Delete
  const handleDelete = async (id: string) => {
    const confirmed = await confirmDialog(
      "delete",
      "Delete Plan?",
      "This plan will be permanently removed."
    );

    if (!confirmed) return;

    await deletePlan(id);
  };

  // ✅ Toggle
  const handleToggleStatus = async (plan: Plan) => {
    if (plan.isActive) {
      const confirmed = await confirmDialog(
        "disable",
        "Disable Plan?",
        "This plan will no longer be available for purchase."
      );

      if (!confirmed) return;
    }

    await updatePlan({
      id: plan._id,
      data: {
        operatorId: plan.operatorId?._id || "",
        serviceId: plan.serviceId?._id || "",
        planTypeId: plan.planTypeId?._id || "",
        planTagsId: plan.planTagsId?.map((tag) => tag._id) || [],
        price: plan.price,
        salePrice: plan.salePrice,
        validity: plan.validity,
        isActive: !plan.isActive,
        isBusinessSim: plan.isBusinessSim,
      },
    });
  };

  // ✅ Loading
  if (isLoading) {
    return (
      <div className="bg-[#0f172a] rounded-xl p-6 border border-gray-800">
        <p className="text-gray-400">Loading plans...</p>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <PageHeader title="Plans">
        <div className="flex items-center gap-3 max-md:flex-col max-md:items-stretch">

          <div className="w-full md:w-64">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by price (e.g. 499)..."
            />
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm max-md:w-full"
          >
            + Add Plan
          </button>

        </div>
      </PageHeader>

      <TableCard>

        {/* ✅ Desktop Table */}
        <DataTable
          headers={[
            "Operator",
            "Service",
            "Plan Type",
            "Plan Tag",
            "Cost Price",
            "Sale Price",
            "Validity",
            "Status",
            "Action",
          ]}
          isEmpty={filteredPlans.length === 0}
          emptyText="No plans found"
        >
          {filteredPlans.map((plan) => (
            <tr
              key={plan._id}
              className="border-t border-gray-800 hover:bg-[#020617]"
            >
              <td className="px-6 py-4 flex items-center gap-2">
                <img
                  src={plan.operatorId?.logo}
                  className="w-6 h-6 object-contain"
                />
                {plan.operatorId?.name}
              </td>
              <td className="px-6 py-4">
                {plan.serviceId?.name || "-"}
              </td>

              <td className="px-6 py-4">{plan.planTypeId?.name}</td>

              <td className="px-6 py-4">
                {plan.planTagsId?.map((tag) => tag.name).join(", ") || "-"}
              </td>

              <td className="px-6 py-4">₹{plan.price}</td>
              <td className="px-6 py-4">₹{plan.salePrice}</td>
              <td className="px-6 py-4">{plan.validity} days</td>

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
                  onClick={() => setSelectedPlan(plan)}
                  className="p-2 rounded-lg hover:bg-gray-800"
                >
                  <Eye size={16} />
                </button>

                <button
                  onClick={() => setEditPlan(plan)}
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

        {/* ✅ Mobile List */}
        <MobileList
          data={filteredPlans}
          emptyText="No plans found"
          renderItem={(plan) => (
            <div className="bg-[#020617] border border-gray-800 rounded-xl p-4 shadow-sm">

              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={plan.operatorId?.logo}
                    className="w-6 h-6 object-contain"
                  />
                  <div>
                    <p className="font-semibold text-sm">
                      {plan.operatorId?.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {plan.planTypeId?.name}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPlan(plan)}
                  className="p-2 rounded-lg hover:bg-gray-800 text-indigo-400"
                >
                  <Eye size={18} />
                </button>
              </div>

              <div className="border-t border-gray-800 my-3"></div>

              <div className="text-xs text-gray-400 mb-2">
                {plan.planTagsId?.map((tag) => tag.name).join(", ") || "-"}
              </div>

              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-xs text-gray-400">Cost</p>
                  <p className="text-sm">₹{plan.price}</p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-400">Sell</p>
                  <p className="text-sm font-semibold text-green-400">
                    ₹{plan.salePrice}
                  </p>
                </div>
              </div>

              <div className="text-xs text-gray-400 mb-3">
                {plan.validity} days
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <ToggleSwitch
                    checked={plan.isActive}
                    onChange={() => handleToggleStatus(plan)}
                  />
                  <StatusBadge isActive={plan.isActive} />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditPlan(plan)}
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
      {openModal && <AddPlanModal onClose={() => setOpenModal(false)} />}

      {selectedPlan && (
        <ViewPlanModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}

      {editPlan && (
        <AddPlanModal
          plan={editPlan}
          onClose={() => setEditPlan(null)}
        />
      )}
    </div>
  );
};

export default Plans;