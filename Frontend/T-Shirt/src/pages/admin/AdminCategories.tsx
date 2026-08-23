import React, { useState } from "react";
import { Plus, Tag, Edit3, Power, Layers } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useAdminCategories, useCreateCategory, useUpdateCategory, useToggleCategoryStatus } from "../../hooks/useAdminCategories";

export default function AdminCategories() {
  const { data: categories, isLoading } = useAdminCategories();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const toggleStatusMutation = useToggleCategoryStatus();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);

  const handleOpenAdd = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setImage("");
    setDisplayOrder(0);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: any) => {
    setEditingId(c.id);
    setName(c.name);
    setDescription(c.description || "");
    setImage(c.image || "");
    setDisplayOrder(c.displayOrder || 0);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      updateCategoryMutation.mutate(
        { id: editingId, payload: { name: name.trim(), description, image, displayOrder } },
        { onSuccess: () => setIsModalOpen(false) }
      );
    } else {
      createCategoryMutation.mutate(
        { name: name.trim(), description, image, displayOrder },
        { onSuccess: () => setIsModalOpen(false) }
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <AdminSidebar />
      <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500 flex items-center gap-1.5">
              <Layers size={14} /> CATALOG CATEGORIES
            </span>
            <h1 className="text-3xl font-black tracking-tight mt-1">Product Categories</h1>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 text-black text-xs font-extrabold uppercase tracking-wider hover:bg-amber-400 shadow-md transition-all shrink-0"
          >
            <Plus size={16} /> Add Category
          </button>
        </div>

        {/* Category Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="h-44 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))
          ) : !categories || categories.length === 0 ? (
            <div className="col-span-full py-12 text-center text-[var(--color-muted)]">
              No categories configured yet. Click "Add Category" to create one.
            </div>
          ) : (
            categories.map((c) => (
              <div
                key={c.id}
                className="p-6 rounded-3xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-4 shadow-xs hover:border-amber-500/50 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black shrink-0">
                      <Tag size={20} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-[var(--color-foreground)]">{c.name}</h3>
                      <p className="text-[11px] font-mono text-[var(--color-muted)]">/{c.slug}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      c.active ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    {c.active ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="text-xs text-[var(--color-muted)] line-clamp-2">{c.description || "No description provided."}</p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold text-[var(--color-muted)]">
                    {c.productCount} Products Linked
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(c)}
                      className="p-2 rounded-xl bg-[var(--color-background)] text-slate-400 hover:text-amber-500 transition-colors"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => toggleStatusMutation.mutate(c.id)}
                      className="p-2 rounded-xl bg-[var(--color-background)] text-slate-400 hover:text-emerald-500 transition-colors"
                    >
                      <Power size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-md p-6 rounded-3xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
              <h3 className="text-lg font-black">{editingId ? "Edit Category" : "Add New Category"}</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
                <div>
                  <label className="block uppercase tracking-wider text-[var(--color-muted)] mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Oversized T-Shirts"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[var(--color-muted)] mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Category description..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)]"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[var(--color-muted)] mb-1">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-[var(--color-muted)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-extrabold uppercase tracking-wider hover:bg-amber-400"
                  >
                    {editingId ? "Save Changes" : "Create Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
