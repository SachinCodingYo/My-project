import { useState } from "react";
import {
  Users,
  Crown,
  RadioTower,
  Layers,
  UserCheck,
  Eye,
  Tag,
  ShoppingCart
} from "lucide-react";

import { useDashboard } from "../../hooks/useDashboard";
import ViewUserModal from "../users/ViewUserModal";
import type { DashboardUser } from "../../common/types/types";
import StatCard from "../common/cards/StatCard";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

  const { data, isLoading, isError } = useDashboard();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<DashboardUser | null>(null);

  if (isLoading) {
    return <p className="text-gray-400">Loading dashboard...</p>;
  }

  if (isError || !data) {
    return <p className="text-red-400">Failed to load dashboard</p>;
  }

  const stats = [
    { title: "Total Users", value: data.totalUserRole, icon: Users, path: "/users" },
    { title: "Total MRs", value: data.totalMR, icon: UserCheck, path: "/mrs" },
    { title: "Services", value: data.totalServices, icon: ShoppingCart, path: "/services" },
    { title: "Operators", value: data.totalOperators, icon: RadioTower, path: "/operators" },
    { title: "VIP Categories", value: data.totalVipCategories, icon: Crown, path: "/vip-categories" },
    { title: "Plan Types", value: data.totalPlanTypes, icon: Layers, path: "/plan-types" },
    { title: "Plan Tags", value: data.totalPlanTags, icon: Tag, path: "/plan-tags" },
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-500/10 text-purple-400 border border-purple-500/20";

      case "MR":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";

      case "USER":
        return "bg-gray-500/10 text-gray-300 border border-gray-500/20";

      default:
        return "bg-gray-700 text-gray-300";
    }
  };

  return (
    <div className="w-full overflow-x-hidden">

      <h1 className="text-xl sm:text-2xl font-semibold mb-6">
        Admin Overview
      </h1>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              onClick={() => navigate(item.path)}
              className="cursor-pointer hover:scale-105 transition-transform"
            >
              <StatCard
                title={item.title}
                value={item.value}
                icon={<Icon size={28} />}
              />
            </div>
          );
        })}
      </div>

      {/* RECENT USERS */}
      <div className="mt-5 bg-[#0f172a] border border-gray-800 rounded-xl p-3 sm:p-6">

        <h2 className="text-lg font-semibold mb-4">Recent Users</h2>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">

          <table className="w-full min-w-200 text-sm">

            <thead className="text-gray-400 border-b border-gray-800">
              <tr>
                <th className="text-left py-3">Name</th>
                <th className="text-left py-3">Email</th>
                <th className="text-left py-3">Mobile</th>
                <th className="text-left py-3">Role</th>
                <th className="text-left py-3">Verified</th>
                <th className="text-left py-3">Status</th>
                <th className="text-left py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {data.recentUsers.map((user: DashboardUser) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-900 hover:bg-[#020617] transition"
                >
                  <td className="py-3">{user.fullName}</td>
                  <td className="py-3 text-gray-400">{user.email}</td>
                  <td className="py-3 text-gray-400">{user.mobile}</td>

                  <td className="py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-md font-medium ${getRoleBadge(user.role)}`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="py-3">
                    {user.isVerified ? (
                      <span className="text-green-400 text-sm font-medium">
                        Verified
                      </span>
                    ) : (
                      <span className="text-red-400 text-sm font-medium">
                        Not Verified
                      </span>
                    )}
                  </td>

                  <td className="py-3">
                    {user.isActive ? (
                      <span className="text-green-400 text-sm font-medium">
                        Active
                      </span>
                    ) : (
                      <span className="text-red-400 text-sm font-medium">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="py-3">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="text-indigo-400 hover:text-indigo-300"
                      title="View User"
                    >
                      <Eye size={18} />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>

        {/* MOBILE USER CARDS */}
        <div className="md:hidden space-y-4">

          {data.recentUsers.map((user: DashboardUser) => (
            <div
              key={user._id}
              className="bg-[#020617] border border-gray-800 rounded-xl p-4"
            >

              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-white">
                  {user.fullName}
                </h3>

                <button
                  onClick={() => setSelectedUser(user)}
                  className="text-indigo-400"
                >
                  <Eye size={18} />
                </button>
              </div>

              <div className="text-sm text-gray-400">
                {user.email}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">

                <div>
                  <span className="text-gray-500">Mobile</span>
                  <div>{user.mobile}</div>
                </div>

                <div>
                  <span className="text-gray-500">Role</span>
                  <div>
                    <span
                      className={`px-2 py-1 text-xs rounded-md font-medium ${getRoleBadge(user.role)}`}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-gray-500">Verified</span>
                  <div className="text-green-400">
                    {user.isVerified ? "Verified" : "Not Verified"}
                  </div>
                </div>

                <div>
                  <span className="text-gray-500">Status</span>
                  <div className={user.isActive ? "text-green-400" : "text-red-400"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </div>
                </div>

              </div>

            </div>
          ))}

        </div>

      </div>

      {/* RECENT ORDERS */}
      {/* RECENT ORDERS */}
      <div className="mt-6 bg-[#0f172a] border border-gray-800 rounded-xl p-6">

        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ShoppingCart size={18} />
          Recent Orders
        </h2>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">

            <thead className="text-gray-400 border-b border-gray-800">
              <tr>
                <th className="text-left py-3">Order</th>
                <th className="text-left py-3">Date</th>
                <th className="text-left py-3">Amount</th>
                <th className="text-left py-3">Order Status</th>
                <th className="text-left py-3">Payment</th>
                <th className="text-left py-3">Assigned</th>
              </tr>
            </thead>

            <tbody>
              {data.recentOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-900 hover:bg-[#020617]"
                >

                  <td className="py-3 font-medium">
                    #{order.orderNumber}
                  </td>

                  <td className="py-3 text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-3 text-green-400 font-medium">
                    ₹{order.totalAmount}
                  </td>

                  {/* ORDER STATUS */}
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-md font-medium ${order.status === "ASSIGNED"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                        }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  {/* PAYMENT STATUS */}
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-md font-medium ${order.paymentStatus === "PAID"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>

                  {/* ASSIGNED */}
                  <td className="py-3">
                    {order.assignedTo ? (
                      <span className="text-gray-300 text-sm">
                        Assigned
                      </span>
                    ) : (
                      <span className="text-red-400 text-sm">
                        Unassigned
                      </span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* MOBILE VIEW */}
        <div className="md:hidden space-y-4">

          {data.recentOrders.map((order) => (
            <div
              key={order._id}
              className="bg-[#020617] border border-gray-800 rounded-xl p-4"
            >

              <div className="flex justify-between items-center mb-2">
                <div className="font-medium text-white">
                  #{order.orderNumber}
                </div>

                <div className="text-green-400 font-semibold">
                  ₹{order.totalAmount}
                </div>
              </div>

              <div className="text-xs text-gray-400 mb-3">
                {new Date(order.createdAt).toLocaleDateString()}
              </div>

              <div className="flex flex-wrap gap-2 text-xs">

                <span
                  className={`px-2 py-1 rounded-md ${order.status === "ASSIGNED"
                      ? "bg-blue-500/10 text-blue-400"
                      : "bg-yellow-500/10 text-yellow-400"
                    }`}
                >
                  {order.status}
                </span>

                <span
                  className={`px-2 py-1 rounded-md ${order.paymentStatus === "PAID"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                    }`}
                >
                  {order.paymentStatus}
                </span>

                <span
                  className={`px-2 py-1 rounded-md ${order.assignedTo
                      ? "bg-gray-700 text-gray-300"
                      : "bg-red-500/10 text-red-400"
                    }`}
                >
                  {order.assignedTo ? "Assigned" : "Unassigned"}
                </span>

              </div>

            </div>
          ))}

        </div>

      </div>

      {/* USER MODAL */}
      {selectedUser && (
        <ViewUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

    </div>
  );
};

export default Dashboard;