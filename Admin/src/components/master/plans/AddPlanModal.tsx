import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useCreatePlan, useUpdatePlan } from "../../../hooks/usePlans";
import { useOperators } from "../../../hooks/useOperators";
import { usePlanTypes } from "../../../hooks/usePlanTypes";
import { usePlanTags } from "../../../hooks/usePlanTags";
import type { Plan, PlanFormData, Operator, PlanType, PlanTag, Service } from "../../../common/types/types";
import Modal from "../../common/modal/Modal";
import { useServices } from "../../../hooks/useServices";

type Props = {
  onClose: () => void;
  plan?: Plan;
};

const AddPlanModal = ({ onClose, plan }: Props) => {

  const { register, handleSubmit, reset, control } = useForm<PlanFormData>({
    defaultValues: {
      operatorId: "",
      serviceId: "",
      planTypeId: "",
      planTagId: "",
      price: undefined,
      salePrice: undefined,
      validity: undefined,
      data: "",
      calls: "",
      sms: "",
      networkType: "",
      description: "",
      benefits: "",
      status: "active",
      isBusinessSim: false,
      simTypePhysical: true,
      simTypeEsim: false,
      minQuantity: undefined,
    },
  });

  const operatorId = useWatch({ control, name: "operatorId" });
  const isBusinessSim = useWatch({ control, name: "isBusinessSim" });

  const { mutateAsync: createPlan, isPending } = useCreatePlan();
  const { mutateAsync: updatePlan } = useUpdatePlan();

  const { data: servicesData } = useServices();
  const services = useMemo(() => servicesData?.data ?? [], [servicesData]);

  const { data: operatorsData } = useOperators();
  const { data: planTypesData } = usePlanTypes();
  const { data: planTagsData } = usePlanTags();

  const operators = useMemo(() => operatorsData?.data ?? [], [operatorsData]);
  const planTypes = useMemo(() => planTypesData?.data ?? [], [planTypesData]);
  const planTags = useMemo(() => planTagsData?.data ?? [], [planTagsData]);

  const onSubmit = async (data: PlanFormData) => {
    const benefitsArray =
      data.benefits
        ?.split(",")
        .map((b) => b.trim())
        .filter(Boolean) || [];

    const basePayload = {
      operatorId: data.operatorId,
      serviceId: data.serviceId,
      planTypeId: data.planTypeId,
      planTagsId: data.planTagId ? [data.planTagId] : [],
      price: data.price ?? 0,
      salePrice: data.salePrice ?? 0,
      validity: data.validity ?? 0,
      data: data.data,
      calls: data.calls,
      sms: data.sms,
      networkType: data.networkType,
      description: data.description,
      benefits: benefitsArray,
      isActive: data.status === "active",
      isBusinessSim: data.isBusinessSim,
    };

    const payload = data.isBusinessSim
      ? { ...basePayload, minQuantity: data.minQuantity }
      : {
          ...basePayload,
          simTypes: [
            ...(data.simTypePhysical ? ["physical" as const] : []),
            ...(data.simTypeEsim ? ["esim" as const] : []),
          ],
        };

    if (plan) {
      await updatePlan({ id: plan._id, data: payload });
    } else {
      await createPlan(payload);
    }

    onClose();
  };

  useEffect(() => {
    if (plan && operators.length && planTypes.length && planTags.length) {
      reset({
        operatorId: plan.operatorId?._id,
        serviceId: plan.serviceId?._id,
        planTypeId: plan.planTypeId?._id,
        planTagId: plan.planTagsId?.[0]?._id || "",
        price: plan.price,
        salePrice: plan.salePrice,
        validity: plan.validity,
        data: plan.data || "",
        calls: plan.calls || "",
        sms: plan.sms || "",
        networkType: plan.networkType || "",
        description: plan.description || "",
        benefits: plan.benefits?.join(", ") || "",
        status: plan.isActive ? "active" : "inactive",
        isBusinessSim: plan.isBusinessSim ?? false,
        simTypePhysical: plan.simTypes?.includes("physical") ?? true,
        simTypeEsim: plan.simTypes?.includes("esim") ?? false,
        minQuantity: plan.minQuantity,
      });
    }
  }, [plan, operators, planTypes, planTags, reset]);

  return (
    <Modal onClose={onClose} width="520px">

      <h2 className="text-lg font-semibold mb-4">
        {plan ? "Edit Plan" : "Add Plan"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <select
          {...register("operatorId")}
          className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
        >
          <option value="">Select Operator</option>
          {operators.map((op: Operator) => (
            <option key={op._id} value={op._id}>{op.name}</option>
          ))}
        </select>

        <select
          {...register("serviceId")}
          disabled={!operatorId}
          className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
        >
          <option value="">Select Service</option>
          {services.map((s: Service) => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>

        <select
          {...register("planTypeId")}
          className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
        >
          <option value="">Select Plan Type</option>
          {planTypes.map((type: PlanType) => (
            <option key={type._id} value={type._id}>{type.name}</option>
          ))}
        </select>

        <select
          {...register("planTagId")}
          className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
        >
          <option value="">Select Plan Tag (optional)</option>
          {planTags.map((tag: PlanTag) => (
            <option key={tag._id} value={tag._id}>{tag.name}</option>
          ))}
        </select>

        {/* Business SIM toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register("isBusinessSim")}
            className="w-4 h-4 accent-indigo-500"
          />
          <span className="text-sm font-medium">
            Business SIM
            <span className="ml-2 text-xs text-gray-400">(bulk corporate orders)</span>
          </span>
        </label>

        {/* SIM Type — only for non-business plans */}
        {!isBusinessSim && (
          <div>
            <p className="text-sm text-gray-400 mb-2">SIM Type (select one or both)</p>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("simTypePhysical")}
                  className="w-4 h-4 accent-indigo-500"
                />
                <span className="text-sm">Physical SIM</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("simTypeEsim")}
                  className="w-4 h-4 accent-indigo-500"
                />
                <span className="text-sm">eSIM</span>
              </label>
            </div>
          </div>
        )}

        {/* Min Quantity — only for business plans */}
        {isBusinessSim && (
          <input
            type="number"
            placeholder="Minimum SIM Quantity (required for business)"
            {...register("minQuantity", { valueAsNumber: true })}
            className="w-full bg-[#020617] border border-indigo-600 rounded-lg p-2"
          />
        )}

        <input
          type="number"
          placeholder="Cost Price"
          {...register("price", { valueAsNumber: true })}
          className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
        />

        <input
          type="number"
          placeholder="Sale Price"
          {...register("salePrice", { valueAsNumber: true })}
          className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
        />

        <input
          type="number"
          {...register("validity", { valueAsNumber: true })}
          placeholder="Validity (days)"
          className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
        />

        <input
          type="text"
          placeholder="Data (e.g. 1.5 GB/day)"
          {...register("data")}
          className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
        />

        <input
          type="text"
          placeholder="Calls (e.g. Unlimited)"
          {...register("calls")}
          className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
        />

        <input
          type="text"
          placeholder="SMS (e.g. 100/day)"
          {...register("sms")}
          className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
        />

        <select
          {...register("networkType")}
          className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
        >
          <option value="">Select Network Type</option>
          <option value="2G">2G</option>
          <option value="3G">3G</option>
          <option value="4G">4G</option>
          <option value="5G">5G</option>
        </select>

        <input
          type="text"
          placeholder="Description"
          {...register("description")}
          className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
        />

        <input
          type="text"
          placeholder="Benefits (comma separated, e.g. Netflix, Prime)"
          {...register("benefits")}
          className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
        />

        <select
          {...register("status")}
          className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-indigo-600 rounded-lg"
          >
            {isPending ? "Saving..." : plan ? "Update" : "Save"}
          </button>
        </div>

      </form>
    </Modal>
  );
};

export default AddPlanModal;
