import React, { useState, useEffect } from "react";
import { usePOS } from "../../context/POSContext";
import { Search, Plus, Minus, CreditCard, Banknote, RefreshCw, Loader2 } from "lucide-react";
import { useSocket } from "../../hooks/useSocket";
import { api } from "../../services/api";

export function POSRegister() {
  const { items, addItem, updateQuantity, clearCart, subtotal, tax, total } = usePOS();
  const [search, setSearch] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { lastUpdate } = useSocket();

  const [inventory, setInventory] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const fetchInventory = () => {
    api.getInventory()
      .then(setInventory)
      .catch(console.error)
      .finally(() => setLoadingProducts(false));
  };

  useEffect(() => { fetchInventory(); }, []);

  // Re-fetch inventory when a real-time socket inventory_sync event fires
  useEffect(() => { if (lastUpdate) fetchInventory(); }, [lastUpdate]);

  const filteredProducts = inventory.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.includes(search) ||
      p.attributes?.color?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCheckout = async (paymentMethod) => {
    if (items.length === 0) return;
    setIsProcessing(true);
    try {
      const cashierName = localStorage.getItem("userName") || "Staff";
      await api.posCheckout({
        cashier_name: cashierName,
        payment_method: paymentMethod,
        tax_amount: tax,
        total_amount: total,
        items: items.map((i) => ({
          product_id: i.product_id || null,
          name: i.name,
          sku: i.id,
          quantity: i.quantity,
          price: i.price,
        })),
      });
      setShowSuccess(true);
      fetchInventory(); // Refresh stock immediately
      setTimeout(() => { clearCart(); setShowSuccess(false); }, 2000);
    } catch (e) {
      alert(`Checkout failed: ${e.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white overflow-hidden z-50">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-green-500 rounded-none flex items-center justify-center text-white mb-6 animate-bounce">
            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <h1 className="text-4xl font-mono font-bold tracking-tight text-brand-obsidian">PAYMENT SUCCESSFUL</h1>
          <p className="text-brand-soft-grey mt-2 font-mono uppercase">Transaction saved to database.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex bg-brand-alabaster font-sans">
      {/* Product Grid */}
      <div className="flex-1 flex flex-col border-r border-gray-200 bg-white">
        <div className="p-6 border-b border-gray-200 shrink-0 bg-white shadow-sm z-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" placeholder="Scan barcode or search products [SKU, Name]..." className="w-full pl-12 pr-4 py-4 bg-brand-alabaster border border-gray-200 rounded-none focus:outline-none focus:ring-1 focus:ring-black font-mono text-sm" autoFocus value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 no-scrollbar bg-[#F8F9FA]">
          {loadingProducts ? (
            <div className="flex items-center justify-center h-full gap-2 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading products...
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <button key={product.product_id}
                  onClick={() => parseInt(product.stock) > 0 && addItem({
                    id: product.sku,
                    product_id: product.product_id,
                    name: `${product.name} - ${product.attributes?.color || ""}/${product.attributes?.size || ""}`,
                    price: parseFloat(product.price),
                    quantity: 1,
                  })}
                  disabled={parseInt(product.stock) <= 0}
                  className={`bg-white border rounded-none p-4 text-left flex flex-col h-36 transition-all ${parseInt(product.stock) > 0 ? "border-gray-200 hover:border-black hover:shadow-sm" : "border-gray-100 opacity-50 cursor-not-allowed"}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-xs text-gray-500 font-mono tracking-wider">{product.sku}</div>
                    <div className={`font-mono text-[10px] px-2 py-0.5 transition-colors duration-300 ${parseInt(product.stock) <= 2 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>STOCK: {product.stock}</div>
                  </div>
                  <div className="font-semibold text-sm line-clamp-2 leading-tight flex-1 text-brand-obsidian">{product.name}</div>
                  <div className="flex justify-between items-end mt-2 border-t border-gray-100 pt-2">
                    <div className="text-[11px] font-mono text-gray-500 uppercase">{product.attributes?.color} / {product.attributes?.size}</div>
                    <div className="font-mono font-bold text-sm text-brand-obsidian">PKR {parseFloat(product.price).toLocaleString()}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart */}
      <div className="w-[450px] flex flex-col bg-white shrink-0 shadow-[-4px_0_24px_-4px_rgba(0,0,0,0.05)] border-l border-gray-200">
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 shrink-0 bg-white">
          <h2 className="font-bold tracking-widest uppercase text-xs text-brand-obsidian">Current Terminal</h2>
          <button onClick={clearCart} className="text-red-500 hover:bg-red-50 px-3 py-1 text-xs font-mono font-semibold transition-colors disabled:opacity-50" disabled={items.length === 0}>[CLEAR]</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-4"><span className="font-mono text-sm tracking-widest">[ READY_FOR_SCAN ]</span></div>
          ) : (
            <div className="flex flex-col gap-2">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col p-4 border border-gray-200 rounded-none bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-semibold text-sm flex-1 pr-4 text-brand-obsidian">{item.name}</span>
                    <span className="font-mono font-bold text-sm">PKR {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-1 border border-gray-200 bg-brand-alabaster">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 px-2 hover:bg-white transition-colors"><Minus className="w-3 h-3" /></button>
                      <span className="font-mono w-8 text-center text-xs font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 px-2 hover:bg-white transition-colors"><Plus className="w-3 h-3" /></button>
                    </div>
                    <button onClick={() => updateQuantity(item.id, -item.quantity)} className="text-gray-400 hover:text-red-500 p-2 text-xs font-mono">DELETE</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="shrink-0 border-t border-gray-200 bg-white p-6 space-y-4">
          <div className="space-y-2 text-sm font-mono">
            <div className="flex justify-between text-gray-500"><span>SUBTOTAL</span><span>PKR {subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-500"><span>TAX_RATE_8%</span><span>PKR {tax.toFixed(2)}</span></div>
            <div className="flex justify-between text-2xl font-bold text-brand-obsidian border-t border-black pt-4 mt-4"><span>TOTAL</span><span>PKR {total.toFixed(2)}</span></div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-6">
            <button disabled={items.length === 0 || isProcessing} onClick={() => handleCheckout("cash")}
              className="flex flex-col items-center justify-center gap-2 border border-gray-300 hover:border-black bg-white text-brand-obsidian py-5 rounded-none disabled:opacity-50 transition-colors font-mono font-bold text-xs uppercase">
              <Banknote className="w-5 h-5" />Cash
            </button>
            <button disabled={items.length === 0 || isProcessing} onClick={() => handleCheckout("card")}
              className="flex flex-col items-center justify-center gap-2 bg-brand-obsidian hover:bg-black text-white py-5 rounded-none disabled:opacity-50 transition-colors font-mono font-bold text-xs uppercase">
              {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
              {isProcessing ? "Processing" : "Card"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
