import React, { useState, useEffect } from "react";
import { X, MapPin, CheckCircle2, AlertCircle, Loader2, Home, Building2 } from "lucide-react";
import type { CreateAddressPayload, AddressType, Address } from "../../types/address";
import { useDebounce } from "../../hooks/useDebounce";
import { useServiceability } from "../../hooks/useCheckout";

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateAddressPayload) => Promise<void>;
  initialData?: Address | null;
  loading?: boolean;
}

export const AddressFormModal: React.FC<AddressFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading = false,
}) => {
  const [fullName, setFullName] = useState(initialData?.fullName || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [addressLine1, setAddressLine1] = useState(initialData?.addressLine1 || "");
  const [addressLine2, setAddressLine2] = useState(initialData?.addressLine2 || "");
  const [city, setCity] = useState(initialData?.city || "");
  const [state, setState] = useState(initialData?.state || "");
  const [postalCode, setPostalCode] = useState(initialData?.postalCode || "");
  const [country, setCountry] = useState(initialData?.country || "India");
  const [addressType, setAddressType] = useState<AddressType>(initialData?.addressType || "HOME");
  const [defaultAddress, setDefaultAddress] = useState(initialData?.defaultAddress || false);

  const debouncedPincode = useDebounce(postalCode, 400);
  const isValidPincodeFormat = /^[1-9][0-9]{5}$/.test(debouncedPincode);
  const { data: serviceability, isFetching: checkingPincode } = useServiceability(
    isValidPincodeFormat ? debouncedPincode : undefined
  );

  // Auto-fill city and state when pincode lookup succeeds
  useEffect(() => {
    if (serviceability && serviceability.serviceable) {
      if (serviceability.city && serviceability.city !== "India") {
        setCity(serviceability.city);
      }
      if (serviceability.state && serviceability.state !== "India") {
        setState(serviceability.state);
      }
    }
  }, [serviceability]);

  // Reset or populate fields when modal opens / initialData changes
  useEffect(() => {
    if (isOpen) {
      setFullName(initialData?.fullName || "");
      setPhone(initialData?.phone || "");
      setAddressLine1(initialData?.addressLine1 || "");
      setAddressLine2(initialData?.addressLine2 || "");
      setCity(initialData?.city || "");
      setState(initialData?.state || "");
      setPostalCode(initialData?.postalCode || "");
      setCountry(initialData?.country || "India");
      setAddressType(initialData?.addressType || "HOME");
      setDefaultAddress(initialData?.defaultAddress || false);
    }
  }, [isOpen, initialData]);

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isPhoneValid = /^[6-9]\d{9}$/.test(phone.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPhoneValid) return;
    await onSubmit({
      fullName: fullName.trim(),
      phone: phone.trim(),
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2.trim() || undefined,
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      country: country.trim(),
      addressType,
      defaultAddress,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl relative my-8">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2 text-amber-500">
            <MapPin className="w-5 h-5" />
            <h3 className="text-lg font-bold text-[var(--color-foreground)]">
              {initialData ? "Edit Delivery Address" : "Add New Delivery Address"}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* Address Type Selection Pills */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-1.5">
              Address Type
            </label>
            <div className="flex gap-2">
              {(["HOME", "OFFICE", "OTHER"] as AddressType[]).map((t) => {
                const Icon = t === "HOME" ? Home : t === "OFFICE" ? Building2 : MapPin;
                const active = addressType === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setAddressType(t)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      active
                        ? "bg-[var(--color-foreground)] text-[var(--color-background)] shadow-xs"
                        : "bg-[var(--color-background)] text-[var(--color-foreground)] border border-slate-200 dark:border-slate-800 hover:opacity-80"
                    }`}
                  >
                    <Icon size={14} />
                    <span>{t}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Full Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Krishna Singh"
                className="w-full px-3.5 py-2 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)] focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-1">
                Phone Number (10 digits) *
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="9876543210"
                className={`w-full px-3.5 py-2 rounded-xl bg-[var(--color-background)] border text-[var(--color-foreground)] focus:outline-hidden ${
                  phone && !isPhoneValid
                    ? "border-red-500 focus:border-red-500"
                    : "border-slate-300 dark:border-slate-700 focus:border-amber-500"
                }`}
              />
              {phone && !isPhoneValid && (
                <p className="text-[11px] text-red-500 mt-1">Enter valid 10-digit mobile number</p>
              )}
            </div>
          </div>

          {/* Address Lines */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-1">
              Address Line 1 *
            </label>
            <input
              type="text"
              required
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              placeholder="Flat, House no., Street, Area"
              className="w-full px-3.5 py-2 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)] focus:outline-hidden focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-1">
              Address Line 2 (Optional)
            </label>
            <input
              type="text"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              placeholder="Landmark, Suite, Unit"
              className="w-full px-3.5 py-2 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)] focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {/* Pincode with Auto Lookup */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                PIN Code (6 digits) *
              </label>
              {checkingPincode && (
                <span className="flex items-center gap-1 text-[11px] text-amber-500">
                  <Loader2 size={12} className="animate-spin" /> Checking delivery...
                </span>
              )}
            </div>
            <input
              type="text"
              required
              maxLength={6}
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ""))}
              placeholder="370001"
              className="w-full px-3.5 py-2 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)] focus:outline-hidden focus:border-amber-500 font-mono tracking-wider"
            />

            {/* Serviceability Feedback Card */}
            {isValidPincodeFormat && serviceability && (
              <div
                className={`mt-2 p-3 rounded-xl border text-xs flex items-start gap-2.5 transition-all ${
                  serviceability.serviceable
                    ? "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400"
                    : "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400"
                }`}
              >
                {serviceability.serviceable ? (
                  <>
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold">Delivery Available</p>
                      <p className="opacity-90">
                        {serviceability.city}, {serviceability.state} ({serviceability.zone} Zone)
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold">Delivery Unavailable</p>
                      <p className="opacity-90">We currently don't deliver to pincode {postalCode}.</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* City, State & Country */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Gandhidham"
                className="w-full px-3.5 py-2 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)] focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-1">
                State *
              </label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Gujarat"
                className="w-full px-3.5 py-2 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)] focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-1">
                Country *
              </label>
              <input
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="India"
                className="w-full px-3.5 py-2 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)] focus:outline-hidden focus:border-amber-500"
              />
            </div>
          </div>

          {/* Default Checkbox */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="defaultAddress"
              checked={defaultAddress}
              onChange={(e) => setDefaultAddress(e.target.checked)}
              className="w-4 h-4 rounded-sm border-slate-300 text-amber-500 focus:ring-amber-500"
            />
            <label htmlFor="defaultAddress" className="text-xs text-[var(--color-foreground)] font-medium">
              Set as default delivery address
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (postalCode.length === 6 && serviceability?.serviceable === false)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[var(--color-foreground)] text-[var(--color-background)] hover:opacity-90 transition-all disabled:opacity-50 shadow-md"
            >
              {loading ? "Saving..." : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressFormModal;
