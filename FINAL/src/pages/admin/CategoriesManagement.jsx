import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Save, Loader2 } from "lucide-react";
import { api } from "../../services/api";

export function CategoriesManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    api.getCategories()
      .then(setCategories)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (cat) => { setEditingId(cat.id); setIsAdding(false); setFormData({ name: cat.name, description: cat.description || "" }); };
  const handleAddNew = () => { setIsAdding(true); setEditingId(null); setFormData({ name: "", description: "" }); };
  const handleCancel = () => { setEditingId(null); setIsAdding(false); setFormData(null); };

  const handleSave = async () => {
    if (!formData.name) { alert("Category Name is required."); return; }
    setSaving(true);
    try {
      if (isAdding) {
        const created = await api.createCategory(formData);
        setCategories((prev) => [...prev, created]);
      } else {
        const updated = await api.updateCategory(editingId, formData);
        setCategories((prev) => prev.map((c) => c.id === editingId ? updated : c));
      }
      handleCancel();
    } catch (e) { alert(`Save failed: ${e.message}`); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      await api.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (e) { alert(`Delete failed: ${e.message}`); }
  };

  if (loading) return (
    <div className="absolute inset-0 flex items-center justify-center gap-3 text-gray-400">
      <Loader2 className="w-5 h-5 animate-spin" /> Loading categories...
    </div>
  );

  if (error) return (
    <div className="absolute inset-0 flex items-center justify-center text-red-500 font-mono text-sm">Error: {error}</div>
  );

  return (
    <div className="absolute inset-0 p-8 flex flex-col overflow-y-auto no-scrollbar">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight">Categories</h2>
          <p className="text-sm text-gray-500 font-mono mt-1">Manage product categories</p>
        </div>
        {!isAdding && !editingId && (
          <button onClick={handleAddNew} className="flex items-center gap-2 px-4 py-2 bg-brand-obsidian text-white rounded-lg hover:bg-black font-medium text-sm transition-colors">
            <Plus className="w-4 h-4" /> Add Category
          </button>
        )}
      </div>

      {(isAdding || editingId) && formData ? (
        <div className="bg-white border text-sm border-gray-200 rounded-xl p-6 mb-8 max-w-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">{isAdding ? "New Category" : "Edit Category"}</h3>
            <button onClick={handleCancel} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4" /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded focus:border-black outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description (optional)</label>
              <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded focus:border-black outline-none" />
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end gap-3">
            <button onClick={handleCancel} className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-brand-obsidian text-white rounded-lg text-sm font-medium hover:bg-black disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10 text-xs tracking-wider uppercase text-gray-500">
            <tr>
              <th className="p-4 font-semibold w-24">ID</th>
              <th className="p-4 font-semibold">Category Name</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-mono text-gray-500">{cat.id}</td>
                <td className="p-4 font-medium text-brand-obsidian">{cat.name}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleEdit(cat)} className="p-2 hover:bg-gray-200 text-blue-600" title="Edit"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(cat.id)} className="p-2 hover:bg-gray-200 text-red-600" title="Delete"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan={3} className="p-8 text-center text-gray-500 font-mono tracking-widest uppercase">No categories found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
