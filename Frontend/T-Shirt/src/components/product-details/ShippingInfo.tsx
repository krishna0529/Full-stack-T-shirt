import { Truck, RotateCcw, ShieldCheck } from "lucide-react";

export default function ShippingInfo() {
  const perks = [
    {
      icon: Truck,
      title: "Free Express Shipping",
      desc: "On all orders above ₹999 across India.",
    },
    {
      icon: RotateCcw,
      title: "Easy 7-Day Returns",
      desc: "Hassle-free pickups and instant store credits.",
    },
    {
      icon: ShieldCheck,
      title: "100% Secure Checkout",
      desc: "Encrypted payments via UPI, Cards, and NetBanking.",
    },
  ];

  return (
    <div className="mt-8 divide-y divide-[var(--color-border)] rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-xs">
      {perks.map((item, idx) => (
        <div key={idx} className={`flex items-start gap-3 ${idx === 0 ? "pb-3" : idx === 1 ? "py-3" : "pt-3"}`}>
          <item.icon size={20} className="mt-0.5 shrink-0 text-[var(--color-foreground)]" strokeWidth={1.6} />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-foreground)]">
              {item.title}
            </h4>
            <p className="mt-0.5 text-xs text-[var(--color-muted)] leading-relaxed">
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
