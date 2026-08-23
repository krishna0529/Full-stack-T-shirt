import { useState } from "react";
import { Search, UserCheck, UserX, Shield, ShoppingBag, CreditCard } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useAdminCustomers, useToggleCustomerStatus } from "../../hooks/useAdminCustomers";

export default function AdminCustomers() {
  const [search, setSearch] = useState("");
  const [page] = useState(0);

  const { data: customerData, isLoading } = useAdminCustomers(page, 15, search);
  const toggleStatusMutation = useToggleCustomerStatus();

  const customers = customerData?.content || [];

  return (
    <div className="flex min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <AdminSidebar />
      <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500 flex items-center gap-1.5">
              <Shield size={14} /> CUSTOMER DIRECTORY
            </span>
            <h1 className="text-3xl font-black tracking-tight mt-1">Customer Management</h1>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 size-4 text-[var(--color-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer by name or email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 text-xs font-bold focus:outline-hidden focus:border-amber-500"
            />
          </div>
        </div>

        {/* Customer Table */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-[var(--color-surface)] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--color-background)] uppercase tracking-wider text-[var(--color-muted)] font-extrabold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Total Orders</th>
                  <th className="px-6 py-4">Total Spent</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-bold">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-[var(--color-muted)]">
                      Loading customer directory...
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-[var(--color-muted)]">
                      No customers found matching search filter.
                    </td>
                  </tr>
                ) : (
                  customers.map((c) => (
                    <tr key={c.id} className="hover:bg-[var(--color-background)]/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-black text-xs shrink-0">
                            {c.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-extrabold text-[var(--color-foreground)]">{c.fullName}</p>
                            <p className="text-[11px] text-[var(--color-muted)] font-normal">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[var(--color-muted)]">{c.phone}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-500 text-xs">
                          <ShoppingBag size={12} /> {c.totalOrders} orders
                        </span>
                      </td>
                      <td className="px-6 py-4 text-emerald-500 font-black">
                        <span className="inline-flex items-center gap-1">
                          <CreditCard size={12} /> ₹{c.totalSpent.toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase ${
                            c.active
                              ? "bg-emerald-500/20 text-emerald-500"
                              : "bg-red-500/20 text-red-500"
                          }`}
                        >
                          {c.active ? <UserCheck size={12} /> : <UserX size={12} />}
                          {c.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => toggleStatusMutation.mutate(c.id)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase transition-all ${
                            c.active
                              ? "border border-red-500/30 text-red-500 hover:bg-red-500/10"
                              : "border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
                          }`}
                        >
                          {c.active ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
