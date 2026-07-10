import React, { useState, useEffect } from "react";
import { X, Truck, Package, User, MapPin, CreditCard, Loader2 } from "lucide-react";
import { api } from "../../services/api";

export function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingNo, setTrackingNo] = useState("");

  const role = localStorage.getItem("userRole");

  const fetchOrders = () => {
    setLoading(true);
    api.getOrders()
      .then(setOrders)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.type === filter);

  const updateStatus = async (id, type, newStatus) => {
    try {
      if (type === "online") {
        await api.updateOrderStatus(id, newStatus);
        setOrders((prev) => prev.map((o) => o.id === id && o.type === "online" ? { ...o, status: newStatus } : o));
        if (selectedOrder?.id === id) setSelectedOrder((s) => ({ ...s, status: newStatus }));
      } else {
        // POS refund
        await api.refundPOS(id);
        setOrders((prev) => prev.map((o) => o.id === id && o.type === "pos" ? { ...o, status: "refunded" } : o));
      }
    } catch (e) { alert(`Failed: ${e.message}`); }
  };

  const refundOrder = (id, type) => updateStatus(id, type, "refunded");

  const removeOrder = async (id) => {
    if (!confirm("Delete this order?")) return;
    try {
      await api.deleteOrder(id);
      setOrders((prev) => prev.filter((o) => !(o.id === id && o.type === "online")));
      if (selectedOrder?.id === id) setSelectedOrder(null);
    } catch (e) { alert(`Delete failed: ${e.message}`); }
  };

  const openOrder = (order) => { setSelectedOrder(order); setTrackingNo(order.tracking_no || ""); };
  const closeOrder = () => { setSelectedOrder(null); setTrackingNo(""); };

  const handleUpdateTracking = async () => {
    if (!selectedOrder || selectedOrder.type !== "online") return;
    try {
      await api.updateTracking(selectedOrder.id, trackingNo);
      setOrders((prev) => prev.map((o) => o.id === selectedOrder.id ? { ...o, tracking_no: trackingNo } : o));
      setSelectedOrder((s) => ({ ...s, tracking_no: trackingNo }));
    } catch (e) { alert(`Failed: ${e.message}`); }
  };

  if (loading) return (
    <div className="p-10 flex items-center gap-3 text-gray-400">
      <Loader2 className="w-5 h-5 animate-spin" /> Loading orders...
    </div>
  );

  if (error) return (
    <div className="p-10 text-red-500 font-mono text-sm">Error: {error}</div>
  );

  return (
    <div className="p-10 max-w-[1600px] mx-auto relative">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif text-brand-obsidian tracking-wide">Orders Management</h1>
          <p className="text-gray-400 mt-2 uppercase tracking-[0.15em] text-[10px] font-bold">Unified Transaction History</p>
        </div>
        <div className="flex gap-2">
          {["all", "online", "pos"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${filter === f ? "bg-brand-obsidian text-white" : "bg-white text-gray-400 hover:text-brand-obsidian border border-gray-200"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#FAFAFA] border-b border-gray-100 text-[10px] font-bold tracking-widest uppercase text-gray-500">
              <tr>
                <th className="p-5">Order ID</th>
                <th className="p-5">Type</th>
                <th className="p-5">Customer / Cashier</th>
                <th className="p-5 text-right">Total</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filteredOrders.map((order) => (
                <tr key={`${order.type}-${order.id}`} onClick={() => openOrder(order)}
                  className="hover:bg-gray-50/50 transition-colors cursor-pointer">
                  <td className="p-5 font-mono text-xs text-brand-obsidian font-bold">{order.order_code || order.id}</td>
                  <td className="p-5 font-mono text-xs uppercase text-gray-400">{order.type}</td>
                  <td className="p-5 text-gray-500 text-sm">
                    {order.type === "online" ? (order.customer_email || order.customer_phone) : order.cashier}
                  </td>
                  <td className="p-5 text-right font-mono text-xs">
                    PKR {parseFloat(order.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="p-5" onClick={(e) => e.stopPropagation()}>
                    {order.type === "online" && order.status !== "refunded" ? (
                      <select value={order.status}
                        onChange={(e) => updateStatus(order.id, "online", e.target.value)}
                        className={`bg-transparent border border-gray-200 text-[10px] font-bold uppercase p-2 tracking-widest outline-none max-w-[160px] ${order.status === "pending_verification" ? "text-amber-600 border-amber-200 bg-amber-50" : "text-brand-obsidian"}`}>
                        <option value="pending">Pending</option>
                        <option value="pending_verification">Pending Verif.</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="out for delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    ) : (
                      <span className={`uppercase text-[10px] font-bold tracking-widest ${order.status === "refunded" ? "text-red-500" : "text-green-600"}`}>
                        {order.status}
                      </span>
                    )}
                  </td>
                  <td className="p-5 flex gap-4 justify-end items-center h-full pt-6" onClick={(e) => e.stopPropagation()}>
                    {order.status !== "refunded" && (
                      <button onClick={() => refundOrder(order.id, order.type)}
                        className="text-[10px] uppercase font-bold tracking-widest text-amber-600 hover:text-amber-800 transition-colors">
                        Refund
                      </button>
                    )}
                    {role === "admin" && order.type === "online" && (
                      <button onClick={() => removeOrder(order.id)}
                        className="text-[10px] uppercase font-bold tracking-widest text-red-500 hover:text-red-700 transition-colors">
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400 font-mono tracking-widest uppercase text-xs">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col">
            <button onClick={closeOrder} className="absolute top-6 right-6 text-gray-400 hover:text-brand-obsidian transition-colors z-10">
              <X className="w-6 h-6" />
            </button>
            <div className="p-8 border-b border-gray-100 bg-[#FAFAFA]">
              <h2 className="text-2xl font-serif tracking-wide text-brand-obsidian mb-2">Order Details</h2>
              <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-gray-500">
                <span className="font-bold text-brand-obsidian">{selectedOrder.order_code || selectedOrder.id}</span>
                <span>//</span>
                <span>{selectedOrder.type}</span>
                <span>//</span>
                <span>{new Date(selectedOrder.date).toLocaleString()}</span>
              </div>
            </div>

            <div className="p-8 flex flex-col md:flex-row gap-12">
              <div className="flex-1 space-y-10">
                {selectedOrder.type === "online" && (
                  <>
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                        <User className="w-3.5 h-3.5" /> Customer Information
                      </h3>
                      <div className="space-y-2 text-sm text-brand-obsidian">
                        <p>{selectedOrder.customer_email}</p>
                        <p className="font-mono">{selectedOrder.customer_phone}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" /> Shipping Address
                      </h3>
                      <p className="text-sm text-brand-obsidian">{selectedOrder.shipping_address}</p>
                    </div>
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                        <Truck className="w-3.5 h-3.5" /> Delivery Tracking
                      </h3>
                      <div className="flex gap-2">
                        <input type="text" value={trackingNo} onChange={(e) => setTrackingNo(e.target.value)}
                          placeholder="Enter Tracking No."
                          className="flex-1 px-4 py-2 bg-[#FAFAFA] border border-gray-200 outline-none focus:border-brand-obsidian text-sm font-mono transition-colors" />
                        <button onClick={handleUpdateTracking}
                          className="px-6 py-2 bg-brand-obsidian text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-colors">
                          Save
                        </button>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                        <CreditCard className="w-3.5 h-3.5" /> Payment Details
                      </h3>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100 text-sm">
                        <span className="text-gray-500 uppercase tracking-widest font-bold text-[10px]">Method</span>
                        <span className="uppercase">{selectedOrder.payment_method === "bank_transfer" ? "Bank Transfer" : (selectedOrder.payment_method || "Card")}</span>
                      </div>
                    </div>
                  </>
                )}
                {selectedOrder.type === "pos" && (
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                      <User className="w-3.5 h-3.5" /> Cashier
                    </h3>
                    <p className="text-sm text-brand-obsidian">{selectedOrder.cashier}</p>
                  </div>
                )}
              </div>

              <div className="md:w-[350px]">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                  <Package className="w-3.5 h-3.5" /> Order Items
                </h3>
                <div className="bg-[#FAFAFA] border border-gray-100 p-6 space-y-4 max-h-[300px] overflow-y-auto no-scrollbar">
                  {(selectedOrder.items || []).map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <div>
                        <p className="font-bold text-brand-obsidian">{item.name}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-mono">
                          {item.sku} x {item.qty}
                        </p>
                      </div>
                      <p className="font-mono text-brand-obsidian">PKR {((item.price || 0) * (item.qty || 1)).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                  <div className="flex justify-between items-end pt-3 text-brand-obsidian">
                    <span className="text-[10px] font-bold tracking-widest uppercase">Total</span>
                    <span className="font-mono text-lg font-bold">
                      PKR {parseFloat(selectedOrder.total || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
