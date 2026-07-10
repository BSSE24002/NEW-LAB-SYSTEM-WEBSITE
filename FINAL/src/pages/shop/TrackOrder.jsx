import React, { useState } from "react";
import { motion } from "motion/react";
import { Search, Loader2 } from "lucide-react";
import { api } from "../../services/api";

export function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const found = await api.trackOrder(orderId.trim());
      setResult(found);
    } catch {
      setError("Order not found. Please check your order ID.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-alabaster min-h-screen pt-32 pb-40">
      <div className="max-w-[800px] mx-auto px-6 lg:px-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
          <div className="mb-16">
            <h1 className="text-[3.5rem] md:text-[6rem] leading-none font-sans font-black tracking-tighter uppercase mb-4 text-brand-obsidian">
              Track Order.
            </h1>
            <p className="text-xl font-medium text-brand-obsidian/60">
              Enter your reference number below to monitor your<br className="hidden md:block" /> acquisition status in real-time.
            </p>
          </div>

          <div className="bg-white p-8 md:p-12 shadow-2xl rounded-3xl border border-black/5 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row gap-4 relative z-10">
              <input type="text" placeholder="e.g. A3XK9T2B"
                className="flex-1 px-6 py-5 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-brand-obsidian focus:bg-white font-mono text-lg transition-all"
                value={orderId} onChange={(e) => setOrderId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
              <button onClick={handleSearch} disabled={loading}
                className="bg-brand-obsidian text-white px-10 py-5 rounded-2xl uppercase tracking-[0.2em] text-xs font-bold hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center h-full min-h-[64px] disabled:opacity-50">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-red-500 mt-6 text-sm font-bold uppercase tracking-widest">{error}</motion.p>
            )}

            {result && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                className="mt-12 pt-12 border-t border-black/10 flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-[10px] text-gray-400 font-black tracking-[0.2em] uppercase mb-2">Order Reference</h4>
                    <p className="font-mono text-2xl font-bold">{result.order_code || result.id}</p>
                  </div>
                  <div className="md:text-right">
                    <h4 className="text-[10px] text-gray-400 font-black tracking-[0.2em] uppercase mb-2">Date Confirmed</h4>
                    <p className="font-mono text-xl">{new Date(result.created_at || result.date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="uppercase font-black tracking-[0.2em] text-[10px] text-gray-500">Current Status</span>
                  <span className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest ${
                    result.status === "confirmed" ? "bg-green-100 text-green-800" :
                    result.status === "pending_verification" ? "bg-yellow-100 text-yellow-800" :
                    result.status === "out for delivery" ? "bg-blue-100 text-blue-800" :
                    "bg-gray-200 text-gray-800"
                  }`}>
                    {result.status?.replace(/_/g, " ")}
                  </span>
                </div>

                <div>
                  <h4 className="text-[10px] text-gray-400 font-black tracking-[0.2em] uppercase mb-6 border-b border-black/5 pb-4">Manifest Summary</h4>
                  <div className="space-y-4">
                    {(result.items || []).map((item, i) => (
                      <div key={i} className="flex justify-between items-center bg-gray-50/50 p-4 rounded-xl">
                        <div className="text-sm font-medium">{item.name} <span className="text-gray-400 ml-2">x{item.qty}</span></div>
                        <div className="font-mono text-sm font-bold">PKR {((item.price || 0) * (item.qty || 1)).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-black/10 flex justify-between items-center">
                    <span className="uppercase font-black tracking-[0.2em] text-xs">Final Settlement</span>
                    <span className="font-mono text-2xl font-bold">
                      PKR {parseFloat(result.total_amount || result.total || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="absolute -top-40 -right-40 w-[300px] h-[300px] bg-gradient-to-br from-gray-100 to-transparent rounded-full blur-3xl opacity-50 pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
