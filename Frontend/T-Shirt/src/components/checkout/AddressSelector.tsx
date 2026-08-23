import React, { useState } from "react";
import { Plus, Check, MapPin, Edit3 } from "lucide-react";
import type { Address, CreateAddressPayload } from "../../types/address";
import AddressFormModal from "./AddressFormModal";

interface AddressSelectorProps {
  addresses: Address[];
  selectedAddressId: number | null;
  onSelectAddress: (id: number) => void;
  onCreateAddress: (payload: CreateAddressPayload) => Promise<void>;
  onUpdateAddress: (id: number, payload: CreateAddressPayload) => Promise<void>;
}

export const AddressSelector: React.FC<AddressSelectorProps> = ({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onCreateAddress,
  onUpdateAddress,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleEdit = (address: Address, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (payload: CreateAddressPayload) => {
    if (editingAddress) {
      await onUpdateAddress(editingAddress.id, payload);
    } else {
      await onCreateAddress(payload);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-black font-bold text-xs">
            01
          </span>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-foreground)]">
            DELIVERY ADDRESS
          </h3>
        </div>
        <button
          type="button"
          onClick={handleAddNew}
          className="flex items-center gap-1 text-xs font-semibold text-amber-500 hover:text-amber-400 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add New Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-dashed border-slate-300 dark:border-slate-800 text-center">
          <MapPin className="w-8 h-8 text-amber-500 mx-auto mb-2 opacity-80" />
          <p className="text-xs text-[var(--color-muted)] mb-3">No delivery address saved yet.</p>
          <button
            onClick={handleAddNew}
            className="px-4 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors"
          >
            + Add Delivery Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {addresses.map((address) => {
            const isSelected = selectedAddressId === address.id;
            return (
              <div
                key={address.id}
                onClick={() => onSelectAddress(address.id)}
                className={`cursor-pointer p-4 rounded-2xl border transition-all relative ${
                  isSelected
                    ? "bg-amber-500/10 border-amber-500/80 shadow-xs"
                    : "bg-[var(--color-surface)] border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                      {address.addressType}
                    </span>
                    {address.defaultAddress && (
                      <span className="text-[10px] font-bold text-amber-500">DEFAULT</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleEdit(address, e)}
                      className="p-1 rounded-md text-slate-400 hover:text-amber-500 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-amber-500 text-black flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 space-y-1 text-xs">
                  <p className="font-bold text-[var(--color-foreground)]">{address.fullName}</p>
                  <p className="text-[var(--color-muted)] line-clamp-1">{address.addressLine1}</p>
                  {address.addressLine2 && (
                    <p className="text-[var(--color-muted)] line-clamp-1">{address.addressLine2}</p>
                  )}
                  <p className="text-[var(--color-muted)]">
                    {address.city}, {address.state} - {address.postalCode}
                  </p>
                  <p className="font-semibold text-[var(--color-foreground)] pt-1">
                    Ph: {address.phone}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AddressFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingAddress}
      />
    </div>
  );
};

export default AddressSelector;
