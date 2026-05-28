import { useEffect, useMemo, useState } from "react";
import Modal from "../common/modal/Modal";
import { useAssignMR, useNearbyMRs } from "../../hooks/useOrderActions";
import { useMRs } from "../../hooks/useMRs";
import type { MR } from "../../common/types/types";

type Props = {
    orderId: string;
    onClose: () => void;
};

const AssignMRModal = ({ orderId, onClose }: Props) => {
    const { data } = useMRs();
    const { mutateAsync: assignMR, isPending } = useAssignMR();
    const {
        mutateAsync: fetchNearbyMRs,
        isPending: isNearbyLoading,
    } = useNearbyMRs();

    const allMRs: MR[] = data?.data?.results || [];

    const [selectedMR, setSelectedMR] = useState("");
    const [nearbyMRs, setNearbyMRs] = useState<MR[]>([]);
    const [showAllMRs, setShowAllMRs] = useState(false);

    useEffect(() => {
        const loadNearbyMRs = async () => {
            try {
                const response = await fetchNearbyMRs(orderId);
                setNearbyMRs(Array.isArray(response?.data) ? response.data : []);
            } catch {
                setNearbyMRs([]);
            }
        };

        loadNearbyMRs();
    }, [fetchNearbyMRs, orderId]);

    const fallbackMRs = useMemo(
        () =>
            allMRs.filter(
                (mr) => !nearbyMRs.some((nearbyMr) => nearbyMr._id === mr._id)
            ),
        [allMRs, nearbyMRs]
    );

    const handleAssign = async () => {
        if (!selectedMR) return;

        await assignMR({
            orderId,
            mrId: selectedMR,
        });

        onClose();
    };

    return (
        <Modal onClose={onClose} width="460px">
            <h2 className="text-lg font-semibold mb-4">Assign MR</h2>

            <div className="space-y-4">
                <div className="bg-[#020617] border border-gray-800 rounded-xl p-4">
                    <p className="text-sm font-medium text-white mb-3">
                        Nearby Recommended MRs
                    </p>

                    {isNearbyLoading ? (
                        <p className="text-sm text-gray-400">
                            Loading nearby MRs...
                        </p>
                    ) : nearbyMRs.length > 0 ? (
                        <div className="space-y-2">
                            {nearbyMRs.map((mr) => (
                                <label
                                    key={mr._id}
                                    className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                                        selectedMR === mr._id
                                            ? "border-indigo-500 bg-indigo-500/10"
                                            : "border-gray-700 hover:border-gray-600"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="selectedMR"
                                        value={mr._id}
                                        checked={selectedMR === mr._id}
                                        onChange={(e) => setSelectedMR(e.target.value)}
                                        className="accent-indigo-500"
                                    />

                                    <div>
                                        <p className="text-sm font-medium">{mr.fullName}</p>
                                        <p className="text-xs text-gray-400">{mr.mobile}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400">
                            No nearby MRs found for this order.
                        </p>
                    )}
                </div>

                <div className="bg-[#020617] border border-gray-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-white">All Active MRs</p>

                        <button
                            type="button"
                            onClick={() => setShowAllMRs((prev) => !prev)}
                            className="text-xs text-indigo-400 hover:text-indigo-300"
                        >
                            {showAllMRs ? "Hide List" : "Show All"}
                        </button>
                    </div>

                    {showAllMRs ? (
                        fallbackMRs.length > 0 ? (
                            <div className="space-y-2 max-h-52 overflow-y-auto hide-scrollbar">
                                {fallbackMRs.map((mr) => (
                                    <label
                                        key={mr._id}
                                        className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                                            selectedMR === mr._id
                                                ? "border-indigo-500 bg-indigo-500/10"
                                                : "border-gray-700 hover:border-gray-600"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="selectedMR"
                                            value={mr._id}
                                            checked={selectedMR === mr._id}
                                            onChange={(e) => setSelectedMR(e.target.value)}
                                            className="accent-indigo-500"
                                        />

                                        <div>
                                            <p className="text-sm font-medium">{mr.fullName}</p>
                                            <p className="text-xs text-gray-400">{mr.mobile}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400">
                                No additional MRs available.
                            </p>
                        )
                    ) : (
                        <p className="text-sm text-gray-400">
                            Expand this list if you want to assign someone outside the nearby recommendations.
                        </p>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-5">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-700 rounded-lg"
                >
                    Cancel
                </button>

                <button
                    onClick={handleAssign}
                    disabled={isPending}
                    className="px-4 py-2 bg-indigo-600 rounded-lg"
                >
                    {isPending ? "Assigning..." : "Assign"}
                </button>
            </div>
        </Modal>
    );
};

export default AssignMRModal;
