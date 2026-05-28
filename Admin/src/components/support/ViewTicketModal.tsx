import { useState, useRef } from "react";
import { X } from "lucide-react";
import { useTicketDetails, useReplyTicket, useCloseTicket } from "../../hooks/useTickets";
import type { TicketReply } from "../../common/types/types";
import { confirmDialog } from "../../utils/confirmDialog";

type Props = {
  ticketId: string | null;
  onClose: () => void;
};

export default function ViewTicketModal({ ticketId, onClose }: Props) {
  const { data: ticket, isLoading } = useTicketDetails(ticketId || "");
  const [replyMessage, setReplyMessage] = useState("");
  const replyMutation = useReplyTicket();
  const closeMutation = useCloseTicket();
  const repliesEndRef = useRef<HTMLDivElement | null>(null);
  const handleReply = () => {
    if (!replyMessage.trim() || !ticketId) return;

    replyMutation.mutate(
      { id: ticketId, message: replyMessage },
      {
        onSuccess: () => {
          setReplyMessage("");
        },
      }
    );
  };
  const handleCloseTicket = async () => {
    if (!ticketId) return;

    const confirmed = await confirmDialog(
      "deactivate",
      "Close Ticket?",
      "This ticket will be marked as closed and cannot receive new replies."
    );

    if (!confirmed) return;

    closeMutation.mutate(ticketId);
  };

  if (!ticketId) return null;


  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

      <div className="bg-[#020617] w-full max-w-2xl rounded-xl shadow-lg p-6 relative max-h-[80vh] overflow-y-auto">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        {isLoading ? (
          <div className="text-gray-400">Loading ticket...</div>
        ) : (
          <>
            {/* Title */}
            <h2 className="text-lg font-semibold text-white mb-4">
              {ticket?.title}
            </h2>

            {/* User info */}
            <div className="text-sm text-gray-400 mb-4">
              <p>User: {ticket?.createdBy?.fullName}</p>
              <p>Email: {ticket?.createdBy?.email}</p>
              <p className="flex items-center gap-2">
                Status:
                <span
                  className={`text-xs px-2 py-1 rounded
      ${ticket?.status === "OPEN"
                      ? "bg-yellow-600"
                      : ticket?.status === "IN_PROGRESS"
                        ? "bg-blue-600"
                        : "bg-gray-600"
                    }`}
                >
                  {ticket?.status}
                </span>
              </p>
            </div>

            {/* Replies */}
            <div className="space-y-4 max-h-75 overflow-y-auto">
              {/* Original Ticket Message */}
              <div className="flex justify-start">
                <div className="max-w-[75%] p-3 rounded-lg bg-[#0f172a] text-sm text-gray-200">
                  <p>{ticket?.description}</p>

                  <div className="text-xs opacity-70 mt-1">
                    {ticket?.createdBy?.fullName} •{" "}
                    {new Date(ticket?.createdAt || "").toLocaleString()}
                  </div>
                </div>
              </div>

              {ticket.replies?.length === 0 && (
                <p className="text-gray-500 text-sm">
                  No replies yet
                </p>
              )}

              {ticket.replies?.map((reply: TicketReply, index: number) => {
                const isAdmin = reply.repliedBy?.role === "ADMIN";

                return (
                  <div
                    key={index}
                    className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] p-3 rounded-lg text-sm
        ${isAdmin
                          ? "bg-indigo-600 text-white"
                          : "bg-[#0f172a] text-gray-200"
                        }`}
                    >
                      <p>{reply.message}</p>

                      <div className="text-xs opacity-70 mt-1">
                        {reply.repliedBy?.fullName} •{" "}
                        {new Date(reply.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={repliesEndRef} />
            </div>
            <div className="mt-6 border-t border-gray-700 pt-4">

              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Write your reply..."
                className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3 text-sm resize-none"
                rows={3}
              />

              <div className="flex justify-between mt-3">

                <button
                  onClick={handleCloseTicket}
                  disabled={closeMutation.isPending || ticket?.status === "CLOSED"}
                  className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-sm disabled:opacity-50"
                >
                  {closeMutation.isPending ? "Closing..." : "Close Ticket"}
                </button>

                <button
                  onClick={handleReply}
                  disabled={replyMutation.isPending || ticket?.status === "CLOSED"}
                  className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm disabled:opacity-50"
                >
                  {replyMutation.isPending ? "Sending..." : "Send Reply"}
                </button>

              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}