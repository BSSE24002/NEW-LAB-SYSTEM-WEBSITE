import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Image as ImageIcon, Save, X, Loader2, PlusCircle, MinusCircle, Wand2 } from "lucide-react";
import { api } from "../../services/api";
import { enhanceProductDescription } from "../../services/ai";

export function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState(null);

  const emptyForm = () => ({
    name: "",
    category_id: "",
    description: "",
    sku: `SKU-${Math.floor(Math.random() * 100000)}`,
    price: 0,
    thumbnail_url: "",
    gallery_urls: [""],
    initial_stock: 0,
    attributes: { color: "", size: "", material: "" },
  });

  useEffect(() => {
    Promise.all([api.getProducts(), api.getCategories()])
      .then(([prods, cats]) => { setProducts(prods); setCategories(cats); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (product) => {
    setEditingId(product.id);
    setIsAdding(false);
    // Parse gallery_urls — could be a stringified JSON or already an array
    let galleryUrls = [];
    if (Array.isArray(product.gallery_urls)) {
      galleryUrls = product.gallery_urls.length > 0 ? product.gallery_urls : [""];
    } else if (typeof product.gallery_urls === "string") {
      try { galleryUrls = JSON.parse(product.gallery_urls); } catch { galleryUrls = [""]; }
    }
    if (galleryUrls.length === 0) galleryUrls = [""];

    setFormData({
      name: product.name || "",
      category_id: product.category_id || "",
      description: product.description || "",
      sku: product.sku || "",
      price: product.price || 0,
      thumbnail_url: product.thumbnail_url || "",
      gallery_urls: galleryUrls,
      initial_stock: product.stock_quantity || 0,
      attributes: product.attributes || { color: "", size: "", material: "" },
    });
  };

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData(emptyForm());
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData(null);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.sku || !formData.price) {
      alert("Name, SKU, and Price are required.");
      return;
    }
    setSaving(true);
    // Clean up gallery_urls: filter out blank entries
    const cleanGallery = (formData.gallery_urls || []).filter((u) => u.trim() !== "");
    const payload = { ...formData, gallery_urls: cleanGallery };

    try {
      if (isAdding) {
        const created = await api.createProduct(payload);
        setProducts((prev) => [created, ...prev]);
      } else {
        const updated = await api.updateProduct(editingId, payload);
        setProducts((prev) => prev.map((p) => (p.id === editingId ? { ...updated, stock_quantity: p.stock_quantity } : p)));
      }
      handleCancel();
    } catch (e) {
      alert(`Save failed: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEnhanceDescription = async () => {
    if (!formData.description) {
      alert("Please enter some raw text in the description field first.");
      return;
    }
    setIsEnhancing(true);
    try {
      const enhancedHTML = await enhanceProductDescription(formData.description);
      updateFormData("description", enhancedHTML);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      alert(`Delete failed: ${e.message}`);
    }
  };

  const updateFormData = (field, value) => setFormData({ ...formData, [field]: value });
  const updateAttribute = (key, val) => setFormData({ ...formData, attributes: { ...formData.attributes, [key]: val } });

  // Gallery URL helpers
  const updateGalleryUrl = (index, value) => {
    const updated = [...formData.gallery_urls];
    updated[index] = value;
    setFormData({ ...formData, gallery_urls: updated });
  };
  const addGalleryUrl = () => setFormData({ ...formData, gallery_urls: [...formData.gallery_urls, ""] });
  const removeGalleryUrl = (index) => {
    const updated = formData.gallery_urls.filter((_, i) => i !== index);
    setFormData({ ...formData, gallery_urls: updated.length > 0 ? updated : [""] });
  };

  const inputClass = "w-full px-4 py-3 bg-[#FAFAFA] border border-gray-200 focus:outline-none focus:border-brand-obsidian transition-colors font-mono text-sm";
  const labelClass = "block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2";

  if (loading) return (
    <div className="absolute inset-0 flex items-center justify-center gap-3 text-gray-400">
      <Loader2 className="w-5 h-5 animate-spin" /> Loading products...
    </div>
  );

  if (error) return (
    <div className="absolute inset-0 flex items-center justify-center text-red-500 font-mono text-sm">
      Error: {error}
    </div>
  );

  return (
    <div className="absolute inset-0 p-10 flex flex-col overflow-y-auto no-scrollbar max-w-[1600px] mx-auto">
      <div className="flex justify-between items-end mb-8 shrink-0">
        <div>
          <h2 className="text-3xl font-serif text-brand-obsidian tracking-wide">Product Catalog</h2>
          <p className="text-gray-400 mt-2 uppercase tracking-[0.15em] text-[10px] font-bold">
            Manage Products &amp; Variants
          </p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-6 py-3 bg-brand-obsidian text-white hover:bg-black uppercase tracking-widest font-bold text-[10px] transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        )}
      </div>

      {(isAdding || editingId) && formData ? (
        <div className="bg-white border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
            <h3 className="font-serif text-2xl text-brand-obsidian tracking-wide">
              {isAdding ? "New Product" : "Edit Product"}
            </h3>
            <button onClick={handleCancel} className="text-gray-400 hover:text-brand-obsidian transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            {/* LEFT COLUMN — Core Fields */}
            <div className="space-y-6">
              <div>
                <label className={labelClass}>Product Name</label>
                <input type="text" value={formData.name} onChange={(e) => updateFormData("name", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>SKU</label>
                <input type="text" value={formData.sku} onChange={(e) => updateFormData("sku", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <select value={formData.category_id} onChange={(e) => updateFormData("category_id", e.target.value)} className={inputClass}>
                  <option value="">Select a category...</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Price (PKR)</label>
                  <input type="number" value={formData.price} onChange={(e) => updateFormData("price", parseFloat(e.target.value) || 0)} className={inputClass} />
                </div>
                {isAdding && (
                  <div>
                    <label className={labelClass}>Initial Stock Qty</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.initial_stock}
                      onChange={(e) => updateFormData("initial_stock", parseInt(e.target.value, 10) || 0)}
                      className={inputClass}
                    />
                  </div>
                )}
              </div>
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0">Description</label>
                  <button 
                    type="button" 
                    onClick={handleEnhanceDescription} 
                    disabled={isEnhancing}
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#0056b3] hover:text-[#0A2540] transition-colors disabled:opacity-50"
                  >
                    {isEnhancing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                    ✨ Enhance with AI
                  </button>
                </div>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => updateFormData("description", e.target.value)} 
                  rows={8} 
                  className={inputClass} 
                  placeholder="Paste raw specifications or features here, then click ✨ Enhance with AI to automatically format into beautiful HTML tables and lists."
                />
              </div>
            </div>

            {/* RIGHT COLUMN — Images & Attributes */}
            <div className="space-y-6">
              {/* Thumbnail URL */}
              <div>
                <label className={labelClass}>Thumbnail URL (Primary Image)</label>
                <input
                  type="url"
                  value={formData.thumbnail_url}
                  onChange={(e) => updateFormData("thumbnail_url", e.target.value)}
                  placeholder="https://example.com/image-thumb.jpg"
                  className={inputClass + " text-xs"}
                />
                {formData.thumbnail_url && (
                  <img
                    src={formData.thumbnail_url}
                    alt="Thumbnail preview"
                    className="mt-2 w-20 h-24 object-cover bg-gray-100 border border-gray-200"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                )}
              </div>

              {/* Gallery URLs */}
              <div>
                <label className={labelClass}>Gallery URLs (Additional Images)</label>
                <div className="space-y-2">
                  {formData.gallery_urls.map((url, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => updateGalleryUrl(index, e.target.value)}
                        placeholder={`Gallery image ${index + 1}...`}
                        className={inputClass + " text-xs flex-1"}
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryUrl(index)}
                        className="text-red-400 hover:text-red-600 transition-colors shrink-0"
                        title="Remove this image"
                      >
                        <MinusCircle className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addGalleryUrl}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-obsidian/60 hover:text-brand-obsidian transition-colors mt-1"
                  >
                    <PlusCircle className="w-4 h-4" /> Add another image
                  </button>
                </div>
              </div>

              {/* Attributes */}
              <div>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Attributes (JSONB)</h4>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Color</label>
                    <input type="text" value={formData.attributes?.color || ""} onChange={(e) => updateAttribute("color", e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Size</label>
                    <input type="text" value={formData.attributes?.size || ""} onChange={(e) => updateAttribute("size", e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Material</label>
                    <input type="text" value={formData.attributes?.material || ""} onChange={(e) => updateAttribute("material", e.target.value)} className={inputClass} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 flex justify-end gap-3">
            <button onClick={handleCancel} className="px-8 py-4 border border-gray-200 bg-white hover:bg-gray-50 uppercase tracking-widest font-bold text-[10px] transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-8 py-4 bg-brand-obsidian text-white hover:bg-black uppercase tracking-widest font-bold text-[10px] transition-colors disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Saving..." : "Save Product"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white border border-gray-100 overflow-hidden flex flex-col">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#FAFAFA] border-b border-gray-100 sticky top-0 z-10 text-[10px] font-bold tracking-widest uppercase text-gray-500">
              <tr>
                <th className="p-5 w-24">Image</th>
                <th className="p-5">Name &amp; Category</th>
                <th className="p-5">SKU</th>
                <th className="p-5 text-right">Price</th>
                <th className="p-5 text-right">Stock</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-5">
                    {product.thumbnail_url ? (
                      <img src={product.thumbnail_url} alt={product.name} className="w-16 h-20 object-cover bg-gray-100" />
                    ) : (
                      <div className="w-16 h-20 bg-gray-100 flex items-center justify-center text-gray-300">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                  </td>
                  <td className="p-5">
                    <div className="font-serif text-lg text-brand-obsidian tracking-wide">{product.name}</div>
                    <div className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">{product.category_name}</div>
                  </td>
                  <td className="p-5 font-mono text-xs text-gray-400">{product.sku}</td>
                  <td className="p-5 text-right font-mono text-xs">PKR {parseFloat(product.price).toLocaleString()}</td>
                  <td className="p-5 text-right font-mono text-xs">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      parseInt(product.stock_quantity) <= 0
                        ? "bg-red-50 text-red-500"
                        : parseInt(product.stock_quantity) <= 5
                        ? "bg-yellow-50 text-yellow-600"
                        : "bg-green-50 text-green-600"
                    }`}>
                      {product.stock_quantity ?? 0}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => handleEdit(product)} className="text-[10px] font-bold uppercase tracking-widest text-brand-obsidian hover:text-gray-500 transition-colors">Edit</button>
                      <button onClick={() => handleDelete(product.id)} className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-16 text-center text-gray-400 font-mono tracking-widest uppercase text-xs">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
