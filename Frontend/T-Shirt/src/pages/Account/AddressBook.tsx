import { useState } from "react";
import { MapPin, Plus, Home, Briefcase, Tag, CheckCircle2, Trash2, Edit3 } from "lucide-react";
import {
  useUserAddresses,
  useAddAddress,
  useUpdateAddress,
  useSetDefaultAddress,
  useDeleteAddress,
} from "../../hooks/useAddresses";
import type { Address, CreateAddressPayload, AddressType } from "../../types/address";
import AddressFormModal from "../../components/checkout/AddressFormModal";

export default function AddressBook() {
  const { data: addresses, isLoading, isError, refetch } = useUserAddresses();
  const addMutation = useAddAddress();
  const updateMutation = useUpdateAddress();
  const setDefaultMutation = useSetDefaultAddress();
  const deleteMutation = useDeleteAddress();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addr: Address) => {
    setEditingAddress(addr);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (payload: CreateAddressPayload) => {
    if (editingAddress) {
      await updateMutation.mutateAsync({ id: editingAddress.id, payload });
    } else {
      await addMutation.mutateAsync(payload);
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmId) {
      await deleteMutation.mutateAsync(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const getTypeIcon = (type: AddressType) => {
    switch (type) {
      case "HOME":
        return <Home className="w-3.5 h-3.5" />;
      case "OFFICE":
        return <Briefcase className="w-3.5 h-3.5" />;
      default:
        return <Tag className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-extrabold uppercase tracking-wider text-[var(--color-foreground)] flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-500" /> SAVED ADDRESSES
          </h2>
          <p className="text-xs text-[var(--color-muted)]">
            Manage your delivery address book. Address edits do not modify historical order snapshots.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-400 shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add New Address
        </button>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse space-y-3">
              <div className="h-4 bg-slate-300 dark:bg-slate-800 rounded-sm w-1/3" />
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-sm w-2/3" />
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-sm w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="p-6 rounded-2xl border border-red-500/30 bg-red-500/10 text-center space-y-3">
          <p className="text-sm font-bold text-red-500">Failed to load saved addresses.</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold uppercase tracking-wider"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && addresses?.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
          <MapPin className="w-10 h-10 mx-auto text-[var(--color-muted)] opacity-50" />
          <h3 className="text-sm font-bold text-[var(--color-foreground)]">No addresses saved yet</h3>
          <p className="text-xs text-[var(--color-muted)] max-w-sm mx-auto">
            Add a delivery address for faster checkout on your orders.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-foreground)] text-[var(--color-background)] font-bold text-xs uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" /> Add Address
          </button>
        </div>
      )}

      {/* Address Cards Grid */}
      {!isLoading && !isError && addresses && addresses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr: Address) => (
            <div
              key={addr.id}
              className={`relative p-5 rounded-2xl border transition-all duration-300 ${
                addr.defaultAddress
                  ? "border-amber-500 bg-amber-500/5 shadow-md"
                  : "border-slate-200 dark:border-slate-800 bg-[var(--color-surface)] hover:border-slate-400 dark:hover:border-slate-700"
              }`}
            >
              {/* Header Badges */}
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-[var(--color-foreground)]">
                  {getTypeIcon(addr.addressType)} {addr.addressType}
                </span>

                {addr.defaultAddress ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-black">
                    <CheckCircle2 className="w-3 h-3" /> DEFAULT
                  </span>
                ) : (
                  <button
                    onClick={() => setDefaultMutation.mutate(addr.id)}
                    disabled={setDefaultMutation.isPending}
                    className="text-[10px] font-bold text-slate-400 hover:text-amber-500 transition-colors uppercase tracking-wider"
                  >
                    Set as Default
                  </button>
                )}
              </div>

              {/* Recipient & Address */}
              <div className="space-y-1 text-xs">
                <p className="font-extrabold text-[var(--color-foreground)] text-sm">{addr.fullName}</p>
                <p className="text-[var(--color-muted)] font-medium">📞 {addr.phone}</p>
                <p className="text-[var(--color-foreground)] leading-relaxed pt-1">
                  {addr.addressLine1}
                  {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                </p>
                <p className="text-[var(--color-foreground)] font-semibold">
                  {addr.city}, {addr.state} - <span className="font-mono">{addr.postalCode}</span>
                </p>
                <p className="text-[10px] text-[var(--color-muted)] uppercase tracking-wider">{addr.country}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => handleOpenEdit(addr)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>

                <button
                  onClick={() => setDeleteConfirmId(addr.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Address Form Modal */}
      <AddressFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingAddress}
        loading={addMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-[var(--color-foreground)]">Delete Address?</h3>
            <p className="text-xs text-[var(--color-muted)] leading-relaxed">
              Are you sure you want to delete this address? If this is your default address, another address will be assigned as default automatically.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-500 text-white hover:bg-red-600 transition-all disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete Address"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
