import { useForm } from "react-hook-form";
import { useEffect } from "react";

import {
    useCreateService,
    useUpdateService,
} from "../../../hooks/useServices";

import type {
    Service,
    ServiceFormInputs,
} from "../../../common/types/types";

import Modal from "../../common/modal/Modal";

type Props = {
    onClose: () => void;
    service?: Service;
};

const AddServiceModal = ({ onClose, service }: Props) => {
    const { register, handleSubmit, reset, setValue, formState: { errors }, } = useForm<ServiceFormInputs>({
        defaultValues: service
            ? {
                name: service.name,
                slug: service.slug,
                description: service.description || "",
                status: service.isActive ? "active" : "inactive",
            }
            : {
                name: "",
                slug: "",
                description: "",
                status: "active",
            },
    });

    const { mutateAsync: createService, isPending } = useCreateService();
    const { mutateAsync: updateService } = useUpdateService();

    const onSubmit = async (data: ServiceFormInputs) => {
        const payload = {
            name: data.name,
            slug: data.slug,
            description: data.description || "",
            isActive: data.status === "active",
        };

        if (service) {
            await updateService({
                id: service._id,
                data: payload,
            });
        } else {
            await createService(payload);
        }

        onClose();
    };

    useEffect(() => {
        if (service) {
            reset({
                name: service.name,
                slug: service.slug,
                description: service.description || "",
                status: service.isActive ? "active" : "inactive",
            });
        }
    }, [service, reset]);

    const generateSlug = (value: string) =>
        value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

    return (
        <Modal onClose={onClose}>
            <h2 className="text-lg font-semibold mb-4">
                {service ? "Edit Service" : "Add Service"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <input
                    {...register("name", { required: "Name is required" })}
                    placeholder="Service Name"
                    className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
                    onChange={(e) => {
                        const name = e.target.value;
                        setValue("name", name);
                        setValue("slug", generateSlug(name));
                    }}
                />

                {errors.name && (
                    <p className="text-red-400 text-xs">{errors.name.message}</p>
                )}

                {/* Slug */}
                <input
                    {...register("slug", { required: "Slug is required" })}
                    placeholder="e.g. new-connection"
                    className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
                />

                {errors.slug && (
                    <p className="text-red-400 text-xs">{errors.slug.message}</p>
                )}

                {/* Description */}
                <textarea
                    {...register("description")}
                    placeholder="Description (optional)"
                    className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
                />

                {/* Status */}
                <select
                    {...register("status")}
                    className="w-full bg-[#020617] border border-gray-700 rounded-lg p-2"
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-2">
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
                        {isPending
                            ? "Saving..."
                            : service
                                ? "Update"
                                : "Save"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddServiceModal;