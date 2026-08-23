import { useState } from "react";
import { Tag, Plus, X, Trash2, Edit3 } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  useAdminCoupons,
  useCreateCoupon,
  useUpdateCoupon,
  useToggleCouponStatus,
  useDeleteCoupon,
} from "../../hooks/useCoupons";
import type { Coupon, DiscountType, CreateCouponPayload } from "../../types/coupon";

export default function AdminCoupons() {
  const [page, setPage] = useState(0);
  const { data: pageData, isLoading } = useAdminCoupons(page, 10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Form State
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<DiscountType>("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState("");
  const [minimumOrderValue, setMinimumOrderValue] = useState("");
  const [maximumDiscount, setMaximumDiscount] = useState("");
  const [globalUsageLimit, setGlobalUsageLimit] = useState("");
  const [perUserUsageLimit, setPerUserUsageLimit] = useState("1");
  const [expiresAt, setExpiresAt] = useState("");

  const createMutation = useCreateCoupon();
  const updateMutation = useUpdateCoupon();
  const toggleMutation = useToggleCouponStatus();
  const deleteMutation = useDeleteCoupon();

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setCode("");
    setDescription("");
    setDiscountType("PERCENTAGE");
    setDiscountValue("20");
    setMinimumOrderValue("1999");
    setMaximumDiscount("500");
    setGlobalUsageLimit("10000");
    setPerUserUsageLimit("1");
    // Default 30 days expiry
    const future = new Date();
    future.setDate(future.getDate() + 30);
    setExpiresAt(future.toISOString().slice(0, 16));
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Coupon) => {
    setEditingCoupon(c);
    setCode(c.code);
    setDescription(c.description || "");
    setDiscountType(c.discountType);
    setDiscountValue(c.discountValue.toString());
    setMinimumOrderValue(c.minimumOrderValue ? c.minimumOrderValue.toString() : "");
    setMaximumDiscount(c.maximumDiscount ? c.maximumDiscount.toString() : "");
    setGlobalUsageLimit(c.globalUsageLimit ? c.globalUsageLimit.toString() : "");
    setPerUserUsageLimit(c.perUserUsageLimit ? c.perUserUsageLimit.toString() : "1");
    setExpiresAt(c.expiresAt ? c.expiresAt.slice(0, 16) : "");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateCouponPayload = {
      code: code.toUpperCase().trim(),
      description,
      discountType,
      discountValue: parseFloat(discountValue),
      minimumOrderValue: minimumOrderValue ? parseFloat(minimumOrderValue) : undefined,
      maximumDiscount: maximumDiscount ? parseFloat(maximumDiscount) : undefined,
      globalUsageLimit: globalUsageLimit ? parseInt(globalUsageLimit, 10) : undefined,
      perUserUsageLimit: perUserUsageLimit ? parseInt(perUserUsageLimit, 10) : undefined,
      expiresAt: new Date(expiresAt).toISOString(),
    };

    if (editingCoupon) {
      updateMutation.mutate(
        { id: editingCoupon.id, payload },
        { onSuccess: () => setIsModalOpen(false) }
      );
    } else {
      createMutation.mutate(payload, { onSuccess: () => setIsModalOpen(false) });
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-wider text-[var(--color-foreground)]">
                COUPON & DISCOUNT ENGINE
              </h1>
              <p className="text-xs text-[var(--color-muted)]">
                Manage promotional codes, minimum order criteria, usage caps, and discount rules
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs flex items-center gap-2 hover:bg-amber-400 transition-colors shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" /> Create Coupon
          </button>
        </div>

        {/* Coupons Table */}
        <div className="rounded-2xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-[var(--color-muted)] animate-pulse">
              Loading coupons...
            </div>
          ) : !pageData || pageData.content.length === 0 ? (
            <div className="p-12 text-center text-xs text-[var(--color-muted)]">
              No coupons created yet. Click 'Create Coupon' to generate your first promotion.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider font-bold text-[var(--color-muted)]">
                  <tr>
                    <th className="p-4">Coupon Code</th>
                    <th className="p-4">Discount Type & Value</th>
                    <th className="p-4">Min. Order / Max Cap</th>
                    <th className="p-4 text-center">Global Usage</th>
                    <th className="p-4">Expiry Date</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {pageData.content.map((coupon: Coupon) => (
                    <tr key={coupon.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="p-4">
                        <span className="font-mono font-black text-amber-500 text-sm px-2.5 py-1 bg-amber-500/10 rounded-lg">
                          {coupon.code}
                        </span>
                        {coupon.description && (
                          <p className="text-[10px] text-[var(--color-muted)] mt-1">{coupon.description}</p>
                        )}
                      </td>
                      <td className="p-4 font-bold text-[var(--color-foreground)]">
                        {coupon.discountType === "PERCENTAGE" ? (
                          <span className="text-emerald-500 font-extrabold">{coupon.discountValue}% OFF</span>
                        ) : (
                          <span className="text-emerald-500 font-extrabold">₹{coupon.discountValue} OFF</span>
                        )}
                      </td>
                      <td className="p-4 text-[11px]">
                        <p>Min: <span className="font-semibold text-[var(--color-foreground)]">₹{coupon.minimumOrderValue || 0}</span></p>
                        {coupon.maximumDiscount && (
                          <p className="text-amber-500 font-semibold">Max Cap: ₹{coupon.maximumDiscount}</p>
                        )}
                      </td>
                      <td className="p-4 text-center font-mono font-bold text-[var(--color-foreground)]">
                        {coupon.globalUsageCount} / {coupon.globalUsageLimit || "∞"}
                      </td>
                      <td className="p-4 text-[11px] text-[var(--color-muted)] font-semibold">
                        {new Date(coupon.expiresAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => toggleMutation.mutate({ id: coupon.id, active: !coupon.active })}
                          className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase transition-colors ${
                            coupon.active
                              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20"
                              : "bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20"
                          }`}
                        >
                          {coupon.active ? "ACTIVE" : "INACTIVE"}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(coupon)}
                            className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteMutation.mutate(coupon.id)}
                            className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
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

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-[var(--color-foreground)]">
                  {editingCoupon ? "EDIT PROMOTIONAL COUPON" : "CREATE NEW COUPON"}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[var(--color-muted)] mb-1">Coupon Code</label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                      placeholder="e.g. SUMMER20"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)] font-mono font-bold uppercase focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--color-muted)] mb-1">Discount Type</label>
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as DiscountType)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)] font-bold focus:outline-hidden focus:border-amber-500"
                    >
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FIXED">Fixed Amount (₹)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[var(--color-muted)] mb-1">Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Get 20% off on summer t-shirt collection"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)] font-semibold focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[var(--color-muted)] mb-1">
                      {discountType === "PERCENTAGE" ? "Discount Percentage (%)" : "Discount Amount (₹)"}
                    </label>
                    <input
                      type="number"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      required
                      step="0.01"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)] font-bold focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--color-muted)] mb-1">Minimum Order Value (₹)</label>
                    <input
                      type="number"
                      value={minimumOrderValue}
                      onChange={(e) => setMinimumOrderValue(e.target.value)}
                      placeholder="e.g. 1999"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)] font-semibold focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[var(--color-muted)] mb-1">Max Discount Cap (₹)</label>
                    <input
                      type="number"
                      value={maximumDiscount}
                      onChange={(e) => setMaximumDiscount(e.target.value)}
                      placeholder="e.g. 500 (For % only)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)] font-semibold focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--color-muted)] mb-1">Expiry Date & Time</label>
                    <input
                      type="datetime-local"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)] font-semibold focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[var(--color-muted)] mb-1">Global Usage Limit</label>
                    <input
                      type="number"
                      value={globalUsageLimit}
                      onChange={(e) => setGlobalUsageLimit(e.target.value)}
                      placeholder="e.g. 10000"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)] font-semibold focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--color-muted)] mb-1">Per User Limit</label>
                    <input
                      type="number"
                      value={perUserUsageLimit}
                      onChange={(e) => setPerUserUsageLimit(e.target.value)}
                      placeholder="e.g. 1"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)] font-semibold focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-[var(--color-foreground)] font-bold uppercase text-[10px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="px-5 py-2 rounded-xl bg-amber-500 text-black font-bold uppercase text-[10px] hover:bg-amber-400"
                  >
                    {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Coupon"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
