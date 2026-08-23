import React from "react";
import { Plus, ShoppingBag, Tag } from "lucide-react";
import { useFrequentlyBoughtTogether } from "../../hooks/useRecommendations";
import { useCartStore } from "../../store/cartStore";
import { useUIStore } from "../../store/uiStore";

interface FrequentlyBoughtSectionProps {
  productId: number;
}

export const FrequentlyBoughtSection: React.FC<FrequentlyBoughtSectionProps> = ({ productId }) => {
  const { data: comboData, isLoading } = useFrequentlyBoughtTogether(productId);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUIStore((state) => state.openCart);

  if (isLoading || !comboData || !comboData.mainProduct || comboData.suggestedProducts.length === 0) {
    return null;
  }

  const main = comboData.mainProduct;
  const suggested = comboData.suggestedProducts;

  const handleAddBundleToCart = () => {
    // Add main product
    addItem(main, 1, "Default", "M");
    // Add suggested bundle products
    suggested.forEach((prod) => {
      addItem(prod, 1, "Default", "M");
    });
    openCart();
  };

  return (
    <div className="py-10 border-t border-slate-200 dark:border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500 flex items-center gap-1.5">
            <Tag size={14} /> BUNDLE & SAVE 10%
          </span>
          <h3 className="text-2xl font-extrabold tracking-tight text-[var(--color-foreground)] mt-1">
            Frequently Bought Together
          </h3>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xs">
        {/* Product Images Sequence */}
        <div className="flex items-center gap-3 overflow-x-auto w-full lg:w-auto">
          {/* Main Product */}
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-amber-500/50 bg-[var(--color-background)] shrink-0">
              <img
                src={main.images && main.images.length > 0 ? main.images[0].imageUrl : ""}
                alt={main.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Plus Icons & Suggested Items */}
          {suggested.map((item) => (
            <React.Fragment key={item.id}>
              <div className="p-1.5 rounded-full bg-amber-500/20 text-amber-500 shrink-0">
                <Plus size={16} />
              </div>
              <div className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-[var(--color-background)] shrink-0">
                <img
                  src={item.images && item.images.length > 0 ? item.images[0].imageUrl : ""}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Combo Price Action */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto justify-between border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[var(--color-muted)] line-through">
                ₹{(main.price + suggested.reduce((sum, p) => sum + p.price, 0)).toLocaleString("en-IN")}
              </span>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500">
                10% OFF COMBO
              </span>
            </div>
            <p className="text-2xl font-black text-amber-500 pt-0.5">
              ₹{comboData.comboPrice.toLocaleString("en-IN")}
            </p>
          </div>

          <button
            onClick={handleAddBundleToCart}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shrink-0"
          >
            <ShoppingBag size={16} /> Add Bundle to Bag
          </button>
        </div>
      </div>
    </div>
  );
};

export default FrequentlyBoughtSection;
