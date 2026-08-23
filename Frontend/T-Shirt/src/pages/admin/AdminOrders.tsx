import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Filter } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useAdminOrders, useUpdateOrderStatus } from "../../hooks/useOrders";
import type { OrderStatus } from "../../types/order";

export default function AdminOrders() {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "ALL">("ALL");
  const [page, setPage] = useState(0);

  const statusQuery = selectedStatus === "ALL" ? undefined : selectedStatus;
  const { data: pageData, isLoading } = useAdminOrders(statusQuery, page, 10);
  const updateStatusMutation = useUpdateOrderStatus();

  const handleStatusChange = (orderNumber: string, newStatus: OrderStatus) => {
    updateStatusMutation.mutate({ orderNumber, status: newStatus, comment: `Updated to ${newStatus} by Admin` });
  };

  const statusOptions: OrderStatus[] = [
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "RETURN_REQUESTED",
    "RETURNED",
  ];

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-wider text-[var(--color-foreground)]">
                ORDER MANAGEMENT
              </h1>
              <p className="text-xs text-[var(--color-muted)]">
                Manage, filter, and update customer order lifecycles
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value as OrderStatus | "ALL");
                setPage(0);
              }}
              className="px-3.5 py-2 rounded-xl bg-[var(--color-surface)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)] font-semibold focus:outline-hidden focus:border-amber-500"
            >
              <option value="ALL">All Statuses</option>
              {statusOptions.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="rounded-2xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-[var(--color-muted)] animate-pulse">
              Loading orders...
            </div>
          ) : !pageData || pageData.content.length === 0 ? (
            <div className="p-12 text-center text-xs text-[var(--color-muted)]">
              No orders found for the selected filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider font-bold text-[var(--color-muted)]">
                  <tr>
                    <th className="p-4">Order #</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {pageData.content.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="p-4 font-mono font-bold text-amber-500">
                        #{order.orderNumber}
                      </td>
                      <td className="p-4 text-[var(--color-muted)]">
                        {new Date(order.placedAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-[var(--color-foreground)]">{order.shippingAddressName}</p>
                        <p className="text-[10px] text-[var(--color-muted)]">{order.shippingCity}, {order.shippingState}</p>
                      </td>
                      <td className="p-4 text-[var(--color-muted)] font-medium">
                        {order.items.length} item(s)
                      </td>
                      <td className="p-4 font-black text-[var(--color-foreground)]">
                        ₹{order.totalAmount}
                      </td>
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.orderNumber, e.target.value as OrderStatus)}
                          disabled={updateStatusMutation.isPending}
                          className="px-2.5 py-1 rounded-lg bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[10px] font-bold text-[var(--color-foreground)] focus:outline-hidden focus:border-amber-500"
                        >
                          {statusOptions.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          to={`/account/orders/${order.orderNumber}`}
                          className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 font-bold transition-colors"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          {pageData && pageData.totalPages > 1 && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs font-semibold">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="px-3.5 py-1.5 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {page + 1} of {pageData.totalPages}
              </span>
              <button
                disabled={pageData.last}
                onClick={() => setPage((p) => p + 1)}
                className="px-3.5 py-1.5 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
