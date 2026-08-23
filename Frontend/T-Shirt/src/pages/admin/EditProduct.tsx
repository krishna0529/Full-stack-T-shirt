import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import { ProductForm } from "../../components/admin/ProductForm";
import { useUpdateProduct } from "../../hooks/useUpdateProduct";
import { adminProductService, type CreateProductPayload } from "../../services/adminProductService";
import { Loader2 } from "lucide-react";

export const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const updateMutation = useUpdateProduct();

  const { data: product, isLoading } = useQuery({
    queryKey: ["admin", "product", productId],
    queryFn: () => adminProductService.getProductById(productId),
    enabled: !!productId,
  });

  const handleUpdateSubmit = async (payload: CreateProductPayload, newFiles: File[]) => {
    // 1. Update product details & variants
    await updateMutation.mutateAsync({
      id: productId,
      payload,
    });

    // 2. Upload new image files if attached
    if (newFiles.length > 0) {
      for (const file of newFiles) {
        await adminProductService.uploadImage(productId, file, payload.name);
      }
    }

    queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
    navigate("/admin/products");
  };

  const handleDeleteExistingImage = async (imageId: number) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      await adminProductService.deleteImage(productId, imageId);
      queryClient.invalidateQueries({ queryKey: ["admin", "product", productId] });
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-20 text-slate-400 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
            <span>Loading Product Data...</span>
          </div>
        ) : !product ? (
          <div className="p-12 text-center text-slate-400">Product not found.</div>
        ) : (
          <ProductForm
            title={`Edit Product: ${product.name}`}
            initialData={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              description: product.description,
              category: product.category,
              price: product.price,
              compareAtPrice: product.compareAtPrice,
              isNew: product.isNew,
              isFeatured: product.isFeatured,
              active: product.active,
              images: product.images,
              variants: product.variants?.map((v) => ({
                sku: v.sku,
                color: v.color,
                colorCode: v.colorCode,
                size: v.size,
                price: v.price ?? product.price ?? 0,
                compareAtPrice: v.compareAtPrice,
                stock: v.stock,
              })),
            }}
            onSubmit={handleUpdateSubmit}
            onDeleteExistingImage={handleDeleteExistingImage}
            isSubmitting={updateMutation.isPending}
          />
        )}
      </main>
    </div>
  );
};

export default EditProduct;
