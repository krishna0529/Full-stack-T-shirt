import { useState } from "react";
import type { TopProductSummary } from "../../types/adminDashboard";
import { TrendingUp, DollarSign, ShoppingBag, CreditCard, PieChart, ShieldCheck } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useDashboardSummary } from "../../hooks/useAdminDashboard";
import KPICard from "../../components/admin/KPICard";



const dateFilters = [
  { label: "Today", value: "today" },
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "This Year", value: "year" },
];

export default function AdminAnalyticsPage() {
  const [selectedFilter, setSelectedFilter] = useState("30d");
  const { data: dashboardData } = useDashboardSummary();

  const revenue = dashboardData?.revenue || { totalRevenue: 542850, percentageChange: 14.2 };
  const revenueChange = (revenue as { percentageChange?: number }).percentageChange ?? 14.2;
  const orders = dashboardData?.orders || { totalOrders: 428, pendingOrders: 12, processingOrders: 45, completedOrders: 350, cancelledOrders: 21 };
  const payments = dashboardData?.payments || { totalPayments: 542850, successfulPayments: 510000, pendingPayments: 12000, failedPayments: 20850, refundedPayments: 32500 };
  const paymentsRefunded = (payments as { refundedPayments?: number }).refundedPayments ?? 32500;
  const topProducts: TopProductSummary[] = dashboardData?.topProducts || [];

  return (
    <div className="flex min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <AdminSidebar />
      <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto space-y-8">
        
        {/* Header & Date Pills */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500 flex items-center gap-1.5">
              <TrendingUp size={14} /> FINANCIAL & SALES METRICS
            </span>
            <h1 className="text-3xl font-black tracking-tight mt-1">Analytics Dashboard</h1>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800">
            {dateFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setSelectedFilter(f.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  selectedFilter === f.value
                    ? "bg-amber-500 text-black shadow-xs"
                    : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Sales KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Gross Revenue"
            value={`₹${revenue.totalRevenue.toLocaleString("en-IN")}`}
            change={revenueChange}
            icon={<DollarSign size={20} />}
          />
          <KPICard
            title="Total Orders"
            value={orders.totalOrders.toLocaleString("en-IN")}
            change={8.4}
            subtitle="+8.4% completed"
            icon={<ShoppingBag size={20} />}
          />
          <KPICard
            title="Online Paid"
            value={`₹${payments.successfulPayments.toLocaleString("en-IN")}`}
            change={94.2}
            subtitle="94.2% success rate"
            icon={<CreditCard size={20} />}
          />
          <KPICard
            title="Total Refunds"
            value={`₹${paymentsRefunded.toLocaleString("en-IN")}`}
            change={-5.9}
            subtitle="5.9% refund rate"
            icon={<ShieldCheck size={20} />}
          />
        </div>

        {/* Payment Methods Distribution */}
        <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black flex items-center gap-2">
              <PieChart size={18} className="text-amber-500" /> Payment Methods Distribution
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[var(--color-background)] border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-[var(--color-muted)] uppercase">UPI (GPay / PhonePe)</span>
              <p className="text-xl font-black text-amber-500">₹2,40,000</p>
              <div className="w-full h-2 rounded-full bg-amber-500/20 overflow-hidden">
                <div className="h-full bg-amber-500 w-[45%]" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--color-background)] border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-[var(--color-muted)] uppercase">Credit / Debit Cards</span>
              <p className="text-xl font-black text-blue-500">₹1,80,000</p>
              <div className="w-full h-2 rounded-full bg-blue-500/20 overflow-hidden">
                <div className="h-full bg-blue-500 w-[33%]" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--color-background)] border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-[var(--color-muted)] uppercase">Net Banking</span>
              <p className="text-xl font-black text-purple-500">₹70,000</p>
              <div className="w-full h-2 rounded-full bg-purple-500/20 overflow-hidden">
                <div className="h-full bg-purple-500 w-[13%]" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--color-background)] border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-[var(--color-muted)] uppercase">Cash on Delivery</span>
              <p className="text-xl font-black text-emerald-500">₹52,850</p>
              <div className="w-full h-2 rounded-full bg-emerald-500/20 overflow-hidden">
                <div className="h-full bg-emerald-500 w-[9%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Top Selling Products List */}
        <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 space-y-6">
          <h3 className="text-lg font-black">Top Selling Products</h3>
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {topProducts.length === 0 ? (
              <div className="py-4 text-xs text-[var(--color-muted)]">No top products recorded.</div>
            ) : (
              topProducts.map((p, idx) => (
                <div key={p.productId} className="py-3.5 flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-black">
                      #{idx + 1}
                    </span>
                    <span className="text-[var(--color-foreground)]">{p.productName}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-[var(--color-muted)]">{p.unitsSold} units sold</span>
                    <span className="text-amber-500 font-black">₹{p.revenue.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
