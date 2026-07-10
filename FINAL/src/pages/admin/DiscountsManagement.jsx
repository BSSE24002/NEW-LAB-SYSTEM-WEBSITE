import React, { useState, useEffect } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { api } from "../../services/api";

export function DiscountsManagement() {
  const [discounts, setDiscounts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("discounts");
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    Promise.all([api.getDiscounts(), api.getCoupons(), api.getCategories(), api.getProducts()])
      .then(([d, c, cats, prods]) => { setDiscounts(d); setCoupons(c); setCategories(cats); setProducts(prods); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAddNewDiscount = () => {
    setActiveTab("discounts"); setIsAdding(true);
    setFormData({ name: "", target: "all", target_value: "", type: "percentage", value: 0 });
  };
  const handleAddNewCoupon = () => {
    setActiveTab("coupons"); setIsAdding(true);
    setFormData({ code: "", type: "percentage", value: 0 });
  };
  const handleCancel = () => { setIsAdding(false); setFormData(null); };
  const updateFormData = (field, value) => setFormData({ ...formData, [field]: value });

  const handleSave = async () => {
    setSaving(true);
    try {
      if (activeTab === "discounts") {
        if (!formData.name || formData.value <= 0) { alert("Name and a valid discount value are required."); return; }
        const created = await api.createDiscount(formData);
        setDiscounts((prev) => [created, ...prev]);
      } else {
        if (!formData.code || formData.value <= 0) { alert("Code and a valid discount value are required."); return; }
        const created = await api.createCoupon(formData);
        setCoupons((prev) => [created, ...prev]);
      }
      handleCancel();
    } catch (e) { alert(`Save failed: ${e.message}`); }
    finally { setSaving(false); }
  };

  const handleDeleteDiscount = async (id) => {
    if (!confirm("Delete this discount rule?")) return;
    try { await api.deleteDiscount(id); setDiscounts((prev) => prev.filter((d) => d.id !== id)); }
    catch (e) { alert(`Delete failed: ${e.message}`); }
  };
  const handleDeleteCoupon = async (id) => {
    if (!confirm("Delete this coupon?")) return;
    try { await api.deleteCoupon(id); setCoupons((prev) => prev.filter((c) => c.id !== id)); }
    catch (e) { alert(`Delete failed: ${e.message}`); }
  };

  if (loading) return (
    <div className="absolute inset-0 flex items-center justify-center gap-3 text-gray-400">
      <Loader2 className="w-5 h-5 animate-spin" /> Loading...
    </div>
  );
  if (error) return <div className="absolute inset-0 flex items-center justify-center text-red-500 font-mono text-sm">Error: {error}</div>;

  return (
    <div className="absolute inset-0 p-8 flex flex-col overflow-y-auto no-scrollbar">
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight">Discounts &amp; Coupons</h2>
          <p className="text-sm text-gray-500 font-mono mt-1">Manage store-wide sales and promo codes</p>
        </div>
        {!isAdding && (
          <div className="flex gap-2">
            <button onClick={handleAddNewDiscount} className="flex items-center gap-2 px-4 py-2 bg-brand-obsidian text-white rounded-lg hover:bg-black font-medium text-sm transition-colors">
              <Plus className="w-4 h-4" /> Add Discount
            </button>
            <button onClick={handleAddNewCoupon} className="flex items-center gap-2 px-4 py-2 border border-brand-obsidian bg-white text-brand-obsidian rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors">
              <Plus className="w-4 h-4" /> Add Coupon
            </button>
          </div>
        )}
      </div>

      {isAdding && formData ? (
        <div className="bg-white border text-sm border-gray-200 rounded-xl p-6 mb-8 max-w-xl">
          <h3 className="font-bold text-lg mb-4">{activeTab === "discounts" ? "New Automatic Discount" : "New Coupon Code"}</h3>
          <div className="space-y-4">
            {activeTab === "discounts" ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Discount Name</label>
                  <input type="text" value={formData.name} onChange={(e) => updateFormData("name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:border-black outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Applies To</label>
                  <select value={formData.target} onChange={(e) => { updateFormData("target", e.target.value); updateFormData("target_value", ""); }}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:border-black outline-none bg-white">
                    <option value="all">Entire Inventory</option>
                    <option value="category">Specific Category</option>
                    <option value="product">Specific Product</option>
                  </select>
                </div>
                {formData.target === "category" && (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category Target</label>
                    <select value={formData.target_value} onChange={(e) => updateFormData("target_value", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded focus:border-black outline-none bg-white">
                      <option value="">Select a category...</option>
                      {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                )}
                {formData.target === "product" && (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Target</label>
                    <select value={formData.target_value} onChange={(e) => updateFormData("target_value", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded focus:border-black outline-none bg-white">
                      <option value="">Select a product...</option>
                      {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                )}
              </>
            ) : (
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Coupon Code</label>
                <input type="text" value={formData.code} onChange={(e) => updateFormData("code", e.target.value.toUpperCase())}
                  placeholder="e.g. SAVE20" className="w-full px-3 py-2 border border-gray-200 rounded focus:border-black outline-none uppercase" />
              </div>
            )}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Discount Type</label>
                <select value={formData.type} onChange={(e) => updateFormData("type", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded focus:border-black outline-none bg-white">
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (PKR)</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Value</label>
                <input type="number" value={formData.value} onChange={(e) => updateFormData("value", parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-200 rounded focus:border-black outline-none" />
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={handleCancel} className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-brand-obsidian text-white rounded-lg text-sm font-medium hover:bg-black disabled:opacity-50">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex gap-8 border-b border-gray-200 mb-6 shrink-0">
        <button onClick={() => setActiveTab("discounts")}
          className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 ${activeTab === "discounts" ? "border-brand-obsidian text-brand-obsidian" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
          Automatic Discounts
        </button>
        <button onClick={() => setActiveTab("coupons")}
          className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 ${activeTab === "coupons" ? "border-brand-obsidian text-brand-obsidian" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
          Promo Coupons
        </button>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
        {activeTab === "discounts" ? (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10 text-xs tracking-wider uppercase text-gray-500">
              <tr>
                <th className="p-4 font-semibold">Rule Name</th>
                <th className="p-4 font-semibold">Target</th>
                <th className="p-4 font-semibold">Discount</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {discounts.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50/50">
                  <td className="p-4 font-medium">{d.name}</td>
                  <td className="p-4 text-gray-600">
                    {d.target === "all" && "Entire Store"}
                    {d.target === "category" && `Category: ${d.target_value}`}
                    {d.target === "product" && `Product ID: ${d.target_value}`}
                  </td>
                  <td className="p-4 font-mono font-bold text-brand-obsidian">
                    {d.type === "percentage" ? `${d.value}% OFF` : `PKR ${parseFloat(d.value).toFixed(2)} OFF`}
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDeleteDiscount(d.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4 inline-block" />
                    </button>
                  </td>
                </tr>
              ))}
              {discounts.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-gray-500 font-mono tracking-widest uppercase">No discounts set</td></tr>}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10 text-xs tracking-wider uppercase text-gray-500">
              <tr>
                <th className="p-4 font-semibold">Code</th>
                <th className="p-4 font-semibold">Discount</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50">
                  <td className="p-4 font-mono font-bold">{c.code}</td>
                  <td className="p-4 font-mono">
                    {c.type === "percentage" ? `${c.value}% OFF` : `PKR ${parseFloat(c.value).toFixed(2)} OFF`}
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDeleteCoupon(c.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4 inline-block" />
                    </button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && <tr><td colSpan={3} className="p-8 text-center text-gray-500 font-mono tracking-widest uppercase">No coupons active</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
