import { useMemo, useState } from "react";
import { Check, Download, X } from "lucide-react";
import type { KycApproval, KycUser } from "../../common/types/types";
import {
  useApproveKyc,
  useApproveVideoKyc,
  usePendingKycs,
  useRejectKyc,
  useRejectVideoKyc,
} from "../../hooks/useKYCApproval";
import PageHeader from "../common/layout/PageHeader";
import SearchInput from "../common/inputs/SearchInput";
import TableCard from "../common/table/TableCard";
import DataTable from "../common/table/DataTable";
import MobileList from "../common/table/MobileList";
import Modal from "../common/modal/Modal";
import { confirmDialog } from "../../utils/confirmDialog";
import { formatDateIndian } from "../../utils/dateFormat";

const getUserDetails = (user: string | KycUser) => {
  if (typeof user === "string") {
    return { name: "Unknown", email: "-", id: user };
  }

  return {
    name: user.fullName || user.fullname || "Unknown",
    email: user.email || "-",
    id: user._id,
  };
};

const shorten = (value?: string, max = 14) => {
  if (!value) return "-";
  if (value.length <= max) return value;
  return `${value.slice(0, max)}...`;
};

const KYCApprovals = () => {
  const [search, setSearch] = useState("");
  const [rejecting, setRejecting] = useState<KycApproval | null>(null);
  const [rejectMode, setRejectMode] = useState<"kyc" | "video">("kyc");
  const [rejectionReason, setRejectionReason] = useState("");

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePendingKycs();
  const approveMutation = useApproveKyc();
  const rejectMutation = useRejectKyc();
  const approveVideoMutation = useApproveVideoKyc();
  const rejectVideoMutation = useRejectVideoKyc();

  const kycs: KycApproval[] = data?.pages.flatMap((p) => p.data) ?? [];

  const filteredKycs = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return kycs;

    return kycs.filter((kyc) => {
      const user = getUserDetails(kyc.userId);
      return (
        (kyc.fullname || "").toLowerCase().includes(query) ||
        (user.name || "").toLowerCase().includes(query) ||
        (user.email || "").toLowerCase().includes(query) ||
        (kyc.aadhaarHolderName || "").toLowerCase().includes(query) ||
        (kyc.panHolderName || "").toLowerCase().includes(query) ||
        (kyc.bankHolderName || "").toLowerCase().includes(query) ||
        (kyc.panNumber || "").toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query)
      );
    });
  }, [kycs, search]);

  const handleApprove = async (kyc: KycApproval) => {
    const confirmed = await confirmDialog(
      "approve",
      "Approve KYC?",
      "This MR will get full dashboard access after approval."
    );

    if (!confirmed) return;
    await approveMutation.mutateAsync(kyc._id);
  };

  const handleApproveVideo = async (kyc: KycApproval) => {
    const confirmed = await confirmDialog(
      "approve",
      "Approve video KYC?",
      "This will move the video review to verified and may send KYC for final approval."
    );

    if (!confirmed) return;
    await approveVideoMutation.mutateAsync(kyc._id);
  };

  const handleRejectSubmit = async () => {
    if (!rejecting) return;
    if (!rejectionReason.trim()) return;

    if (rejectMode === "video") {
      await rejectVideoMutation.mutateAsync({
        kycId: rejecting._id,
        reason: rejectionReason.trim(),
      });
    } else {
      await rejectMutation.mutateAsync({
        kycId: rejecting._id,
        reason: rejectionReason.trim(),
      });
    }

    setRejecting(null);
    setRejectionReason("");
  };

  if (isLoading) {
    return (
      <div className="bg-[#0f172a] rounded-xl p-6 border border-gray-800">
        <p className="text-gray-400">Loading KYC approvals...</p>
      </div>
    );
  }

  if (isError) {
    const httpStatus = (error as any)?.response?.status;
    const message =
      (error as any)?.response?.data?.message ||
      (error as any)?.message ||
      "Network error";

    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-100">
        <h2 className="text-lg font-semibold">KYC List Unavailable</h2>
        <p className="mt-2 text-sm text-red-300">
          {httpStatus === 404
            ? "The backend is missing the GET /kyc/all endpoint. Ask the backend developer to add it."
            : httpStatus === 403 || httpStatus === 401
              ? "You are not authorized to view the KYC list. Ensure you are logged in as ADMIN."
              : `Server error: ${message}`}
        </p>
        <p className="mt-3 font-mono text-xs text-red-400">
          GET /api/v1/kyc/all → {httpStatus ?? "no response"}
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="KYC Approvals">
        <div className="w-full md:w-72">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by name, email, PAN..."
          />
        </div>
      </PageHeader>

      <TableCard>
        <DataTable
          headers={[
            "Applicant",
            "Contact",
            "PAN",
            "Aadhaar",
            "Bank",
            "Video",
            "Submitted",
            "Action",
          ]}
          isEmpty={filteredKycs.length === 0}
          emptyText="No pending KYC requests"
        >
          {filteredKycs.map((kyc) => {
            const user = getUserDetails(kyc.userId);
            const needsVideoReview =
              Boolean(kyc.kycVideo) &&
              kyc.videoKycStatus !== "verified" &&
              !kyc.isVideoVerified;
            const canFinalReview =
              kyc.status === "pending" ||
              kyc.status === "video_uploaded" ||
              kyc.videoKycStatus === "verified" ||
              kyc.isVideoVerified;

            return (
              <tr
                key={kyc._id}
                className="border-t border-gray-800 hover:bg-[#020617]"
              >
                <td className="px-6 py-4 font-medium">
                  {kyc.fullname || user.name}
                </td>
                <td className="px-6 py-4 text-gray-400">
                  <div>{user.email}</div>
                  <div className="text-xs text-gray-500">{user.id}</div>
                </td>
                <td className="px-6 py-4">
                  <div>{kyc.panNumber || "-"}</div>
                  {kyc.panHolderName && (
                    <div className="text-xs text-green-400">{kyc.panHolderName}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div>{shorten(kyc.aadhaarNumber)}</div>
                  {kyc.aadhaarHolderName && (
                    <div className="text-xs text-green-400">{kyc.aadhaarHolderName}</div>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-400">
                  <div>{shorten(kyc.bankAccountNumber || kyc.bankAccount)}</div>
                  <div className="text-xs text-gray-500">{kyc.ifscCode || kyc.bankIfsc || "-"}</div>
                  {kyc.bankHolderName && (
                    <div className="text-xs text-green-400">{kyc.bankHolderName}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  {kyc.kycVideo ? (
                    <div className="space-y-1">
                      <a
                        href={kyc.kycVideo}
                        download
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                      >
                        <Download size={12} />
                        Download
                      </a>
                      <div className="text-xs text-gray-500">
                        {kyc.videoKycStatus || (kyc.isVideoVerified ? "verified" : "pending")}
                      </div>
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-6 py-4 text-gray-400">
                  {formatDateIndian(kyc.createdAt)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {needsVideoReview ? (
                      <button
                        onClick={() => handleApproveVideo(kyc)}
                        disabled={approveVideoMutation.isPending}
                        className="inline-flex items-center gap-1 rounded-lg bg-indigo-600/20 px-3 py-1 text-xs text-indigo-300 hover:bg-indigo-600/30 disabled:opacity-50"
                      >
                        <Check size={14} />
                        Approve Video
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApprove(kyc)}
                        disabled={approveMutation.isPending || !canFinalReview}
                        className="inline-flex items-center gap-1 rounded-lg bg-green-600/20 px-3 py-1 text-xs text-green-400 hover:bg-green-600/30 disabled:opacity-50"
                      >
                        <Check size={14} />
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setRejecting(kyc);
                        setRejectMode(needsVideoReview ? "video" : "kyc");
                        setRejectionReason("");
                      }}
                      disabled={rejectMutation.isPending || rejectVideoMutation.isPending}
                      className="inline-flex items-center gap-1 rounded-lg bg-red-600/20 px-3 py-1 text-xs text-red-400 hover:bg-red-600/30 disabled:opacity-50"
                    >
                      <X size={14} />
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </DataTable>

        <MobileList
          data={filteredKycs}
          emptyText="No pending KYC requests"
          renderItem={(kyc) => {
            const user = getUserDetails(kyc.userId);
            const needsVideoReview =
              Boolean(kyc.kycVideo) &&
              kyc.videoKycStatus !== "verified" &&
              !kyc.isVideoVerified;
            const canFinalReview =
              kyc.status === "pending" ||
              kyc.status === "video_uploaded" ||
              kyc.videoKycStatus === "verified" ||
              kyc.isVideoVerified;

            return (
              <div className="rounded-xl border border-gray-800 bg-[#020617] p-4">
                <p className="text-sm font-semibold">{kyc.fullname || user.name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
                <p className="mt-2 text-xs text-gray-400">
                  PAN: {kyc.panNumber || "-"}
                  {kyc.panHolderName && <span className="ml-1 text-green-400">({kyc.panHolderName})</span>}
                </p>
                <p className="text-xs text-gray-400">
                  Aadhaar: {shorten(kyc.aadhaarNumber)}
                  {kyc.aadhaarHolderName && <span className="ml-1 text-green-400">({kyc.aadhaarHolderName})</span>}
                </p>
                <p className="text-xs text-gray-400">
                  Bank: {shorten(kyc.bankAccountNumber || kyc.bankAccount)} / {kyc.ifscCode || kyc.bankIfsc || "-"}
                  {kyc.bankHolderName && <span className="ml-1 text-green-400">({kyc.bankHolderName})</span>}
                </p>
                {kyc.kycVideo && (
                  <div className="mt-2">
                    <a
                      href={kyc.kycVideo}
                      download
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400"
                    >
                      <Download size={12} />
                      Download KYC video
                    </a>
                    <p className="text-xs text-gray-500">
                      Video: {kyc.videoKycStatus || (kyc.isVideoVerified ? "verified" : "pending")}
                    </p>
                  </div>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Submitted: {formatDateIndian(kyc.createdAt)}
                </p>

                <div className="mt-3 flex gap-2">
                  {needsVideoReview ? (
                    <button
                      onClick={() => handleApproveVideo(kyc)}
                      disabled={approveVideoMutation.isPending}
                      className="rounded-lg bg-indigo-600/20 px-3 py-1 text-xs text-indigo-300 disabled:opacity-50"
                    >
                      Approve Video
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApprove(kyc)}
                      disabled={approveMutation.isPending || !canFinalReview}
                      className="rounded-lg bg-green-600/20 px-3 py-1 text-xs text-green-400 disabled:opacity-50"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setRejecting(kyc);
                      setRejectMode(needsVideoReview ? "video" : "kyc");
                      setRejectionReason("");
                    }}
                    disabled={rejectMutation.isPending || rejectVideoMutation.isPending}
                    className="rounded-lg bg-red-600/20 px-3 py-1 text-xs text-red-400 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          }}
        />
      </TableCard>

      {hasNextPage && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="rounded-lg bg-gray-800 px-6 py-2 text-sm text-gray-300 hover:bg-gray-700 disabled:opacity-50"
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {rejecting && (
        <Modal onClose={() => setRejecting(null)} width="480px">
          <h3 className="text-lg font-semibold text-white">
            Reject {rejectMode === "video" ? "Video KYC" : "KYC"}
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            Add a rejection reason so MR can correct details and resubmit.
          </p>

          <textarea
            value={rejectionReason}
            onChange={(event) => setRejectionReason(event.target.value)}
            rows={4}
            placeholder="Enter rejection reason"
            className="mt-4 w-full rounded-lg border border-gray-700 bg-[#020617] p-3 text-sm outline-none focus:border-indigo-500"
          />

          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setRejecting(null)}
              className="rounded-lg bg-gray-700 px-3 py-2 text-sm hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleRejectSubmit}
              disabled={
                !rejectionReason.trim() ||
                rejectMutation.isPending ||
                rejectVideoMutation.isPending
              }
              className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-500 disabled:opacity-50"
            >
              Submit Rejection
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default KYCApprovals;
