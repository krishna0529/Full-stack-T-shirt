import { useState } from "react";
import { Package, AlertTriangle, PlusCircle, Sliders, History, X } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  useAdminInventory,
  useRestockVariant,
  useAdjustStock,
  useStockMovements,
} from "../../hooks/useInventory";
import type { InventoryItem } from "../../types/inventory";

export default function AdminInventory() {
  const [page, setPage] = useState(0);
  const { data: pageData, isLoading } = useAdminInventory(page, 10);

  const [selectedVariant, setSelectedVariant] = useState<InventoryItem | null>(null);
  const [modalType, setModalType] = useState<"RESTOCK" | "ADJUST" | "HISTORY" | null>(null);

  const [quantityInput, setQuantityInput] = useState("");
  const [reasonInput, setReasonInput] = useState("");

  const restockMutation = useRestockVariant();
  const adjustMutation = useAdjustStock();
  const { data: movementsData } = useStockMovements(
    modalType === "HISTORY" && selectedVariant ? selectedVariant.variantId : undefined,
    0,
    20
  );

  const handleOpenRestock = (item: InventoryItem) => {
    setSelectedVariant(item);
    setQuantityInput("50");
    setReasonInput("New warehouse stock batch");
    setModalType("RESTOCK");
  };

  const handleOpenAdjust = (item: InventoryItem) => {
    setSelectedVariant(item);
    setQuantityInput("-2");
    setReasonInput("Damaged goods / inspection adjustment");
    setModalType("ADJUST");
  };

  const handleOpenHistory = (item: InventoryItem) => {
    setSelectedVariant(item);
    setModalType("HISTORY");
  };

  const handleSubmitModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVariant) return;

    const val = parseInt(quantityInput, 10);
    if (isNaN(val)) return;

    if (modalType === "RESTOCK") {
      restockMutation.mutate(
        { variantId: selectedVariant.variantId, payload: { quantity: val, reason: reasonInput } },
        { onSuccess: () => setModalType(null) }
      );
    } else if (modalType === "ADJUST") {
      adjustMutation.mutate(
        { variantId: selectedVariant.variantId, payload: { adjustment: val, reason: reasonInput } },
        { onSuccess: () => setModalType(null) }
      );
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
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-wider text-[var(--color-foreground)]">
                INVENTORY & RESERVATIONS
              </h1>
              <p className="text-xs text-[var(--color-muted)]">
                Real-time stock monitoring, atomic reservation tracking, and restock management
              </p>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="rounded-2xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-[var(--color-muted)] animate-pulse">
              Loading inventory records...
            </div>
          ) : !pageData || pageData.content.length === 0 ? (
            <div className="p-12 text-center text-xs text-[var(--color-muted)]">
              No inventory records found. Add product variants to generate stock tracking.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider font-bold text-[var(--color-muted)]">
                  <tr>
                    <th className="p-4">Product & SKU</th>
                    <th className="p-4">Color / Size</th>
                    <th className="p-4 text-center">Total Stock</th>
                    <th className="p-4 text-center">Reserved</th>
                    <th className="p-4 text-center">Available Stock</th>
                    <th className="p-4">Stock Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {pageData.content.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-[var(--color-foreground)]">{item.productName}</p>
                        <p className="font-mono text-[10px] text-amber-500 font-semibold">{item.sku}</p>
                      </td>
                      <td className="p-4 font-semibold text-[var(--color-foreground)]">
                        {item.color} / <span className="font-black text-amber-500">{item.size}</span>
                      </td>
                      <td className="p-4 text-center font-bold text-[var(--color-foreground)]">
                        {item.totalStock}
                      </td>
                      <td className="p-4 text-center font-bold text-amber-500">
                        {item.reservedStock}
                      </td>
                      <td className="p-4 text-center font-black text-emerald-500 text-sm">
                        {item.availableStock}
                      </td>
                      <td className="p-4">
                        {item.outOfStock ? (
                          <span className="px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 font-bold text-[10px] uppercase">
                            OUT OF STOCK
                          </span>
                        ) : item.lowStock ? (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 font-bold text-[10px] uppercase flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3 h-3" /> LOW STOCK ({item.availableStock})
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-bold text-[10px] uppercase">
                            IN STOCK
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenRestock(item)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 font-bold flex items-center gap-1 transition-colors"
                          >
                            <PlusCircle className="w-3.5 h-3.5" /> Restock
                          </button>
                          <button
                            onClick={() => handleOpenAdjust(item)}
                            className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 font-bold flex items-center gap-1 transition-colors"
                          >
                            <Sliders className="w-3.5 h-3.5" /> Adjust
                          </button>
                          <button
                            onClick={() => handleOpenHistory(item)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-[var(--color-foreground)] hover:bg-slate-300 dark:hover:bg-slate-700 font-bold flex items-center gap-1 transition-colors"
                          >
                            <History className="w-3.5 h-3.5" /> Audit Log
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

        {/* Restock & Adjustment Modal */}
        {(modalType === "RESTOCK" || modalType === "ADJUST") && selectedVariant && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-[var(--color-foreground)]">
                  {modalType === "RESTOCK" ? "RESTOCK PRODUCT VARIANT" : "ADJUST VARIANT STOCK"}
                </h3>
                <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs space-y-1 bg-slate-100 dark:bg-slate-900 p-3 rounded-xl">
                <p className="font-bold text-[var(--color-foreground)]">{selectedVariant.productName}</p>
                <p className="text-[var(--color-muted)]">SKU: <span className="font-mono text-amber-500">{selectedVariant.sku}</span> ({selectedVariant.color} / {selectedVariant.size})</p>
                <p className="text-[var(--color-muted)]">Current Total Stock: <span className="font-bold text-[var(--color-foreground)]">{selectedVariant.totalStock}</span> | Available: <span className="font-bold text-emerald-500">{selectedVariant.availableStock}</span></p>
              </div>

              <form onSubmit={handleSubmitModal} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[var(--color-muted)] mb-1">
                    {modalType === "RESTOCK" ? "Restock Quantity (+)" : "Stock Adjustment (+ or -)"}
                  </label>
                  <input
                    type="number"
                    value={quantityInput}
                    onChange={(e) => setQuantityInput(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)] font-mono font-bold focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--color-muted)] mb-1">Reason for Adjustment</label>
                  <input
                    type="text"
                    value={reasonInput}
                    onChange={(e) => setReasonInput(e.target.value)}
                    required
                    placeholder="e.g. New warehouse batch / Damaged goods"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)] font-semibold focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-[var(--color-foreground)] font-bold uppercase text-[10px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={restockMutation.isPending || adjustMutation.isPending}
                    className="px-5 py-2 rounded-xl bg-amber-500 text-black font-bold uppercase text-[10px] hover:bg-amber-400"
                  >
                    {restockMutation.isPending || adjustMutation.isPending ? "Updating..." : "Confirm Stock Change"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Audit Log Drawer */}
        {modalType === "HISTORY" && selectedVariant && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-[var(--color-foreground)]">
                  STOCK MOVEMENT AUDIT TRAIL — {selectedVariant.sku}
                </h3>
                <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 space-y-3 pr-2">
                {!movementsData || movementsData.content.length === 0 ? (
                  <p className="py-8 text-center text-xs text-[var(--color-muted)]">
                    No stock movements recorded yet.
                  </p>
                ) : (
                  movementsData.content.map((m) => (
                    <div
                      key={m.id}
                      className="p-3.5 rounded-xl bg-[var(--color-background)] border border-slate-200 dark:border-slate-800 space-y-1 text-xs"
                    >
                      <div className="flex justify-between font-bold">
                        <span className="text-amber-500 uppercase tracking-wider font-mono">{m.movementType}</span>
                        <span className={m.quantity >= 0 ? "text-emerald-500" : "text-red-500"}>
                          {m.quantity >= 0 ? `+${m.quantity}` : m.quantity} units
                        </span>
                      </div>
                      <p className="text-[var(--color-muted)]">{m.reason || "System movement"}</p>
                      <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                        <span>Prev: {m.previousStock} → New: {m.newStock}</span>
                        <span>By {m.createdBy} on {new Date(m.createdAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
