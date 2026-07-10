import React, { useState, useEffect } from "react";
import { ArrowUpDown, AlertCircle, FileDown, Loader2, Save, PlusCircle } from "lucide-react";
import { api } from "../../services/api";

export function InventoryGrid() {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]); // all products (for orphans)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortCol, setSortCol] = useState("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [stockValue, setStockValue] = useState(0);
  const [saving, setSaving] = useState(false);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    // Fetch both inventory rows AND all products (to detect orphans)
    Promise.all([api.getInventory(), api.getProducts()])
      .then(([inv, prods]) => {
        setInventory(inv);
        setProducts(prods);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  // Build a unified list: inventory rows + products that have NO inventory row yet
  const inventoryProductIds = new Set(inventory.map((r) => r.product_id));
  const orphanProducts = products.filter((p) => !inventoryProductIds.has(p.id));

  // Merge into one display list
  const allRows = [
    ...inventory.map((row) => ({
      product_id: row.product_id,
      sku: row.sku,
      name: row.name,
      category: row.category,
      attributes: row.attributes,
      price: row.price,
      stock: row.stock,
      hasInventory: true,
    })),
    ...orphanProducts.map((p) => ({
      product_id: p.id,
      sku: p.sku,
      name: p.name,
      category: p.category_name,
      attributes: p.attributes,
      price: p.price,
      stock: null, // no row yet
      hasInventory: false,
    })),
  ];

  const sortedRows = [...allRows].sort((a, b) => {
    const aVal = a[sortCol] ?? "";
    const bVal = b[sortCol] ?? "";
    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  const toggleSort = (col) => {
    if (sortCol === col) setSortAsc(!sortAsc);
    else { setSortCol(col); setSortAsc(true); }
  };

  const getSortIcon = (col) => (
    <ArrowUpDown className={`w-3 h-3 ml-1 inline-block ${sortCol === col ? "text-brand-obsidian" : "text-gray-300"}`} />
  );

  const handleStockClick = (product_id, currentStock) => {
    setEditingId(product_id);
    setStockValue(currentStock ?? 0);
  };

  const handleStockSave = async (product_id, hasInventory) => {
    if (product_id === null && product_id === undefined) return;
    setSaving(true);
    try {
      if (!hasInventory) {
        // No inventory row yet — use addStock which will INSERT
        await api.addStock(product_id, stockValue);
      } else {
        await api.setStock(product_id, stockValue);
      }
      // Refresh to get fresh data from the server
      await fetchData();
      setEditingId(null);
    } catch (e) {
      alert(`Failed to update stock: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="absolute inset-0 flex items-center justify-center gap-3 text-gray-400">
      <Loader2 className="w-5 h-5 animate-spin" /> Loading inventory...
    </div>
  );

  if (error) return (
    <div className="absolute inset-0 flex items-center justify-center text-red-500 font-mono text-sm">
      Error: {error}
    </div>
  );

  return (
    <div className="absolute inset-0 p-10 flex flex-col max-w-[1600px] mx-auto">
      <div className="flex justify-between items-end mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-serif text-brand-obsidian tracking-wide">Inventory Management</h1>
          <p className="text-gray-400 mt-2 uppercase tracking-[0.15em] text-[10px] font-bold">Unified Stock View</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-6 py-3 border border-gray-200 bg-white hover:bg-gray-50 uppercase tracking-widest font-bold text-[10px] transition-colors">
          <FileDown className="w-4 h-4" /> Refresh
        </button>
      </div>

      {orphanProducts.length > 0 && (
        <div className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {orphanProducts.length} product{orphanProducts.length > 1 ? "s" : ""} with no inventory row — click the stock cell to initialize.
        </div>
      )}

      <div className="bg-white border border-gray-100 flex-1 flex flex-col overflow-hidden">
        <div className="overflow-x-auto flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#FAFAFA] border-b border-gray-100 sticky top-0 z-10 text-[10px] font-bold tracking-widest uppercase text-gray-500">
              <tr>
                <th className="p-5 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => toggleSort("sku")}>SKU {getSortIcon("sku")}</th>
                <th className="p-5 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => toggleSort("name")}>Product {getSortIcon("name")}</th>
                <th className="p-5 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => toggleSort("category")}>Category {getSortIcon("category")}</th>
                <th className="p-5">Color</th>
                <th className="p-5">Size</th>
                <th className="p-5 cursor-pointer hover:bg-gray-100 transition-colors text-right" onClick={() => toggleSort("price")}>Price {getSortIcon("price")}</th>
                <th className="p-5 cursor-pointer hover:bg-gray-100 transition-colors text-right" onClick={() => toggleSort("stock")}>Stock {getSortIcon("stock")}</th>
                <th className="p-5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {sortedRows.map((row) => (
                <tr
                  key={row.product_id}
                  className={`hover:bg-gray-50/50 transition-colors ${!row.hasInventory ? "bg-amber-50/30" : ""}`}
                >
                  <td className="p-5 font-mono text-xs text-gray-400">{row.sku}</td>
                  <td className="p-5 font-medium text-brand-obsidian">{row.name}</td>
                  <td className="p-5 text-gray-500">{row.category || "—"}</td>
                  <td className="p-5 text-gray-500">{row.attributes?.color || "—"}</td>
                  <td className="p-5 font-mono text-xs text-center">{row.attributes?.size || "—"}</td>
                  <td className="p-5 text-right font-mono text-xs">
                    PKR {parseFloat(row.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="p-5 text-right font-mono text-xs">
                    <div className="flex items-center justify-end gap-2 h-full">
                      {editingId === row.product_id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={stockValue}
                            onChange={(e) => setStockValue(parseInt(e.target.value) || 0)}
                            className="w-20 px-2 py-1 text-right border border-brand-obsidian outline-none font-mono"
                            autoFocus
                            onKeyDown={(e) => { if (e.key === "Enter") handleStockSave(row.product_id, row.hasInventory); if (e.key === "Escape") setEditingId(null); }}
                          />
                          <button
                            onClick={() => handleStockSave(row.product_id, row.hasInventory)}
                            disabled={saving}
                            className="text-green-600 hover:text-green-800 disabled:opacity-50"
                            title="Save stock"
                          >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          </button>
                          <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-700 text-[10px] font-bold uppercase tracking-wider">✕</button>
                        </div>
                      ) : !row.hasInventory ? (
                        // No inventory row yet — show an initialize button
                        <button
                          onClick={() => handleStockClick(row.product_id, 0)}
                          className="flex items-center gap-1 text-amber-600 hover:text-amber-800 text-[10px] font-bold uppercase tracking-wider transition-colors"
                          title="Click to set initial stock"
                        >
                          <PlusCircle className="w-3.5 h-3.5" /> Set Stock
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStockClick(row.product_id, row.stock)}
                          className={`hover:bg-gray-100 px-3 py-1.5 transition-colors font-mono ${parseInt(row.stock) <= 5 ? "font-bold text-red-600 bg-red-50" : ""}`}
                          title="Click to edit stock"
                        >
                          {row.stock}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="p-5">
                    {!row.hasInventory ? (
                      <span className="inline-flex items-center gap-1.5 text-amber-600 text-[10px] font-bold tracking-widest uppercase w-full justify-center">
                        <AlertCircle className="w-3 h-3" /> NOT INITIALIZED
                      </span>
                    ) : parseInt(row.stock) <= 0 ? (
                      <span className="inline-flex items-center gap-1.5 text-red-600 text-[10px] font-bold tracking-widest uppercase w-full justify-center">
                        <AlertCircle className="w-3 h-3" /> OUT OF STOCK
                      </span>
                    ) : parseInt(row.stock) <= 5 ? (
                      <span className="inline-flex items-center gap-1.5 text-amber-600 text-[10px] font-bold tracking-widest uppercase w-full justify-center">
                        <AlertCircle className="w-3 h-3" /> LOW STOCK
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-green-600 text-[10px] font-bold tracking-widest uppercase w-full justify-center">
                        IN STOCK
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {sortedRows.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-gray-400 font-mono tracking-widest uppercase text-xs">
                    No products found. Add products first via the Products page.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
