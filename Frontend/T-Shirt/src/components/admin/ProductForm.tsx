import React, { useState } from "react";
import type { CreateVariantRequest, CreateProductPayload } from "../../services/adminProductService";
import { VariantForm } from "./VariantForm";
import { VariantTable } from "./VariantTable";
import { ImageUploader } from "./ImageUploader";
import type { ProductImage } from "../../types/product";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductFormProps {
  initialData?: {
    id?: number;
    name: string;
    slug: string;
    description: string;
    category: string;
    price: number;
    compareAtPrice?: number;
    isNew?: boolean;
    isFeatured?: boolean;
    active?: boolean;
    images?: ProductImage[];
    variants?: CreateVariantRequest[];
  };
  onSubmit: (payload: CreateProductPayload, imageFiles: File[]) => Promise<void>;
  onDeleteExistingImage?: (imageId: number) => void;
  isSubmitting?: boolean;
  title: string;
}

const CATEGORIES = ["OVERSIZED", "POLO", "GRAPHIC", "CLASSIC", "HOODIE", "LIMITED_EDITION"];

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  onDeleteExistingImage,
  isSubmitting = false,
  title,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "OVERSIZED");
  const [price, setPrice] = useState<number | "">(initialData?.price ?? 1299);
  const [compareAtPrice, setCompareAtPrice] = useState<number | "">(initialData?.compareAtPrice ?? 1599);
  const [isNew, setIsNew] = useState(initialData?.isNew ?? true);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);
  
  const [variants, setVariants] = useState<CreateVariantRequest[]>(initialData?.variants || []);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate slug when name changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    if (!initialData?.id) {
      setSlug(
        newName
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9 -]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
      );
    }
  };

  const handleAddVariant = (variant: CreateVariantRequest) => {
    setVariants((current) => [...current, variant]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants((current) => current.filter((_, i) => i !== index));
  };

  const handleAddFiles = (files: File[]) => {
    setNewImageFiles((current) => [...current, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setNewImageFiles((current) => current.filter((_, i) => i !== index));
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Product Name is required.");
      return;
    }

    if (!slug.trim()) {
      setError("Product Slug is required.");
      return;
    }

    if (!description.trim()) {
      setError("Description is required.");
      return;
    }

    if (variants.length === 0) {
      setError("At least one product variant (Color/Size) is required.");
      return;
    }

    try {
      const payload: CreateProductPayload = {
        name,
        slug,
        description,
        category,
        price: price !== "" ? Number(price) : variants[0].price,
        compareAtPrice: compareAtPrice !== "" ? Number(compareAtPrice) : undefined,
        isNew,
        isFeatured,
        variants,
      };

      await onSubmit(payload, newImageFiles);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to save product.");
    }
  };

  return (
    <form onSubmit={handleSubmitForm} className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/products"
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-slate-500">
              Manage core info, images, and inventory variants.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm rounded-xl shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSubmitting ? "Saving..." : "Save Product"}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {/* Section 1: Basic Info */}
      <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
          1. Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={handleNameChange}
              placeholder="e.g. Premium Oversized T-Shirt"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-[var(--color-background)] text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. premium-oversized-t-shirt"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-[var(--color-background)] text-sm font-mono focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-[var(--color-background)] text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Base Price (₹)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="1299"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-[var(--color-background)] text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Compare At Price (₹)
            </label>
            <input
              type="number"
              value={compareAtPrice}
              onChange={(e) => setCompareAtPrice(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="1599"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-[var(--color-background)] text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Description *
          </label>
          <textarea
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write detailed product features, fabric quality, fit, care instructions..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-[var(--color-background)] text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isNew}
              onChange={(e) => setIsNew(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Mark as "NEW ARRIVAL"
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Feature on Homepage
            </span>
          </label>
        </div>
      </div>

      {/* Section 2: Product Images */}
      <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
          2. Product Images
        </h3>
        <ImageUploader
          existingImages={initialData?.images}
          newFiles={newImageFiles}
          onAddFiles={handleAddFiles}
          onRemoveFile={handleRemoveFile}
          onDeleteExistingImage={onDeleteExistingImage}
        />
      </div>

      {/* Section 3: Product Variants (Inventory Builder) */}
      <div className="bg-[var(--color-surface)] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            3. Product Variants & Inventory
          </h3>
          <span className="text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full">
            {variants.length} Variant(s)
          </span>
        </div>

        {/* Existing Variants Table */}
        <VariantTable variants={variants} onRemoveVariant={handleRemoveVariant} />

        {/* Add Variant Form */}
        <VariantForm
          onAddVariant={handleAddVariant}
          existingVariants={variants}
          productCode={slug ? slug.toUpperCase().substring(0, 7) : "TSH-001"}
        />
      </div>
    </form>
  );
};

export default ProductForm;
