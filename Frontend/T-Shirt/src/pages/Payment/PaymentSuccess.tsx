import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import type { Order } from "../../types/order";
import type { VerifyPaymentResponse } from "../../types/payment";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as { order?: Order; verifyRes?: VerifyPaymentResponse } | null;
  const order = state?.order;
  const verifyRes = state?.verifyRes;

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/40 text-center space-y-6 shadow-2xl w-full"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500 text-black flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black uppercase tracking-wider text-[var(--color-foreground)]">
            PAYMENT SUCCESSFUL!
          </h1>
          <p className="text-xs text-[var(--color-muted)]">
            Your payment has been verified and your order is confirmed.
          </p>
        </div>

        {order && (
          <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 space-y-3 text-xs text-left">
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-[var(--color-muted)]">Order Number</span>
              <span className="font-mono font-bold text-amber-500">#{order.orderNumber}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-[var(--color-muted)]">Payment Ref</span>
              <span className="font-mono font-bold text-[var(--color-foreground)]">{verifyRes?.paymentReference || "PAY-SUCCESS"}</span>
            </div>
            <div className="flex justify-between items-baseline pt-1">
              <span className="font-bold text-[var(--color-foreground)]">Total Amount Paid</span>
              <span className="text-xl font-black text-amber-500">₹{order.totalAmount}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {order && (
            <button
              onClick={() => navigate(`/account/orders/${order.orderNumber}`)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors flex items-center justify-center gap-2"
            >
              <span>TRACK ORDER</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <Link
            to="/shop"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-[var(--color-foreground)] font-bold text-xs uppercase tracking-wider hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
