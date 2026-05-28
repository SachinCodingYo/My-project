import { useState } from "react";
import { Eye } from "lucide-react";
import { useTickets } from "../../hooks/useTickets";
import type { SupportTicket } from "../../common/types/types";
import ViewTicketModal from "./ViewTicketModal";

import PageHeader from "../common/layout/PageHeader";
import SearchInput from "../common/inputs/SearchInput";
import TableCard from "../common/table/TableCard";
import DataTable from "../common/table/DataTable";
import MobileList from "../common/table/MobileList";
import Loading from "../common/Loading";
import { formatDateIndian } from "../../utils/dateFormat";
import TicketStatusBadge from "../common/badges/TicketStatusBadge";

export default function Tickets() {
  const { data: tickets, isLoading } = useTickets();

  const [search, setSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "OPEN" | "IN_PROGRESS" | "CLOSED"
  >("ALL");

  const searchTerm = search.trim().toLowerCase();

  const allCount = tickets?.length || 0;
  const openCount = tickets?.filter((t) => t.status === "OPEN").length || 0;
  const inProgressCount =
    tickets?.filter((t) => t.status === "IN_PROGRESS").length || 0;
  const closedCount =
    tickets?.filter((t) => t.status === "CLOSED").length || 0;

  if (isLoading) return <Loading />;

  const filteredTickets: SupportTicket[] =
    tickets?.filter((ticket) => {
      const matchesSearch = ticket.title
        ?.toLowerCase()
        .includes(searchTerm);

      const matchesStatus =
        statusFilter === "ALL" || ticket.status === statusFilter;

      return matchesSearch && matchesStatus;
    }) || [];

  return (
    <div>
      {/* HEADER */}
      <PageHeader title="Support Tickets">
        <div className="w-full md:w-64">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search tickets..."
          />
        </div>
      </PageHeader>

      {/* STATUS FILTER */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { key: "ALL", label: "All", count: allCount },
          { key: "OPEN", label: "Open", count: openCount },
          { key: "IN_PROGRESS", label: "In Progress", count: inProgressCount },
          { key: "CLOSED", label: "Closed", count: closedCount },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() =>
              setStatusFilter(
                tab.key as "ALL" | "OPEN" | "IN_PROGRESS" | "CLOSED"
              )
            }
            className={`px-3 py-1 rounded text-sm flex items-center gap-2
            ${
              statusFilter === tab.key
                ? "bg-indigo-600 text-white"
                : "bg-[#0f172a] text-gray-400 hover:bg-[#1e293b]"
            }`}
          >
            {tab.label}
            <span className="text-xs bg-black/30 px-2 py-0.5 rounded">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <TableCard>

        {/* ✅ Desktop Table */}
        <DataTable
          headers={["Title", "User", "Role", "Status", "Created", "Action"]}
          isEmpty={filteredTickets.length === 0}
          emptyText="No support tickets available"
        >
          {filteredTickets.map((ticket) => (
            <tr
              key={ticket._id}
              className="border-t border-gray-800 hover:bg-[#020617]"
            >
              <td className="px-6 py-4">{ticket.title}</td>

              <td className="px-6 py-4">
                {ticket.createdBy?.fullName}
              </td>

              <td className="px-6 py-4">
                {ticket.createdBy?.role}
              </td>

              <td className="px-6 py-4">
                <TicketStatusBadge status={ticket.status} />
              </td>

              <td className="px-6 py-4">
                {formatDateIndian(ticket.createdAt)}
              </td>

              <td className="px-6 py-4">
                <button
                  onClick={() => setSelectedTicket(ticket._id)}
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  <Eye size={18} />
                </button>
              </td>
            </tr>
          ))}
        </DataTable>

        {/* ✅ Mobile List */}
        <MobileList
          data={filteredTickets}
          emptyText="No support tickets available"
          renderItem={(ticket) => (
            <div className="bg-[#020617] border border-gray-800 rounded-xl p-4 shadow-sm">

              {/* Top */}
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-sm">
                    {ticket.title}
                  </p>
                  <p className="text-xs text-gray-400">
                    {ticket.createdBy?.fullName}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedTicket(ticket._id)}
                  className="p-2 rounded-lg hover:bg-gray-800 text-indigo-400"
                >
                  <Eye size={18} />
                </button>
              </div>

              <div className="border-t border-gray-800 my-3"></div>

              {/* Middle */}
              <div className="text-xs text-gray-400 mb-2">
                {ticket.createdBy?.role}
              </div>

              <div className="mb-2">
                <TicketStatusBadge status={ticket.status} />
              </div>

              <div className="text-xs text-gray-400">
                {formatDateIndian(ticket.createdAt)}
              </div>

            </div>
          )}
        />

      </TableCard>

      {/* MODAL */}
      <ViewTicketModal
        ticketId={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />
    </div>
  );
}