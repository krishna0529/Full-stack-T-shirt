import { useState } from "react";
import { Star } from "lucide-react";
import type { Product } from "../../types/product";
import { useCartStore } from "../../store/cartStore";
import { useUIStore } from "../../store/uiStore";
import ColorSelector from "./ColorSelector";
import SizeSelector from "./SizeSelector";
import QuantitySelector from "./QuantitySelector";
import AddToCartButton from "./AddToCartButton";
import ShippingInfo from "./ShippingInfo";
import ProductAccordion from "./ProductAccordion";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUIStore((state) => state.openCart);

  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0].name : "Black"
  );

  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[2] || product.sizes[0] : "M"
  );

  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addItem(product, quantity, selectedColor, selectedSize);
    openCart();
  };

  const handleBuyNow = () => {
    addItem(product, quantity, selectedColor, selectedSize);
    openCart();
  };

  return (
    <div className="flex flex-col text-[var(--color-foreground)]">

      {/* Category */}
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-muted)]">
        {product.category} Collection
      </p>

      {/* Title */}
      <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--color-foreground)]">
        {product.name}
      </h1>

      {/* Price & Rating Row */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <span className="text-2xl sm:text-3xl font-black">
            ₹{product.price.toLocaleString("en-IN")}
          </span>

          {product.originalPrice && (
            <>
              <span className="text-base font-semibold text-[var(--color-muted)] line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
              <span className="rounded-md bg-red-500/10 px-2 py-0.5 text-xs font-bold text-red-500">
                SAVE ₹{(product.originalPrice - product.price).toLocaleString("en-IN")}
              </span>
            </>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < Math.floor(product.rating || 5) ? "currentColor" : "none"}
                strokeWidth={1.5}
                className={i < Math.floor(product.rating || 5) ? "" : "text-[var(--color-muted)]"}
              />
            ))}
          </div>
          <span className="text-xs font-bold text-[var(--color-foreground)]">
            {product.rating || 4.8}
          </span>
          <span className="text-xs text-[var(--color-muted)]">
            ({product.reviewCount || 124} reviews)
          </span>
        </div>
      </div>

      {/* Color Selector */}
      <ColorSelector
        colors={product.colors}
        selectedColor={selectedColor}
        onSelectColor={setSelectedColor}
      />

      {/* Size Selector */}
      <SizeSelector
        sizes={product.sizes}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
      />

      {/* Quantity Selector */}
      <QuantitySelector
        quantity={quantity}
        onChangeQuantity={setQuantity}
      />

      {/* Add To Cart & Buy Now Buttons */}
      <AddToCartButton
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        productName={product.name}
      />

      {/* Shipping Perks */}
      <ShippingInfo />

      {/* Accordion */}
      <ProductAccordion
        description={product.description}
        material={product.material}
        fit={product.fit}
      />

    </div>
  );
}
