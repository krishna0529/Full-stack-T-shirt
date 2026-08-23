import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, PackageCheck } from "lucide-react";
import AddressSelector from "../../components/checkout/AddressSelector";
import ShippingSelector from "../../components/checkout/ShippingSelector";
import CouponBox from "../../components/checkout/CouponBox";
import OrderSummary from "../../components/checkout/OrderSummary";
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
} from "../../hooks/useAddresses";
import {
  useShippingMethods,
  useValidateCoupon,
  useCheckoutPreview,
} from "../../hooks/useCheckout";
import { useCreateOrder } from "../../hooks/useOrders";
import type { CheckoutPreview } from "../../types/checkout";
import type { Order } from "../../types/order";

export default function CheckoutPage() {
  const navigate = useNavigate();

  const { data: addresses = [] } = useAddresses();
  const { data: shippingMethods = [] } = useShippingMethods();

  const createAddressMutation = useCreateAddress();
  const updateAddressMutation = useUpdateAddress();

  const validateCouponMutation = useValidateCoupon();
  const previewMutation = useCheckoutPreview();
  const createOrderMutation = useCreateOrder();

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [selectedShippingId, setSelectedShippingId] = useState<number | null>(null);
  const [couponCode, setCouponCode] = useState<string | null>(null);

  const [preview, setPreview] = useState<CheckoutPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Auto-select default address and shipping method when data arrives
  const effectiveAddressId = selectedAddressId ?? (addresses.find((a) => a.defaultAddress)?.id || addresses[0]?.id || null);
  const effectiveShippingId = selectedShippingId ?? (shippingMethods[0]?.id || null);

  // Recalculate checkout preview whenever selections change
  useEffect(() => {
    if (effectiveAddressId || effectiveShippingId || couponCode) {
      previewMutation.mutate(
        {
          addressId: effectiveAddressId,
          shippingMethodId: effectiveShippingId,
          couponCode,
        },
        {
          onSuccess: (data) => {
            setPreview(data);
            setError(null);
          },
          onError: (err: unknown) => {
            const message = err instanceof Error ? err.message : "Failed to calculate checkout preview";
            setError(message);
          },
        }
      );
    }
  }, [effectiveAddressId, effectiveShippingId, couponCode]);

  const handleApplyCoupon = async (code: string) => {
    const res = await validateCouponMutation.mutateAsync(code);
    if (res.valid) {
      setCouponCode(code);
    }
    return res;
  };

  const handleRemoveCoupon = () => {
    setCouponCode(null);
  };

  const handleReserveAndProceed = () => {
    if (!effectiveAddressId || !effectiveShippingId) {
      setError("Please select a delivery address and shipping method");
      return;
    }

    setError(null);
    createOrderMutation.mutate(
      {
        addressId: effectiveAddressId,
        shippingMethodId: effectiveShippingId,
        couponCode,
      },
      {
        onSuccess: (res) => {
          setCreatedOrder(res);
          navigate(`/payment/${res.orderNumber}`);
        },
        onError: (err: unknown) => {
          const message = err instanceof Error ? err.message : "Failed to place order";
          setError(message);
        },
      }
    );
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header Breadcrumb */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <Link
          to="/cart"
          className="flex items-center gap-2 text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Cart
        </Link>
        <h1 className="text-xl font-black uppercase tracking-wider text-[var(--color-foreground)]">
          CHECKOUT
        </h1>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-500">
          {error}
        </div>
      )}

      {createdOrder ? (
        /* Order Creation Success Banner */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/40 text-center max-w-2xl mx-auto space-y-4 shadow-2xl"
        >
          <PackageCheck className="w-16 h-16 text-emerald-500 mx-auto" />
          <h2 className="text-2xl font-black uppercase tracking-wider text-[var(--color-foreground)]">
            ORDER CONFIRMED!
          </h2>
          <p className="text-xs text-[var(--color-muted)]">
            Order Number:{" "}
            <span className="font-mono font-bold text-amber-500 text-sm">{createdOrder.orderNumber}</span>
          </p>
          <p className="text-xs text-[var(--color-foreground)]">
            Thank you, <span className="font-bold">{createdOrder.shippingAddressName}</span>. Your order of{" "}
            <span className="font-bold text-amber-500">₹{createdOrder.totalAmount}</span> has been confirmed and is being prepared for dispatch.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate(`/account/orders/${createdOrder.orderNumber}`)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors"
            >
              VIEW ORDER DETAILS
            </button>
            <button
              onClick={() => navigate("/shop")}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-[var(--color-foreground)] font-bold text-xs uppercase tracking-wider hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              CONTINUE SHOPPING
            </button>
          </div>
        </motion.div>
      ) : (
        /* Checkout Layout Grid */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (Address, Shipping, Coupon) */}
          <div className="lg:col-span-2 space-y-8">
            <AddressSelector
              addresses={addresses}
              selectedAddressId={effectiveAddressId}
              onSelectAddress={(id) => setSelectedAddressId(id)}
              onCreateAddress={async (payload) => {
                await createAddressMutation.mutateAsync(payload);
              }}
              onUpdateAddress={async (id, payload) => {
                await updateAddressMutation.mutateAsync({ id, payload });
              }}
            />

            <ShippingSelector
              shippingMethods={shippingMethods}
              selectedMethodId={effectiveShippingId}
              onSelectMethod={(id) => setSelectedShippingId(id)}
            />

            <CouponBox
              appliedCoupon={couponCode}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
            />
          </div>

          {/* Right Column (Order Summary & Order Creation) */}
          <div className="lg:col-span-1">
            <OrderSummary
              preview={preview}
              loading={previewMutation.isPending}
              onReserveAndProceed={handleReserveAndProceed}
              reserveLoading={createOrderMutation.isPending}
            />
          </div>
        </div>
      )}
    </div>
  );
}
