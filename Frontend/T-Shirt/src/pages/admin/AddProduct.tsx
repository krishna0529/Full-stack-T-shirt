import React from "react";
import { useNavigate } from "react-router-dom";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import { ProductForm } from "../../components/admin/ProductForm";
import { useCreateProduct } from "../../hooks/useCreateProduct";
import { adminProductService, type CreateProductPayload } from "../../services/adminProductService";

export const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateProduct();

  const handleCreateSubmit = async (payload: CreateProductPayload, imageFiles: File[]) => {
    // 1. Create product & variants
    const createdProduct = await createMutation.mutateAsync(payload);

    // 2. Upload images if attached
    if (imageFiles.length > 0 && createdProduct.id) {
      for (const file of imageFiles) {
        await adminProductService.uploadImage(createdProduct.id, file, createdProduct.name);
      }
    }

    // 3. Redirect back to admin product list
    navigate("/admin/products");
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <ProductForm
          title="Add New Product"
          onSubmit={handleCreateSubmit}
          isSubmitting={createMutation.isPending}
        />
      </main>
    </div>
  );
};

export default AddProduct;
