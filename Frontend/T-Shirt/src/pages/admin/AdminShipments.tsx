import { useState } from "react";
import { Truck, PackageCheck, Send, CheckCircle2, History, X } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  useAdminShipments,
  usePackShipment,
  useShipShipment,
  useUpdateShipmentStatus,
  useAddTrackingEvent,
} from "../../hooks/useShipping";
import type { Shipment, ShipmentStatus } from "../../types/shipping";

export default function AdminShipments() {
  const [page, setPage] = useState(0);
  const { data: pageData, isLoading } = useAdminShipments(page, 10);

  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [activeModal, setActiveModal] = useState<"PACK" | "SHIP" | "STATUS" | "EVENT" | null>(null);

  // Form State
  const [carrierInput, setCarrierInput] = useState("");
  const [trackingInput, setTrackingInput] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<ShipmentStatus>("IN_TRANSIT");
  const [eventLocation, setEventLocation] = useState("");
  const [eventMessage, setEventMessage] = useState("");

  const packMutation = usePackShipment();
  const shipMutation = useShipShipment();
  const updateStatusMutation = useUpdateShipmentStatus();
  const addEventMutation = useAddTrackingEvent();

  const handleOpenPack = (s: Shipment) => {
    setSelectedShipment(s);
    setCarrierInput(s.carrier || "Delhivery Express");
    setActiveModal("PACK");
  };

  const handleOpenShip = (s: Shipment) => {
    setSelectedShipment(s);
    setTrackingInput(s.trackingNumber || "");
    setActiveModal("SHIP");
  };

  const handleOpenStatus = (s: Shipment) => {
    setSelectedShipment(s);
    setSelectedStatus(s.status);
    setActiveModal("STATUS");
  };

  const handleOpenEvent = (s: Shipment) => {
    setSelectedShipment(s);
    setSelectedStatus(s.status);
    setEventLocation("Hub Station - Regional FC");
    setEventMessage("Package processed through sorting facility");
    setActiveModal("EVENT");
  };

  const handleSubmitModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment) return;

    if (activeModal === "PACK") {
      packMutation.mutate(
        { id: selectedShipment.id, carrier: carrierInput },
        { onSuccess: () => setActiveModal(null) }
      );
    } else if (activeModal === "SHIP") {
      shipMutation.mutate(
        { id: selectedShipment.id, trackingNumber: trackingInput },
        { onSuccess: () => setActiveModal(null) }
      );
    } else if (activeModal === "STATUS") {
      updateStatusMutation.mutate(
        { id: selectedShipment.id, status: selectedStatus },
        { onSuccess: () => setActiveModal(null) }
      );
    } else if (activeModal === "EVENT") {
      addEventMutation.mutate(
        {
          id: selectedShipment.id,
          payload: {
            status: selectedStatus,
            location: eventLocation,
            message: eventMessage,
          },
        },
        { onSuccess: () => setActiveModal(null) }
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
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-wider text-[var(--color-foreground)]">
                SHIPMENT & DELIVERY MANAGEMENT
              </h1>
              <p className="text-xs text-[var(--color-muted)]">
                Carrier dispatch, real-time logistics tracking, and delivery status updates
              </p>
            </div>
          </div>
        </div>

        {/* Shipments Table */}
        <div className="rounded-2xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-[var(--color-muted)] animate-pulse">
              Loading shipment records...
            </div>
          ) : !pageData || pageData.content.length === 0 ? (
            <div className="p-12 text-center text-xs text-[var(--color-muted)]">
              No shipments created yet. Placed orders automatically initialize shipment records upon payment confirmation.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider font-bold text-[var(--color-muted)]">
                  <tr>
                    <th className="p-4">Order & Ref</th>
                    <th className="p-4">Carrier & Tracking</th>
                    <th className="p-4">Shipping Method</th>
                    <th className="p-4">Estimated Delivery</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {pageData.content.map((s: Shipment) => (
                    <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-[var(--color-foreground)]">{s.orderNumber}</p>
                        <p className="font-mono text-[10px] text-amber-500 font-semibold">{s.shipmentReference}</p>
                      </td>
                      <td className="p-4 font-semibold text-[var(--color-foreground)]">
                        <p>{s.carrier}</p>
                        <p className="font-mono text-[10px] text-slate-400 font-bold">{s.trackingNumber}</p>
                      </td>
                      <td className="p-4 font-bold text-amber-500">
                        {s.shippingMethod} (₹{s.shippingCost})
                      </td>
                      <td className="p-4 text-[11px] text-[var(--color-muted)] font-semibold">
                        {s.estimatedDeliveryFrom} to {s.estimatedDeliveryTo}
                      </td>
                      <td className="p-4 text-center">
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 font-extrabold text-[10px] uppercase">
                          {s.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {s.status === "CREATED" && (
                            <button
                              onClick={() => handleOpenPack(s)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 font-bold flex items-center gap-1 transition-colors"
                            >
                              <PackageCheck className="w-3.5 h-3.5" /> Pack
                            </button>
                          )}
                          {(s.status === "PACKED" || s.status === "CREATED") && (
                            <button
                              onClick={() => handleOpenShip(s)}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 font-bold flex items-center gap-1 transition-colors"
                            >
                              <Send className="w-3.5 h-3.5" /> Ship
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenStatus(s)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-[var(--color-foreground)] hover:bg-slate-300 dark:hover:bg-slate-700 font-bold flex items-center gap-1 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Status
                          </button>
                          <button
                            onClick={() => handleOpenEvent(s)}
                            className="px-2.5 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 font-bold flex items-center gap-1 transition-colors"
                          >
                            <History className="w-3.5 h-3.5" /> Event
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
        {activeModal && selectedShipment && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-[var(--color-foreground)]">
                  {activeModal === "PACK" && "PACK SHIPMENT"}
                  {activeModal === "SHIP" && "SHIP / DISPATCH PARCEL"}
                  {activeModal === "STATUS" && "UPDATE SHIPMENT STATUS"}
                  {activeModal === "EVENT" && "LOG LOGISTICS TRACKING EVENT"}
                </h3>
                <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitModal} className="space-y-4 text-xs">
                {activeModal === "PACK" && (
                  <div>
                    <label className="block font-bold text-[var(--color-muted)] mb-1">Carrier Partner</label>
                    <input
                      type="text"
                      value={carrierInput}
                      onChange={(e) => setCarrierInput(e.target.value)}
                      required
                      placeholder="e.g. Delhivery / BlueDart / Shiprocket"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)] font-semibold focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                )}

                {activeModal === "SHIP" && (
                  <div>
                    <label className="block font-bold text-[var(--color-muted)] mb-1">Tracking Number</label>
                    <input
                      type="text"
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                      required
                      placeholder="e.g. DEL-TRK-982137"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)] font-mono font-bold focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                )}

                {(activeModal === "STATUS" || activeModal === "EVENT") && (
                  <div>
                    <label className="block font-bold text-[var(--color-muted)] mb-1">Shipment Status</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value as ShipmentStatus)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)] font-bold focus:outline-hidden focus:border-amber-500"
                    >
                      <option value="CREATED">CREATED</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="PACKED">PACKED</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="IN_TRANSIT">IN_TRANSIT</option>
                      <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="DELIVERY_FAILED">DELIVERY_FAILED</option>
                      <option value="RETURNED">RETURNED</option>
                    </select>
                  </div>
                )}

                {activeModal === "EVENT" && (
                  <>
                    <div>
                      <label className="block font-bold text-[var(--color-muted)] mb-1">Current Hub Location</label>
                      <input
                        type="text"
                        value={eventLocation}
                        onChange={(e) => setEventLocation(e.target.value)}
                        required
                        placeholder="e.g. Ahmedabad Hub / Gandhidham Facility"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)] font-semibold focus:outline-hidden focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[var(--color-muted)] mb-1">Status Log Message</label>
                      <input
                        type="text"
                        value={eventMessage}
                        onChange={(e) => setEventMessage(e.target.value)}
                        required
                        placeholder="e.g. In transit to destination city hub"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)] font-semibold focus:outline-hidden focus:border-amber-500"
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-[var(--color-foreground)] font-bold uppercase text-[10px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      packMutation.isPending ||
                      shipMutation.isPending ||
                      updateStatusMutation.isPending ||
                      addEventMutation.isPending
                    }
                    className="px-5 py-2 rounded-xl bg-amber-500 text-black font-bold uppercase text-[10px] hover:bg-amber-400"
                  >
                    Confirm Action
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
