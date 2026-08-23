import React, { useState } from "react";
import type { CreateVariantRequest } from "../../services/adminProductService";
import { Plus } from "lucide-react";

interface VariantFormProps {
  onAddVariant: (variant: CreateVariantRequest) => void;
  existingVariants: CreateVariantRequest[];
  productCode?: string;
}

const AVAILABLE_COLORS = ["BLACK", "WHITE", "GREY", "NAVY", "RED", "BEIGE", "GREEN"];
const AVAILABLE_SIZES = ["S", "M", "L", "XL", "XXL"];

export const VariantForm: React.FC<VariantFormProps> = ({
  onAddVariant,
  existingVariants,
  productCode = "TSH-001",
}) => {
  const [color, setColor] = useState("BLACK");
  const [size, setSize] = useState("M");
  const [price, setPrice] = useState<number | "">(1299);
  const [compareAtPrice, setCompareAtPrice] = useState<number | "">(1599);
  const [stock, setStock] = useState<number | "">(20);
  const [sku, setSku] = useState(`${productCode}-BLK-M`);
  const [error, setError] = useState<string | null>(null);

  const handleColorChange = (newColor: String) => {
    const colorStr = newColor.toString();
    setColor(colorStr);
    const colorCode = colorStr.substring(0, 3).toUpperCase();
    setSku(`${productCode}-${colorCode}-${size}`);
  };

  const handleSizeChange = (newSize: string) => {
    setSize(newSize);
    const colorCode = color.substring(0, 3).toUpperCase();
    setSku(`${productCode}-${colorCode}-${newSize}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!sku.trim()) {
      setError("SKU is required.");
      return;
    }

    if (price === "" || Number(price) <= 0) {
      setError("Price must be greater than 0.");
      return;
    }

    if (stock === "" || Number(stock) < 0) {
      setError("Stock cannot be negative.");
      return;
    }

    // Duplicate check: Color + Size combination cannot exist twice
    const isDuplicate = existingVariants.some(
      (v) => v.color.toUpperCase() === color.toUpperCase() && v.size.toUpperCase() === size.toUpperCase()
    );

    if (isDuplicate) {
      setError(`Variant with Color '${color}' and Size '${size}' already exists.`);
      return;
    }

    onAddVariant({
      sku: sku.trim().toUpperCase(),
      color,
      size,
      price: Number(price),
      compareAtPrice: compareAtPrice !== "" ? Number(compareAtPrice) : undefined,
      stock: Number(stock),
    });

    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[var(--color-surface)] p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-white uppercase tracking-wider">
          Add New Variant
        </h4>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/40 rounded-lg border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {/* Color Select */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">COLOR</label>
          <select
            value={color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-[var(--color-background)]"
          >
            {AVAILABLE_COLORS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Size Select */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">SIZE</label>
          <select
            value={size}
            onChange={(e) => handleSizeChange(e.target.value)}
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-[var(--color-background)]"
          >
            {AVAILABLE_SIZES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* SKU Input */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">SKU</label>
          <input
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            placeholder="TSH-001-BLK-M"
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-[var(--color-background)]"
          />
        </div>

        {/* Price Input */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">PRICE (₹)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="1299"
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-[var(--color-background)]"
          />
        </div>

        {/* Compare Price Input */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">COMPARE (₹)</label>
          <input
            type="number"
            value={compareAtPrice}
            onChange={(e) => setCompareAtPrice(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="1599"
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-[var(--color-background)]"
          />
        </div>

        {/* Stock Input */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">STOCK</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="20"
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-[var(--color-background)]"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm rounded-lg shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Variant</span>
        </button>
      </div>
    </form>
  );
};

export default VariantForm;
