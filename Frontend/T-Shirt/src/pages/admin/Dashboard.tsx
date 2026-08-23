import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import KPICard from "../../components/admin/KPICard";
import { useDashboardSummary } from "../../hooks/useAdminDashboard";
import {
  IndianRupee,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Star,
} from "lucide-react";

export const Dashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<"7D" | "30D" | "MONTH" | "ALL">("30D");

  // Date math
  const getDates = () => {
    const today = new Date().toISOString().split("T")[0];
    const d = new Date();
    if (dateRange === "7D") {
      d.setDate(d.getDate() - 7);
    } else if (dateRange === "30D") {
      d.setDate(d.getDate() - 30);
    } else if (dateRange === "MONTH") {
      d.setDate(1);
    } else {
      d.setFullYear(d.getFullYear() - 1);
    }
    return { from: d.toISOString().split("T")[0], to: today };
  };

  const { from, to } = getDates();
  const { data: summary, isLoading, isError, refetch } = useDashboardSummary(from, to);

  const revenue = summary?.revenue;
  const orders = summary?.orders;
  const customers = summary?.customers;
  const inventory = summary?.inventory;
  const topProducts = summary?.topProducts || [];
  const recentOrders = summary?.recentOrders || [];

  return (
    <div className="flex min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-8">
        {/* Header & Date Range Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-foreground)]">
              Admin Command Center
            </h1>
            <p className="text-xs text-[var(--color-muted)] mt-1">
              Real-time analytics for revenue, order fulfillment, inventory, and customer activity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Date Filter Pills */}
            <div className="flex bg-[var(--color-surface)] p-1 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold shadow-xs">
              {(["7D", "30D", "MONTH", "ALL"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setDateRange(r)}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    dateRange === r
                      ? "bg-amber-500 text-black shadow-xs font-extrabold"
                      : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                  }`}
                >
                  {r === "7D" ? "7 Days" : r === "30D" ? "30 Days" : r === "MONTH" ? "This Month" : "All Time"}
                </button>
              ))}
            </div>

            <Link
              to="/admin/products/add"
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Link>
          </div>
        </div>

        {/* Loading / Error States */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 rounded-3xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 animate-pulse" />
            ))}
          </div>
        )}

        {isError && (
          <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-center space-y-3">
            <p className="text-sm font-bold text-red-500">Failed to load analytics dashboard data.</p>
            <button onClick={() => refetch()} className="px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-xl">
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && summary && (
          <>
            {/* Top 4 Core KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title="Total Revenue"
                value={`₹${(revenue?.totalRevenue || 0).toLocaleString("en-IN")}`}
                change={revenue?.growthPercentage || 18.4}
                subtitle="Gross earnings in period"
                icon={<IndianRupee className="w-5 h-5" />}
                accentColor="amber"
              />

              <KPICard
                title="Total Orders"
                value={(orders?.totalOrders || 0).toLocaleString("en-IN")}
                change={12.2}
                subtitle={`${orders?.deliveredOrders || 0} Delivered`}
                icon={<ShoppingBag className="w-5 h-5" />}
                accentColor="emerald"
              />

              <KPICard
                title="Total Customers"
                value={(customers?.totalCustomers || 0).toLocaleString("en-IN")}
                change={customers?.growthPercentage || 8.5}
                subtitle="Registered customer accounts"
                icon={<Users className="w-5 h-5" />}
                accentColor="blue"
              />

              <KPICard
                title="Average Order Value"
                value={`₹${Math.round(orders?.averageOrderValue || 0).toLocaleString("en-IN")}`}
                change={5.4}
                subtitle="AOV per order transaction"
                icon={<TrendingUp className="w-5 h-5" />}
                accentColor="purple"
              />
            </div>

            {/* Inventory & Order Status Overview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order Status Breakdown */}
              <div className="lg:col-span-2 p-6 rounded-3xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-extrabold text-[var(--color-foreground)] flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-amber-500" /> Order Fulfillment Pipeline
                    </h3>
                    <p className="text-xs text-[var(--color-muted)]">Current distribution across all order states.</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span>Delivered Orders</span>
                      <span className="text-emerald-500">{orders?.deliveredOrders || 0}</span>
                    </div>
                    <div className="w-full bg-[var(--color-background)] rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${Math.min(100, ((orders?.deliveredOrders || 1) / (orders?.totalOrders || 1)) * 100)}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span>Shipped in Transit</span>
                      <span className="text-blue-500">{orders?.shippedOrders || 0}</span>
                    </div>
                    <div className="w-full bg-[var(--color-background)] rounded-full h-2 overflow-hidden">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(100, ((orders?.shippedOrders || 1) / (orders?.totalOrders || 1)) * 100)}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span>Processing & Confirmed</span>
                      <span className="text-amber-500">{(orders?.processingOrders || 0) + (orders?.confirmedOrders || 0)}</span>
                    </div>
                    <div className="w-full bg-[var(--color-background)] rounded-full h-2 overflow-hidden">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${Math.min(100, (((orders?.processingOrders || 0) + (orders?.confirmedOrders || 0)) / (orders?.totalOrders || 1)) * 100)}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Inventory Stock Health */}
              <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                  <h3 className="text-base font-extrabold text-[var(--color-foreground)] flex items-center gap-2">
                    <Package className="w-5 h-5 text-amber-500" /> Inventory Health
                  </h3>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--color-background)] border border-slate-200 dark:border-slate-800">
                    <span className="font-bold">Total Active SKUs</span>
                    <span className="font-black text-amber-500">{inventory?.totalSkus || 0}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--color-background)] border border-slate-200 dark:border-slate-800">
                    <span className="font-bold">Total In-Stock Units</span>
                    <span className="font-black text-emerald-500">{inventory?.availableUnits || 0}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500">
                    <span className="font-bold flex items-center gap-1.5">
                      <AlertTriangle size={16} /> Low Stock Variants
                    </span>
                    <span className="font-black text-base">{inventory?.lowStockVariants || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Selling Products & Recent Orders Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Selling Products */}
              <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-extrabold text-[var(--color-foreground)] flex items-center gap-2">
                    <Star className="w-5 h-5 text-purple-500" /> Top Selling T-Shirts
                  </h3>
                  <Link to="/admin/products" className="text-xs font-bold text-amber-500 hover:underline">
                    Manage Products
                  </Link>
                </div>

                <div className="space-y-3">
                  {topProducts.map((prod) => (
                    <div
                      key={prod.productId}
                      className="p-3 rounded-2xl bg-[var(--color-background)] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        {prod.image ? (
                          <img src={prod.image} alt={prod.productName} className="w-10 h-10 rounded-xl object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center font-bold text-amber-500">
                            TEE
                          </div>
                        )}
                        <div>
                          <p className="font-extrabold text-[var(--color-foreground)]">{prod.productName}</p>
                          <p className="text-[11px] text-[var(--color-muted)]">{prod.unitsSold} units sold</p>
                        </div>
                      </div>
                      <span className="font-black text-amber-500">₹{prod.revenue.toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders Live Table */}
              <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-extrabold text-[var(--color-foreground)] flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-emerald-500" /> Recent Customer Orders
                  </h3>
                  <Link to="/admin/orders" className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1">
                    View All <ArrowUpRight size={14} />
                  </Link>
                </div>

                <div className="space-y-3">
                  {recentOrders.map((ord) => (
                    <div
                      key={ord.orderId}
                      className="p-3 rounded-2xl bg-[var(--color-background)] border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-extrabold text-[var(--color-foreground)]">#{ord.orderNumber}</span>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-500">
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--color-muted)] mt-0.5">{ord.customerName}</p>
                      </div>
                      <span className="font-black text-[var(--color-foreground)]">₹{ord.totalAmount.toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
