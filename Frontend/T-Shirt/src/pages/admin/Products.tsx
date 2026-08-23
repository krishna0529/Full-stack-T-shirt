import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import { useAdminProducts } from "../../hooks/useAdminProducts";
import { useDeleteProduct } from "../../hooks/useDeleteProduct";
import { Plus, Search, Edit3, Trash2, Filter, Loader2, Eye } from "lucide-react";
import type { Product } from "../../types/product";

export const Products: React.FC = () => {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const { data: pageData, isLoading } = useAdminProducts(page, 20);
  const deleteMutation = useDeleteProduct();

  const products: Product[] = pageData?.content || [];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "ALL" || p.category.toUpperCase() === selectedCategory.toUpperCase();

    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to deactivate/delete '${name}'?`)) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Product Management
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Create, update, manage variants, and control catalog availability.
            </p>
          </div>

          <Link
            to="/admin/products/add"
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm rounded-xl shadow-lg shadow-amber-500/25 transition-all w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[var(--color-surface)] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products by name or slug..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-[var(--color-background)] focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-[var(--color-background)] font-medium text-slate-700 dark:text-slate-200"
            >
              <option value="ALL">All Categories</option>
              <option value="OVERSIZED">Oversized</option>
              <option value="POLO">Polo</option>
              <option value="GRAPHIC">Graphic</option>
              <option value="CLASSIC">Classic</option>
              <option value="HOODIE">Hoodie</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-[var(--color-surface)] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
              <span>Loading Product Catalog...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-16 text-center text-slate-400 space-y-3">
              <p className="text-base font-semibold text-slate-600 dark:text-slate-300">
                No products found.
              </p>
              <p className="text-xs">Try adjusting search filters or click "Add New Product".</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-400 uppercase text-xs tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3.5">Image</th>
                    <th className="px-6 py-3.5">Product Name</th>
                    <th className="px-6 py-3.5">Category</th>
                    <th className="px-6 py-3.5">Base Price</th>
                    <th className="px-6 py-3.5">Total Stock</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredProducts.map((product) => {
                    const primaryImage =
                      product.images && product.images.length > 0
                        ? product.images[0].imageUrl
                        : "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100&auto=format&fit=crop&q=80";

                    // Total stock from variants
                    const totalStock = product.variants
                      ? product.variants.reduce((acc, v) => acc + (v.stock || 0), 0)
                      : product.stock || 0;

                    return (
                      <tr key={product.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="px-6 py-4">
                          <img
                            src={primaryImage}
                            alt={product.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {product.name}
                          </div>
                          <div className="text-xs font-mono text-slate-400">{product.slug}</div>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-300">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                          ₹{product.price}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                              totalStock === 0
                                ? "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400"
                                : totalStock <= 10
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                            }`}
                          >
                            {totalStock === 0 ? "SOLD OUT" : `${totalStock} in stock`}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                              product.active !== false
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                          >
                            {product.active !== false ? "ACTIVE" : "INACTIVE"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/product/${product.slug}`}
                              target="_blank"
                              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="View Customer Page"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              to={`/admin/products/edit/${product.id}`}
                              className="p-2 text-slate-400 hover:text-amber-500 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                              title="Edit Product"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(product.id, product.name)}
                              className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                              title="Delete/Deactivate"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {pageData && pageData.totalPages > 1 && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs font-semibold">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="px-3.5 py-1.5 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {page + 1} of {pageData.totalPages}
              </span>
              <button
                disabled={pageData.last}
                onClick={() => setPage((p) => p + 1)}
                className="px-3.5 py-1.5 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Products;
